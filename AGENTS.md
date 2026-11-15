# AI DevOps Investigator Development Rules

1. **Never modify production infrastructure.** All operations must be read-only and confined to the local investigation environment.
2. **Never use real secrets in test data.** Use synthetic tokens and sanitized logs only.
3. **Never expose ground-truth incident files to the investigator.** `ground-truth.json` is strictly for post-investigation evaluation.
4. **Every major feature must have tests.** Untested reasoning or parsing logic is not considered done.
5. **Prefer small changes.** Develop incrementally, one milestone and package at a time.
6. **Do not introduce unnecessary dependencies.** Keep the footprint lightweight.
7. **Do not add PostgreSQL unless required by the current phase.** Use JSON, JSONL, LOG, and TXT files for the Static Incident Laboratory.
8. **Do not introduce Kubernetes before the static incident laboratory is complete.**
9. **Do not execute destructive Kubernetes commands.**
10. **Preserve evidence references.** Every normalized evidence item must retain links to its source file and location.
11. **Never claim a root cause without supporting evidence.** Every conclusion must trace directly back to verified evidence items.
12. **Always represent contradictory evidence.** Explicitly search for and record evidence that contradicts current hypotheses.
13. **Never fabricate missing evidence.** If required telemetry is absent, mark it as missing rather than assuming values.
14. **Use structured JSON schemas for LLM outputs.** Guarantee deterministic parsing and schema adherence.
15. **Keep LLM provider logic behind an abstraction.** The investigation engine must never depend directly on a single vendor SDK.
16. **Keep evaluation separate from investigation.** Evaluation metrics (Top-K, recall, reduction ratio) run independently after investigation completes.
17. **Do not modify the ground truth during inference.**
18. **Document important architectural decisions.** Maintain clear records of causal reasoning designs and evaluation metrics.
19. **Add regression tests for discovered bugs.**
20. **Keep the project runnable on a low-resource development machine.** Avoid heavy memory or CPU consumption.
