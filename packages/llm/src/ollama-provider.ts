import type { LLMProvider, LLMRequest, LLMResponse } from './types.js';

export interface OllamaProviderConfig {
  baseUrl?: string;
  model?: string;
}

export class OllamaLLMProvider implements LLMProvider {
  readonly name = 'ollama';
  private baseUrl: string;
  private model: string;

  constructor(config: OllamaProviderConfig = {}) {
    this.baseUrl = config.baseUrl || process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
    this.model = config.model || process.env.OLLAMA_MODEL || 'llama3.2';
  }

  async generate<T = unknown>(request: LLMRequest): Promise<LLMResponse<T>> {
    const start = Date.now();
    const url = `${this.baseUrl}/api/chat`;

    const body: Record<string, unknown> = {
      model: this.model,
      messages: request.messages,
      stream: false,
      options: {
        temperature: request.temperature ?? 0.2
      }
    };

    if (request.responseFormat === 'json') {
      body.format = 'json';
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Ollama error (${response.status}): ${errText}`);
    }

    const data = (await response.json()) as {
      message?: { content?: string };
      prompt_eval_count?: number;
      eval_count?: number;
    };

    const text = data.message?.content || '';
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
        promptTokens: data.prompt_eval_count || 0,
        completionTokens: data.eval_count || 0,
        totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0)
      },
      durationMs: Date.now() - start
    };
  }
}
