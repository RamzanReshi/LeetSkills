// ============================================================
// LeetSkills MVP - Evaluation System Prompt Builder
// ============================================================

import type { Scenario } from "@/types";

const LANGUAGE_NAMES: Record<string, string> = {
  en: "English",
  ar: "Arabic",
  tr: "Turkish",
};

export function buildEvaluationPrompt(scenario: Scenario, locale: string = "en"): string {
  const languageName = LANGUAGE_NAMES[locale] ?? "English";
  const localizationLine =
    locale !== "en"
      ? `\nLOCALIZATION:\n- All natural-language string values you produce (skill_scores[].feedback, strengths[], improvements[], improved_example_response) MUST be written in ${languageName}. Do not translate JSON keys, scenario_id, path_id, difficulty enum values, skill names, or numeric scores — those must remain exactly as specified. Write feedback in ${languageName} regardless of the language the candidate's response is written in.\n`
      : "";
  const skillLines = scenario.skills_graded
    .map(
      (skill) =>
        `- ${skill.skill} (weight ${skill.weight}): Excellent = ${skill.excellent}`,
    )
    .join("\n");

  const nextScenario = scenario.recommended_next_scenario_id ?? null;
  const nextScenarioJson = nextScenario ? `"${nextScenario}"` : "null";
  const skillScoreTemplate = scenario.skills_graded
    .map(
      (skill) =>
        `    { "skill": "${skill.skill}", "rating_0_to_4": <integer 0-4>, "weight": ${skill.weight}, "weighted_score": <number>, "feedback": "<1-2 specific sentences>" }`,
    )
    .join(",\n");

  return `You are a strict, calibrated evaluator for a scenario-based skill-development platform called LeetSkills. Score the candidate's final response to this specific scenario using only the weighted rubric below.${localizationLine}

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
- skill_scores must include exactly one object for every rubric skill, in the same order shown below.
- Be strict and scenario-specific. Do not reward generic advice that misses the prompt.
- strengths must be a non-empty JSON array of strings naming what went well, tied to the strongest skill(s).
- improvements must be a non-empty JSON array of strings naming what to improve, tied to the weakest skill(s).
- improved_example_response must be a concise stronger answer string the learner could study.
- recommended_next_scenario_id should be ${nextScenarioJson} unless a different listed scenario is clearly better for the learner's weakness.

OUTPUT FORMAT - respond with ONLY a valid JSON object, no markdown, no explanation, no text before or after:
{
  "scenario_id": "${scenario.id}",
  "path_id": "${scenario.path_id}",
  "difficulty": "${scenario.difficulty}",
  "overall_score": <integer 0-100>,
  "skill_scores": [
${skillScoreTemplate}
  ],
  "strengths": ["<specific strength>"],
  "improvements": ["<specific improvement>"],
  "improved_example_response": "<concise improved answer>",
  "recommended_next_scenario_id": ${nextScenarioJson}
}`;
}
