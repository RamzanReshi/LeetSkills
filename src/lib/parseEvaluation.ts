// ============================================================
// LeetSkills MVP — Evaluation Response Parser
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================
// TODO: Implement JSON response parser with validation
//
// This module parses Claude's JSON response into a typed
// Evaluation object, with validation and error handling.

import type { Evaluation, DimensionName } from "@/types";

const VALID_DIMENSIONS: DimensionName[] = [
  "Decomposition",
  "Hypothesis Quality",
  "Reasoning Depth",
  "Honesty",
];

/**
 * Parse and validate an AI provider's raw JSON response into a typed Evaluation.
 * @throws Error with a descriptive message if the response is malformed or out of range.
 */
export function parseEvaluation(raw: string, scenarioId: string): Evaluation {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`parseEvaluation: invalid JSON — ${raw.slice(0, 120)}`);
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("parseEvaluation: response is not an object");
  }

  const obj = parsed as Record<string, unknown>;

  if (!Array.isArray(obj.scores) || obj.scores.length !== 4) {
    throw new Error("parseEvaluation: scores must be an array of exactly 4 items");
  }

  for (const item of obj.scores) {
    if (typeof item !== "object" || item === null) {
      throw new Error("parseEvaluation: each score entry must be an object");
    }
    const s = item as Record<string, unknown>;

    if (!VALID_DIMENSIONS.includes(s.dimension as DimensionName)) {
      throw new Error(`parseEvaluation: unknown dimension "${s.dimension}"`);
    }
    if (typeof s.score !== "number" || typeof s.max_score !== "number") {
      throw new Error("parseEvaluation: score and max_score must be numbers");
    }
    if (s.score < 0 || s.score > s.max_score) {
      throw new Error(
        `parseEvaluation: score ${s.score} out of range [0, ${s.max_score}]`
      );
    }
    if (typeof s.feedback !== "string" || s.feedback.trim().length === 0) {
      throw new Error("parseEvaluation: feedback must be a non-empty string");
    }
  }

  if (
    typeof obj.overall_feedback !== "string" ||
    obj.overall_feedback.trim().length === 0
  ) {
    throw new Error("parseEvaluation: overall_feedback must be a non-empty string");
  }

  if (!VALID_DIMENSIONS.includes(obj.weakest_dimension as DimensionName)) {
    throw new Error(
      `parseEvaluation: weakest_dimension "${obj.weakest_dimension}" is not valid`
    );
  }

  return {
    scenario_id: scenarioId,
    scores: obj.scores as Evaluation["scores"],
    overall_feedback: obj.overall_feedback as string,
    weakest_dimension: obj.weakest_dimension as DimensionName,
    timestamp: Date.now(),
  };
}
