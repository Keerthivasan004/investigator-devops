import type { LLMProvider, LLMRequest, LLMResponse } from './types.js';

export interface GeminiProviderConfig {
  apiKey?: string;
  model?: string;
}

export class GeminiLLMProvider implements LLMProvider {
  readonly name = 'gemini';
  private apiKey: string;
  private model: string;

  constructor(config: GeminiProviderConfig = {}) {
    this.apiKey = config.apiKey || process.env.GEMINI_API_KEY || '';
    this.model = config.model || process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    if (!this.apiKey) {
      console.warn('[GeminiLLMProvider] Warning: GEMINI_API_KEY not configured. Calls will fail unless provided.');
    }
  }

  async generate<T = unknown>(request: LLMRequest): Promise<LLMResponse<T>> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is required. Set GEMINI_API_KEY environment variable.');
    }

    const start = Date.now();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const contents = request.messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const body: Record<string, unknown> = {
      contents,
      generationConfig: {
        temperature: request.temperature ?? 0.2,
        maxOutputTokens: request.maxTokens ?? 2048,
        responseMimeType: request.responseFormat === 'json' ? 'application/json' : 'text/plain'
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number; totalTokenCount?: number };
    };

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    let parsed: T | undefined;

    if (request.responseFormat === 'json') {
      try {
        parsed = JSON.parse(text) as T;
      } catch {
        // failed parse
      }
    }

    return {
      text,
      parsed,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata?.totalTokenCount || 0
      },
      durationMs: Date.now() - start
    };
  }
}
