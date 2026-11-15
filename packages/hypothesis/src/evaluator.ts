import type { EvidenceItem } from '@investigator/evidence';
import type { Hypothesis, HypothesisEvaluation, ContradictionCheck } from './types.js';

/**
 * Evaluates a hypothesis against all available normalized evidence.
 * Specifically checks for supporting evidence, actively searches for contradicting evidence,
 * and identifies missing telemetry types (Rules 11, 12, 13).
 */
export function evaluateHypothesisWithEvidence(
  hypothesis: Hypothesis,
  allEvidence: EvidenceItem[]
): HypothesisEvaluation {
  const causeLower = hypothesis.cause.toLowerCase();
  const supporting: EvidenceItem[] = [];
  const contradicting: EvidenceItem[] = [];
  const missing: string[] = [...hypothesis.missingEvidenceDescriptions];

  // 1. Identify Supporting Evidence
  for (const item of allEvidence) {
    const msg = item.message.toLowerCase();
    const service = item.service.toLowerCase();

    // Check database exhaustion / query hypothesis
    if (causeLower.includes('database') || causeLower.includes('connection pool') || causeLower.includes('query')) {
      if (
        (service.includes('postgres') || service.includes('database') || item.type === 'database') &&
        (msg.includes('connection pool') || msg.includes('slow query') || msg.includes('exhausted') || msg.includes('100%'))
      ) {
        supporting.push(item);
      } else if (item.type === 'metric' && msg.includes('connection_pool') && (item.value ?? 0) >= 80) {
        supporting.push(item);
      }
    }

    // Check deployment hypothesis
    if (causeLower.includes('deployment') || causeLower.includes('regression') || causeLower.includes('release')) {
      if (item.type === 'deployment') {
        supporting.push(item);
      }
    }

    // Check memory leak / OOM hypothesis
    if (causeLower.includes('memory') || causeLower.includes('oom')) {
      if (msg.includes('oom') || msg.includes('out of memory') || msg.includes('heap')) {
        supporting.push(item);
      }
    }

    // Check network hypothesis
    if (causeLower.includes('network') || causeLower.includes('dns')) {
      if (item.type === 'network' || msg.includes('dns') || msg.includes('econnrefused') || msg.includes('packet loss')) {
        supporting.push(item);
      }
    }
  }

  // 2. Active Contradiction Checking (Rule 12)
  // What evidence would disprove this hypothesis?
  if (causeLower.includes('memory') || causeLower.includes('oom')) {
    // If pod memory metrics exist and show stable/low memory, that contradicts a memory leak
    const stableMemoryMetric = allEvidence.find(
      (e) => e.type === 'metric' && e.message.includes('memory') && (e.value ?? 0) < 50
    );
    if (stableMemoryMetric) {
      contradicting.push(stableMemoryMetric);
    }
  }

  if (causeLower.includes('network')) {
    // If local network logs show 0 packet loss and successful internal pings, network failure is contradicted
    const networkOk = allEvidence.find(
      (e) => e.type === 'network' && (e.message.includes('healthy') || e.message.includes('0% loss'))
    );
    if (networkOk) {
      contradicting.push(networkOk);
    }
  }

  // 3. Check for Missing Telemetry
  // E.g. If investigating database, do we have database metrics or slow query logs?
  if (causeLower.includes('database')) {
    const hasDbMetrics = allEvidence.some((e) => e.source.includes('db') || e.type === 'metric');
    if (!hasDbMetrics && !missing.includes('database metrics')) {
      missing.push('database metrics');
    }
  }

  // 4. Calibrated Confidence Calculation
  let confidence = 0.5;

  if (supporting.length > 0 && contradicting.length === 0) {
    confidence = Math.min(0.95, 0.5 + supporting.length * 0.12);
  } else if (contradicting.length > 0) {
    confidence = Math.max(0.1, 0.4 - contradicting.length * 0.2);
  }

  // 5. Update Status
  let status = hypothesis.status;
  if (contradicting.length > 0) {
    status = confidence < 0.2 ? 'disproven' : 'weakened';
  } else if (supporting.length >= 3 && confidence >= 0.8) {
    status = 'strongly_supported';
  } else if (supporting.length > 0) {
    status = 'partially_supported';
  }

  const updatedHypothesis: Hypothesis = {
    ...hypothesis,
    supportingEvidenceIds: supporting.map((e) => e.id),
    contradictingEvidenceIds: contradicting.map((e) => e.id),
    missingEvidenceDescriptions: missing,
    confidence: Number(confidence.toFixed(2)),
    status,
    rationale: `Evaluated against ${allEvidence.length} evidence items: ${supporting.length} supporting, ${contradicting.length} contradicting.`
  };

  return {
    hypothesis: updatedHypothesis,
    supportingEvidence: supporting,
    contradictingEvidence: contradicting,
    missingEvidence: missing
  };
}
