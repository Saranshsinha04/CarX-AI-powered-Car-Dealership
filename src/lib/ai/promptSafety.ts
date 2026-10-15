/**
 * Security defense layer against LLM prompt injection and API abuse
 */

const SUSPICIOUS_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|system)\s+instructions/i,
  /reveal\s+(the\s+)?(database|api[_\s]?key|system\s+prompt|credentials|password)/i,
  /drop\s+table/i,
  /delete\s+from/i,
  /select\s+\*\s+from/i,
  /grant\s+all/i,
  /show\s+me\s+other\s+customers/i,
  /bypass\s+(security|dealership\s+permissions|auth)/i,
  /you\s+are\s+now\s+in\s+dan\s+mode/i,
  /execute\s+this\s+sql/i,
];

export interface SafetyCheckResult {
  safe: boolean;
  sanitized: string;
  flaggedReason?: string;
}

export function sanitizeAndGuardPrompt(input: string, maxLength: number = 800): SafetyCheckResult {
  if (!input || typeof input !== "string") {
    return { safe: true, sanitized: "" };
  }

  // Enforce reasonable length bound
  const trimmed = input.trim().slice(0, maxLength);

  // Check for adversarial prompt injection patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        safe: false,
        sanitized: "",
        flaggedReason: "Suspicious security pattern detected in input.",
      };
    }
  }

  // Strip harmful control characters while preserving standard punctuation
  const sanitized = trimmed.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");

  return {
    safe: true,
    sanitized,
  };
}
