# Troubleshooting & Edge Cases Memory

This document records known platform-specific traps, execution edge cases, and their proven solutions to prevent future regressions.

---

## 1. Node.js ES Modules & `__dirname`
- **Issue**: In ES Modules (`"type": "module"` in `package.json`), `__dirname` and `__filename` are not defined globally.
- **Solution**: Always import `fileURLToPath` from `node:url` and resolve:
  ```typescript
  import { fileURLToPath } from 'node:url';
  import * as path from 'node:path';

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  ```

---

## 2. Windows PowerShell Sequential Command Syntax
- **Issue**: In Windows PowerShell, running `command1 && command2` can throw:
  `The token '&&' is not a valid statement separator in this version.`
- **Solution**: Use semicolon `;` in PowerShell:
  ```powershell
  pnpm build ; pnpm test
  ```

---

## 3. CSS Grid Blowout from Unbroken Log Strings
- **Issue**: In crash dumps, single environment strings (like `PATH=C:\...`) contain thousands of continuous characters with no spaces. Standard CSS Grid items expand to `min-content` (3,000+ pixels wide), causing a massive horizontal scrollbar.
- **Solution**:
  1. Define grid columns with `minmax(0, 1fr)` instead of `1fr`.
  2. Add `min-width: 0;` to all grid item children.
  3. Apply `word-break: break-word; overflow-wrap: anywhere;` to all text containers.
  4. Use `table-layout: fixed;` with explicit percentage/pixel widths on table headers.

---

## 4. Benchmark Fallback for External Directories
- **Issue**: When `investigator eval` is run in an external project repository that has no `incidents/` directory, the benchmark runner cannot find `ground-truth.json`.
- **Solution**: In `handleBenchmark()`, if `./incidents` does not exist in `cwd`, fall back to `getIncidentsBaseDir()` which resolves to the packaged benchmark incidents in the CLI distribution.

---

## 5. Global Link Synchronization
- **Issue**: After editing TypeScript source files in `apps/cli/src`, running the global `investigator` command runs outdated code if not rebuilt.
- **Solution**: Always run `pnpm --filter @investigator/cli build` and `npm link apps/cli` to update the global symlink.

---

## 6. Nested Scroll Containers Trapping Page Scroll
- **Issue**: Dashboard sections with `max-height` + `overflow-y: auto` (timeline list, evidence table) trapped the mouse wheel: once the inner section reached its end, the page itself would not continue scrolling up or down.
- **Cause**: `overscroll-behavior: contain` on the inner containers explicitly blocks scroll chaining to the parent page.
- **Solution**: Use `overscroll-behavior: auto` (the default) on inner scroll areas so scroll chains to the page at the container limits. Keep `contain` only where trapping is intentionally wanted (e.g. modal dialogs).
