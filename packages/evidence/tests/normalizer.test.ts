import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { loadIncident } from '../src/loader.js';
import { normalizeEvidence } from '../src/normalizer.js';

describe('Evidence Normalizer', () => {
  const incidentDir = path.resolve(__dirname, '../../../incidents/incident-001');

  it('should normalize loaded incident telemetry into structured EvidenceItem objects', () => {
    const loaded = loadIncident(incidentDir);
    const evidenceItems = normalizeEvidence(loaded.evidenceFiles);

    expect(evidenceItems.length).toBeGreaterThan(0);

    // Verify all items have required fields and source references (Rule 10)
    for (const item of evidenceItems) {
      expect(item.id).toBeDefined();
      expect(item.timestamp).toBeDefined();
      expect(item.source).toBeDefined();
      expect(item.type).toBeDefined();
      expect(item.service).toBeDefined();
      expect(item.severity).toBeDefined();
      expect(item.originalReference.file).toBeDefined();
      expect(item.originalReference.line).toBeGreaterThan(0);
    }
  });

  it('should detect critical database errors and connection metrics', () => {
    const loaded = loadIncident(incidentDir);
    const evidenceItems = normalizeEvidence(loaded.evidenceFiles);

    // Find database connection pool exhaustion item
    const criticalDbItem = evidenceItems.find(
      (item) => item.service === 'postgres-db' && item.severity === 'critical'
    );
    expect(criticalDbItem).toBeDefined();
    expect(criticalDbItem?.message).toContain('connection pool exhausted');

    // Find metric item
    const metricItem = evidenceItems.find(
      (item) => item.type === 'metric' && item.value === 100
    );
    expect(metricItem).toBeDefined();
    expect(metricItem?.unit).toBe('percent');
  });

  it('should sort evidence items chronologically', () => {
    const loaded = loadIncident(incidentDir);
    const evidenceItems = normalizeEvidence(loaded.evidenceFiles);

    for (let i = 0; i < evidenceItems.length - 1; i++) {
      const timeCurrent = Date.parse(evidenceItems[i].timestamp);
      const timeNext = Date.parse(evidenceItems[i + 1].timestamp);
      if (!isNaN(timeCurrent) && !isNaN(timeNext)) {
        expect(timeCurrent).toBeLessThanOrEqual(timeNext);
      }
    }
  });
});
