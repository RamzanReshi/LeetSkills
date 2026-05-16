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

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectStrings(item));
  }

  if (typeof value === "object" && value !== null) {
    return Object.values(value).flatMap((item) => collectStrings(item));
  }

  return [];
}

function coerceStringArray(value: unknown, fallback: string[]): string[] {
  const items = collectStrings(value);
  return items.length > 0 ? items.slice(0, 4) : fallback;
}

function coerceString(value: unknown, fallback: string): string {
  return collectStrings(value)[0] ?? fallback;
}

function normalizeJsonResponse(raw: string): string {
  const trimmed = raw.trim();
  const fence = "```";

  if (trimmed.startsWith(fence)) {
    const firstLineBreak = trimmed.indexOf("\n");
    const closingFence = trimmed.lastIndexOf(fence);

    if (firstLineBreak >= 0 && closingFence > firstLineBreak) {
      return trimmed.slice(firstLineBreak + 1, closingFence).trim();
    }
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

export function parseEvaluation(raw: string, scenario: Scenario): Evaluation {
  let parsed: unknown;
  const json = normalizeJsonResponse(raw);
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error(`parseEvaluation: invalid JSON - ${raw.slice(0, 500)}`);
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

  const strongestScore = [...skillScores].sort(
    (a, b) => b.rating_0_to_4 - a.rating_0_to_4 || b.weight - a.weight,
  )[0];
  const weakestScore = [...skillScores].sort(
    (a, b) => a.rating_0_to_4 - b.rating_0_to_4 || b.weight - a.weight,
  )[0];
  const fallbackStrength = strongestScore
    ? strongestScore.skill + ": " + strongestScore.feedback
    : "Your submission was evaluated against the scenario rubric.";
  const fallbackImprovement = weakestScore
    ? weakestScore.skill + ": " + weakestScore.feedback
    : "Make the response more specific to the scenario prompt and constraints.";

  return {
    scenario_id: scenario.id,
    path_id: scenario.path_id,
    difficulty: scenario.difficulty,
    overall_score: overallScore,
    skill_scores: skillScores,
    strengths: coerceStringArray(obj.strengths, [fallbackStrength]),
    improvements: coerceStringArray(obj.improvements, [fallbackImprovement]),
    improved_example_response: coerceString(
      obj.improved_example_response,
      "A stronger response would directly address the prompt, state assumptions, explain tradeoffs, and provide a concrete next step.",
    ),
    recommended_next_scenario_id: recommended,
    timestamp: Date.now(),
  };
}
