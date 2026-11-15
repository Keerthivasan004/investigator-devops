import { describe, it, expect } from 'vitest';
import type { EvidenceItem } from '../src/types.js';

describe('Evidence Model', () => {
  it('should instantiate and validate an EvidenceItem structure', () => {
    const item: EvidenceItem = {
      id: 'evidence-001',
      timestamp: '2026-09-21T14:05:00Z',
      source: 'kubernetes',
      type: 'event',
      service: 'orders-api',
      severity: 'critical',
      message: 'Container OOMKilled',
      metadata: {
        pod: 'orders-api-7f89d',
        namespace: 'production'
      },
      originalReference: {
        file: 'kubernetes.log',
        line: 42
      }
    };

    expect(item.id).toBe('evidence-001');
    expect(item.type).toBe('event');
    expect(item.originalReference.file).toBe('kubernetes.log');
    expect(item.originalReference.line).toBe(42);
  });
});
