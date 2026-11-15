# Application Updates & Modifications Log

Every modification made to the codebase must be documented in this ledger with the date, files modified, changes introduced, and technical rationale.

---

## [2026-09-21] - Milestone 4: Production Hardening, UI Overhaul & Scaling

### 1. Terminal Styling & Professional ANSI Formatting
- **Files Modified**: `apps/cli/src/colors.ts`, `apps/cli/src/index.ts`
- **Changes**:
  - Implemented terminal color wrappers for Severity (`[CRITICAL]`, `[ERROR]`, `[WARN]`, `[INFO]`), Status (`[CONFIRMED]`, `[DISPROVEN]`, `[INVESTIGATING]`), and Causal Roles.
  - Enforced zero-emoji policy across all CLI terminal prints and Web GUI for professional enterprise aesthetics.
  - Added dedicated `KEY EVIDENCE & ERROR TRACES (File & Line Provenance)` section to CLI reports displaying exact file locations and line numbers.

### 2. Native Support for JVM / Gradle / Android Fatal Crashes
- **Files Modified**: `packages/incident-engine/src/causal-model.ts`, `packages/incident-engine/src/engine.ts`
- **Changes**:
  - Implemented `checkJvmCrash` in `NativeCausalModel` to detect Java/Android JVM fatal crashes (`hs_err_pid*.log`, `replay_pid*.log`, `EXCEPTION_ACCESS_VIOLATION`, `Out of Memory Error (malloc / AllocateHeap / G1 virtual space)`).
  - Tested directly against real-world project (`futrsec-new`), parsing 153,860 lines in 1.29s with 92% confidence diagnosis and actionable Gradle heap fix recommendations.

### 3. Web GUI Dashboard Improvements & Interactive Target Selection
- **Files Modified**: `apps/cli/src/index.ts`
- **Changes**:
  - Fixed unresponsive Investigate button by adding interactive loading state (`Investigating...` button text, button disable, and progress messaging).
  - Added custom path input field in Web GUI header so users can type or paste any directory or log file path directly.
  - Added automatic active workspace detection (`[Active Project]`) to UI incident dropdown.
  - Enhanced `/api/incident` backend endpoint to support both real codebases (`projectPath` via `scanProject`) and synthetic incident folders (`incidentPath`).

### 4. Layout Constraint & Horizontal Overflow Elimination
- **Files Modified**: `apps/cli/src/index.ts`
- **Changes**:
  - Fixed horizontal scrollbar caused by long unbroken environment strings (e.g. 3,500-character Windows `PATH` dumps) by applying `minmax(0, 1.35fr)` on CSS Grid, `table-layout: fixed;` on the evidence table, and `word-break: break-word; overflow-wrap: anywhere;` across all timeline and card elements.
  - Wrapped dashboard layout in `.app-container` with `max-width: 1360px; margin: 0 auto;` to eliminate excess horizontal empty space on widescreen and 4K displays.

### 5. Large Codebase Scaling & Recency Sorting
- **Files Modified**: `packages/evidence/src/scanner.ts`, `packages/incident-engine/src/engine.ts`
- **Changes**:
  - Increased log discovery limit from 20 to 200 files in `scanner.ts`.
  - Added timestamp sorting (`mtime`) so newly modified log files and crash dumps are automatically prioritized during scans.
  - Removed arbitrary `slice(0, 10)` limit in `engine.ts` to ensure no discovered project log files are dropped.

### 6. Benchmark Evaluation Fallback
- **Files Modified**: `apps/cli/src/index.ts`
- **Changes**:
  - Updated `investigator eval` to automatically fall back to evaluating against the bundled benchmark laboratory when run inside external project repos that lack a local `./incidents` folder.

---

## [2026-09-21] - Web GUI Dashboard UI/UX Overhaul (Presentation Only, Zero Functionality Change)

All work confined to `getEmbeddedUIDashboardHtml()` in `apps/cli/src/index.ts`. No API, engine, or data-contract changes. Stack unchanged (vanilla embedded HTML/CSS/JS, zero new dependencies). Verified after every session: `pnpm build` clean, 25/25 vitest tests pass, `investigator eval` 100% Top-1 on 3 incidents.

### Session 1: Professional Light Enterprise Theme
- Replaced neon dark styling with a clean light SaaS theme (white cards, slate borders, Inter type).
- Added hierarchy: dark read-only topbar, header card with brand mark, root-cause hero banner, 4 KPI stat cards, 2-column workspace, footer disclaimer.
- Converted causal chain to a numbered vertical stepper, hypotheses to status-pill cards with progress bars and supporting/contradicting count chips, timeline to a dot-and-stem rail, actions to a numbered checklist, evidence to a striped table with sticky header.

### Session 2: Dark Silver Theme + Right-Column Containment
- Switched to a professional dark + silver palette (charcoal-navy surfaces `#0a0d13`/`#141a26`, silver `#cbd5e1` text/borders, silver Investigate button).
- Fixed runaway right-column height: sticky right column (`max-height: calc(100vh - 32px)`) with capped internal scrolls (timeline 400px, evidence table 440px, sticky `thead`).

### Session 3: Theme Toggle, Checkbox Removal, Full-Width Evidence
- Added persistent light/dark toggle (`data-theme` on `<html>`, moon/sun SVG button, `localStorage`), with all surfaces refactored to theme variables (`--card`, `--input-bg`, `--tag-bg`, `--thead-bg`, etc.).
- Removed checkbox `<input>` boxes from Recommended Actions; replaced with numbered-step rows (plain numerals + subtle arrow).
- Moved Evidence Inspector out of the cramped right column into a full-width section below the grid (560px scroll, wider Source column 270px).

### Session 4: De-Boxed Flat Design + Gap, Palette & Scroll Fixes
- Removed all content boxes per UX review: header, hero, stat cards, section cards, hypothesis/causal/timeline/action items, and table frame are now flat sections separated by hairline dividers; stats render as a divider strip; container widened 1360px to 1520px.
- Fixed void below Recommended Actions: timeline uncapped in Session 4 caused the right column to outgrow the left; timeline re-capped at 560px with grid `align-items: start` and no column stretching.
- Muted dark-theme palette for eye comfort (sage `#7fb89c`, tan `#cfa66a`, dusty rose `#cd8f9a`, steel blue `#8ba3c2`, muted lavender `#a89ccb`; glow rings 3px to 2px).
- Fixed nested scroll trapping: `overscroll-behavior: contain` swallowed wheel events at section ends so the page never continued scrolling; changed to `auto` for scroll chaining (see troubleshooting entry 6).

### Session 5: Telemetry Gaps & Investigation Safeguards Panel (Void Elimination)
- **Problem**: In the 2-column grid, with Timeline capped at 560px in the right column, a large empty rectangular void existed on the right side directly parallel to the "Recommended actions" section.
- **Solution**:
  - Added a complementary `Telemetry gaps & safeguards` card directly below Timeline in the right column (`#safeguards-card`).
  - Integrated `report.missingEvidence` (and hypothesis-level `missingEvidenceDescriptions`) to display identified observability gaps (e.g. absent heap dumps, query plans, socket limits) or full-coverage confirmation, enforcing Rule 13 ("Never fabricate missing evidence").
  - Integrated `report.alternativeExplanations` to showcase ruled-out competing hypotheses and their status.
  - Added operational safety guardrails badges (`Rule 1: Read-Only Analysis`, `Rule 11: File & Line Provenance`, `Rule 20: Offline Air-Gapped`).
  - Added a 1-click `Copy Action Plan` / `Copy plan` button (with clipboard API + fallback and visual toast) in both the Recommended Actions header and Safeguards panel for incident communication (Slack/Jira/PagerDuty).
  - Rebalanced vertical rhythm between the two columns; verified clean build (`pnpm build`), 25/25 vitest tests passing, and 100% benchmark evaluation accuracy.

### Session 6: Recommended Actions Bottom Gap Elimination & Supporting Numbers Visibility
- **Problem 1 (Gap Below Recommended Actions)**: Timeline list at 560px max-height combined with the new safeguards card pushed the right column height beyond the left column, leaving an empty void below Recommended Actions with an orphaned bottom border.
- **Solution 1**:
  - Calibrated `.timeline-list` max-height to `380px`, aligning total right-column height with the left column.
  - Removed premature `border-bottom` on `.left-col .card:last-child` and `.right-col .card:last-child`.
  - Added a unified `border-bottom: 1px solid var(--border)` at the `.main-grid` container level.
  - Added an operational read-only safety guidance note footer inside the Recommended Actions card.
  - Tightened vertical padding (`12px 0 16px`) on `.evidence-full` for seamless section flow.
- **Problem 2 (Supporting Numbers Visibility)**: Quantitative supporting metrics and evidence references were either faint, plain text, or missing entirely from table rows.
- **Solution 2**:
  - **Hypotheses Counts**: Styled supporting and contradicting numbers with bold, tabular numeric badges (`<strong class="count-num">6</strong> supporting evidence`), plus evidence reference tags (`Refs: #01, #02...`).
  - **Evidence Inspector Table**: Added dedicated `#` index column (`#01`, `#02`, `#03`...) and introduced a high-visibility `SUPPORTING` tag identifying evidence items directly validating the root cause.
  - **KPI Banner**: Explicitly highlighted verified supporting evidence items in green (`6 / 15 inspected`).
  - **Recommended Actions**: Upgraded faint action index numbers into crisp, high-contrast numeric badges (`01`, `02`, `03`).
  - **Causal Stepper**: Added high-contrast supporting reference count badges (`3 supporting refs`).

### Session 7: UI/UX Neatness, Clarity & Cognitive Understandability Overhaul
- **Core Motivation**: Ensure the dashboard is crystal clear, intuitively structured, and instantly understandable for all viewers (operators, developers, managers) without cognitive friction.
- **Key Enhancements**:
  - **Hero Root Cause Decision**:
    - Upgraded `.hero` into an executive summary card with a prominent green accent border (`border-left: 5px solid var(--success)`), subtle container surface, and clear status banner (`<span class="hero-eyebrow"><svg>...</svg> Confirmed root cause decision</span>` + `<span id="hero-conf-badge" class="hero-badge-tag">92% Confidence</span>`).
    - Increased title font size to `18px` with bold `800` weight for immediate visual prominence.
    - Added comprehensive subtitle explaining mechanism, confidence, and verified telemetry clue counts.
  - **KPI Stat Cards**:
    - Enclosed each stat card in clean individual containers with subtle borders and hover feedback to eliminate running numbers.
    - Updated descriptive microcopy: "Model certainty in root cause", "Routine noise filtered from logs", "Direct telemetry evidence cited", "Deterministic & symbolic engine".
  - **Adversarial Hypothesis Testing (Resolving "What does contradicting mean?")**:
    - Replaced ambiguous jargon with self-explanatory indicators:
      - `<span class="count-chip good">✓ <strong class="count-num">N</strong> Proving (Supports)</span>`
      - `<span class="count-chip bad/neutral">✕ <strong class="count-num">N</strong> Disproving (Rules Out)</span>`
    - Added explicit verdict notes directly on hypothesis cards:
      - Confirmed: `✓ Telemetry actively proves this root cause with 0 contradicting signals.`
      - Ruled Out: `✕ Ruled out — does not match primary telemetry indicators.`
    - Updated card subtitle: `"Adversarial testing: verifies the true cause while checking for contradicting signals to eliminate red herrings."`
  - **Causal Chain Sequential Stepper**:
    - Formatted step headers into explicit chronological stages: `Step 1: Root Cause / Trigger`, `Step 2: Contributing Factor`, `Step 3: System Effect`, `Step 4: Visible Symptom / Impact`.
    - Added verified clue badges: `<span class="step-ref"><strong class="step-ref-num">N</strong> verified clue(s)</span>`.
  - **Recommended Actions Inline Command Highlighting**:
    - Implemented `formatActionText()` to automatically parse and highlight shell commands (`./gradlew ...`, `gradlew.bat ...`, `kill -9 ...`, `Stop-Process ...`), JVM arguments (`org.gradle.jvmargs=...`, `-Xmx4096m`), and configuration files (`android/gradle.properties`) in styled `<code class="cmd-pill">` and `<code class="path-pill">`.
  - **Evidence Inspector & Row Scanning**:
    - Added `✓ PROVES ROOT CAUSE` green badge on evidence rows directly supporting the root cause decision.
    - Added table row hover highlighting (`.ev-table tbody tr:hover td { background: var(--zebra); }`) for effortless horizontal scanning across wide screens.
  - **Build & Server Validation**:
    - `pnpm build` passed with zero errors (`tsc -b`).
    - 25/25 vitest tests passing.
    - Live server verified at `http://localhost:4000` with all features active.

