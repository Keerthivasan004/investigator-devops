# AI Evidence-Driven Incident Investigator

## 1. Project Overview

**Project name:** AI Evidence-Driven Incident Investigator

**Primary goal:** Build an AI system that investigates DevOps incidents by selecting relevant evidence, generating competing hypotheses, testing those hypotheses, and producing an evidence-backed root-cause analysis (RCA).

This is intentionally **not** a generic chatbot and not initially a fully autonomous production remediation system.

The core research/problem focus is:

> **Can an AI agent intelligently reduce the amount of telemetry it must examine while maintaining or improving root-cause identification accuracy?**

A second research question is:

> **Can an AI distinguish correlation from causation when investigating distributed-system incidents?**

The system should not simply summarize logs. It should behave like an investigator.

---

# 2. Why This Problem Matters

Modern systems generate huge amounts of telemetry:

- Application logs
- Nginx/load-balancer logs
- Kubernetes events
- Container logs
- CPU/memory metrics
- Database metrics
- Deployment history
- Infrastructure events
- Network errors
- Distributed traces
- Service dependency information

During an incident, the difficult problem is often not finding data.

The difficult problem is deciding:

1. Which evidence matters?
2. Which evidence is noise?
3. What happened first?
4. Which symptoms are consequences?
5. Which possible causes should be investigated?
6. What evidence supports or contradicts each hypothesis?
7. When is there enough evidence to make an RCA?
8. What evidence could prove the current hypothesis wrong?

The project therefore focuses on **evidence selection + hypothesis-driven investigation + causal reasoning**.

---

# 3. Important Scope Decision

Do **not** begin by building:

- A production Kubernetes cluster
- Multiple cloud VMs
- Prometheus + Grafana + OpenTelemetry
- A large local LLM
- Autonomous production remediation
- A huge database
- A complex multi-agent system

The developer machine is resource constrained.

The initial system must run primarily using:

- Synthetic incident datasets
- JSON files
- Small logs
- Small metrics files
- Lightweight TypeScript services
- A configurable external/local LLM provider

The laptop does **not** need to simulate production.

Instead:

> The laptop is the investigation and evaluation environment.

Production-like infrastructure can be added later.

---

# 4. Core System Flow

```text
Incident Description
        +
Available Evidence
        |
        v
Understand Symptoms
        |
        v
Identify Possible Causes
        |
        v
Determine Required Evidence
        |
        v
Select Relevant Evidence
        |
        v
Generate Competing Hypotheses
        |
        v
Investigate Hypotheses
        |
        +----------------------+
        |                      |
        v                      v
Supporting Evidence     Contradicting Evidence
        |                      |
        +----------+-----------+
                   |
                   v
            Update Hypotheses
                   |
                   v
          Build Causal Chain
                   |
                   v
          Root Cause Decision
                   |
                   v
        Evidence-Backed RCA
                   |
                   v
       Safe Recommended Action
```

---

# 5. Example Incident

User reports:

> "Our website is slow and occasionally returns HTTP 500 errors."

Available evidence:

```text
application.log
nginx.log
database.log
metrics.json
deployment-history.json
architecture.json
```

The system should not immediately say:

> "CPU is high, therefore CPU is the root cause."

Instead it should investigate.

Example reasoning:

```text
Deployment v2.3
       |
       v
Query behavior changed
       |
       v
Database query latency increased
       |
       v
Database connection pool reaches 100%
       |
       v
API requests wait for DB connections
       |
       v
API latency increases
       |
       v
HTTP 500 responses
```

Meanwhile:

```text
CPU = 92%
```

may be a **symptom** rather than the root cause.

The system must distinguish:

```text
Root Cause
     ↓
Contributing Cause
     ↓
System Effect
     ↓
User-Visible Symptom
```

---

# 6. MVP Objective

The first working version should accept:

```text
Incident description
+
A directory containing evidence files
```

Example:

```text
POST /investigate

incident:
"Website is slow and returning intermittent 500 errors"

evidence:
./incidents/incident-001/
```

The system returns structured investigation output:

```json
{
  "incident_summary": "...",
  "timeline": [],
  "hypotheses": [],
  "selected_evidence": [],
  "supporting_evidence": [],
  "contradicting_evidence": [],
  "causal_chain": [],
  "root_cause": "...",
  "confidence": 0.0,
  "recommended_actions": []
}
```

---

# 7. MVP Must NOT Do

The first version must NOT:

- Modify production systems
- Execute Kubernetes destructive commands
- Restart production services
- Delete resources
- Change infrastructure
- Automatically deploy code
- Automatically rollback deployments
- Automatically modify databases
- Claim certainty without evidence
- Hide contradictory evidence
- Pretend missing evidence exists

The initial system is:

> **Read-only investigation + evidence-backed recommendation.**

---

# 8. Project Architecture

Recommended initial architecture:

```text
ai-devops-investigator/
│
├── apps/
│   ├── web/
│   │   ├── src/
│   │   └── package.json
│   │
│   └── api/
│       ├── src/
│       └── package.json
│
├── packages/
│   ├── evidence/
│   ├── incident-engine/
│   ├── hypothesis/
│   ├── service-graph/
│   ├── llm/
│   ├── evaluation/
│   └── shared/
│
├── incidents/
│   ├── database/
│   ├── deployment/
│   ├── infrastructure/
│   ├── kubernetes/
│   ├── network/
│   └── mixed/
│
├── evaluation/
│   ├── datasets/
│   ├── benchmarks/
│   └── reports/
│
├── docs/
│   ├── architecture/
│   ├── research/
│   └── incidents/
│
├── scripts/
│
├── AGENTS.md
├── README.md
└── package.json
```

Do not create every directory immediately.

Create only what the current phase needs.

---

# 9. Recommended Technology Stack

## Frontend

```text
React
TypeScript
Vite
```

The frontend is secondary during the research phase.

Do not spend excessive time on UI.

---

## Backend

```text
Node.js
TypeScript
Fastify or Express
```

Choose one and remain consistent.

---

## Data

Initial version:

```text
JSON
JSONL
TXT
LOG
```

Do not introduce PostgreSQL unless it becomes necessary.

---

## AI Provider

Create a provider abstraction.

Example:

```text
LLM Provider
    |
    +-- OpenAI
    |
    +-- Gemini
    |
    +-- Ollama
    |
    +-- Other compatible provider
```

The investigation engine must not depend directly on one provider.

Example interface:

```typescript
interface LLMProvider {
  generate(request: LLMRequest): Promise<LLMResponse>;
}
```

This allows the user to switch providers without rewriting the investigation engine.

---

# 10. Resource-Constrained Development Rules

The developer machine has limited RAM and CPU.

Therefore:

### Do

- Use small datasets
- Use small logs
- Use lightweight Node services
- Use external APIs when appropriate
- Use Ollama only with models that are practical for the machine
- Run one major service at a time when possible
- Keep Docker usage limited
- Prefer JSON files during MVP
- Keep datasets in small files
- Build incrementally

### Do not

- Download multi-GB models unnecessarily
- Run Kubernetes locally during MVP
- Run many Docker containers simultaneously
- Build a large vector database
- Fine-tune an LLM initially
- Build a large distributed test environment

---

# 11. Incident Dataset

Each incident should contain known ground truth.

Example:

```text
incidents/
└── incident-001/
    ├── incident.json
    ├── application.log
    ├── database.log
    ├── nginx.log
    ├── metrics.json
    ├── deployment.json
    ├── architecture.json
    └── ground-truth.json
```

The AI must NOT receive:

```text
ground-truth.json
```

The evaluator uses it afterward.

---

# 12. Incident Metadata

Example:

```json
{
  "id": "incident-001",
  "title": "Intermittent API 500 errors",
  "description": "Website is slow and occasionally returns HTTP 500 errors.",
  "start_time": "2026-09-21T14:00:00Z",
  "end_time": "2026-09-21T14:20:00Z"
}
```

---

# 13. Ground Truth

Example:

```json
{
  "root_cause": "database_connection_pool_exhaustion",
  "contributing_factors": [
    "inefficient_database_query"
  ],
  "symptoms": [
    "api_latency_increase",
    "http_500_errors",
    "high_cpu"
  ]
}
```

Ground truth is for evaluation only.

Never expose it to the investigator.

---

# 14. Evidence Normalization

Different sources should eventually be converted into a common evidence format.

Example:

```json
{
  "id": "evidence-001",
  "timestamp": "2026-09-21T14:05:00Z",
  "source": "kubernetes",
  "type": "event",
  "service": "orders-api",
  "severity": "critical",
  "message": "Container OOMKilled",
  "metadata": {
    "pod": "orders-api-7f89d",
    "namespace": "production"
  }
}
```

Another example:

```json
{
  "id": "evidence-002",
  "timestamp": "2026-09-21T14:04:32Z",
  "source": "database",
  "type": "metric",
  "service": "postgres",
  "metric": "connection_pool_usage",
  "value": 100,
  "unit": "percent"
}
```

The normalization layer should preserve original evidence references.

---

# 15. Evidence Types

Initial evidence types:

```text
log
metric
event
deployment
configuration
architecture
trace
network
database
kubernetes
```

Each evidence item should contain:

```text
id
timestamp
source
type
service
severity
message/value
metadata
original_reference
```

---

# 16. Evidence Selection

This is one of the most important research components.

The AI should NOT always receive every evidence item.

Instead:

```text
All Evidence
     |
     v
Evidence Ranking
     |
     v
Relevant Evidence
     |
     v
Investigation
```

The system should eventually answer:

> "Which evidence should I inspect next?"

For example:

```text
1000 evidence items available

AI selects:
35 items

Relevant evidence:
15 items

Relevant evidence found:
14 / 15
```

This can become a measurable research result.

---

# 17. Hypothesis Generation

The system should generate multiple possible causes.

Example:

```json
{
  "hypotheses": [
    {
      "id": "H1",
      "cause": "Database connection pool exhaustion",
      "status": "investigating"
    },
    {
      "id": "H2",
      "cause": "Bad application deployment",
      "status": "investigating"
    },
    {
      "id": "H3",
      "cause": "Network instability",
      "status": "investigating"
    }
  ]
}
```

Do not allow the first hypothesis to automatically become the answer.

---

# 18. Hypothesis Investigation

For every hypothesis, collect:

```text
Supporting evidence
Contradicting evidence
Missing evidence
Confidence
Status
```

Example:

```json
{
  "hypothesis": "H1",
  "status": "strongly_supported",
  "supporting_evidence": [
    "DB connection pool reached 100%",
    "DB latency increased",
    "API requests waited for DB connections"
  ],
  "contradicting_evidence": [],
  "missing_evidence": [],
  "confidence": 0.91
}
```

Another hypothesis may have:

```json
{
  "hypothesis": "H2",
  "status": "partially_supported",
  "supporting_evidence": [
    "Deployment occurred before incident"
  ],
  "contradicting_evidence": [
    "Database connection exhaustion began before application errors"
  ],
  "confidence": 0.42
}
```

---

# 19. Missing Evidence

A major feature is the ability to recognize missing evidence.

Example:

```text
Current hypothesis:
Database connection pool exhaustion

Evidence available:
- API logs
- DB metrics

Missing:
- connection pool configuration
- deployment timeline
- slow query information
```

The system should respond:

```text
Additional evidence required:

1. Database connection pool metrics
2. Deployment history
3. Slow query logs
```

If a tool exists, the agent should request the tool.

If the evidence does not exist, it must say:

```text
Evidence unavailable.
```

Never fabricate it.

---

# 20. Contradiction Detection

The investigator should actively search for evidence that disproves its current hypothesis.

Example:

```text
Hypothesis:
Database is unavailable.

Supporting:
API connection failures.

Contradicting:
Successful DB queries at the same timestamp.

Conclusion:
Hypothesis downgraded.
```

The system should explicitly ask:

> "What evidence would prove this hypothesis wrong?"

This is an important anti-hallucination mechanism.

---

# 21. Timeline Construction

The system should construct a chronological timeline.

Example:

```text
14:00:00  Deployment v2.3 begins
14:01:10  Query latency increases
14:02:30  DB connection pool reaches 80%
14:03:10  DB connection pool reaches 100%
14:03:25  API latency increases
14:03:40  HTTP 500 errors begin
14:04:00  CPU reaches 92%
```

This allows temporal reasoning.

Important rule:

> Temporal precedence does not automatically prove causation.

The investigator must combine timing with other evidence.

---

# 22. Causal Chain

Final RCA should contain a causal chain.

Example:

```text
Deployment v2.3
      ↓
Query behavior changed
      ↓
Database query latency increased
      ↓
Connection pool exhausted
      ↓
API requests blocked
      ↓
API latency increased
      ↓
HTTP 500 responses
```

The system should distinguish:

```text
Root cause
Contributing factor
Intermediate effect
Symptom
```

---

# 23. Final Investigation Output

Recommended structure:

```json
{
  "incident_summary": "...",

  "timeline": [],

  "hypotheses": [],

  "root_cause": {
    "description": "...",
    "confidence": 0.0
  },

  "causal_chain": [],

  "supporting_evidence": [],

  "contradicting_evidence": [],

  "missing_evidence": [],

  "alternative_explanations": [],

  "recommended_actions": [],

  "investigation_statistics": {
    "total_evidence_available": 0,
    "evidence_inspected": 0,
    "evidence_reduction_ratio": 0
  }
}
```

---

# 24. Confidence

Confidence must not be arbitrary.

The system should explain why confidence is high or low.

Example:

```text
Confidence: 0.87

Reason:
- 4 independent evidence items support the hypothesis
- 0 contradictory evidence items found
- Timeline is consistent
- Deployment correlation exists
- DB metrics directly confirm connection exhaustion
```

If evidence is incomplete:

```text
Confidence: 0.54

Reason:
- Strong correlation with deployment
- DB connection metrics unavailable
- Multiple alternative causes remain possible
```

---

# 25. Safe Recommendations

The system may recommend actions.

Example:

```text
Recommended:

1. Inspect query introduced in deployment v2.3.
2. Compare query execution plans.
3. Review DB connection pool configuration.
4. Consider rollback only after human verification.
```

The system should NOT execute them in MVP.

---

# 26. Incident Categories

Initial dataset should contain approximately 10 incidents.

Recommended categories:

```text
1. Database connection pool exhaustion
2. Slow database query
3. Memory exhaustion / OOM
4. CPU saturation
5. DNS failure
6. Bad deployment
7. Invalid environment variable
8. Disk full
9. Redis unavailable
10. Network timeout
```

After the first 10 work correctly:

```text
50 incidents
```

Then:

```text
100+ incidents
```

---

# 27. Tricky Incidents

The dataset must not contain only obvious incidents.

Create incidents where:

```text
Symptom != Root Cause
```

Example:

```text
CPU = 95%
```

but the real cause is:

```text
Database query regression
```

Another:

```text
HTTP 500 errors
```

but the real cause is:

```text
DNS failure
```

Another:

```text
Pod restarted
```

but the real cause is:

```text
Memory leak introduced by deployment
```

The goal is to test reasoning, not keyword matching.

---

# 28. Evaluation Framework

The system must be evaluated against known ground truth.

Important metrics:

### Root Cause Accuracy

```text
correct root causes / total incidents
```

### Top-K Accuracy

Measure whether the correct root cause appears in:

```text
Top 1
Top 3
Top 5
```

### Evidence Quality

Measure whether selected evidence actually supports the RCA.

### Evidence Recall

```text
Relevant evidence selected
/
Total relevant evidence
```

### Evidence Reduction Ratio

```text
1 - (evidence inspected / evidence available)
```

### False Positive Rate

How often irrelevant evidence is incorrectly treated as causal evidence.

### Investigation Efficiency

Measure:

```text
number of evidence items inspected
number of model calls
investigation duration
```

### Confidence Calibration

Compare:

```text
AI confidence
vs
actual correctness
```

---

# 29. Core Research Experiment

Run at least these experiments.

## Experiment A — Full Evidence

Give the AI all evidence.

```text
All telemetry
    ↓
LLM
    ↓
RCA
```

Measure accuracy.

---

## Experiment B — AI Evidence Selection

```text
All telemetry
    ↓
Evidence selector
    ↓
Relevant subset
    ↓
LLM investigation
    ↓
RCA
```

Measure:

- Accuracy
- Evidence inspected
- Investigation time

---

## Experiment C — Evidence Selection + Service Graph

```text
Telemetry
    +
Service graph
    ↓
Evidence selector
    ↓
Hypothesis investigation
    ↓
RCA
```

Compare results.

---

## Experiment D — Historical Incidents

Provide previous incident knowledge.

Measure whether historical incidents improve:

```text
root-cause accuracy
investigation speed
evidence selection
```

---

# 30. Research Hypothesis

Primary hypothesis:

> An AI investigator that selectively retrieves relevant evidence can reduce the amount of telemetry examined while maintaining or improving root-cause identification accuracy.

Secondary hypothesis:

> Explicit competing hypotheses and contradiction checking improve RCA reliability compared with direct LLM summarization.

These hypotheses should be tested experimentally rather than assumed to be true.

---

# 31. Service Graph

Later, introduce:

```text
Frontend
   |
API
   |
Orders Service
   |
Database

Orders Service
   |
Redis

API
   |
Authentication Service
```

Example:

```json
{
  "services": [
    "frontend",
    "api",
    "orders",
    "postgres",
    "redis"
  ],
  "dependencies": [
    {
      "from": "api",
      "to": "orders"
    },
    {
      "from": "orders",
      "to": "postgres"
    },
    {
      "from": "orders",
      "to": "redis"
    }
  ]
}
```

The service graph can help prioritize evidence.

If:

```text
orders → postgres
```

and the incident involves:

```text
orders latency
```

database evidence becomes more relevant.

---

# 32. Future Evidence Tools

The architecture should eventually support tools such as:

```text
get_logs()
get_metrics()
get_kubernetes_events()
get_deployments()
get_service_dependencies()
get_database_status()
get_network_events()
get_configuration()
```

The agent can decide:

```text
I need database metrics.
```

Then:

```text
get_metrics("postgres")
```

returns evidence.

This creates a true investigation agent.

---

# 33. Future Real Infrastructure

Only after the static incident laboratory works:

```text
Static incidents
      ↓
Docker incident environment
      ↓
Real logs/metrics
      ↓
Prometheus
      ↓
OpenTelemetry
      ↓
Kubernetes
```

Do not start with Kubernetes.

---

# 34. Incident Replay Engine

Create an incident replay mechanism.

Example:

```text
incident-001
    ↓
Replay timeline
    ↓
Generate telemetry
    ↓
Investigator
```

This allows repeatable experiments.

A replay should always produce the same ground truth unless randomness is intentionally introduced.

---

# 35. Multi-Agent Architecture — Future

Do not implement initially.

Possible future architecture:

```text
                 Root Cause Coordinator
                          |
       +------------------+------------------+
       |         |         |        |         |
       v         v         v        v         v
     Logs     Metrics     K8s      DB      Network
 Investigator Investigator Investigator Investigator Investigator
```

Each specialist produces evidence.

The coordinator compares results.

Potential specialists:

```text
Log Investigator
Metrics Investigator
Kubernetes Investigator
Database Investigator
Network Investigator
Deployment Investigator
```

---

# 36. Self-Verification — Future

The final investigator should ask:

```text
What evidence could prove my RCA wrong?
```

Then investigate it.

Example:

```text
Current RCA:
Database connection pool exhaustion

Challenge:
Could the same symptoms be explained by network failure?

Investigation:
Check network errors.

Result:
No network errors found.

Conclusion:
Alternative explanation weakened.
```

This should reduce premature conclusions.

---

# 37. Production Safety Model — Future

When production integrations are eventually introduced:

```text
AI detects incident
       ↓
AI investigates
       ↓
AI proposes action
       ↓
Human approval
       ↓
Controlled execution
       ↓
Verification
       ↓
Rollback if necessary
```

Required controls:

```text
Human approval
Dry run
Permissions
Audit logs
Action limits
Rollback
Verification
```

Never allow unrestricted autonomous production actions.

---

# 38. Development Phases

## Phase 1 — Incident Laboratory

Build:

```text
Incident loader
Evidence parser
Evidence normalization
Basic LLM provider
Structured investigation output
10 synthetic incidents
Ground-truth evaluator
```

Success criteria:

```text
System can investigate 10 incidents.
System produces structured RCA.
System can compare RCA against ground truth.
```

---

## Phase 2 — Evidence Selection

Add:

```text
Evidence ranking
Relevant evidence selection
Evidence reduction metrics
```

Success criteria:

```text
System examines less evidence
while preserving RCA accuracy.
```

---

## Phase 3 — Hypothesis Engine

Add:

```text
Multiple hypotheses
Supporting evidence
Contradicting evidence
Missing evidence
Hypothesis scoring
```

---

## Phase 4 — Timeline + Causal Graph

Add:

```text
Timeline
Causal chain
Root cause
Contributing factors
Symptoms
```

---

## Phase 5 — Service Graph

Add:

```text
Architecture graph
Dependency-aware evidence selection
```

---

## Phase 6 — Tool-Based Investigation

Add:

```text
get_logs()
get_metrics()
get_deployments()
get_kubernetes_events()
```

The agent chooses which tool to call.

---

## Phase 7 — Incident Replay

Build:

```text
Incident replay engine
```

---

## Phase 8 — Real Observability

Only after the previous phases work:

```text
Prometheus
OpenTelemetry
Grafana
Docker
```

---

## Phase 9 — Kubernetes

Only if hardware/resources allow.

---

## Phase 10 — Controlled Remediation

Human-approved actions only.

---

# 39. Antigravity + OpenCode Development Strategy

Do not ask Antigravity/OpenCode:

> "Build the entire project."

Use small milestones.

Example:

### Task 1

```text
Create the initial TypeScript monorepo structure.
Do not implement the AI investigation engine yet.
Add linting, formatting, and basic tests.
```

### Task 2

```text
Implement the incident loader.

Requirements:
- Load incident metadata.
- Load evidence files.
- Never load ground-truth.json into investigator context.
- Add unit tests.
```

### Task 3

```text
Implement evidence normalization.

Requirements:
- Normalize logs.
- Normalize metrics.
- Preserve source references.
- Add tests.
```

### Task 4

```text
Implement LLM provider abstraction.

Requirements:
- Provider interface.
- Mock provider.
- Ollama provider.
- No provider-specific logic inside investigation engine.
- Tests.
```

### Task 5

```text
Implement hypothesis generation.

Requirements:
- Structured JSON output.
- Multiple competing hypotheses.
- Validation.
- Tests.
```

Continue one component at a time.

---

# 40. AGENTS.md Rules

Create an `AGENTS.md` at the repository root.

It should contain rules such as:

```text
# AI DevOps Investigator Development Rules

1. Never modify production infrastructure.
2. Never use real secrets in test data.
3. Never expose ground-truth incident files to the investigator.
4. Every major feature must have tests.
5. Prefer small changes.
6. Do not introduce unnecessary dependencies.
7. Do not add PostgreSQL unless required by the current phase.
8. Do not introduce Kubernetes before the static incident laboratory is complete.
9. Do not execute destructive Kubernetes commands.
10. Preserve evidence references.
11. Never claim a root cause without supporting evidence.
12. Always represent contradictory evidence.
13. Never fabricate missing evidence.
14. Use structured JSON schemas for LLM outputs.
15. Keep LLM provider logic behind an abstraction.
16. Keep evaluation separate from investigation.
17. Do not modify the ground truth during inference.
18. Document important architectural decisions.
19. Add regression tests for discovered bugs.
20. Keep the project runnable on a low-resource development machine.
```

---

# 41. Suggested Initial Prompt for OpenCode

Use this only for the first milestone:

```text
You are working on the AI Evidence-Driven Incident Investigator.

Read AGENTS.md and README.md before making changes.

Goal:
Create the initial TypeScript project structure for the static incident laboratory.

Requirements:
- Create a clean monorepo structure.
- Create apps/api.
- Create packages/evidence.
- Create packages/incident-engine.
- Create packages/hypothesis.
- Create packages/llm.
- Create packages/evaluation.
- Create incidents/.
- Create evaluation/.
- Add TypeScript configuration.
- Add basic linting and formatting.
- Add a minimal test setup.
- Do not implement the full AI investigator yet.
- Do not install unnecessary dependencies.
- Do not add PostgreSQL.
- Do not add Kubernetes.
- Do not add Docker.
- Keep the project lightweight.

After implementation:
1. Run the tests.
2. Run type checking.
3. Report exactly what changed.
4. Report any assumptions.
5. Do not modify unrelated files.
```

---

# 42. Suggested Second Prompt

```text
Implement the incident dataset loader.

Requirements:

1. Load incident metadata.
2. Load supported evidence files.
3. Normalize the evidence into the internal evidence model.
4. Explicitly exclude ground-truth.json from investigator input.
5. Preserve the original evidence filename and location.
6. Validate malformed evidence.
7. Add unit tests.
8. Add one small sample incident.
9. Keep all files small.
10. Do not implement LLM reasoning yet.

Run:
- tests
- typecheck
- lint

Do not modify unrelated files.
```

---

# 43. Suggested Third Prompt

```text
Implement the LLM provider abstraction.

Requirements:

1. Create a provider interface.
2. Create a mock provider for tests.
3. Create an Ollama-compatible provider.
4. Keep provider-specific code isolated.
5. Return structured responses.
6. Add timeout handling.
7. Add error handling.
8. Do not hardcode API keys.
9. Use environment variables for configuration.
10. Add unit tests using the mock provider.

Do not implement the investigation engine yet.
```

---

# 44. Definition of Done

A feature is not complete merely because code exists.

A feature is complete when:

```text
Implementation
    +
Tests
    +
Type checking
    +
Linting
    +
Documentation
```

and the existing project still works.

---

# 45. First Milestone

The first milestone should be:

```text
Incident description
        ↓
Load incident
        ↓
Load evidence
        ↓
Normalize evidence
        ↓
LLM provider
        ↓
Generate hypotheses
        ↓
Investigate evidence
        ↓
Produce structured RCA
        ↓
Compare against ground truth
```

No Kubernetes.

No production.

No autonomous remediation.

No fine-tuning.

---

# 46. Fine-Tuning Strategy

Do NOT fine-tune initially.

First establish a baseline.

Compare:

```text
Prompt-only baseline
        ↓
Structured output
        ↓
Evidence selection
        ↓
Hypothesis reasoning
        ↓
Historical incidents
```

Only consider fine-tuning after identifying a repeatable failure mode.

Example:

```text
Model repeatedly selects irrelevant CPU evidence
while missing database evidence.
```

Then investigate whether:

```text
better prompts
better evidence ranking
better schemas
better retrieval
```

solve the issue.

If not, fine-tuning can be considered later.

---

# 47. What Makes This Project Different

The project is not simply:

```text
Logs → LLM → Summary
```

The intended architecture is:

```text
Incident
   ↓
Evidence selection
   ↓
Hypothesis generation
   ↓
Evidence gathering
   ↓
Contradiction checking
   ↓
Temporal reasoning
   ↓
Causal reasoning
   ↓
Root cause
   ↓
Evidence-backed explanation
```

The research contribution should come from the **investigation process**, not merely the chat interface.

---

# 48. Success Criteria

The project should eventually demonstrate measurable results such as:

```text
1. AI can identify root causes from synthetic incidents.
2. AI can distinguish symptoms from root causes.
3. AI can generate competing hypotheses.
4. AI can identify missing evidence.
5. AI can use contradictory evidence.
6. AI can construct a causal chain.
7. AI can reduce telemetry inspected.
8. Reduced evidence does not significantly reduce RCA accuracy.
9. Results are reproducible using the incident replay engine.
10. Evaluation is based on known ground truth.
```

Do not invent performance numbers before experiments are run.

---

# 49. Final Project Vision

The long-term system should behave like:

```text
User:
"Our API is slow and returning 500 errors."

AI:
"I found 1,842 evidence items."

"Rather than inspect everything, I identified three
possible causes."

"Next I need database latency, deployment history,
and network error evidence."

        ↓

AI investigates

        ↓

"Database connection exhaustion is strongly supported."

"Deployment v2.3 introduced a query regression."

"High CPU is a downstream symptom."

"I found no evidence supporting network failure."

        ↓

AI:

Root Cause:
Query regression introduced in deployment v2.3.

Causal Chain:
Deployment
→ Query latency
→ DB connection exhaustion
→ API blocking
→ HTTP 500

Confidence:
High, based on 14 relevant evidence items.

Recommended:
Review the query execution plan and compare
against v2.2. Human approval required for rollback.
```

That is the target behavior.

---

# 50. Immediate Next Steps

Start in this exact order:

```text
1. Create repository.
2. Create AGENTS.md.
3. Create README.md.
4. Create minimal TypeScript monorepo.
5. Create incident loader.
6. Create evidence model.
7. Create 3 sample incidents.
8. Create ground truth.
9. Create mock LLM provider.
10. Create first investigation pipeline.
11. Create evaluator.
12. Run baseline experiment.
13. Expand to 10 incidents.
14. Implement evidence selection.
15. Compare results.
```

Do not jump directly to Kubernetes or production infrastructure.

The first goal is to prove:

> **Can the system investigate a known incident and produce an evidence-backed root cause that can be objectively evaluated?**

Once that works, the project can grow into a much more sophisticated AI/SRE investigation platform.
