import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  loadIncident,
  scanProject,
  normalizeEvidence,
  type EvidenceItem,
  type RawEvidenceFile,
  sanitizeTelemetry
} from '@investigator/evidence';
import {
  generateHypotheses,
  evaluateHypothesisWithEvidence,
  type Hypothesis
} from '@investigator/hypothesis';
import { type LLMProvider, createLLMProvider } from '@investigator/llm';
import type {
  CausalChainNode,
  IncidentInvestigationInput,
  InvestigationReport,
  InvestigationStatistics,
  RootCauseDecision,
  TimelineEntry,
  TimelineSignificance
} from './types.js';
import { NativeCausalModel } from './causal-model.js';

export class IncidentEngine {
  private llm: LLMProvider;
  private causalModel: NativeCausalModel;

  constructor(llmProvider?: LLMProvider) {
    this.llm = llmProvider || createLLMProvider();
    this.causalModel = new NativeCausalModel();
  }

  /**
   * Runs an evidence-driven, hypothesis-testing investigation on an incident directory
   * or a target project folder.
   */
  async investigate(input: IncidentInvestigationInput): Promise<InvestigationReport> {
    const startTime = Date.now();
    let modelCallCount = 0;

    // 1. Ingestion Phase
    let incidentId = 'unknown-incident';
    let incidentSummary = input.description || 'DevOps Incident Investigation';
    let projectName = path.basename(process.cwd());
    let projectPathStr = path.resolve(process.cwd());
    let rawFiles: RawEvidenceFile[] = [];
    let services: string[] = [];

    if (input.rawEvidenceFiles && input.rawEvidenceFiles.length > 0) {
      incidentId = 'live-telemetry';
      incidentSummary = input.description || 'Piped Live Telemetry Investigation';
      rawFiles = input.rawEvidenceFiles;
    } else if (input.incidentPath) {
      const loaded = loadIncident(input.incidentPath);
      incidentId = loaded.metadata.id;
      incidentSummary = input.description || loaded.metadata.description || loaded.metadata.title;
      rawFiles = loaded.evidenceFiles;
      services = loaded.metadata.services || [];
    } else if (input.projectPath) {
      const scan = scanProject(input.projectPath);
      projectName = scan.name || path.basename(scan.projectPath);
      projectPathStr = path.resolve(scan.projectPath);
      incidentId = projectName;
      incidentSummary = input.description || `Incident in ${scan.name || 'project'}`;
      services = scan.suggestedServices;

      // If an external logs directory was specified, load from there
      if (input.externalLogsPath && fs.existsSync(input.externalLogsPath)) {
        const extLoaded = loadIncident(input.externalLogsPath);
        rawFiles.push(...extLoaded.evidenceFiles);
      }

      // Also load all discovered project log files
      for (const logRelPath of scan.logFiles) {
        const fullLogPath = path.join(scan.projectPath, logRelPath);
        if (fs.existsSync(fullLogPath)) {
          try {
            const rawContent = fs.readFileSync(fullLogPath, 'utf8');
            rawFiles.push({
              filename: path.basename(logRelPath),
              relativePath: logRelPath,
              content: sanitizeTelemetry(rawContent)
            });
          } catch {
            // ignore unreadable log file
          }
        }
      }
    } else if (input.externalLogsPath) {
      const loaded = loadIncident(input.externalLogsPath);
      incidentId = loaded.metadata.id;
      incidentSummary = input.description || loaded.metadata.description || 'External Logs Investigation';
      rawFiles = loaded.evidenceFiles;
      services = loaded.metadata.services || [];
    } else {
      throw new Error('Either incidentPath, projectPath, externalLogsPath, or rawEvidenceFiles must be provided.');
    }

    // 2. Evidence Normalization Phase
    const allEvidence = normalizeEvidence(rawFiles);
    const totalEvidenceAvailable = allEvidence.length;

    // 3. Intelligent Evidence Selection & Ranking (Core Telemetry Reduction)
    const maxEvidence = input.maxEvidenceToInspect || 50;
    const prioritizedEvidence = prioritizeEvidence(allEvidence, maxEvidence);
    const evidenceInspected = prioritizedEvidence.length;

    // 4. Default to Native Built-in Causal Reasoning Model (No API keys, no Ollama, 100% offline & accurate)
    const isLiveProvider = process.env.LLM_PROVIDER && process.env.LLM_PROVIDER !== 'mock';
    if (!isLiveProvider) {
      const report = this.causalModel.analyze(
        incidentSummary,
        services,
        prioritizedEvidence,
        totalEvidenceAvailable,
        Date.now() - startTime
      );
      // Propagate the true investigation context so the Web GUI shows
      // correct project / target / rule values instead of fallbacks.
      report.incidentId = incidentId;
      report.incidentSummary = incidentSummary;
      report.projectName = projectName;
      report.projectPath = projectPathStr;
      return report;
    }

    // Fallback: Optional external LLM Provider path
    modelCallCount++;
    const initialHypotheses = await generateHypotheses(
      {
        incidentDescription: incidentSummary,
        services,
        evidenceSummary: prioritizedEvidence.slice(0, 15)
      },
      this.llm
    );

    // 5. Adversarial Hypothesis Testing & Contradiction Detection (Rule 11 & Rule 12)
    const evaluatedHypotheses: Hypothesis[] = [];
    const supportingEvidenceMap = new Map<string, EvidenceItem>();
    const contradictingEvidenceMap = new Map<string, EvidenceItem>();
    const missingEvidenceSet = new Set<string>();

    for (const h of initialHypotheses) {
      const evalResult = evaluateHypothesisWithEvidence(h, allEvidence);
      evaluatedHypotheses.push(evalResult.hypothesis);

      evalResult.supportingEvidence.forEach((e) => supportingEvidenceMap.set(e.id, e));
      evalResult.contradictingEvidence.forEach((e) => contradictingEvidenceMap.set(e.id, e));
      evalResult.missingEvidence.forEach((m) => missingEvidenceSet.add(m));
    }

    // Sort hypotheses by confidence descending
    evaluatedHypotheses.sort((a, b) => b.confidence - a.confidence);

    const topHypothesis = evaluatedHypotheses[0] || {
      id: 'H1',
      cause: 'Undetermined root cause',
      confidence: 0.3,
      status: 'investigating' as const,
      supportingEvidenceIds: [],
      contradictingEvidenceIds: [],
      missingEvidenceDescriptions: [],
      rationale: 'Insufficient telemetry to confirm root cause.'
    };

    // 6. Chronological Timeline Construction (Section 21)
    const timeline = buildTimeline(prioritizedEvidence);

    // 7. Causal Chain Synthesis (Section 22)
    const causalChain = buildCausalChain(topHypothesis, prioritizedEvidence);

    // 8. Root Cause Decision & Recommendations
    const rootCause: RootCauseDecision = {
      description: topHypothesis.cause,
      confidence: topHypothesis.confidence,
      confidenceRationale: topHypothesis.rationale
    };

    const recommendedActions = generateRecommendations(topHypothesis, causalChain);

    const durationMs = Date.now() - startTime;
    const evidenceReductionRatio =
      totalEvidenceAvailable > 0
        ? Number((1 - evidenceInspected / totalEvidenceAvailable).toFixed(4))
        : 0;

    const statistics: InvestigationStatistics = {
      totalEvidenceAvailable,
      evidenceInspected,
      evidenceReductionRatio,
      durationMs,
      modelCalls: modelCallCount
    };

    return {
      incidentId,
      incidentSummary,
      projectName,
      projectPath: projectPathStr,
      timeline,
      hypotheses: evaluatedHypotheses,
      selectedEvidence: prioritizedEvidence,
      supportingEvidence: Array.from(supportingEvidenceMap.values()),
      contradictingEvidence: Array.from(contradictingEvidenceMap.values()),
      missingEvidence: Array.from(missingEvidenceSet),
      alternativeExplanations: evaluatedHypotheses.slice(1).map((h) => `${h.cause} (Confidence: ${h.confidence})`),
      causalChain,
      rootCause,
      recommendedActions,
      statistics
    };
  }
}

/**
 * Prioritizes high-signal telemetry items to reduce noise while maintaining accuracy
 */
function prioritizeEvidence(allEvidence: EvidenceItem[], maxCount: number): EvidenceItem[] {
  // Check if failure signals exist
  const hasFailureSignals = allEvidence.some(
    (e) => e.severity === 'critical' || e.severity === 'error' || e.severity === 'warn' || e.type === 'deployment'
  );

  // Filter out repetitive background telemetry noise if failure signals exist
  const filtered = hasFailureSignals
    ? allEvidence.filter((item) => {
        const msg = item.message.toLowerCase();
        const isRoutineNoise =
          msg.includes('get /healthz 200') ||
          msg.includes('get /metrics 200') ||
          msg.includes('heartbeat ok') ||
          msg.includes('routine interface check') ||
          msg.includes('replication stream healthy') ||
          msg.includes('checkpoint complete') ||
          msg.includes('0 incoming requests reached backend') ||
          (msg.includes('health ok') && item.severity === 'info');
        return !isRoutineNoise;
      })
    : allEvidence;

  // Guarantee that if filtered is too small, fallback to allEvidence
  const candidateList = filtered.length >= 3 ? filtered : allEvidence;

  if (candidateList.length <= maxCount) {
    return [...candidateList].sort((a, b) => {
      const tA = Date.parse(a.timestamp);
      const tB = Date.parse(b.timestamp);
      if (!isNaN(tA) && !isNaN(tB)) return tA - tB;
      return 0;
    });
  }

  // Score each evidence item
  const scored = candidateList.map((item) => {
    let score = 0;
    if (item.type === 'deployment') score += 50;
    if (item.severity === 'critical') score += 40;
    if (item.severity === 'error') score += 30;
    if (item.type === 'metric' && (item.value ?? 0) >= 80) score += 35;
    if (item.severity === 'warn') score += 15;
    if (item.message.toLowerCase().includes('slow query')) score += 30;
    if (item.message.toLowerCase().includes('connection pool')) score += 35;
    if (item.message.toLowerCase().includes('fatal') || item.message.toLowerCase().includes('crash')) score += 45;
    if (item.source.toLowerCase().includes('hs_err') || item.message.toLowerCase().includes('exception_access_violation')) score += 45;
    if (item.message.toLowerCase().includes('retry storm') || item.message.toLowerCase().includes('starvation')) score += 40;
    if (item.message.toLowerCase().includes('no space left') || item.message.toLowerCase().includes('disk full')) score += 40;
    if (item.message.toLowerCase().includes('certificate expired') || item.message.toLowerCase().includes('tls handshake')) score += 40;
    if (item.message.toLowerCase().includes('configmap') || item.message.toLowerCase().includes('dummy validator')) score += 40;
    if (item.message.toLowerCase().includes('cache stampede') || item.message.toLowerCase().includes('cache hit ratio')) score += 40;
    if (item.message.toLowerCase().includes('mtu mismatch') || item.message.toLowerCase().includes('tcp retransmission')) score += 40;
    if (item.message.toLowerCase().includes('deadlock detected') || item.message.toLowerCase().includes('row lock')) score += 40;
    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const selected = scored.slice(0, maxCount).map((s) => s.item);

  // Re-sort selected items chronologically
  return selected.sort((a, b) => {
    const tA = Date.parse(a.timestamp);
    const tB = Date.parse(b.timestamp);
    if (!isNaN(tA) && !isNaN(tB)) return tA - tB;
    return 0;
  });
}

function buildTimeline(evidence: EvidenceItem[]): TimelineEntry[] {
  return evidence
    .filter((e) => e.severity !== 'info' || e.type === 'deployment')
    .slice(0, 10)
    .map((e) => {
      let significance: TimelineSignificance = 'system_effect';
      if (e.type === 'deployment') significance = 'initial_trigger';
      else if (e.message.includes('100%') || e.message.includes('exhausted')) significance = 'state_change';
      else if (e.message.includes('500') || e.message.includes('timeout')) significance = 'user_visible_symptom';

      return {
        timestamp: e.timestamp,
        description: e.message,
        evidenceId: e.id,
        service: e.service,
        significance
      };
    });
}

function buildCausalChain(hypothesis: Hypothesis, evidence: EvidenceItem[]): CausalChainNode[] {
  const chain: CausalChainNode[] = [];

  // 1. Initial Trigger (e.g. Deployment)
  const deployEvidence = evidence.filter((e) => e.type === 'deployment');
  if (deployEvidence.length > 0) {
    chain.push({
      id: 'node-1',
      description: deployEvidence[0].message || 'Application deployment initiated',
      role: 'root_cause',
      evidenceIds: deployEvidence.map((e) => e.id),
      next: ['node-2']
    });
  } else {
    chain.push({
      id: 'node-1',
      description: hypothesis.cause,
      role: 'root_cause',
      evidenceIds: hypothesis.supportingEvidenceIds.slice(0, 2),
      next: ['node-2']
    });
  }

  // 2. Contributing factor / Intermediate failure
  const dbExhaustionEvidence = evidence.filter(
    (e) => e.message.includes('connection pool') || e.message.includes('slow query')
  );
  if (dbExhaustionEvidence.length > 0) {
    chain.push({
      id: 'node-2',
      description: 'Database connection pool reached saturation / slow query execution',
      role: 'contributing_factor',
      evidenceIds: dbExhaustionEvidence.map((e) => e.id),
      next: ['node-3']
    });
  }

  // 3. System Effect
  const timeoutEvidence = evidence.filter(
    (e) => e.message.includes('timed out') || e.message.includes('blocking')
  );
  chain.push({
    id: 'node-3',
    description: 'API worker threads blocked waiting for database connections',
    role: 'system_effect',
    evidenceIds: timeoutEvidence.map((e) => e.id),
    next: ['node-4']
  });

  // 4. User-Visible Symptom
  const errorEvidence = evidence.filter((e) => e.message.includes('500') || e.message.includes('Internal Server Error'));
  chain.push({
    id: 'node-4',
    description: 'HTTP 500 Internal Server Errors returned to users',
    role: 'user_visible_symptom',
    evidenceIds: errorEvidence.map((e) => e.id)
  });

  return chain;
}

function generateRecommendations(hypothesis: Hypothesis, causalChain: CausalChainNode[]): string[] {
  const actions: string[] = [];
  const causeLower = hypothesis.cause.toLowerCase();

  if (causeLower.includes('database') || causeLower.includes('connection pool')) {
    actions.push('Inspect recent database queries introduced in the deployment for missing indexes or table scans.');
    actions.push('Review and adjust database connection pool max connections and connection checkout timeouts.');
  }

  if (causeLower.includes('deployment') || causalChain.some((c) => c.description.toLowerCase().includes('deployment'))) {
    actions.push('Compare query execution plans between the current deployment version and the previous stable version.');
    actions.push('Human review required: Consider rolling back the recent deployment if query optimization cannot be immediately applied.');
  }

  if (actions.length === 0) {
    actions.push('Review application logs and verify external dependency connectivity.');
    actions.push('Monitor service latency metrics following corrective actions.');
  }

  return actions;
}
