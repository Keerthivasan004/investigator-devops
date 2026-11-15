# AI Evidence-Driven Incident Investigator

> **Created and Architected by Keerthivasan.R.V**

An AI system that investigates DevOps and distributed systems incidents by intelligently selecting relevant telemetry, pruning 90%+ of noise, generating competing hypotheses, actively seeking contradictory evidence, and synthesizing an evidence-backed root-cause analysis (RCA).

---

## Author & Attribution

- **Creator & Lead Architect:** **Keerthivasan.R.V**
- **Methodology:** Designed and engineered through human systems architecture.
- **License:** MIT (Copyright © 2026 Keerthivasan.R.V)

---

## Core Research Questions

1. **Telemetry Reduction:** *Can an AI agent intelligently reduce the amount of telemetry it must examine while maintaining or improving root-cause identification accuracy?*
2. **Causal Reasoning:** *Can an AI distinguish correlation from causation (symptoms vs. root causes) when investigating distributed-system incidents?*

---

## Key Architectural Principles

- **Static Incident Laboratory:** Operates on lightweight synthetic datasets (JSON, LOG, TXT) without requiring heavy local Kubernetes or observability clusters during development.
- **Strict Ground-Truth Isolation:** Ground truth data (`ground-truth.json`) is never provided to the investigator agent and is exclusively consumed by the evaluation framework post-investigation.
- **Adversarial & Hypothesis-Driven:** Rather than summarizing logs, the system creates competing hypotheses, searches for disproving evidence, and detects missing information.
- **Read-Only & Safe:** The system produces RCAs and recommendations for human review, never executing destructive changes autonomously.

---

## Installation & Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Package Manager**: `pnpm` (recommended) or `npm`

---

### Option 1: Install Globally via npm (Recommended for End Users)

Once published or distributed, users can install globally with a single command:

```bash
npm install -g ai-devops-investigator
```

Or run directly without installation via `npx`:

```bash
npx ai-devops-investigator ui
npx ai-devops-investigator check /path/to/project
```

---

### Option 2: Install from Source (For Developers & SRE Teams)

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
   # This makes the 'investigator' command available globally in any terminal:
   npm link
   ```

4. **Verify the installation**:
   ```bash
   investigator --version
   investigator help
   ```

---

## How to Use the Investigator

Once installed, you can run `investigator` from **any directory** on your machine:

### 1. Diagnose Any Project or Repository
Navigate to any project directory and run:
```bash
# Inspect the current project directory:
investigator check .

# Inspect a specific project folder:
investigator check C:\projects\my-app

# Inspect a project with external logs:
investigator check C:\projects\my-app --logs /var/log/app
```

### 2. Launch the Local Web GUI Dashboard
Start the interactive, sequential SRE investigation console:
```bash
investigator ui
```
Open **`http://localhost:4000`** in your browser. You can select benchmark targets, paste any local folder path, and inspect:
- Confirmed Root Cause Verdict with diagnostic certainty
- **01. Chronological Event Timeline**
- **02. Causal Propagation Chain**
- **03. Hypotheses Evaluated & Contradictions**
- **04. Recommended Actions & Remediation Plan**
- **05. Telemetry Gaps & Safeguards**
- **06. Evidence Inspector & Provenance Tracking**

### 3. Scan Tech Stack & Telemetry
Quick discovery of services, dependencies, log files, and stack traces:
```bash
investigator scan .
```

### 4. Run Benchmark Laboratory Evaluation
Evaluate against 10 real-world DevOps failure benchmarks:
```bash
# Run benchmark tests:
investigator eval

# Generate scientific publication report:
investigator report
```

### 5. Optional LLM Integration (100% Offline by Default)
The investigator runs completely offline with deterministic symbolic reasoning. To connect to an LLM provider:
```bash
# Google Gemini
export LLM_PROVIDER=gemini
export GEMINI_API_KEY="your-api-key"

# OpenAI
export LLM_PROVIDER=openai
export OPENAI_API_KEY="your-api-key"

# Local Ollama (Air-Gapped)
export LLM_PROVIDER=ollama
export OLLAMA_BASE_URL="http://localhost:11434"
```

---

## Monorepo Architecture

```text
├── packages/
│   ├── evidence/          # Target project scanner, secret sanitizer, evidence normalization
│   ├── llm/               # LLM provider abstraction (Mock, Ollama, Gemini, OpenAI)
│   ├── hypothesis/        # Competing hypotheses generator & contradiction engine
│   ├── incident-engine/   # Master orchestrator, timeline builder, and causal chain
│   └── evaluation/        # Objective benchmark evaluator against ground truth
├── apps/
│   └── cli/               # Global native CLI ('investigator') & local Web GUI
├── incidents/             # Benchmark incident datasets
├── AGENTS.md              # Mandatory developer & AI assistant rules
├── LICENSE                # MIT License (Copyright Keerthivasan.R.V)
└── README.md
```
