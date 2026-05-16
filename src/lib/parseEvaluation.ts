// ============================================================
// LeetSkills MVP — Evaluation Response Parser
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================
// TODO: Implement JSON response parser with validation
//
// This module parses Claude's JSON response into a typed
// Evaluation object, with validation and error handling.

import type { Evaluation } from "@/types";

/**
 * Parse Claude's raw JSON response into a typed Evaluation.
 * Validates structure, score ranges, and required fields.
 *
 * @param raw - Raw JSON string from Claude
 * @param scenarioId - The scenario ID for context
 * @returns Parsed and validated Evaluation
 * @throws Error if parsing or validation fails
 */
export function parseEvaluation(
  raw: string,
  scenarioId: string
): Evaluation {
  // TODO: Implement in Phase 2
  // 1. Parse JSON
  // 2. Validate all required fields exist
  // 3. Validate score ranges (0 to max_score)
  // 4. Determine weakest_dimension
  // 5. Add timestamp
  throw new Error("Not implemented — Phase 2");
}
