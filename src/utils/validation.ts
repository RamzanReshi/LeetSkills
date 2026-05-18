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

// Quick heuristic: flags inputs that are almost certainly low-effort
// (keyboard mashing, repeated chars, single-word spam). Cheap pre-flight
// check so we don't burn AI quota on junk.
export function looksLikeGibberish(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length < 20) return false; // already caught by min-length check

  // Tokenize on whitespace; collapse alpha words.
  const words = trimmed.split(/\s+/).filter((w) => /[a-zA-Z؀-ۿÀ-ɏ]/.test(w));
  if (words.length < 3) return true;

  // Unique-word ratio — heavy repetition (e.g. "test test test...") is junk.
  const unique = new Set(words.map((w) => w.toLowerCase()));
  if (unique.size / words.length < 0.25) return true;

  // Vowel ratio — random keyboard mashing tends to have very low vowel density.
  const letters = trimmed.replace(/[^a-zA-Z]/g, "");
  if (letters.length > 30) {
    const vowels = letters.match(/[aeiouAEIOU]/g)?.length ?? 0;
    const ratio = vowels / letters.length;
    if (ratio < 0.15 || ratio > 0.7) return true;
  }

  // Long runs of the same character ("aaaaaaaaa").
  if (/(.)\1{6,}/.test(trimmed)) return true;

  return false;
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
