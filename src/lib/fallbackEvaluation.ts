// ============================================================
// LeetSkills MVP - Fallback Evaluation
// ============================================================

import type { Evaluation, Scenario } from "@/types";

export function getFallbackEvaluation(scenario: Scenario): Evaluation {
  const placeholder =
    "AI evaluation was temporarily unavailable. This neutral placeholder preserves the attempt; resubmit later for a calibrated score.";

  const skill_scores = scenario.skills_graded.map((skill) => ({
    skill: skill.skill,
    rating_0_to_4: 2,
    weight: skill.weight,
    weighted_score: Number(((2 / 4) * skill.weight).toFixed(2)),
    feedback: placeholder,
  }));

  return {
    scenario_id: scenario.id,
    path_id: scenario.path_id,
    difficulty: scenario.difficulty,
    overall_score: Math.round(skill_scores.reduce((total, score) => total + score.weighted_score, 0)),
    skill_scores,
    strengths: ["Your submission was recorded, but live AI feedback was unavailable."],
    improvements: ["Resubmit this scenario later to receive specific skill-level feedback."],
    improved_example_response:
      "A stronger response would directly address the prompt, make assumptions explicit, explain tradeoffs, and provide a concrete next step.",
    recommended_next_scenario_id: scenario.recommended_next_scenario_id,
    timestamp: Date.now(),
  };
}
