---
name: incident-investigator
description: >-
  Workflows, operations, and runbooks for running, testing, extending, and debugging
  the AI Evidence-Driven Incident Investigator (CLI, Web GUI, Causal Engine, and Benchmark Laboratory).
---

# Incident Investigator Skill & Runbook

This skill provides step-by-step procedures for interacting with, testing, and developing the **AI Evidence-Driven Incident Investigator**.

---

## 1. Project Commands Cheatsheet

### Build & Test Commands
```bash
# Build all packages in pnpm workspace
pnpm build

# Run all 25 vitest tests across workspace
pnpm test

# Run build and test sequentially in PowerShell
pnpm build ; pnpm test

# Link the CLI globally to run `investigator` anywhere
npm link apps/cli
```

### CLI Investigation Commands
```bash
# Project scan (discovers tech stack, git commits, manifests, and log files)
investigator scan .
investigator scan C:\path\to\project

# Automated full-project investigation (crawls logs, correlates git changes, generates causal report)
investigator check .
investigator check C:\path\to\project

# Direct incident or log file investigation
investigator run incidents/incident-001
investigator run C:\logs\production-crash.log

# Stream telemetry live via standard input (Docker, Kubernetes, systemd)
docker logs my-container --tail 200 | investigator run --stdin
kubectl logs deployment/api --tail 500 | investigator run --stdin

# Deep evidence normalization & line inspection
investigator evidence incidents/incident-001/kubernetes.log
investigator evidence hs_err_pid10996.log

# Benchmark evaluation (grades Top-1 accuracy and recall against ground-truth)
investigator eval
investigator eval incidents

# Launch local Web GUI Dashboard (defaults to port 4000)
investigator ui
investigator ui --port 5000
```

---

## 2. Core Operational Workflows

### Workflow A: Adding a New Causal Rule to the Engine
When adding a new causal fault pattern (e.g. Disk Space Saturation, Kafka Lag, TLS Certificate Expiration):
1. **Extend `check...` in `packages/incident-engine/src/causal-model.ts`**:
   - Write a dedicated detection method (e.g. `checkDiskExhaustion(evidence: EvidenceItem[])`).
   - Extract relevant telemetry lines, define confidence, and write actionable rationale.
2. **Add Contradiction Detection (Rule 12)**:
   - Identify which competing hypotheses are falsified by this evidence and update their status to `disproven`.
3. **Construct Causal Chain Nodes**:
   - Synthesize `root_cause -> contributing_factor -> system_effect -> user_visible_symptom`.
4. **Add Unit Test in `packages/incident-engine/tests/causal-model.test.ts`**:
   - Verify detection triggers on matching telemetry and returns expected confidence.

### Workflow B: Adding a Benchmark Incident
1. Create a directory: `incidents/incident-00X/`.
2. Add raw sanitized telemetry files: `app.log`, `metrics.json`, `kubernetes.log`.
3. Add `incident.json` for metadata.
4. Add `ground-truth.json` containing the expected root cause, category, and critical evidence patterns.
5. Run `investigator eval incidents/incident-00X` to verify 100% Top-1 match.

---

## 3. Web GUI Server Guidelines (`http://localhost:4000`)
- Backend runs an embedded Node.js HTTP server in `apps/cli/src/index.ts`.
- Serves endpoints:
  - `GET /api/incidents`: Discovers local workspace and packaged benchmark incidents.
  - `GET /api/incident?id=...` or `?path=...`: Executes investigation on synthetic incidents or real codebases.
  - `GET /`: Serves embedded single-page dashboard HTML with DAG visualization.
- **Layout Constraints**:
  - Always wrap dashboard contents in `.app-container` with max-width to prevent widescreen distortion.
  - Always apply `minmax(0, ...)` on CSS Grid tracks and `word-break: break-word` to prevent 3,000+ character log lines (e.g. Windows PATH dumps) from creating horizontal scrollbars.
