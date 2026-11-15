import * as path from 'node:path';
import type {
  EvidenceItem,
  EvidenceSeverity,
  EvidenceType,
  RawEvidenceFile
} from './types.js';

let evidenceCounter = 1;

function nextEvidenceId(): string {
  const id = `ev-${String(evidenceCounter).padStart(4, '0')}`;
  evidenceCounter++;
  return id;
}

export function resetEvidenceIdCounter(start = 1): void {
  evidenceCounter = start;
}

/**
 * Normalizes an array of raw evidence files into typed, structured EvidenceItem objects.
 * Every item preserves an exact pointer back to its original file and line number.
 */
export function normalizeEvidence(rawFiles: RawEvidenceFile[]): EvidenceItem[] {
  const normalized: EvidenceItem[] = [];

  for (const file of rawFiles) {
    const filename = file.filename.toLowerCase();

    if (filename.endsWith('.json')) {
      const items = normalizeJsonEvidence(file);
      normalized.push(...items);
    } else if (filename.endsWith('.jsonl')) {
      const items = normalizeJsonlEvidence(file);
      normalized.push(...items);
    } else {
      // Default to line-by-line log parsing (.log, .txt)
      const items = normalizeLogEvidence(file);
      normalized.push(...items);
    }
  }

  // Chronologically sort normalized evidence items if valid timestamps exist
  return normalized.sort((a, b) => {
    const timeA = Date.parse(a.timestamp);
    const timeB = Date.parse(b.timestamp);
    if (!isNaN(timeA) && !isNaN(timeB)) {
      return timeA - timeB;
    }
    return 0;
  });
}

/**
 * Parses raw text log lines into individual EvidenceItems
 */
function normalizeLogEvidence(file: RawEvidenceFile): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  const lines = file.content.split('\n');
  const service = deduceServiceFromFilename(file.filename);
  const evidenceType = deduceTypeFromFilename(file.filename);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const lineNum = i + 1;
    const { timestamp, messageWithoutTime } = extractTimestamp(line);
    const severity = extractSeverity(line);

    items.push({
      id: nextEvidenceId(),
      timestamp,
      source: file.filename,
      type: evidenceType,
      service,
      severity,
      message: messageWithoutTime || line,
      originalReference: {
        file: file.relativePath,
        line: lineNum
      }
    });
  }

  return items;
}

/**
 * Parses JSON telemetry files (metrics arrays, deployments, events, or architecture)
 */
function normalizeJsonEvidence(file: RawEvidenceFile): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  let parsed: unknown;

  try {
    parsed = JSON.parse(file.content);
  } catch {
    // If invalid JSON, treat as plain text log fallback
    return normalizeLogEvidence(file);
  }

  const defaultService = deduceServiceFromFilename(file.filename);

  // 1. If it's an array of metric points or event objects
  if (Array.isArray(parsed)) {
    parsed.forEach((entry, idx) => {
      if (typeof entry === 'object' && entry !== null) {
        const item = normalizeJsonObject(entry as Record<string, unknown>, file, idx + 1, defaultService);
        items.push(item);
      }
    });
    return items;
  }

  // 2. If it's an architecture file with services & dependencies
  if (typeof parsed === 'object' && parsed !== null) {
    const obj = parsed as Record<string, unknown>;

    if (obj.services && (obj.dependencies || obj.edges)) {
      items.push({
        id: nextEvidenceId(),
        timestamp: new Date().toISOString(),
        source: file.filename,
        type: 'architecture',
        service: 'system',
        severity: 'info',
        message: `System architecture loaded with ${Array.isArray(obj.services) ? obj.services.length : 0} services`,
        metadata: obj,
        originalReference: {
          file: file.relativePath,
          line: 1
        }
      });
      return items;
    }

    // Single JSON record
    items.push(normalizeJsonObject(obj, file, 1, defaultService));
  }

  return items;
}

/**
 * Parses JSONL (JSON Lines) files
 */
function normalizeJsonlEvidence(file: RawEvidenceFile): EvidenceItem[] {
  const items: EvidenceItem[] = [];
  const lines = file.content.split('\n');
  const defaultService = deduceServiceFromFilename(file.filename);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    try {
      const parsed = JSON.parse(line);
      if (typeof parsed === 'object' && parsed !== null) {
        items.push(normalizeJsonObject(parsed, file, i + 1, defaultService));
      }
    } catch {
      // ignore or treat as plain line
    }
  }

  return items;
}

function normalizeJsonObject(
  obj: Record<string, unknown>,
  file: RawEvidenceFile,
  lineOrIndex: number,
  fallbackService: string
): EvidenceItem {
  const timestamp =
    typeof obj.timestamp === 'string'
      ? obj.timestamp
      : typeof obj.time === 'string'
        ? obj.time
        : new Date().toISOString();

  const service =
    typeof obj.service === 'string'
      ? obj.service
      : typeof obj.app === 'string'
        ? obj.app
        : fallbackService;

  const severity: EvidenceSeverity = extractSeverity(
    String(obj.level || obj.severity || obj.status || '')
  );

  const type: EvidenceType =
    (obj.type as EvidenceType) || deduceTypeFromFilename(file.filename);

  const message =
    typeof obj.message === 'string'
      ? obj.message
      : typeof obj.metric === 'string'
        ? `${obj.metric}: ${obj.value ?? ''} ${obj.unit ?? ''}`.trim()
        : typeof obj.description === 'string'
          ? obj.description
          : JSON.stringify(obj);

  const value = typeof obj.value === 'number' ? obj.value : undefined;
  const unit = typeof obj.unit === 'string' ? obj.unit : undefined;

  return {
    id: nextEvidenceId(),
    timestamp,
    source: file.filename,
    type,
    service,
    severity,
    message,
    value,
    unit,
    metadata: obj,
    originalReference: {
      file: file.relativePath,
      line: lineOrIndex
    }
  };
}

function extractTimestamp(line: string): { timestamp: string; messageWithoutTime: string } {
  // ISO 8601: 2026-09-21T14:05:00Z or 2026-09-21 14:05:00.123
  const isoRegex = /^\[?(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)\]?\s*(.*)$/;
  const matchIso = line.match(isoRegex);
  if (matchIso) {
    const rawTime = matchIso[1].replace(' ', 'T');
    return {
      timestamp: rawTime.endsWith('Z') || rawTime.includes('+') ? rawTime : `${rawTime}Z`,
      messageWithoutTime: matchIso[2]
    };
  }

  // Fallback: use current time if timestamp absent
  return {
    timestamp: new Date().toISOString(),
    messageWithoutTime: line
  };
}

function extractSeverity(text: string): EvidenceSeverity {
  const upper = text.toUpperCase();
  if (upper.includes('CRITICAL') || upper.includes('FATAL') || upper.includes('EMERG')) return 'critical';
  if (upper.includes('ERROR') || upper.includes('ERR') || upper.includes('FAIL')) return 'error';
  if (upper.includes('WARN') || upper.includes('WARNING')) return 'warn';
  return 'info';
}

function deduceServiceFromFilename(filename: string): string {
  const lower = filename.toLowerCase();
  if (lower.startsWith('app') || lower.includes('api')) return 'api-service';
  if (lower.includes('nginx') || lower.includes('ingress') || lower.includes('gateway')) return 'gateway';
  if (lower.includes('db') || lower.includes('postgres') || lower.includes('mysql') || lower.includes('database')) return 'postgres-db';
  if (lower.includes('redis') || lower.includes('cache')) return 'redis';
  if (lower.includes('k8s') || lower.includes('kube')) return 'kubernetes';
  return path.parse(filename).name;
}

function deduceTypeFromFilename(filename: string): EvidenceType {
  const lower = filename.toLowerCase();
  if (lower.includes('metric')) return 'metric';
  if (lower.includes('deploy')) return 'deployment';
  if (lower.includes('arch')) return 'architecture';
  if (lower.includes('k8s') || lower.includes('kube')) return 'kubernetes';
  if (lower.includes('db') || lower.includes('postgres')) return 'database';
  if (lower.includes('net') || lower.includes('dns')) return 'network';
  if (lower.includes('trace')) return 'trace';
  return 'log';
}
