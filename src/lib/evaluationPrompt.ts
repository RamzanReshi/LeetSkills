// ============================================================
// LeetSkills MVP — Evaluation System Prompt Builder
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================
// TODO: Implement strict grading prompt for Claude
//
// This module constructs the system prompt that instructs Claude
// to evaluate user submissions against scenario-specific rubrics.

import type { Scenario } from "@/types";

/**
 * Build the system prompt for Claude evaluation.
 * Must enforce:
 * - Scenario specificity (evaluate against THIS scenario)
 * - Calibration consistency (strict, fair grading)
 * - JSON-only output format
 * - 4-dimension scoring
 *
 * @param scenario - The scenario to build the prompt for
 * @returns The complete system prompt string
 */
export function buildEvaluationPrompt(scenario: Scenario): string {
  // TODO: Implement in Phase 2
  // Return the full system prompt with rubric, constraints, and output format
  throw new Error("Not implemented — Phase 2");
}
