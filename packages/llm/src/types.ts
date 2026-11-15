export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: 'text' | 'json';
  jsonSchema?: Record<string, unknown>;
}

export interface LLMResponse<T = unknown> {
  text: string;
  parsed?: T;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  durationMs: number;
}

/**
 * Pluggable LLM Provider interface allowing provider swapping (Mock, Ollama, Gemini, OpenAI)
 * without rewriting the investigation engine.
 */
export interface LLMProvider {
  readonly name: string;
  generate<T = unknown>(request: LLMRequest): Promise<LLMResponse<T>>;
}
