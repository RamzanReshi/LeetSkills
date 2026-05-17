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

export type LearningEventType =
  | "scenario_started"
  | "draft_updated"
  | "scenario_submitted"
  | "ai_evaluation_completed"
  | "ai_evaluation_failed"
  | "retry_started"
  | "scenario_completed"
  | "session_reset";

export interface UserInputSnapshot {
  thinking_trace: string;
  response: string;
}

export interface AttemptErrorState {
  message: string;
  code?: string;
  action?: string;
  provider?: string;
  provider_status?: number;
  model?: string;
  retryable?: boolean;
  failure_count?: number;
  fallback_used: boolean;
}

export interface LearningEvent {
  id: string;
  type: LearningEventType;
  scenario_id?: string;
  timestamp: number;
  payload?: Record<string, unknown>;
}

export interface ScenarioDraft {
  scenario_id: string;
  user_input: UserInputSnapshot;
  started_at: number;
  updated_at: number;
  submitted_at?: number;
  last_failure?: AttemptErrorState;
}

export type AttemptSyncStatus =
  | "local_only"
  | "syncing"
  | "synced"
  | "sync_failed";

export interface CompletedAttempt {
  id: string;
  scenario_id: string;
  path_id: Scenario["path_id"];
  difficulty: Scenario["difficulty"];
  user_input: UserInputSnapshot;
  thinking_trace: string;
  final_response: string;
  ai_feedback: Evaluation;
  score: number;
  skill_scores: SkillScore[];
  fingerprint_before: SkillFingerprint;
  fingerprint_after: SkillFingerprint;
  fallback_used: boolean;
  error_state?: AttemptErrorState;
  timestamps: {
    started_at: number;
    submitted_at: number;
    evaluated_at: number;
    completed_at: number;
  };
  completion_status: "completed";
  /** Local-only field. Never sent to Supabase. */
  syncStatus?: AttemptSyncStatus;
}

/** Skill Fingerprint - aggregated scores across all attempts */
export type DimensionName = DashboardDimension;

export type SkillFingerprint = Record<DashboardDimension, number>;

/** Session data persisted in localStorage */
export interface SessionData {
  fingerprint: SkillFingerprint;
  history: Evaluation[];
  completedAttempts?: CompletedAttempt[];
  events?: LearningEvent[];
  activeDrafts?: Record<string, ScenarioDraft>;
  completedScenarioIds: string[];
}
