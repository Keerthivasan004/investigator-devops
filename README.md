# DevOps Incident Investigator

[![npm version](https://img.shields.io/npm/v/ai-devops-investigator?color=blue)](https://www.npmjs.com/package/ai-devops-investigator)
[![npm downloads](https://img.shields.io/npm/dm/ai-devops-investigator)](https://www.npmjs.com/package/ai-devops-investigator)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

> **Created and Architected by Keerthivasan.R.V**

An evidence-driven, hypothesis-testing diagnostic engine designed to investigate distributed systems, cloud-native deployments, and developer environments. Rather than blindly dumping massive log files into an LLM, the investigator isolates high-signal telemetry, evaluates competing causal hypotheses, actively checks for contradicting evidence, and produces an evidence-backed Root Cause Analysis (RCA) with exact file and line number provenance.

---

## What is This & How to Explain It to Your Team

### The 30-Second Elevator Pitch
> *"When production systems crash, builds fail, or daemons terminate abruptly, engineers typically spend 30 to 60 minutes drowning in thousands of lines of logs, stack traces, and alerts. Most AI tools simply copy-paste entire log dumps into an LLM, which hallucinates or only reports the obvious symptom (like a 500 error).*
>
> *The **DevOps Incident Investigator** solves this. It ingests raw telemetry, prunes 85%+ of informational noise, traces the causal path from root cause to visible symptom, and delivers an instant Executive Diagnosis: **Where is the error? What is the error? What caused it? and How to fix it?**—with every claim verified by file and line number proof."*

---

### The 3 Core Problems It Solves

| Problem Faced by SRE / DevOps | How the Investigator Solves It |
| :--- | :--- |
| **Telemetry Overload:** Sifting through 100,000+ lines of debug/info logs. | **Intelligent Signal Pruning:** Isolates state-changes, JVM crash dumps, and error signatures in under 3 seconds, filtering out 85%+ of routine noise. |
| **Confusing Symptoms with Root Causes:** Treating a database timeout or a 500 status code as the issue when the real cause was a cascading retry storm or thread pool starvation. | **Causal Propagation Chain:** Constructs a 4-tier directed causal flow: `Root Cause` &rarr; `Contributing Factor` &rarr; `System Effect` &rarr; `Visible Symptom`. |
| **AI Hallucinations:** Generic or unverified advice that lacks source proof. | **Deterministic Evidence Provenance:** Every claim links directly to the exact source file and line (e.g. `hs_err_pid17456.log:L21`). It actively seeks *contradicting* evidence before confirming any hypothesis. |

---

### How It Works (The 4-Step Pipeline)

1. **Telemetry Ingestion & Sanitization:** Automatically scans the target folder for logs (`.log`, `.json`, stack traces, HotSpot crash dumps, metrics). It strips secrets, passwords, and authorization tokens.
2. **Causal Graph Traversal:** Analyzes events against deterministic causal rules (JVM memory/thread starvation, connection pool exhaustion, DNS blackholes, deadlocks).
3. **Adversarial Hypothesis Testing:** Formulates competing explanations ($H_1, H_2, H_3$). It only confirms $H_1$ if supporting evidence exists **and** competing alternatives are disproven.
4. **Remediation & Runbook Synthesis:** Outlines actionable, non-destructive commands that an engineer can copy and run to remediate the incident.

---

### Safety & Security Highlights

* **100% Read-Only:** Never modifies infrastructure, runs destructive shell commands, or alters code.
* **100% Offline by Default:** Uses a built-in native causal engine. Zero telemetry or source code is sent to external cloud APIs or third parties.
* **Ultra Lightweight:** The whole package is only **173 kB** and runs on any standard laptop without requiring Kubernetes, PostgreSQL, or GPU clusters.

---

## Author & Attribution

- **Creator & Lead Architect:** **Keerthivasan.R.V**
- **Methodology:** Designed and engineered through human systems architecture.
- **License:** MIT (Copyright © 2026 Keerthivasan.R.V)
- **Repository:** [https://github.com/Keerthivasan004/investigator-devops](https://github.com/Keerthivasan004/investigator-devops)
- **NPM Package:** [https://www.npmjs.com/package/ai-devops-investigator](https://www.npmjs.com/package/ai-devops-investigator)

---

## Quick Start & Installation

### Option 1: Run Instantly via `npx` (No Installation Needed)

You can run the investigator directly from any terminal without cloning or installing:

```bash
# Launch the interactive Web GUI dashboard on http://localhost:4000
npx ai-devops-investigator ui

# Diagnose the current directory or project
npx ai-devops-investigator check .

# Inspect a specific folder
npx ai-devops-investigator check /path/to/project

# Scan project tech stacks and discovered log sources
npx ai-devops-investigator scan .
```

---

### Option 2: Install Globally via `npm`

```bash
npm install -g ai-devops-investigator

# The 'investigator' command is now available globally:
investigator ui
investigator check .
investigator eval
```

---

### Option 3: Install from Source (For Developers & Contributors)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Keerthivasan004/investigator-devops.git
   cd investigator-devops
   ```

2. **Install dependencies and compile**:
   ```bash
   pnpm install
   pnpm build
   ```

3. **Link the CLI globally**:
   ```bash
   npm link
   ```

---

## Web GUI Console Features (`investigator ui`)

Start the interactive console:
```bash
investigator ui
```
Open **`http://localhost:4000`** in your browser to access:

* **Executive Diagnosis Card:** At-a-glance view of *Where is the error?*, *What is the error?*, *What caused it?*, and *How to fix it?* with a one-click button to copy the recommended remediation.
* **01. Chronological Event Timeline:** Significant state-change events in sequential order with noise filtered out.
* **02. Causal Propagation Chain:** Numbered failure cascade from root cause to visible symptom.
* **03. Candidate Explanations:** Competing hypotheses evaluated against evidence with contradiction tracking.
* **04. Recommended Actions:** Non-destructive operator inspection and remediation runbook.
* **05. Telemetry Gaps & Safeguards:** Active tracking of missing telemetry and observability blind spots.
* **06. Evidence Records:** Live search, severity filters, and raw log dumps with file and line provenance.

---

## CLI Commands Reference

| Command | Description | Example |
| :--- | :--- | :--- |
| `investigator ui` | Launch the local Web GUI dashboard | `investigator ui --port 4000` |
| `investigator check <path>` | Scan project, collect telemetry, and diagnose root cause | `investigator check .` |
| `investigator check <path> --logs <dir>` | Inspect project with external log directory | `investigator check . --logs /var/log/app` |
| `investigator scan <path>` | Scan tech stacks, manifests, and discovered logs (alias: `status`) | `investigator scan .` |
| `investigator run <incident-dir>` | Run investigation on an incident folder | `investigator run incidents/incident-001` |
| `investigator evidence <path>` | Extract, sanitize, and normalize telemetry | `investigator evidence incidents/incident-001` |
| `investigator eval` | Benchmark against 10 ground-truth outage scenarios | `investigator eval` |
| `investigator report` | Compile publication-grade benchmark report | `investigator report` |

---

## Benchmark Laboratory Results

Tested against the built-in 10-incident laboratory outage benchmark (`investigator eval`):

* **Total Incidents Evaluated:** 10
* **Root Cause Accuracy (Top 1):** 100%
* **Root Cause Accuracy (Top 3):** 100%
* **Average Evidence Recall:** 100%
* **Average Telemetry Reduction Ratio:** 13.1% (86.9% noise pruned)
* **Average Duration per Investigation:** < 500ms

---

## Monorepo Architecture

```text
├── bin/                   # Global CLI entrypoint wrapper
├── apps/
│   └── cli/               # Global native CLI ('investigator') & local Web GUI
├── packages/
│   ├── evidence/          # Project scanner, secret sanitizer, telemetry normalizer
│   ├── llm/               # LLM provider abstraction (Offline, Ollama, Gemini, OpenAI)
│   ├── hypothesis/        # Competing hypotheses generator & contradiction engine
│   ├── incident-engine/   # Master orchestrator, timeline builder, and causal model
│   └── evaluation/        # Objective benchmark evaluator against ground truth
├── incidents/             # 10 ground-truth outage laboratory benchmark datasets
├── AGENTS.md              # Mandatory developer & AI assistant rules
├── LICENSE                # MIT License (Copyright Keerthivasan.R.V)
└── README.md
```
