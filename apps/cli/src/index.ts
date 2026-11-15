#!/usr/bin/env node

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as http from 'node:http';
import * as readline from 'node:readline';
import type { Socket } from 'node:net';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import { scanProject, loadIncident, normalizeEvidence } from '@investigator/evidence';
import { createLLMProvider } from '@investigator/llm';
import { IncidentEngine, type InvestigationReport } from '@investigator/incident-engine';
import { runBenchmarkSuite, evaluateInvestigation, generatePublicationReport } from '@investigator/evaluation';
import { c, colorSeverity, colorStatus, colorRole, colorConfidence } from './colors.js';
import { getEmbeddedUIDashboardHtml } from './dashboard-html.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
const command = args[0] ? args[0].toLowerCase() : 'help';

async function main() {
  switch (command) {
    case 'scan':
    case 'status':
      await handleScan(args.slice(1));
      break;
    case 'run':
    case 'investigate':
      await handleInvestigate(args.slice(1));
      break;
    case 'check':
      await handleCheck(args.slice(1));
      break;
    case 'evidence':
      await handleEvidence(args.slice(1));
      break;
    case 'eval':
    case 'benchmark':
    case 'report':
      await handleBenchmark(args.slice(1), command === 'report');
      break;
    case 'ui':
    case 'gui':
      await handleUI(args.slice(1));
      break;
    case 'help':
    case '--help':
    case '-h':
    default:
      printHelp();
      break;
  }
}

async function handleScan(cmdArgs: string[]) {
  const targetPath = cmdArgs[0] || '.';
  console.log(`\nScanning target project at: ${c.cyan(path.resolve(targetPath))}...\n`);

  try {
    const result = scanProject(targetPath);

    console.log(`Project Name: ${c.bold(c.brightWhite(result.name || 'Unknown'))}`);
    console.log(`Path:         ${c.dim(result.projectPath)}`);

    console.log(c.bold(c.brightCyan('\nTech Stacks Detected:')));
    if (result.techStacks.length === 0) {
      console.log(c.dim('   (No standard manifest files recognized)'));
    } else {
      for (const stack of result.techStacks) {
        console.log(`   - ${c.bold(c.brightGreen(stack.language.toUpperCase()))} ${c.dim('(' + (stack.packageManager || 'no package manager') + ')')}`);
        if (stack.frameworks && stack.frameworks.length > 0) {
          console.log(`     Frameworks: ${c.cyan(stack.frameworks.join(', '))}`);
        }
        console.log(`     Manifests:  ${c.dim(stack.manifestFiles.join(', '))}`);
      }
    }

    console.log(c.bold(c.brightCyan(`\nDiscovered Log Sources (${result.logFiles.length}):`)));
    if (result.logFiles.length === 0) {
      console.log(c.dim('   (No active log files found in standard locations)'));
    } else {
      result.logFiles.forEach((f) => console.log(`   - ${c.brightYellow(f)}`));
    }

    console.log(c.bold(c.brightCyan(`\nConfiguration Files (${result.configFiles.length}):`)));
    result.configFiles.slice(0, 5).forEach((f) => console.log(`   - ${c.dim(f)}`));

    if (result.gitChanges?.isGitRepo) {
      console.log(c.bold(c.brightCyan(`\nGit Repository Status:`)));
      console.log(`   Branch: ${c.brightGreen(result.gitChanges.branch || 'HEAD')}`);
      console.log(`   Recent Commits: ${result.gitChanges.recentCommits.length}`);
      result.gitChanges.recentCommits.slice(0, 3).forEach((comm) => {
        console.log(`     ${c.yellow('[' + comm.hash + ']')} ${comm.message} ${c.dim('(' + comm.author + ')')}`);
      });
      if (result.gitChanges.uncommittedChangesCount) {
        console.log(`   ${c.brightYellow(c.bold('[WARN]'))} Uncommitted Changes: ${result.gitChanges.uncommittedChangesCount} files`);
      }
    }

    console.log('\n' + c.brightGreen('Scan complete.') + ' Ready to investigate with: ' + c.cyan('investigator check ' + targetPath) + '\n');
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`${colorSeverity('error')} Scan failed: ${errorMsg}`);
    process.exit(1);
  }
}

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => (data += chunk));
    process.stdin.on('end', () => resolve(data));
  });
}

async function handleInvestigate(cmdArgs: string[]) {
  // Check if reading from stdin: investigator run --stdin
  if (cmdArgs.includes('--stdin') || cmdArgs[0] === '-') {
    console.log('\nReading piped telemetry from standard input (stdin)...\n');
    const stdinData = await readStdin();
    if (!stdinData.trim()) {
      console.error('[ERROR] No telemetry data received on stdin.');
      process.exit(1);
    }
    try {
      const engine = new IncidentEngine(createLLMProvider());
      const report = await engine.investigate({
        rawEvidenceFiles: [
          {
            filename: 'stdin.log',
            relativePath: 'stdin.log',
            content: stdinData
          }
        ],
        description: 'Piped Standard Input Telemetry'
      });
      printReport(report);
      return;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error(`[ERROR] Investigation failed: ${errorMsg}`);
      process.exit(1);
    }
  }

  const incidentPath = cmdArgs[0] || './incidents/incident-001';
  console.log(`\nInitializing Investigation on: ${path.resolve(incidentPath)}...\n`);

  try {
    const engine = new IncidentEngine(createLLMProvider());
    const report = await engine.investigate({ incidentPath });
    printReport(report);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[ERROR] Investigation failed: ${errorMsg}`);
    process.exit(1);
  }
}

async function handleCheck(cmdArgs: string[]) {
  const projectPath = cmdArgs[0] || '.';
  let externalLogsPath: string | undefined;

  const logsIdx = cmdArgs.indexOf('--logs');
  if (logsIdx !== -1 && cmdArgs[logsIdx + 1]) {
    externalLogsPath = cmdArgs[logsIdx + 1];
  }

  console.log(`\nInspecting Project at: ${path.resolve(projectPath)}...`);
  if (externalLogsPath) {
    console.log(`Using external logs from: ${path.resolve(externalLogsPath)}`);
  }
  console.log('');

  try {
    const engine = new IncidentEngine(createLLMProvider());
    const report = await engine.investigate({
      projectPath,
      externalLogsPath,
      description: 'Automated project anomaly investigation'
    });
    printReport(report);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`[ERROR] Project check failed: ${errorMsg}`);
    process.exit(1);
  }
}

async function handleEvidence(cmdArgs: string[]) {
  const targetPath = cmdArgs[0] || './incidents/incident-001';
  console.log(`\nExtracting and Normalizing Telemetry from: ${c.cyan(path.resolve(targetPath))}...\n`);

  try {
    const loaded = loadIncident(targetPath);
    const items = normalizeEvidence(loaded.evidenceFiles);

    console.log(`Total Normalized Evidence Items: ${c.bold(c.brightCyan(items.length.toString()))}\n`);
    items.forEach((item, idx) => {
      console.log(
        `#${idx + 1} ${c.dim('[' + item.timestamp + ']')} ${c.cyan('[' + item.service + ']')} (${c.magenta(item.type.toUpperCase())}) ${colorSeverity(item.severity)}`
      );
      console.log(`    Message: ${item.message}`);
      console.log(`    Source:  ${c.dim(item.originalReference.file + ':L' + item.originalReference.line)}`);
      if (item.value !== undefined) {
        console.log(`    Metric Value: ${c.brightYellow(item.value.toString())} ${item.unit || ''}`);
      }
      console.log('');
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`${colorSeverity('error')} Evidence extraction failed: ${errorMsg}`);
    process.exit(1);
  }
}

async function handleBenchmark(cmdArgs: string[], forceReport = false) {
  let incidentsDir = cmdArgs[0];
  const isFlag = incidentsDir && incidentsDir.startsWith('-');
  if (!incidentsDir || isFlag) {
    if (fs.existsSync(path.resolve('./incidents'))) {
      incidentsDir = './incidents';
    } else {
      incidentsDir = getIncidentsBaseDir();
      console.log(c.dim(`(Note: 'investigator eval' benchmarks the AI investigator against 10 known laboratory outage scenarios, not your current project files)`));
    }
  }
  const shouldGenerateReport = forceReport || cmdArgs.includes('--report') || cmdArgs.includes('-r');

  console.log(`\nRunning AI Diagnostic Competency Benchmark against: ${c.cyan(path.resolve(incidentsDir))}...\n`);

  try {
    const engine = new IncidentEngine(createLLMProvider());
    const summary = await runBenchmarkSuite(incidentsDir, engine);

    const line = c.dim('============================================================');
    console.log(line);
    console.log(c.brightCyan(c.bold('              BENCHMARK EVALUATION RESULTS                  ')));
    console.log(line);
    console.log(`Total Incidents Evaluated:       ${c.bold(c.brightWhite(summary.totalIncidents.toString()))}`);
    console.log(`Root Cause Accuracy (Top 1):     ${summary.rootCauseAccuracy >= 90 ? c.brightGreen(c.bold(summary.rootCauseAccuracy + '%')) : c.brightYellow(summary.rootCauseAccuracy + '%')}`);
    console.log(`Root Cause Accuracy (Top 3):     ${summary.top3Accuracy >= 90 ? c.brightGreen(c.bold(summary.top3Accuracy + '%')) : c.brightYellow(summary.top3Accuracy + '%')}`);
    console.log(`Average Evidence Recall:         ${summary.averageEvidenceRecall >= 90 ? c.brightGreen(c.bold(summary.averageEvidenceRecall + '%')) : c.brightYellow(summary.averageEvidenceRecall + '%')}`);
    console.log(`Telemetry Reduction Ratio:       ${c.cyan(summary.averageEvidenceReductionRatio + '%')}`);
    console.log(c.dim('------------------------------------------------------------'));

    summary.results.forEach((r, idx) => {
      const matchText = r.rootCauseMatched
        ? c.brightGreen(c.bold('YES (Rank 1)'))
        : r.rootCauseTopKMatched
          ? c.brightYellow(c.bold(`YES (Rank ${r.topKRank})`))
          : c.brightRed(c.bold('NO'));

      console.log(`Incident #${idx + 1}: ${c.bold(r.incidentId)}`);
      console.log(`  - Matched: ${matchText}`);
      console.log(`  - Recall: ${c.brightGreen((r.evidenceRecall * 100).toFixed(1) + '%')} | Reduction: ${c.cyan((r.evidenceReductionRatio * 100).toFixed(1) + '%')}`);
    });
    console.log(line + '\n');

    if (shouldGenerateReport) {
      const reportMarkdown = generatePublicationReport(summary, incidentsDir);
      const reportPath = path.resolve(process.cwd(), 'BENCHMARK_REPORT.md');
      fs.writeFileSync(reportPath, reportMarkdown, 'utf8');
      console.log(c.brightGreen(c.bold('✔ Publication Benchmark Report saved to: ')) + c.cyan(reportPath) + '\n');
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`${colorSeverity('error')} Benchmark failed: ${errorMsg}`);
    process.exit(1);
  }
}

function getIncidentsBaseDir(): string {
  const fromCliDist = path.resolve(__dirname, '../../../incidents');
  if (fs.existsSync(fromCliDist)) return fromCliDist;

  const fromCliSrc = path.resolve(__dirname, '../../incidents');
  if (fs.existsSync(fromCliSrc)) return fromCliSrc;

  const cwdIncidents = path.resolve(process.cwd(), 'incidents');
  if (fs.existsSync(cwdIncidents)) return cwdIncidents;

  return fromCliDist;
}

function getAvailableIncidents(): Array<{ id: string; title: string; path: string }> {
  const baseDir = getIncidentsBaseDir();
  const list: Array<{ id: string; title: string; path: string }> = [];

  // Always include the current active project workspace
  const cwd = process.cwd();
  list.push({
    id: 'current-workspace',
    title: `[Active Project] ${path.basename(cwd)}`,
    path: cwd
  });

  if (fs.existsSync(baseDir)) {
    const entries = fs.readdirSync(baseDir, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) {
        const incDir = path.join(baseDir, e.name);
        let title = e.name;
        const metaFile = path.join(incDir, 'incident.json');
        if (fs.existsSync(metaFile)) {
          try {
            const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
            if (meta.title) title = `${e.name}: ${meta.title}`;
          } catch {}
        }
        list.push({ id: e.name, title, path: incDir });
      }
    }
  }

  return list;
}

async function handleUI(cmdArgs: string[]) {
  let port = 4000;
  const portIdx = cmdArgs.indexOf('--port');
  if (portIdx !== -1 && cmdArgs[portIdx + 1]) {
    port = Number(cmdArgs[portIdx + 1]) || 4000;
  } else if (process.env.PORT) {
    port = Number(process.env.PORT) || 4000;
  }
  console.log(`\nLaunching Local Web GUI Dashboard on port ${port}...`);

  return new Promise<void>((resolve, reject) => {
    let server: http.Server;
    const sockets = new Set<Socket>();
    let isShuttingDown = false;

    const shutdown = () => {
      if (isShuttingDown) {
        process.exit(0);
      }
      isShuttingDown = true;
      console.log(`\nStopping Investigator dashboard server and freeing port ${port}...`);

      if (process.stdin && process.stdin.isTTY && typeof process.stdin.setRawMode === 'function') {
        try {
          process.stdin.setRawMode(false);
        } catch {}
      }

      for (const socket of sockets) {
        try {
          socket.destroy();
        } catch {}
      }
      sockets.clear();

      if (server && typeof (server as any).closeAllConnections === 'function') {
        try {
          (server as any).closeAllConnections();
        } catch {}
      }

      if (server) {
        server.close(() => {
          process.exit(0);
        });
      }

      const timer = setTimeout(() => {
        process.exit(0);
      }, 150);
      if (typeof timer.unref === 'function') {
        timer.unref();
      }
    };

    server = http.createServer((req, res) => {
      const parsedUrl = new URL(req.url || '/', `http://localhost:${port}`);

      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      // 0. API: Shutdown endpoint triggered from Web GUI
      if (parsedUrl.pathname === '/api/shutdown' && (req.method === 'POST' || req.method === 'GET')) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: true, message: 'Investigator server shutting down' }));
        setTimeout(() => shutdown(), 50);
        return;
      }

      // 1. API: List available incident targets and active project info
      if (parsedUrl.pathname === '/api/incidents' && req.method === 'GET') {
        const cwd = process.cwd();
        const baseDir = getIncidentsBaseDir();
        const targets: Array<{ id: string; title: string; path: string; type: 'project_scan' | 'incident_benchmark' }> = [];

        // Dedicated live project scan target
        targets.push({
          id: 'project-scan',
          title: '[Live Project Scan] Project Telemetry & Anomaly Analysis',
          path: cwd,
          type: 'project_scan'
        });

        // Benchmark Incident Targets
        if (fs.existsSync(baseDir)) {
          const entries = fs.readdirSync(baseDir, { withFileTypes: true });
          for (const e of entries) {
            if (e.isDirectory()) {
              const incDir = path.join(baseDir, e.name);
              let title = e.name;
              const metaFile = path.join(incDir, 'incident.json');
              if (fs.existsSync(metaFile)) {
                try {
                  const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
                  if (meta.title) title = `${e.name}: ${meta.title}`;
                } catch {}
              }
              targets.push({ id: e.name, title, path: incDir, type: 'incident_benchmark' });
            }
          }
        }

        const payload = {
          project: {
            name: path.basename(cwd),
            path: cwd
          },
          targets
        };

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(payload));
        return;
      }

      // 2. API: Get specific incident or project investigation report
      if (parsedUrl.pathname === '/api/incident' && req.method === 'GET') {
        const id = parsedUrl.searchParams.get('id') || 'project-scan';
        const projectPathQuery = parsedUrl.searchParams.get('projectPath') || parsedUrl.searchParams.get('path');
        const activeProjectDir = projectPathQuery && projectPathQuery.trim()
          ? path.resolve(projectPathQuery.trim())
          : process.cwd();

        let targetPath = '';
        let isProject = false;

        if (id === 'project-scan' || id === 'current-workspace') {
          targetPath = activeProjectDir;
          isProject = true;
        } else {
          const baseDir = getIncidentsBaseDir();
          targetPath = path.resolve(baseDir, id);
          if (!fs.existsSync(targetPath)) {
            targetPath = path.resolve(process.cwd(), 'incidents', id);
          }
          if (!fs.existsSync(targetPath) && fs.existsSync(id)) {
            targetPath = path.resolve(id);
          }
          isProject = false;
        }

        if (!fs.existsSync(targetPath)) {
          res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: `Path or incident target not found: ${targetPath}` }));
          return;
        }

        const engine = new IncidentEngine(createLLMProvider());
        const investigationPromise = isProject
          ? engine.investigate({
              projectPath: targetPath,
              description: `Automated project anomaly investigation of ${path.basename(targetPath)}`
            })
          : engine.investigate({ incidentPath: targetPath });

        investigationPromise
          .then((report) => {
            const enriched = {
              ...report,
              projectName: isProject ? path.basename(activeProjectDir) : (report.projectName || path.basename(activeProjectDir)),
              projectPath: isProject ? activeProjectDir : (report.projectPath || targetPath),
              targetId: id,
              targetTitle: isProject ? `Live Project Scan (${path.basename(activeProjectDir)})` : `${id}: ${report.incidentSummary || id}`,
              targetType: isProject ? 'Live Project Telemetry Scan' : 'Incident Benchmark Laboratory',
              targetLocation: targetPath
            };
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify(enriched));
          })
          .catch((err) => {
            const errorMsg = err instanceof Error ? err.message : String(err);
            res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ error: errorMsg }));
          });
        return;
      }

      // 3. Serve HTML Dashboard
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(getEmbeddedUIDashboardHtml());
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`[ERROR] Port ${port} is already in use. Specify a different port using --port <number>`);
        reject(err);
      } else {
        console.error(`[ERROR] HTTP server error:`, err);
      }
    });

    server.on('connection', (socket) => {
      sockets.add(socket);
      socket.on('close', () => {
        sockets.delete(socket);
      });
    });

    server.listen(port, () => {
      const url = `http://localhost:${port}`;
      console.log(`Web GUI is running at: ${url}`);
      console.log(`To stop server: Press Ctrl+C, press 'q', or click [Stop Server] in the UI.\n`);

      const startCmd = process.platform === 'win32' ? `start ${url}` : `open ${url}`;
      exec(startCmd, () => {
        // safely ignore browser launch errors in headless/daemon environments
      });
    });

    const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGBREAK', 'SIGHUP'];
    for (const sig of signals) {
      process.on(sig, shutdown);
    }

    if (process.stdin) {
      if (process.stdin.isTTY && typeof process.stdin.setRawMode === 'function') {
        try {
          process.stdin.setRawMode(true);
        } catch {}
      }
      process.stdin.resume();
      process.stdin.on('data', (buf: Buffer) => {
        const s = buf.toString();
        // \u0003 is Ctrl+C, \u0004 is Ctrl+D, \u001b is Escape
        if (
          s.includes('\u0003') ||
          s.includes('\u0004') ||
          s.includes('\u001b') ||
          s.trim().toLowerCase() === 'q' ||
          s.trim().toLowerCase() === 'x' ||
          s.trim().toLowerCase() === 'exit' ||
          s.trim().toLowerCase() === 'stop'
        ) {
          shutdown();
        }
      });
    }
  });
}

function printReport(report: InvestigationReport) {
  const line = c.dim('============================================================');
  console.log(line);
  console.log(c.brightCyan(c.bold('              INCIDENT INVESTIGATION REPORT                 ')));
  console.log(c.cyan('        Evidence-Driven Incident Investigator               '));
  console.log(c.dim('             Created by: ') + c.bold(c.brightWhite('Keerthivasan.R.V')));
  console.log(line);
  console.log(`${c.bold('Project:    ')} ${c.brightCyan(report.projectName || 'DevOps Project')}`);
  console.log(`${c.bold('Target:     ')} ${c.brightYellow(report.incidentId)}`);
  console.log(`${c.bold('Summary:    ')} ${report.incidentSummary}`);
  console.log(c.dim('------------------------------------------------------------'));

  console.log(c.bold(c.brightCyan('\nROOT CAUSE DECISION:')));
  console.log(c.bold(c.brightRed(`   ${report.rootCause.description}`)));
  console.log(`   ${c.bold('Confidence:')} ${colorConfidence(report.rootCause.confidence)}`);
  console.log(`   ${c.bold('Rationale: ')} ${c.dim(report.rootCause.confidenceRationale)}`);

  console.log(c.bold(c.brightCyan('\nCAUSAL CHAIN:')));
  report.causalChain.forEach((node, idx) => {
    const arrow = idx < report.causalChain.length - 1 ? c.dim('   |\n   v') : '';
    console.log(`   ${colorRole(node.role)} ${node.description}`);
    if (arrow) console.log(arrow);
  });

  console.log(c.bold(c.brightCyan('\nCHRONOLOGICAL TIMELINE:')));
  report.timeline.forEach((t) => {
    let sigFormatted = c.dim('(' + t.significance + ')');
    if (t.significance === 'initial_trigger') sigFormatted = c.brightBlue(c.bold('(' + t.significance + ')'));
    else if (t.significance === 'state_change') sigFormatted = c.brightYellow(c.bold('(' + t.significance + ')'));
    else if (t.significance === 'user_visible_symptom') sigFormatted = c.brightRed(c.bold('(' + t.significance + ')'));

    console.log(`   - ${c.dim('[' + t.timestamp + ']')} ${c.cyan('[' + t.service + ']')} ${t.description} ${sigFormatted}`);
  });

  console.log(c.bold(c.brightCyan('\nHYPOTHESES EVALUATED:')));
  report.hypotheses.forEach((h) => {
    const mark = colorStatus(h.status);
    console.log(`   ${mark} ${c.bold('[' + h.id + ']')} ${h.cause}`);
    console.log(`      Status: ${c.dim(h.status)} | Confidence: ${colorConfidence(h.confidence)}`);
    console.log(`      Supporting evidence count:   ${c.brightGreen(h.supportingEvidenceIds.length.toString())}`);
    console.log(`      Contradicting evidence count: ${h.contradictingEvidenceIds.length > 0 ? c.brightRed(h.contradictingEvidenceIds.length.toString()) : c.dim('0')}`);
    if (h.missingEvidenceDescriptions.length > 0) {
      console.log(`      Missing telemetry: ${c.brightYellow(h.missingEvidenceDescriptions.join(', '))}`);
    }
  });

  console.log(c.bold(c.brightCyan('\nKEY EVIDENCE & ERROR TRACES (File & Line Provenance):')));
  const primaryEvidence = report.supportingEvidence.length > 0 ? report.supportingEvidence : report.selectedEvidence;
  primaryEvidence.slice(0, 8).forEach((ev, idx) => {
    const ref = ev.originalReference ? `${ev.originalReference.file}:L${ev.originalReference.line}` : ev.source;
    console.log(`   #${idx + 1} ${colorSeverity(ev.severity)} ${c.dim('[' + ev.service + ']')} ${c.underline(c.cyan(ref))}`);
    console.log(`      ${c.bold(ev.message)}`);
    if (ev.value !== undefined) {
      console.log(`      ${c.dim('Metric Value:')} ${c.brightYellow(ev.value.toString())} ${ev.unit || ''}`);
    }
  });

  console.log(c.bold(c.brightCyan('\nSAFE RECOMMENDED ACTIONS (Read-Only):')));
  report.recommendedActions.forEach((act) => {
    console.log(`   ${c.cyan('[ ]')} ${act}`);
  });

  console.log(c.bold(c.brightCyan('\nTELEMETRY REDUCTION STATISTICS:')));
  console.log(`   Total Evidence Available:   ${c.bold(c.brightWhite(report.statistics.totalEvidenceAvailable.toString()))}`);
  console.log(`   Evidence Items Inspected:   ${c.bold(c.brightWhite(report.statistics.evidenceInspected.toString()))}`);
  console.log(`   Telemetry Pruned:           ${c.brightGreen((report.statistics.evidenceReductionRatio * 100).toFixed(1) + '%')}`);
  console.log(`   Investigation Duration:     ${c.brightYellow(report.statistics.durationMs + 'ms')}`);
  console.log(line + '\n');
}

function printHelp() {
  console.log(`
Evidence-Driven Incident Investigator (CLI & GUI)
Created by: Keerthivasan.R.V

USAGE:
  investigator <command> [options]

COMMANDS:
  scan [path]         Automatically recognize project tech stack, services, and logs (alias: status)
  check [path]        Scan project, collect telemetry, and run automated investigation
  run <incident-dir>  Run investigation on an incident directory (e.g. incidents/incident-001)
  evidence <path>     Extract and normalize evidence items with source references
  eval [dir]          Benchmark the AI investigator against 10 ground-truth outage scenarios
  report [dir]        Run benchmark and compile publication-grade BENCHMARK_REPORT.md
  ui                  Launch the local Web GUI dashboard in your browser
  help                Show this help message

EXAMPLES:
  investigator scan .
  investigator run incidents/incident-001
  investigator eval
  investigator report
  investigator ui
`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
