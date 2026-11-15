import { describe, it, expect } from 'vitest';
import * as path from 'node:path';
import { scanProject } from '../src/scanner.js';

describe('Project Scanner', () => {
  const rootDir = path.resolve(__dirname, '../../../');

  it('should scan the current workspace and detect TypeScript and pnpm', () => {
    const result = scanProject(rootDir, { includeGit: false });

    expect(result.projectPath).toBe(rootDir);
    expect(result.techStacks.length).toBeGreaterThan(0);

    const tsStack = result.techStacks.find((s) => s.language === 'typescript');
    expect(tsStack).toBeDefined();
    expect(tsStack?.packageManager).toBe('pnpm');
    expect(tsStack?.manifestFiles).toContain('package.json');
    expect(tsStack?.manifestFiles).toContain('pnpm-lock.yaml');
  });

  it('should discover log and configuration files', () => {
    const result = scanProject(rootDir, { includeGit: false });

    expect(Array.isArray(result.logFiles)).toBe(true);
    expect(Array.isArray(result.configFiles)).toBe(true);
    // tsconfig.base.json should be discovered
    expect(result.configFiles.some((f) => f.includes('tsconfig'))).toBe(true);
  });
});
