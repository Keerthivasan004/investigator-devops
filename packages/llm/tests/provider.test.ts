import { describe, it, expect } from 'vitest';
import { MockLLMProvider, createLLMProvider } from '../src/index.js';

describe('LLM Provider Abstraction', () => {
  it('should generate responses via MockLLMProvider', async () => {
    const provider = new MockLLMProvider();
    const res = await provider.generate<{ hypotheses: unknown[] }>({
      messages: [{ role: 'user', content: 'Generate hypotheses for high database latency' }],
      responseFormat: 'json'
    });

    expect(res.durationMs).toBeGreaterThanOrEqual(0);
    expect(res.parsed).toBeDefined();
    expect(Array.isArray(res.parsed?.hypotheses)).toBe(true);
    expect(res.parsed?.hypotheses.length).toBeGreaterThan(0);
  });

  it('should support factory creation of mock provider', () => {
    const provider = createLLMProvider({ providerName: 'mock' });
    expect(provider.name).toBe('mock');
  });

  it('should support custom queued responses in MockLLMProvider', async () => {
    const provider = new MockLLMProvider([{ custom: 'data' }]);
    const res = await provider.generate<{ custom: string }>({
      messages: [{ role: 'user', content: 'test' }],
      responseFormat: 'json'
    });

    expect(res.parsed?.custom).toBe('data');
  });
});
