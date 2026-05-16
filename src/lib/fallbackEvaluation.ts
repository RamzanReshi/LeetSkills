// ============================================================
// LeetSkills MVP — Fallback Evaluation
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================
// TODO: Implement cached/default fallback evaluation
//
// This module provides a reliable fallback when the Claude API
// call fails or response parsing fails, ensuring the product
// loop never breaks for the user.

import type { Evaluation, DimensionName } from "@/types";

/**
 * Generate a fallback evaluation when live evaluation fails.
 * Returns a conservative, generic evaluation with a message
 * explaining that AI evaluation was unavailable.
 *
 * @param scenarioId - The scenario that was attempted
 * @returns A safe fallback Evaluation object
 */
export function getFallbackEvaluation(scenarioId: string): Evaluation {
  // TODO: Implement in Phase 2
  // Return a neutral evaluation with:
  // - Mid-range scores
  // - Generic but honest feedback
  // - Clear indication this is a fallback
  throw new Error("Not implemented — Phase 2");
}
