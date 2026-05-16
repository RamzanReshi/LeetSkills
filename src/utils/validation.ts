// ============================================================
// LeetSkills MVP — Input Validation
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================

const MIN_THINKING_TRACE_CHARS = 80;

/** Validate thinking trace meets minimum length requirement */
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

  return { valid: true, message: "Valid", charCount };
}

/** Validate response is not empty */
export function validateResponse(response: string): {
  valid: boolean;
  message: string;
} {
  const trimmed = response.trim();

  if (trimmed.length === 0) {
    return { valid: false, message: "Response cannot be empty." };
  }

  return { valid: true, message: "Valid" };
}
