import type { LLMProvider } from './types.js';
import { MockLLMProvider } from './mock-provider.js';
import { GeminiLLMProvider } from './gemini-provider.js';
import { OllamaLLMProvider } from './ollama-provider.js';

export interface ProviderFactoryOptions {
  providerName?: string;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

export function createLLMProvider(options: ProviderFactoryOptions = {}): LLMProvider {
  const provider = (options.providerName || process.env.LLM_PROVIDER || 'mock').toLowerCase();

  switch (provider) {
    case 'gemini':
      return new GeminiLLMProvider({ apiKey: options.apiKey, model: options.model });
    case 'ollama':
      return new OllamaLLMProvider({ baseUrl: options.baseUrl, model: options.model });
    case 'mock':
    default:
      return new MockLLMProvider();
  }
}
