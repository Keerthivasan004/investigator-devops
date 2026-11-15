import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import type {
  ProjectScanResult,
  DetectedTechStack,
  GitChangeSummary,
  GitCommitInfo
} from './types.js';

const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'target',
  '.next',
  '.nuxt',
  'venv',
  '.venv',
  '__pycache__',
  'coverage',
  '.turbo'
]);

export interface ScanOptions {
  includeGit?: boolean;
  maxLogFiles?: number;
}

/**
 * Scans any target project directory to recognize its tech stack, services,
 * configuration files, log sources, and recent git changes.
 */
export function scanProject(projectPath: string, options: ScanOptions = {}): ProjectScanResult {
  const resolvedPath = path.resolve(projectPath);

  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Project directory does not exist: ${resolvedPath}`);
  }

  const techStacks: DetectedTechStack[] = [];
  const logFiles: string[] = [];
  const configFiles: string[] = [];
  const dockerFiles: string[] = [];
  const suggestedServices: Set<string> = new Set();
  let projectName: string | undefined;

  // 1. Check Node.js / TypeScript
  const pkgJsonPath = path.join(resolvedPath, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    try {
      const raw = fs.readFileSync(pkgJsonPath, 'utf8');
      const pkg = JSON.parse(raw);
      projectName = pkg.name || path.basename(resolvedPath);

      const manifests = ['package.json'];
      let pm: 'pnpm' | 'npm' | 'yarn' = 'npm';
      if (fs.existsSync(path.join(resolvedPath, 'pnpm-lock.yaml'))) {
        pm = 'pnpm';
        manifests.push('pnpm-lock.yaml');
      } else if (fs.existsSync(path.join(resolvedPath, 'yarn.lock'))) {
        pm = 'yarn';
        manifests.push('yarn.lock');
      } else if (fs.existsSync(path.join(resolvedPath, 'package-lock.json'))) {
        manifests.push('package-lock.json');
      }

      const frameworks: string[] = [];
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (allDeps['express']) frameworks.push('express');
      if (allDeps['fastify']) frameworks.push('fastify');
      if (allDeps['react']) frameworks.push('react');
      if (allDeps['next']) frameworks.push('next.js');
      if (allDeps['@nestjs/core']) frameworks.push('nestjs');
      if (allDeps['vue']) frameworks.push('vue');

      const isTs = fs.existsSync(path.join(resolvedPath, 'tsconfig.json')) || !!allDeps['typescript'];

      techStacks.push({
        language: isTs ? 'typescript' : 'nodejs',
        packageManager: pm,
        frameworks,
        manifestFiles: manifests
      });

      suggestedServices.add(projectName || 'node-service');
    } catch {
      // malformed package.json
    }
  }

  // 2. Check Python
  const pyprojectPath = path.join(resolvedPath, 'pyproject.toml');
  const reqsPath = path.join(resolvedPath, 'requirements.txt');
  if (fs.existsSync(pyprojectPath) || fs.existsSync(reqsPath)) {
    const manifests: string[] = [];
    if (fs.existsSync(pyprojectPath)) manifests.push('pyproject.toml');
    if (fs.existsSync(reqsPath)) manifests.push('requirements.txt');

    techStacks.push({
      language: 'python',
      packageManager: fs.existsSync(pyprojectPath) ? 'poetry' : 'pip',
      manifestFiles: manifests
    });
    suggestedServices.add(projectName || path.basename(resolvedPath));
  }

  // 3. Check Go
  const goModPath = path.join(resolvedPath, 'go.mod');
  if (fs.existsSync(goModPath)) {
    techStacks.push({
      language: 'golang',
      packageManager: 'go',
      manifestFiles: ['go.mod']
    });
    suggestedServices.add(projectName || path.basename(resolvedPath));
  }

  // 4. Check Java / Kotlin
  const pomPath = path.join(resolvedPath, 'pom.xml');
  const gradlePath = path.join(resolvedPath, 'build.gradle');
  if (fs.existsSync(pomPath) || fs.existsSync(gradlePath)) {
    techStacks.push({
      language: 'java',
      packageManager: fs.existsSync(pomPath) ? 'maven' : 'gradle',
      manifestFiles: fs.existsSync(pomPath) ? ['pom.xml'] : ['build.gradle']
    });
    suggestedServices.add(projectName || path.basename(resolvedPath));
  }

  // 5. Check Docker
  const dockerfilePath = path.join(resolvedPath, 'Dockerfile');
  const composePath = path.join(resolvedPath, 'docker-compose.yml');
  const composeYamlPath = path.join(resolvedPath, 'compose.yaml');
  if (fs.existsSync(dockerfilePath)) dockerFiles.push('Dockerfile');
  if (fs.existsSync(composePath)) dockerFiles.push('docker-compose.yml');
  if (fs.existsSync(composeYamlPath)) dockerFiles.push('compose.yaml');

  if (dockerFiles.length > 0) {
    techStacks.push({
      language: 'docker',
      manifestFiles: dockerFiles
    });
  }

  // 6. Discover Log & Config files (recursive, bounded by options or default 200)
  const maxLogs = options.maxLogFiles ?? 200;
  const discoveredLogsWithMtime: { relPath: string; mtime: number }[] = [];
  findFilesRecursive(resolvedPath, resolvedPath, discoveredLogsWithMtime, configFiles, maxLogs);

  // Sort discovered log files so the most recently updated logs are prioritized
  discoveredLogsWithMtime.sort((a, b) => b.mtime - a.mtime);
  for (const logItem of discoveredLogsWithMtime) {
    logFiles.push(logItem.relPath);
  }

  // 7. Check Git History (if git repository)
  let gitChanges: GitChangeSummary | undefined;
  if (options.includeGit !== false && fs.existsSync(path.join(resolvedPath, '.git'))) {
    gitChanges = scanGitChanges(resolvedPath);
  }

  return {
    projectPath: resolvedPath,
    name: projectName || path.basename(resolvedPath),
    techStacks,
    logFiles,
    configFiles,
    dockerFiles,
    gitChanges,
    suggestedServices: Array.from(suggestedServices)
  };
}

function findFilesRecursive(
  currentDir: string,
  rootDir: string,
  logFiles: { relPath: string; mtime: number }[],
  configFiles: string[],
  maxLogs: number,
  depth: number = 0,
  maxDepth: number = 4
) {
  if (depth > maxDepth || logFiles.length >= maxLogs) return;

  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(currentDir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
        findFilesRecursive(path.join(currentDir, entry.name), rootDir, logFiles, configFiles, maxLogs, depth + 1, maxDepth);
      }
    } else if (entry.isFile()) {
      const fullPath = path.join(currentDir, entry.name);
      const relPath = path.relative(rootDir, fullPath);
      const lower = entry.name.toLowerCase();

      // Log files
      if (
        lower.endsWith('.log') ||
        lower.includes('access.log') ||
        lower.includes('error.log') ||
        lower.includes('app.log') ||
        lower.includes('hs_err') ||
        lower.includes('replay_pid')
      ) {
        if (logFiles.length < maxLogs) {
          let mtime = 0;
          try {
            mtime = fs.statSync(fullPath).mtimeMs;
          } catch {
            // ignore
          }
          logFiles.push({ relPath, mtime });
        }
      }

      // Config files
      if (
        lower === '.env.example' ||
        lower.includes('tsconfig') ||
        lower.endsWith('.config.js') ||
        lower.endsWith('.config.ts') ||
        lower.endsWith('.config.json') ||
        lower === 'config.json' ||
        lower === 'application.yml' ||
        lower === 'application.properties'
      ) {
        configFiles.push(relPath);
      }
    }
  }
}

function scanGitChanges(projectPath: string): GitChangeSummary {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: projectPath,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 3000
    }).trim();

    // Last 5 commits: hash|author|date|subject
    const rawLog = execSync('git log -n 5 --pretty=format:"%h|%an|%cI|%s"', {
      cwd: projectPath,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 3000
    }).trim();

    const recentCommits: GitCommitInfo[] = rawLog
      ? rawLog
          .split('\n')
          .filter(Boolean)
          .map((line) => {
            const [hash, author, timestamp, message] = line.replace(/^"|"$/g, '').split('|');
            return {
              hash: hash || '',
              author: author || '',
              timestamp: timestamp || '',
              message: message || ''
            };
          })
      : [];

    // Check uncommitted changes
    const statusOut = execSync('git status --porcelain', {
      cwd: projectPath,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 3000
    }).trim();

    const modifiedFiles = statusOut
      ? statusOut
          .split('\n')
          .filter(Boolean)
          .map((line) => line.trim().split(/\s+/)[1])
          .filter(Boolean)
      : [];

    return {
      isGitRepo: true,
      branch,
      recentCommits,
      uncommittedChangesCount: modifiedFiles.length,
      modifiedFiles
    };
  } catch {
    return {
      isGitRepo: true,
      recentCommits: []
    };
  }
}
