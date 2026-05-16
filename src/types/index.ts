// ============================================================
// LeetSkills MVP - Shared TypeScript Types
// ============================================================

import type { DashboardDimension, MvpScenario } from "@/data/mvp-content";

/** A single canonical MVP scenario. */
export interface Scenario {
  id: string;
  path_id: MvpScenario["path_id"];
  path_title: string;
  title: string;
  difficulty: MvpScenario["difficulty"];
  scenario_type: string;
  estimated_time: string;
  prompt_text: string;
  time_limit_seconds: number;
  expected_learner_output: string;
  skills_graded: SkillRubric[];
  grading_notes?: string;
  recommended_next_scenario_id?: string;
}

/** Scenario-level weighted skill rubric. */
export interface SkillRubric {
  skill: string;
  weight: number;
  excellent: string;
}

/** What the user submits */
export interface Submission {
  scenario_id: string;
  thinking_trace: string;
  response: string;
}

/** Score for a single weighted scenario skill. */
export interface SkillScore {
  skill: string;
  rating_0_to_4: number;
  weight: number;
  weighted_score: number;
  feedback: string;
}

/** Full evaluation returned by /api/evaluate */
export interface Evaluation {
  scenario_id: string;
  path_id: Scenario["path_id"];
  difficulty: Scenario["difficulty"];
  overall_score: number;
  skill_scores: SkillScore[];
  strengths: string[];
  improvements: string[];
  improved_example_response: string;
  recommended_next_scenario_id?: string;
  timestamp: number;
}

/** Skill Fingerprint - aggregated scores across all attempts */
export type DimensionName = DashboardDimension;

export type SkillFingerprint = Record<DashboardDimension, number>;

/** Session data persisted in localStorage */
export interface SessionData {
  fingerprint: SkillFingerprint;
  history: Evaluation[];
  completedScenarioIds: string[];
}
