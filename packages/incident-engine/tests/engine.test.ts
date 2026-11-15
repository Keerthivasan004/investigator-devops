import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { MockLLMProvider } from '@investigator/llm';
import { IncidentEngine } from '../src/index.js';

describe('IncidentEngine Orchestrator', () => {
  const incidentDir = path.resolve(__dirname, '../../../incidents/incident-001');
  const projectDir = path.resolve(__dirname, '../../../');

  it('should run an end-to-end investigation on an incident directory', async () => {
    const mockProvider = new MockLLMProvider();
    const engine = new IncidentEngine(mockProvider);

    const report = await engine.investigate({
      incidentPath: incidentDir
    });

    expect(report.incidentId).toBe('incident-001');
    expect(report.hypotheses.length).toBeGreaterThan(0);
    expect(report.selectedEvidence.length).toBeGreaterThan(0);
    expect(report.supportingEvidence.length).toBeGreaterThan(0);
    expect(report.timeline.length).toBeGreaterThan(0);
    expect(report.causalChain.length).toBeGreaterThan(0);
    expect(report.rootCause.description).toBeDefined();
    expect(report.rootCause.confidence).toBeGreaterThan(0.5);
    expect(report.recommendedActions.length).toBeGreaterThan(0);
    expect(report.statistics.totalEvidenceAvailable).toBeGreaterThan(0);
    expect(report.statistics.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('should investigate when given a project directory path', async () => {
    const mockProvider = new MockLLMProvider();
    const engine = new IncidentEngine(mockProvider);

    const report = await engine.investigate({
      projectPath: projectDir,
      description: 'Test investigation for workspace project'
    });

    expect(report.incidentId).toBeDefined();
    expect(report.hypotheses.length).toBeGreaterThan(0);
    expect(report.statistics).toBeDefined();
  });
});
