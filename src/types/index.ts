// ============================================================
// LeetSkills MVP — Shared TypeScript Types
// Owner: reshiahmed (Foundation & Infrastructure)
// ============================================================

/** A single scenario stored in scenarios.json */
export interface Scenario {
  id: string;
  track: "first-principles" | "productive-struggle";
  prompt_text: string;
  time_limit_seconds: number;
  rubric_dimensions: RubricDimension[];
}

/** Rubric dimension metadata */
export interface RubricDimension {
  name: DimensionName;
  description: string;
  max_score: number;
}

/** The 4 evaluation axes */
export type DimensionName =
  | "Decomposition"
  | "Hypothesis Quality"
  | "Reasoning Depth"
  | "Honesty";

/** What the user submits */
export interface Submission {
  scenario_id: string;
  thinking_trace: string;
  response: string;
}

/** Score for a single dimension */
export interface DimensionScore {
  dimension: DimensionName;
  score: number;
  max_score: number;
  feedback: string;
}

/** Full evaluation returned by /api/evaluate */
export interface Evaluation {
  scenario_id: string;
  scores: DimensionScore[];
  overall_feedback: string;
  weakest_dimension: DimensionName;
  timestamp: number;
}

/** Skill Fingerprint — aggregated scores across all attempts */
export interface SkillFingerprint {
  Decomposition: number;
  "Hypothesis Quality": number;
  "Reasoning Depth": number;
  Honesty: number;
}

/** Session data persisted in localStorage */
export interface SessionData {
  fingerprint: SkillFingerprint;
  history: Evaluation[];
  completedScenarioIds: string[];
}
