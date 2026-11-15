/**
 * Secret sanitizer utility for telemetry and project telemetry data
 * Ensures Rule 2: "Never use real secrets in test data. Use synthetic tokens and sanitized logs only."
 */

const SECRET_PATTERNS: Array<{ regex: RegExp; replaceWith: string }> = [
  // Database connection URI password mask: e.g. postgres://user:secret@localhost:5432/db
  {
    regex: /(postgres|mysql|mongodb|redis|amqp):\/\/([^:\s]+):([^@\s]+)@/gi,
    replaceWith: '$1://$2:[REDACTED]@'
  },
  // Bearer tokens
  {
    regex: /bearer\s+([a-zA-Z0-9\-._~+/]+=*)/gi,
    replaceWith: 'Bearer [REDACTED]'
  },
  // JWT tokens: eyJ...
  {
    regex: /eyJ[a-zA-Z0-9_\-]+\.eyJ[a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+/g,
    replaceWith: '[JWT_REDACTED]'
  },
  // Common key/token/password assignments in json or log strings
  {
    regex: /(["']?(?:password|passwd|secret|api_key|apiKey|token|access_token|private_key)["']?\s*[:=]\s*["'])([^"',\s]{4,})(["'])/gi,
    replaceWith: '$1[REDACTED]$3'
  },
  // AWS / OpenAI / General API key formats
  {
    regex: /\b(sk-[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16})\b/g,
    replaceWith: '[API_KEY_REDACTED]'
  }
];

export function sanitizeTelemetry(text: string): string {
  if (!text) return text;
  let sanitized = text;
  for (const { regex, replaceWith } of SECRET_PATTERNS) {
    sanitized = sanitized.replace(regex, replaceWith);
  }
  return sanitized;
}
