import type { LLMProvider, LLMRequest, LLMResponse } from './types.js';

export type MockResponseHandler = (request: LLMRequest) => unknown;

export class MockLLMProvider implements LLMProvider {
  readonly name = 'mock';
  private cannedResponses: Array<unknown> = [];
  private dynamicHandler?: MockResponseHandler;
  public recordedRequests: LLMRequest[] = [];

  constructor(responses: Array<unknown> = [], dynamicHandler?: MockResponseHandler) {
    this.cannedResponses = [...responses];
    this.dynamicHandler = dynamicHandler;
  }

  queueResponse(response: unknown): void {
    this.cannedResponses.push(response);
  }

  setDynamicHandler(handler: MockResponseHandler): void {
    this.dynamicHandler = handler;
  }

  async generate<T = unknown>(request: LLMRequest): Promise<LLMResponse<T>> {
    const start = Date.now();
    this.recordedRequests.push(request);

    let output: unknown;

    if (this.cannedResponses.length > 0) {
      output = this.cannedResponses.shift();
    } else if (this.dynamicHandler) {
      output = this.dynamicHandler(request);
    } else {
      // Default rule-based output based on prompt keywords
      output = this.defaultRuleBasedOutput(request);
    }

    const text = typeof output === 'string' ? output : JSON.stringify(output);
    let parsed: T | undefined;

    if (request.responseFormat === 'json' || typeof output === 'object') {
      try {
        parsed = (typeof output === 'object' && output !== null ? output : JSON.parse(text)) as T;
      } catch {
        // failed parse
      }
    }

    return {
      text,
      parsed,
      usage: {
        promptTokens: 50,
        completionTokens: 100,
        totalTokens: 150
      },
      durationMs: Date.now() - start
    };
  }

  private defaultRuleBasedOutput(request: LLMRequest): Record<string, unknown> {
    const promptText = request.messages.map((m) => m.content).join(' ').toLowerCase();

    // If generating hypotheses
    if (promptText.includes('hypothesis') || promptText.includes('hypotheses') || promptText.includes('possible causes')) {
      return {
        hypotheses: [
          {
            id: 'H1',
            cause: 'Database connection pool exhaustion',
            status: 'investigating',
            supportingEvidenceIds: [],
            contradictingEvidenceIds: [],
            missingEvidenceDescriptions: ['connection pool configuration', 'slow query logs'],
            confidence: 0.85,
            rationale: 'Database metrics and logs indicate connection pool reached 100% saturation.'
          },
          {
            id: 'H2',
            cause: 'Application memory leak / OOM error',
            status: 'investigating',
            supportingEvidenceIds: [],
            contradictingEvidenceIds: [],
            missingEvidenceDescriptions: ['heap dump metrics'],
            confidence: 0.3,
            rationale: 'High CPU/traffic can sometimes correlate with memory leaks.'
          },
          {
            id: 'H3',
            cause: 'Upstream gateway or network timeout',
            status: 'investigating',
            supportingEvidenceIds: [],
            contradictingEvidenceIds: [],
            missingEvidenceDescriptions: ['network packet loss stats'],
            confidence: 0.2,
            rationale: 'Network timeouts could manifest as HTTP 500 or 504 errors.'
          }
        ]
      };
    }

    // If synthesizing causal chain / root cause
    if (promptText.includes('causal chain') || promptText.includes('root cause') || promptText.includes('rca')) {
      return {
        rootCause: {
          description: 'Database connection pool exhaustion caused by unindexed query in deployment v2.3',
          confidence: 0.91,
          confidenceRationale: 'Direct database log confirmation of 100% pool saturation following deployment v2.3.'
        },
        causalChain: [
          {
            id: 'C1',
            description: 'Deployment v2.3 introduces slow order line items query',
            role: 'root_cause',
            evidenceIds: ['ev-0001']
          },
          {
            id: 'C2',
            description: 'Postgres query latency increases to >3800ms',
            role: 'contributing_factor',
            evidenceIds: ['ev-0003']
          },
          {
            id: 'C3',
            description: 'Database connection pool hits 100% capacity',
            role: 'system_effect',
            evidenceIds: ['ev-0005', 'ev-0009']
          },
          {
            id: 'C4',
            description: 'API requests timeout waiting for connections resulting in HTTP 500 errors',
            role: 'user_visible_symptom',
            evidenceIds: ['ev-0012', 'ev-0013']
          }
        ],
        recommendedActions: [
          'Add database index on line_items(order_id)',
          'Review database connection pool max connections configuration',
          'Human review required before rolling back deployment v2.3'
        ]
      };
    }

    return { response: 'Acknowledged' };
  }
}
