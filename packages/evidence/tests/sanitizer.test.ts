import { describe, it, expect } from 'vitest';
import { sanitizeTelemetry } from '../src/sanitizer.js';

describe('Secret Sanitizer', () => {
  it('should mask database connection URI passwords', () => {
    const log = 'Connecting to postgres://admin:superSecretPassword123@db.prod.internal:5432/orders';
    const result = sanitizeTelemetry(log);
    expect(result).not.toContain('superSecretPassword123');
    expect(result).toContain('postgres://admin:[REDACTED]@db.prod.internal:5432/orders');
  });

  it('should mask Bearer tokens', () => {
    const log = 'Authorization header: Bearer ya29.a0AfH6SMDI8823h8f';
    const result = sanitizeTelemetry(log);
    expect(result).not.toContain('ya29.a0AfH6SMDI8823h8f');
    expect(result).toContain('Bearer [REDACTED]');
  });

  it('should mask API keys', () => {
    const log = 'Failed request with apiKey: sk-123456789012345678901234';
    const result = sanitizeTelemetry(log);
    expect(result).not.toContain('sk-123456789012345678901234');
    expect(result).toContain('[API_KEY_REDACTED]');
  });
});
