// ============================================================
// LeetSkills MVP - Zustand Store
// ============================================================

import { create } from "zustand";
import type { Evaluation, SessionData, SkillFingerprint } from "@/types";
import { DASHBOARD_DIMENSIONS, getDashboardDimensionsForSkill } from "@/data/mvp-content";
import { loadSession, saveSession, clearSession } from "@/utils/localStorage";

interface SkillStore extends SessionData {
  addEvaluation: (evaluation: Evaluation) => void;
  resetSession: () => void;
}

const DEFAULT_FINGERPRINT: SkillFingerprint = DASHBOARD_DIMENSIONS.reduce(
  (fingerprint, dimension) => ({
    ...fingerprint,
    [dimension.dimension]: 0,
  }),
  {} as SkillFingerprint,
);

function isEvaluation(value: unknown): value is Evaluation {
  if (typeof value !== "object" || value === null) return false;
  const evaluation = value as Partial<Evaluation>;
  return (
    typeof evaluation.scenario_id === "string" &&
    typeof evaluation.overall_score === "number" &&
    Array.isArray(evaluation.skill_scores)
  );
}

function normalizeSession(session: SessionData | null): SessionData | null {
  if (!session || typeof session !== "object") return null;
  if (!Array.isArray(session.history) || !session.history.every(isEvaluation)) return null;
  if (!Array.isArray(session.completedScenarioIds)) return null;

  return {
    fingerprint: calculateFingerprint(session.history),
    history: session.history,
    completedScenarioIds: session.completedScenarioIds.filter((id): id is string => typeof id === "string"),
  };
}

function calculateFingerprint(history: Evaluation[]): SkillFingerprint {
  const totals = { ...DEFAULT_FINGERPRINT };
  const counts = DASHBOARD_DIMENSIONS.reduce(
    (acc, dimension) => ({ ...acc, [dimension.dimension]: 0 }),
    {} as SkillFingerprint,
  );

  for (const entry of history) {
    for (const score of entry.skill_scores) {
      const dimensions = getDashboardDimensionsForSkill(score.skill);
      const normalizedScore = score.weight > 0 ? (score.weighted_score / score.weight) * 100 : 0;

      for (const dimension of dimensions) {
        totals[dimension] += normalizedScore;
        counts[dimension] += 1;
      }
    }
  }

  for (const dimension of DASHBOARD_DIMENSIONS) {
    const key = dimension.dimension;
    totals[key] = counts[key] > 0 ? Math.round(totals[key] / counts[key]) : 0;
  }

  return totals;
}

const initialSession = normalizeSession(loadSession());

export const useSkillStore = create<SkillStore>((set) => ({
  fingerprint: initialSession?.fingerprint ?? DEFAULT_FINGERPRINT,
  history: initialSession?.history ?? [],
  completedScenarioIds: initialSession?.completedScenarioIds ?? [],

  addEvaluation: (evaluation: Evaluation) =>
    set((state) => {
      const newHistory = [...state.history, evaluation];
      const newState: SessionData = {
        fingerprint: calculateFingerprint(newHistory),
        history: newHistory,
        completedScenarioIds: [
          ...new Set([...state.completedScenarioIds, evaluation.scenario_id]),
        ],
      };

      saveSession(newState);
      return newState;
    }),

  resetSession: () => {
    clearSession();
    set({
      fingerprint: DEFAULT_FINGERPRINT,
      history: [],
      completedScenarioIds: [],
    });
  },
}));
