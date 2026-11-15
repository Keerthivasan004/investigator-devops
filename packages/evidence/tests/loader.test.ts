import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { loadIncident } from '../src/loader.js';

describe('Incident Loader', () => {
  const incidentDir = path.resolve(__dirname, '../../../incidents/incident-001');

  it('should load incident metadata and telemetry files correctly', () => {
    const loaded = loadIncident(incidentDir);

    expect(loaded.metadata.id).toBe('incident-001');
    expect(loaded.metadata.title).toContain('API 500 errors');
    expect(loaded.evidenceFiles.length).toBeGreaterThan(0);
  });

  it('CRITICAL RULE 3: must strictly exclude ground-truth.json from investigator evidence files', () => {
    const loaded = loadIncident(incidentDir);

    // Verify ground-truth was detected
    expect(loaded.hasGroundTruth).toBe(true);

    // Verify ground-truth is NOT in evidence files
    const fileNames = loaded.evidenceFiles.map((f) => f.filename.toLowerCase());
    expect(fileNames).not.toContain('ground-truth.json');
    expect(fileNames).not.toContain('ground_truth.json');
    expect(fileNames).not.toContain('incident.json');

    // Telemetry files must be present
    expect(fileNames).toContain('application.log');
    expect(fileNames).toContain('database.log');
    expect(fileNames).toContain('metrics.json');
    expect(fileNames).toContain('deployment.json');
  });
});
