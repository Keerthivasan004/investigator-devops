import type { EvidenceItem } from '@investigator/evidence';

export type HypothesisStatus =
  | 'investigating'
  | 'strongly_supported'
  | 'partially_supported'
  | 'weakened'
  | 'disproven';

export interface Hypothesis {
  /** Unique hypothesis identifier (e.g., 'H1', 'H2') */
  id: string;
  /** Proposed root or contributing cause description */
  cause: string;
  /** Current evaluation status */
  status: HypothesisStatus;
  /** Identifiers of evidence items supporting this hypothesis */
  supportingEvidenceIds: string[];
  /** Identifiers of evidence items contradicting or challenging this hypothesis */
  contradictingEvidenceIds: string[];
  /** Expected evidence items or telemetry types that are missing */
  missingEvidenceDescriptions: string[];
  /** Confidence score between 0.0 and 1.0 */
  confidence: number;
  /** Explanatory reasoning behind the confidence and status */
  rationale: string;
}

export interface HypothesisEvaluation {
  hypothesis: Hypothesis;
  supportingEvidence: EvidenceItem[];
  contradictingEvidence: EvidenceItem[];
  missingEvidence: string[];
}

export interface ContradictionCheck {
  hypothesisId: string;
  /** The question asked to challenge the hypothesis (e.g. 'What evidence proves this wrong?') */
  challengeQuestion: string;
  contradictingEvidenceIds: string[];
  evaluation: 'sustained' | 'weakened' | 'refuted';
  explanation: string;
}
