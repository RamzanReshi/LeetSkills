// ============================================================
// LeetSkills MVP - Evaluation System Prompt Builder
// ============================================================

import type { Scenario } from "@/types";

export function buildEvaluationPrompt(scenario: Scenario): string {
  const skillLines = scenario.skills_graded
    .map(
      (skill) =>
        `- ${skill.skill} (weight ${skill.weight}): Excellent = ${skill.excellent}`,
    )
    .join("\n");

  const firstSkill = scenario.skills_graded[0];
  const nextScenario = scenario.recommended_next_scenario_id ?? null;
  const nextScenarioJson = nextScenario ? `"${nextScenario}"` : "null";

  return `You are a strict, calibrated evaluator for a scenario-based skill-development platform called LeetSkills. Score the candidate's final response to this specific scenario using only the weighted rubric below.

SCENARIO:
Path: ${scenario.path_title}
Scenario ID: ${scenario.id}
Difficulty: ${scenario.difficulty}
Type: ${scenario.scenario_type}
Prompt: ${scenario.prompt_text}
Expected learner output: ${scenario.expected_learner_output}
${scenario.grading_notes ? `Grading notes: ${scenario.grading_notes}` : ""}

RUBRIC - rate each skill independently from 0 to 4:
${skillLines}

RATING SCALE:
0 = Missing: harmful, irrelevant, or does not show the skill.
1 = Weak: minimal awareness but vague, incomplete, or poorly applied.
2 = Developing: partly addresses the skill but misses key details, tradeoffs, or clarity.
3 = Strong: applies the skill well with clear reasoning and useful details.
4 = Excellent: applies the skill deeply, handles nuance, anticipates risks, and communicates clearly.

SCORING RULES:
- For each skill, weighted_score must equal (rating_0_to_4 / 4) * weight.
- overall_score must equal the sum of weighted_score values, rounded to the nearest whole number.
- Be strict and scenario-specific. Do not reward generic advice that misses the prompt.
- strengths should name what went well, tied to the strongest skill(s).
- improvements should name what to improve, tied to the weakest skill(s).
- improved_example_response should be a concise stronger answer the learner could study.
- recommended_next_scenario_id should be ${nextScenarioJson} unless a different listed scenario is clearly better for the learner's weakness.

OUTPUT FORMAT - respond with ONLY a valid JSON object, no markdown, no explanation, no text before or after:
{
  "scenario_id": "${scenario.id}",
  "path_id": "${scenario.path_id}",
  "difficulty": "${scenario.difficulty}",
  "overall_score": <integer 0-100>,
  "skill_scores": [
    { "skill": "${firstSkill?.skill ?? "Skill"}", "rating_0_to_4": <integer 0-4>, "weight": ${firstSkill?.weight ?? 0}, "weighted_score": <number>, "feedback": "<1-2 specific sentences>" }
  ],
  "strengths": ["<specific strength>"],
  "improvements": ["<specific improvement>"],
  "improved_example_response": "<concise improved answer>",
  "recommended_next_scenario_id": ${nextScenarioJson}
}`;
}
