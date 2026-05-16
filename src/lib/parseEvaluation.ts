// ============================================================
// LeetSkills MVP - Evaluation Response Parser
// ============================================================

import { MVP_SCENARIOS } from "@/data/mvp-content";
import type { Evaluation, Scenario, SkillScore } from "@/types";

const VALID_SCENARIO_IDS = new Set(MVP_SCENARIOS.map((scenario) => scenario.id));
const FLOAT_TOLERANCE = 0.76;

function asRecord(value: unknown, message: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null) throw new Error(message);
  return value as Record<string, unknown>;
}

function requireString(value: unknown, message: string): string {
  if (typeof value !== "string" || value.trim().length === 0) throw new Error(message);
  return value.trim();
}

function requireNumber(value: unknown, message: string): number {
  if (typeof value !== "number" || Number.isNaN(value)) throw new Error(message);
  return value;
}

function requireStringArray(value: unknown, message: string): string[] {
  if (!Array.isArray(value) || value.length === 0) throw new Error(message);
  return value.map((item) => requireString(item, message));
}

export function parseEvaluation(raw: string, scenario: Scenario): Evaluation {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`parseEvaluation: invalid JSON - ${raw.slice(0, 120)}`);
  }

  const obj = asRecord(parsed, "parseEvaluation: response is not an object");

  if (obj.scenario_id !== scenario.id) {
    throw new Error(`parseEvaluation: scenario_id must be ${scenario.id}`);
  }
  if (obj.path_id !== scenario.path_id) {
    throw new Error(`parseEvaluation: path_id must be ${scenario.path_id}`);
  }
  if (obj.difficulty !== scenario.difficulty) {
    throw new Error(`parseEvaluation: difficulty must be ${scenario.difficulty}`);
  }

  if (!Array.isArray(obj.skill_scores)) {
    throw new Error("parseEvaluation: skill_scores must be an array");
  }
  if (obj.skill_scores.length !== scenario.skills_graded.length) {
    throw new Error("parseEvaluation: skill_scores length must match scenario rubric");
  }

  const skillScores: SkillScore[] = obj.skill_scores.map((item, index) => {
    const score = asRecord(item, "parseEvaluation: each skill score must be an object");
    const expected = scenario.skills_graded[index];
    const skill = requireString(score.skill, "parseEvaluation: skill must be a non-empty string");
    if (skill !== expected.skill) {
      throw new Error(`parseEvaluation: expected skill ${expected.skill}, got ${skill}`);
    }

    const rating = requireNumber(score.rating_0_to_4, "parseEvaluation: rating_0_to_4 must be a number");
    if (!Number.isInteger(rating) || rating < 0 || rating > 4) {
      throw new Error("parseEvaluation: rating_0_to_4 must be an integer from 0 to 4");
    }

    const weight = requireNumber(score.weight, "parseEvaluation: weight must be a number");
    if (weight !== expected.weight) {
      throw new Error(`parseEvaluation: expected weight ${expected.weight}, got ${weight}`);
    }

    const weightedScore = requireNumber(score.weighted_score, "parseEvaluation: weighted_score must be a number");
    const expectedWeightedScore = (rating / 4) * weight;
    if (Math.abs(weightedScore - expectedWeightedScore) > FLOAT_TOLERANCE) {
      throw new Error("parseEvaluation: weighted_score does not match rating and weight");
    }

    return {
      skill,
      rating_0_to_4: rating,
      weight,
      weighted_score: Number(weightedScore.toFixed(2)),
      feedback: requireString(score.feedback, "parseEvaluation: feedback must be a non-empty string"),
    };
  });

  const overallScore = requireNumber(obj.overall_score, "parseEvaluation: overall_score must be a number");
  if (!Number.isInteger(overallScore) || overallScore < 0 || overallScore > 100) {
    throw new Error("parseEvaluation: overall_score must be an integer from 0 to 100");
  }

  const calculatedOverall = Math.round(
    skillScores.reduce((total, score) => total + score.weighted_score, 0),
  );
  if (Math.abs(overallScore - calculatedOverall) > 1) {
    throw new Error("parseEvaluation: overall_score does not match skill_scores");
  }

  const recommended =
    typeof obj.recommended_next_scenario_id === "string"
      ? obj.recommended_next_scenario_id.trim()
      : undefined;
  if (recommended && !VALID_SCENARIO_IDS.has(recommended)) {
    throw new Error(`parseEvaluation: recommended_next_scenario_id ${recommended} is unknown`);
  }

  return {
    scenario_id: scenario.id,
    path_id: scenario.path_id,
    difficulty: scenario.difficulty,
    overall_score: overallScore,
    skill_scores: skillScores,
    strengths: requireStringArray(obj.strengths, "parseEvaluation: strengths must be a non-empty string array"),
    improvements: requireStringArray(obj.improvements, "parseEvaluation: improvements must be a non-empty string array"),
    improved_example_response: requireString(
      obj.improved_example_response,
      "parseEvaluation: improved_example_response must be a non-empty string",
    ),
    recommended_next_scenario_id: recommended,
    timestamp: Date.now(),
  };
}
