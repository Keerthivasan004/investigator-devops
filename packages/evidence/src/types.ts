/**
 * Supported telemetry evidence categories
 */
export type EvidenceType =
  | 'log'
  | 'metric'
  | 'event'
  | 'deployment'
  | 'configuration'
  | 'architecture'
  | 'trace'
  | 'network'
  | 'database'
  | 'kubernetes';

export type EvidenceSeverity = 'info' | 'warn' | 'error' | 'critical';

export interface EvidenceSourceReference {
  /** Relative or absolute path of the source file */
  file: string;
  /** Line number if applicable (1-based) */
  line?: number;
  /** Character or byte offset if applicable */
  offset?: number;
}

/**
 * Normalized evidence item representing a single atomic piece of telemetry
 */
export interface EvidenceItem {
  /** Unique evidence identifier (e.g., 'evidence-001') */
  id: string;
  /** ISO8601 timestamp string representing when the evidence occurred */
  timestamp: string;
  /** Source system or logger (e.g., 'kubernetes', 'database', 'nginx', 'application') */
  source: string;
  /** Category of telemetry evidence */
  type: EvidenceType;
  /** Associated microservice or infrastructure component (e.g., 'orders-api', 'postgres') */
  service: string;
  /** Severity level */
  severity: EvidenceSeverity;
  /** Human-readable event description, log line, or status message */
  message: string;
  /** Optional numeric metric value */
  value?: number;
  /** Optional metric unit (e.g., 'ms', 'percent', 'bytes') */
  unit?: string;
  /** Additional structured attributes */
  metadata?: Record<string, unknown>;
  /** Reference back to original raw telemetry file and location for verification */
  originalReference: EvidenceSourceReference;
}

export interface RawEvidenceFile {
  filename: string;
  relativePath: string;
  content: string;
}

export type SupportedLanguage =
  | 'nodejs'
  | 'typescript'
  | 'python'
  | 'golang'
  | 'java'
  | 'rust'
  | 'docker'
  | 'unknown';

export interface DetectedTechStack {
  language: SupportedLanguage;
  packageManager?: 'pnpm' | 'npm' | 'yarn' | 'pip' | 'poetry' | 'go' | 'maven' | 'gradle' | 'cargo';
  frameworks?: string[];
  manifestFiles: string[];
}

export interface GitCommitInfo {
  hash: string;
  author: string;
  timestamp: string;
  message: string;
  filesChanged?: string[];
}

export interface GitChangeSummary {
  isGitRepo: boolean;
  branch?: string;
  recentCommits: GitCommitInfo[];
  uncommittedChangesCount?: number;
  modifiedFiles?: string[];
}

export interface ProjectScanResult {
  projectPath: string;
  name?: string;
  techStacks: DetectedTechStack[];
  logFiles: string[];
  configFiles: string[];
  dockerFiles: string[];
  gitChanges?: GitChangeSummary;
  suggestedServices: string[];
}

export interface IncidentMetadata {
  id: string;
  title: string;
  description: string;
  startTime?: string;
  endTime?: string;
  services?: string[];
}

export interface LoadedIncident {
  metadata: IncidentMetadata;
  evidenceFiles: RawEvidenceFile[];
  hasGroundTruth: boolean;
}
