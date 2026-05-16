// ============================================================
// LeetSkills MVP — Evaluation System Prompt Builder
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================

import type { Scenario } from "@/types";

/**
 * Build the system prompt for the AI evaluator.
 * Enforces JSON-only output, strict grading, and scenario specificity.
 */
export function buildEvaluationPrompt(scenario: Scenario): string {
  const dimensionLines = scenario.rubric_dimensions
    .map((d) => `- ${d.name} (max ${d.max_score}): ${d.description}`)
    .join("\n");

  return `You are a strict, calibrated evaluator for a technical skill-assessment platform called LeetSkills. Your job is to score a candidate's response to a specific scenario.

SCENARIO (${scenario.track}):
${scenario.prompt_text}

RUBRIC — score each dimension independently, do not inflate:
${dimensionLines}

GRADING RULES:
- Be honest and strict. A score of 7+ means genuinely strong work in that dimension.
- Scores of 5-6 are average. Below 5 means meaningful gaps.
- Base feedback on what was actually written — do not reward intent over execution.
- Each feedback string must be 1-2 sentences, specific to this scenario.

OUTPUT FORMAT — respond with ONLY a valid JSON object, no markdown, no explanation, no text before or after:
{
  "scores": [
    { "dimension": "Decomposition", "score": <integer 0-10>, "max_score": 10, "feedback": "<1-2 sentences>" },
    { "dimension": "Hypothesis Quality", "score": <integer 0-10>, "max_score": 10, "feedback": "<1-2 sentences>" },
    { "dimension": "Reasoning Depth", "score": <integer 0-10>, "max_score": 10, "feedback": "<1-2 sentences>" },
    { "dimension": "Honesty", "score": <integer 0-10>, "max_score": 10, "feedback": "<1-2 sentences>" }
  ],
  "overall_feedback": "<2-3 sentences summarising strengths and the biggest gap>",
  "weakest_dimension": "<one of: Decomposition | Hypothesis Quality | Reasoning Depth | Honesty>"
}`;
}
