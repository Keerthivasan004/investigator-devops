import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { MockLLMProvider } from '@investigator/llm';
import { loadIncident, normalizeEvidence } from '@investigator/evidence';
import { generateHypotheses, evaluateHypothesisWithEvidence } from '../src/index.js';

describe('Hypothesis Engine', () => {
  const incidentDir = path.resolve(__dirname, '../../../incidents/incident-001');

  it('should generate competing hypotheses using MockLLMProvider', async () => {
    const provider = new MockLLMProvider();
    const hypotheses = await generateHypotheses(
      {
        incidentDescription: 'Website is slow and occasionally returns HTTP 500 errors',
        services: ['api', 'postgres']
      },
      provider
    );

    expect(Array.isArray(hypotheses)).toBe(true);
    expect(hypotheses.length).toBeGreaterThanOrEqual(2);
    expect(hypotheses[0].cause).toBeDefined();
    expect(hypotheses[0].confidence).toBeGreaterThan(0);
  });

  it('should evaluate hypothesis against evidence and find supporting evidence', () => {
    const loaded = loadIncident(incidentDir);
    const evidenceItems = normalizeEvidence(loaded.evidenceFiles);

    const h1 = {
      id: 'H1',
      cause: 'Database connection pool exhaustion',
      status: 'investigating' as const,
      supportingEvidenceIds: [],
      contradictingEvidenceIds: [],
      missingEvidenceDescriptions: [],
      confidence: 0.5,
      rationale: ''
    };

    const evaluation = evaluateHypothesisWithEvidence(h1, evidenceItems);

    expect(evaluation.supportingEvidence.length).toBeGreaterThan(0);
    expect(evaluation.hypothesis.status).toBe('strongly_supported');
    expect(evaluation.hypothesis.confidence).toBeGreaterThan(0.8);
  });

  it('RULE 12: should identify contradicting evidence and weaken disproven hypotheses', () => {
    const loaded = loadIncident(incidentDir);
    const evidenceItems = normalizeEvidence(loaded.evidenceFiles);

    // Inject a telemetry item showing memory is healthy
    evidenceItems.push({
      id: 'ev-test-mem',
      timestamp: '2026-09-21T14:02:00Z',
      source: 'metrics.json',
      type: 'metric',
      service: 'api',
      severity: 'info',
      message: 'memory_usage is stable at 35%',
      value: 35,
      unit: 'percent',
      originalReference: { file: 'metrics.json', line: 1 }
    });

    const hMemory = {
      id: 'H2',
      cause: 'Application memory leak / OOM error',
      status: 'investigating' as const,
      supportingEvidenceIds: [],
      contradictingEvidenceIds: [],
      missingEvidenceDescriptions: [],
      confidence: 0.5,
      rationale: ''
    };

    const evaluation = evaluateHypothesisWithEvidence(hMemory, evidenceItems);

    expect(evaluation.contradictingEvidence.length).toBeGreaterThan(0);
    expect(evaluation.hypothesis.status).toBe('weakened');
    expect(evaluation.hypothesis.confidence).toBeLessThan(0.4);
  });
});
