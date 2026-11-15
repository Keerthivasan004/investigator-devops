/**
 * Professional ANSI Terminal Colors & Styling Utility
 * Provides instant visual hierarchy for severities, status pills, and headers.
 * Zero external dependencies.
 */

const ESC = '\x1b[';
const RESET = `${ESC}0m`;

const color = (code: string) => (text: string) => `${code}${text}${RESET}`;

export const c = {
  reset: RESET,
  bold: color(`${ESC}1m`),
  dim: color(`${ESC}2m`),
  italic: color(`${ESC}3m`),
  underline: color(`${ESC}4m`),

  // Standard Foregrounds
  red: color(`${ESC}31m`),
  green: color(`${ESC}32m`),
  yellow: color(`${ESC}33m`),
  blue: color(`${ESC}34m`),
  magenta: color(`${ESC}35m`),
  cyan: color(`${ESC}36m`),
  white: color(`${ESC}37m`),
  gray: color(`${ESC}90m`),

  // High-Intensity Foregrounds
  brightRed: color(`${ESC}91m`),
  brightGreen: color(`${ESC}92m`),
  brightYellow: color(`${ESC}93m`),
  brightBlue: color(`${ESC}94m`),
  brightMagenta: color(`${ESC}95m`),
  brightCyan: color(`${ESC}96m`),
  brightWhite: color(`${ESC}97m`),

  // Backgrounds
  bgRed: color(`${ESC}41m`),
  bgGreen: color(`${ESC}42m`),
  bgYellow: color(`${ESC}43m`),
  bgBlue: color(`${ESC}44m`),
  bgMagenta: color(`${ESC}45m`),
  bgCyan: color(`${ESC}46m`)
};

export function colorSeverity(severity: string): string {
  const s = severity.toLowerCase();
  switch (s) {
    case 'critical':
      return c.bgRed(c.brightWhite(c.bold(' CRITICAL ')));
    case 'error':
    case 'high':
      return c.brightRed(c.bold('[ERROR]'));
    case 'warn':
    case 'warning':
    case 'medium':
      return c.brightYellow(c.bold('[WARN]'));
    case 'info':
    case 'low':
      return c.brightCyan('[INFO]');
    default:
      return c.dim(`[${severity.toUpperCase()}]`);
  }
}

export function colorStatus(status: string): string {
  switch (status) {
    case 'strongly_supported':
      return c.brightGreen(c.bold('[CONFIRMED]   '));
    case 'weakened':
    case 'disproven':
      return c.brightRed(c.bold('[DISPROVEN]   '));
    case 'investigating':
    default:
      return c.brightYellow(c.bold('[INVESTIGATING]'));
  }
}

export function colorRole(role: string): string {
  const r = role.toLowerCase();
  switch (r) {
    case 'root_cause':
      return c.bgRed(c.brightWhite(c.bold(' [ROOT_CAUSE] ')));
    case 'contributing_factor':
      return c.brightYellow(c.bold('[CONTRIBUTING_FACTOR]'));
    case 'system_effect':
      return c.brightMagenta(c.bold('[SYSTEM_EFFECT]'));
    case 'user_visible_symptom':
      return c.brightRed(c.bold('[USER_VISIBLE_SYMPTOM]'));
    default:
      return c.cyan(c.bold(`[${role.toUpperCase()}]`));
  }
}

export function colorConfidence(confidence: number): string {
  const pct = (confidence * 100).toFixed(0) + '%';
  if (confidence >= 0.85) return c.brightGreen(c.bold(pct));
  if (confidence >= 0.5) return c.brightYellow(c.bold(pct));
  return c.gray(pct);
}
