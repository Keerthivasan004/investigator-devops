export interface GroundTruth {
  incidentId: string;
  rootCause: string;
  rootCauseCategory: string;
  contributingFactors: string[];
  intermediateEffects: string[];
  symptoms: string[];
  /** Evidence items that are essential to identifying the true root cause */
  essentialEvidenceIds: string[];
  /** Telemetry items present in dataset that are noise/unrelated symptoms */
  noiseEvidenceIds?: string[];
}

export interface EvaluationResult {
  incidentId: string;
  rootCauseMatched: boolean;
  rootCauseTopKMatched: boolean;
  topKRank?: number;
  /** Relevant evidence selected / Total relevant evidence */
  evidenceRecall: number;
  /** Relevant evidence selected / Total evidence inspected */
  evidencePrecision: number;
  /** 1 - (evidence inspected / evidence available) */
  evidenceReductionRatio: number;
  /** Rate of selecting noise evidence as causal */
  falsePositiveEvidenceRate: number;
  confidenceReported: number;
  detailedAnalysis: string;
}

export interface BenchmarkSummary {
  totalIncidents: number;
  rootCauseAccuracy: number;
  top3Accuracy: number;
  averageEvidenceRecall: number;
  averageEvidenceReductionRatio: number;
  results: EvaluationResult[];
}

