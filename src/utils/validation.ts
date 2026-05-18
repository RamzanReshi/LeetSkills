// ============================================================
// LeetSkills MVP — Input Validation & AI Usage Caps
// ============================================================

export const MIN_THINKING_TRACE_CHARS = 80;
export const MAX_THINKING_TRACE_CHARS = 2000;
export const MAX_RESPONSE_CHARS = 3000;
// Hard ceiling on combined user-supplied chars sent to the model.
export const MAX_TOTAL_INPUT_CHARS = MAX_THINKING_TRACE_CHARS + MAX_RESPONSE_CHARS;
// Rough chars-per-token heuristic for budgeting before tokenizer runs.
export const APPROX_CHARS_PER_TOKEN = 4;

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / APPROX_CHARS_PER_TOKEN);
}

// Trim text to fit a token budget by keeping the first N chars.
// Cuts on a word boundary when possible so the model isn't fed a half-word.
export function truncateToTokenBudget(text: string, maxTokens: number): string {
  const maxChars = maxTokens * APPROX_CHARS_PER_TOKEN;
  if (text.length <= maxChars) return text;
  const slice = text.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(" ");
  return lastSpace > maxChars * 0.8 ? slice.slice(0, lastSpace) : slice;
}

export function validateThinkingTrace(trace: string): {
  valid: boolean;
  message: string;
  charCount: number;
} {
  const trimmed = trace.trim();
  const charCount = trimmed.length;

  if (charCount < MIN_THINKING_TRACE_CHARS) {
    return {
      valid: false,
      message: `Thinking trace must be at least ${MIN_THINKING_TRACE_CHARS} characters. Currently: ${charCount}`,
      charCount,
    };
  }

  if (charCount > MAX_THINKING_TRACE_CHARS) {
    return {
      valid: false,
      message: `Thinking trace must be at most ${MAX_THINKING_TRACE_CHARS} characters. Currently: ${charCount}`,
      charCount,
    };
  }

  return { valid: true, message: "Valid", charCount };
}

export function validateResponse(response: string): {
  valid: boolean;
  message: string;
  charCount: number;
} {
  const trimmed = response.trim();
  const charCount = trimmed.length;

  if (charCount === 0) {
    return { valid: false, message: "Response cannot be empty.", charCount };
  }

  if (charCount > MAX_RESPONSE_CHARS) {
    return {
      valid: false,
      message: `Response must be at most ${MAX_RESPONSE_CHARS} characters. Currently: ${charCount}`,
      charCount,
    };
  }

  return { valid: true, message: "Valid", charCount };
}
