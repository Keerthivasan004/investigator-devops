import * as fs from 'node:fs';
import * as path from 'node:path';
import type { IncidentMetadata, LoadedIncident, RawEvidenceFile } from './types.js';
import { sanitizeTelemetry } from './sanitizer.js';

export const FORBIDDEN_INVESTIGATOR_FILES = new Set(['ground-truth.json', 'ground_truth.json']);

/**
 * Loads an incident directory for investigation.
 * 
 * CRITICAL ENFORCEMENT (Rule 3 & Rule 17):
 * Under no circumstances is `ground-truth.json` ever loaded into the investigator's evidence context.
 * It is solely flagged as present for post-investigation evaluation.
 */
export function loadIncident(incidentDirPath: string): LoadedIncident {
  const resolvedPath = path.resolve(incidentDirPath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Incident path not found: ${resolvedPath}`);
  }

  const stat = fs.statSync(resolvedPath);

  // If the user passed a single file directly (e.g., C:\logs\app.log)
  if (stat.isFile()) {
    const rawContent = fs.readFileSync(resolvedPath, 'utf8');
    const content = sanitizeTelemetry(rawContent);
    const filename = path.basename(resolvedPath);

    return {
      metadata: {
        id: filename,
        title: `Telemetry from ${filename}`,
        description: `Investigation of telemetry file ${filename}`
      },
      evidenceFiles: [
        {
          filename,
          relativePath: filename,
          content
        }
      ],
      hasGroundTruth: false
    };
  }

  // Otherwise, handle as a directory
  const resolvedDir = resolvedPath;
  const incidentMetaPath = path.join(resolvedDir, 'incident.json');
  let metadata: IncidentMetadata;

  if (fs.existsSync(incidentMetaPath)) {
    try {
      const raw = fs.readFileSync(incidentMetaPath, 'utf8');
      metadata = JSON.parse(raw);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to parse incident.json: ${errorMsg}`);
    }
  } else {
    // Fallback if directory does not have incident.json
    metadata = {
      id: path.basename(resolvedDir),
      title: `Incident in ${path.basename(resolvedDir)}`,
      description: 'Incident detected from telemetry directory'
    };
  }

  // 2. Discover and load all telemetry files (excluding ground truth)
  const evidenceFiles: RawEvidenceFile[] = [];
  let hasGroundTruth = false;

  const entries = fs.readdirSync(resolvedDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) continue;

    const lowerName = entry.name.toLowerCase();

    // Guardrail: Exclude ground truth completely
    if (FORBIDDEN_INVESTIGATOR_FILES.has(lowerName)) {
      hasGroundTruth = true;
      continue;
    }

    // Don't include the incident description itself as a raw evidence file
    if (lowerName === 'incident.json') {
      continue;
    }

    // Supported evidence file types
    if (
      lowerName.endsWith('.log') ||
      lowerName.endsWith('.json') ||
      lowerName.endsWith('.jsonl') ||
      lowerName.endsWith('.txt') ||
      lowerName.endsWith('.csv')
    ) {
      const filePath = path.join(resolvedDir, entry.name);
      try {
        const rawContent = fs.readFileSync(filePath, 'utf8');
        // Sanitize telemetry (passwords, tokens) before providing to investigator
        const content = sanitizeTelemetry(rawContent);

        evidenceFiles.push({
          filename: entry.name,
          relativePath: entry.name,
          content
        });
      } catch (err) {
        console.warn(`[IncidentLoader] Warning: Could not read evidence file ${entry.name}:`, err);
      }
    }
  }

  return {
    metadata,
    evidenceFiles,
    hasGroundTruth
  };
}
