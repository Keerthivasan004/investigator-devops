# Mandatory Guidelines for AI Agents

All AI assistants and automated coding agents operating in this repository must strictly adhere to the following rules:

---

## 1. Professional Style & Formatting
- **Zero Emojis**: Never output emojis in terminal logs, CLI banners, reports, or the Web GUI dashboard. Use standard bracketed tags instead (e.g. `[CRITICAL]`, `[ERROR]`, `[CONFIRMED]`, `[DISPROVEN]`).
- **Author Attribution**: All CLI banners, generated reports, and Web GUI headers must permanently maintain the author attribution:
  `Created by: Keerthivasan.R.V with AI` or `Architected & Developed by Keerthivasan.R.V with AI`.

---

## 2. Safety & Operational Guardrails
- **Read-Only Operations (Rule 1)**: Never modify production infrastructure or execute destructive system commands. All operations are non-destructive and read-only.
- **Sanitize Secrets (Rule 2)**: Never log, store, or output real credentials, passwords, JWTs, or API keys. Always run raw telemetry through `sanitizeTelemetry`.
- **Strict Isolation of Ground Truth (Rule 3 & Rule 17)**: Under no circumstances may `ground-truth.json` ever be loaded into the investigator engine's context during analysis. It is strictly reserved for post-investigation evaluation.
- **Strict Evidence Provenance (Rule 10 & Rule 11)**: Never claim a root cause without supporting evidence. Every conclusion must trace directly back to an immutable `{ file, line }` reference.
- **Scientific Falsification (Rule 12)**: Explicitly test for, represent, and record contradictory evidence to disprove false hypotheses.

---

## 3. Engineering & Performance Standards
- **Low Resource Footprint (Rule 20)**: Keep the engine runnable on low-resource developer machines (<100MB RAM, <2s execution time). Avoid heavy in-memory allocations.
- **Automated Tests Mandatory (Rule 4 & Rule 19)**: Every parser, rule, or reasoning enhancement must be accompanied by unit or integration tests. Run `pnpm test` to verify before finishing turns.
- **Document All Changes**: Whenever code is updated, write a clear markdown entry into `.agents/memory/changelog_and_updates.md`.
