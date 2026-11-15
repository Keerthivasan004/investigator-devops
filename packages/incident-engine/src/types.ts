import type { EvidenceItem } from '@investigator/evidence';
import type { Hypothesis } from '@investigator/hypothesis';

export interface IncidentMetadata {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime?: string;
  services?: string[];
}

export type TimelineSignificance =
  | 'initial_trigger'
  | 'state_change'
  | 'system_effect'
  | 'user_visible_symptom';

export interface TimelineEntry {
  timestamp: string;
  description: string;
  evidenceId: string;
  service: string;
  significance: TimelineSignificance;
}

export type CausalNodeRole =
  | 'root_cause'
  | 'contributing_factor'
  | 'system_effect'
  | 'user_visible_symptom';

export interface CausalChainNode {
  id: string;
  description: string;
  role: CausalNodeRole;
  evidenceIds: string[];
  next?: string[];
}

export interface RootCauseDecision {
  description: string;
  confidence: number;
  confidenceRationale: string;
  ruleId?: string;
}

export interface InvestigationStatistics {
  totalEvidenceAvailable: number;
  evidenceInspected: number;
  evidenceReductionRatio: number;
  durationMs: number;
  modelCalls: number;
}

/**
 * Structured Investigation Report conforming to Section 23 of the specification
 */
export interface InvestigationReport {
  incidentId: string;
  incidentSummary: string;
  projectName?: string;
  projectPath?: string;
  timeline: TimelineEntry[];
  hypotheses: Hypothesis[];
  selectedEvidence: EvidenceItem[];
  supportingEvidence: EvidenceItem[];
  contradictingEvidence: EvidenceItem[];
  missingEvidence: string[];
  alternativeExplanations: string[];
  causalChain: CausalChainNode[];
  rootCause: RootCauseDecision;
  recommendedActions: string[];
  statistics: InvestigationStatistics;
}

export interface IncidentInvestigationInput {
  incidentPath?: string;
  projectPath?: string;
  externalLogsPath?: string;
  rawEvidenceFiles?: import('@investigator/evidence').RawEvidenceFile[];
  description?: string;
  maxEvidenceToInspect?: number;
}
