# AI DevOps Investigator - Agent Memory & Skills Hub

Welcome to the **`.agents/`** context hub for the **AI Evidence-Driven Incident Investigator**.

This directory is designed specifically for **AI pair-programmers, autonomous coding agents, and human developers** to maintain persistent project memory, documented skills, and architectural decisions across sessions.

---

## Directory Structure

```
.agents/
├── README.md                             # This file - Overview and AI onboarding guide
├── skills/
│   └── incident-investigator/
│       └── SKILL.md                     # Reusable execution workflows, CLI commands, and runbooks
├── memory/
│   ├── architecture_and_decisions.md    # Core architecture: Native symbolic causal engine, LLM abstraction, DAG synthesis
│   ├── changelog_and_updates.md         # Chronological log of every modification, feature addition, and bugfix
│   └── troubleshooting_and_edge_cases.md# Solutions to common runtime traps, ESM handling, Windows issues, CSS overflow
└── rules/
    └── investigator_guidelines.md       # Mandatory guidelines: 0 emojis, strict author attribution, test coverage
```

---

## AI Agent Instructions: How to Update Memory

Whenever you (or any AI agent) make a modification to this repository:
1. **Log the Update**: Add an entry to [changelog_and_updates.md](file:///e:/AI_unsolved/.agents/memory/changelog_and_updates.md) under the latest date with the exact files modified and the rationale.
2. **Record Architectural Shifts**: If adding new causal rules, parsers, or telemetry extractors, update [architecture_and_decisions.md](file:///e:/AI_unsolved/.agents/memory/architecture_and_decisions.md).
3. **Record Bugs & Fixes**: If encountering an edge case (e.g. platform-specific error, parsing anomaly), document it in [troubleshooting_and_edge_cases.md](file:///e:/AI_unsolved/.agents/memory/troubleshooting_and_edge_cases.md).
4. **Preserve Rules**: Never violate the project rules in [investigator_guidelines.md](file:///e:/AI_unsolved/.agents/rules/investigator_guidelines.md) (Strict attribution to **Keerthivasan.R.V with AI**, zero emojis, zero hallucinations).
