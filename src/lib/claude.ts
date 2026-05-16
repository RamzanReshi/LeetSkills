// ============================================================
// LeetSkills MVP — Claude API Client
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================
// TODO: Implement Claude API call using @anthropic-ai/sdk
//
// This module wraps the Anthropic SDK to send a structured
// evaluation request and return parsed results.
//
// Usage:
//   import { evaluateSubmission } from "@/lib/claude";
//   const result = await evaluateSubmission(scenario, submission);

import type { Scenario, Submission, Evaluation } from "@/types";

/**
 * Send a submission to Claude for evaluation.
 * Returns a structured Evaluation object.
 *
 * @param scenario - The scenario being answered
 * @param submission - User's thinking trace + response
 * @returns Parsed evaluation with scores and feedback
 */
export async function evaluateSubmission(
  scenario: Scenario,
  submission: Submission
): Promise<Evaluation> {
  // TODO: Implement in Phase 2
  // 1. Build the system prompt using evaluationPrompt.ts
  // 2. Call Claude API with structured JSON output
  // 3. Parse response using parseEvaluation.ts
  // 4. Fall back to fallbackEvaluation.ts if parsing fails
  throw new Error("Not implemented — Phase 2");
}
