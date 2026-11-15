import type { EvidenceItem } from '@investigator/evidence';
import type { LLMProvider } from '@investigator/llm';
import type { Hypothesis } from './types.js';

export interface GenerateHypothesesInput {
  incidentDescription: string;
  services?: string[];
  evidenceSummary?: EvidenceItem[];
}

/**
 * Generates 2 to 4 competing hypotheses for the given incident symptoms.
 * Mandates structured JSON output from the LLM provider.
 */
export async function generateHypotheses(
  input: GenerateHypothesesInput,
  llm: LLMProvider
): Promise<Hypothesis[]> {
  const topEvidenceText = (input.evidenceSummary || [])
    .slice(0, 15)
    .map((e) => `[${e.timestamp}] [${e.service}] (${e.severity.toUpperCase()}): ${e.message}`)
    .join('\n');

  const systemPrompt = `You are a Principal Site Reliability Engineer (SRE) investigating an incident.
Given the incident symptoms and telemetry observations, formulate 2 to 4 COMPETING, distinct hypotheses explaining what could be the root cause.
Do not jump to a single conclusion. Consider multiple potential failure modes (e.g. database, deployment, resource exhaustion, network, configuration).
You MUST respond with pure JSON conforming to this schema:
{
  "hypotheses": [
    {
      "id": "H1",
      "cause": "Concise root cause description",
      "status": "investigating",
      "supportingEvidenceIds": [],
      "contradictingEvidenceIds": [],
      "missingEvidenceDescriptions": ["Telemetry needed to prove or disprove this"],
      "confidence": 0.5,
      "rationale": "Reasoning explaining why this is a plausible cause"
    }
  ]
}`;

  const userPrompt = `Incident Description: ${input.incidentDescription}
Services Involved: ${input.services?.join(', ') || 'Unknown'}

Telemetry Observations:
${topEvidenceText || 'No initial telemetry provided.'}

Generate competing hypotheses now.`;

  const response = await llm.generate<{ hypotheses: Hypothesis[] }>({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.2,
    responseFormat: 'json'
  });

  if (response.parsed?.hypotheses && Array.isArray(response.parsed.hypotheses)) {
    return response.parsed.hypotheses.map((h, idx) => ({
      id: h.id || `H${idx + 1}`,
      cause: h.cause || 'Unknown cause',
      status: h.status || 'investigating',
      supportingEvidenceIds: h.supportingEvidenceIds || [],
      contradictingEvidenceIds: h.contradictingEvidenceIds || [],
      missingEvidenceDescriptions: h.missingEvidenceDescriptions || [],
      confidence: typeof h.confidence === 'number' ? h.confidence : 0.5,
      rationale: h.rationale || ''
    }));
  }

  // Fallback default hypotheses if LLM output fails
  return [
    {
      id: 'H1',
      cause: 'Database connection pool exhaustion or query latency',
      status: 'investigating',
      supportingEvidenceIds: [],
      contradictingEvidenceIds: [],
      missingEvidenceDescriptions: ['database connection metrics', 'slow query logs'],
      confidence: 0.5,
      rationale: 'Common root cause for intermittent 500 errors and high API latency.'
    },
    {
      id: 'H2',
      cause: 'Bad code deployment or regression',
      status: 'investigating',
      supportingEvidenceIds: [],
      contradictingEvidenceIds: [],
      missingEvidenceDescriptions: ['deployment timeline', 'application release changelog'],
      confidence: 0.4,
      rationale: 'Recent deployment may have introduced code errors or memory leaks.'
    }
  ];
}
