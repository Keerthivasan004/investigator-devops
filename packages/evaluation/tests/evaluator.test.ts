import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { MockLLMProvider } from '@investigator/llm';
import { IncidentEngine } from '@investigator/incident-engine';
import { evaluateInvestigation, runBenchmarkSuite } from '../src/index.js';

describe('Evaluation & Benchmark Engine', () => {
  const incidentDir = path.resolve(__dirname, '../../../incidents/incident-001');
  const allIncidentsDir = path.resolve(__dirname, '../../../incidents');

  it('should evaluate an investigation against ground truth accurately', async () => {
    const engine = new IncidentEngine(new MockLLMProvider());
    const report = await engine.investigate({ incidentPath: incidentDir });

    const evalResult = evaluateInvestigation(report, incidentDir);

    expect(evalResult.incidentId).toBe('incident-001');
    expect(evalResult.rootCauseMatched).toBe(true);
    expect(evalResult.evidenceRecall).toBeGreaterThan(0.5);
    expect(evalResult.detailedAnalysis).toContain('Root Cause Matched: YES');
  });

  it('should run benchmark suite over synthetic incidents directory', async () => {
    const engine = new IncidentEngine(new MockLLMProvider());
    const summary = await runBenchmarkSuite(allIncidentsDir, engine);

    expect(summary.totalIncidents).toBeGreaterThan(0);
    expect(summary.rootCauseAccuracy).toBeGreaterThan(0);
    expect(summary.averageEvidenceRecall).toBeGreaterThan(0);
    expect(summary.results.length).toBe(summary.totalIncidents);
  });
});
