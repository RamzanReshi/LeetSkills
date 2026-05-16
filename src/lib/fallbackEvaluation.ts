// ============================================================
// LeetSkills MVP — Fallback Evaluation
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================
// TODO: Implement cached/default fallback evaluation
//
// This module provides a reliable fallback when the Claude API
// call fails or response parsing fails, ensuring the product
// loop never breaks for the user.

import type { Evaluation } from "@/types";

/**
 * Returns a neutral mid-range evaluation when live AI evaluation fails.
 * The user always gets a result — the pipeline never breaks.
 */
export function getFallbackEvaluation(scenarioId: string): Evaluation {
  const placeholder =
    "AI evaluation was temporarily unavailable. This is a placeholder score — resubmit to get a real evaluation.";

  return {
    scenario_id: scenarioId,
    scores: [
      { dimension: "Decomposition", score: 5, max_score: 10, feedback: placeholder },
      { dimension: "Hypothesis Quality", score: 5, max_score: 10, feedback: placeholder },
      { dimension: "Reasoning Depth", score: 5, max_score: 10, feedback: placeholder },
      { dimension: "Honesty", score: 5, max_score: 10, feedback: placeholder },
    ],
    overall_feedback:
      "Live AI evaluation was unavailable when you submitted. Scores are neutral placeholders (5/10 across all dimensions). Your submission was recorded — try again to receive real feedback.",
    weakest_dimension: "Honesty",
    timestamp: Date.now(),
  };
}
