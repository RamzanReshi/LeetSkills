// ============================================================
// LeetSkills MVP — Zustand Store
// Owner: Reshi (Foundation & Infrastructure)
// ============================================================

import { create } from "zustand";
import type {
  SkillFingerprint,
  Evaluation,
  SessionData,
} from "@/types";
import {
  loadSession,
  saveSession,
  clearSession,
} from "@/utils/localStorage";

interface SkillStore extends SessionData {
  // Actions
  addEvaluation: (evaluation: Evaluation) => void;
  resetSession: () => void;
}

const DEFAULT_FINGERPRINT: SkillFingerprint = {
  Decomposition: 0,
  "Hypothesis Quality": 0,
  "Reasoning Depth": 0,
  Honesty: 0,
};

const initialSession = loadSession();

export const useSkillStore = create<SkillStore>((set) => ({
  fingerprint: initialSession?.fingerprint ?? DEFAULT_FINGERPRINT,
  history: initialSession?.history ?? [],
  completedScenarioIds: initialSession?.completedScenarioIds ?? [],

  addEvaluation: (evaluation: Evaluation) =>
    set((state) => {
      // Recalculate fingerprint as running average
      const newHistory = [...state.history, evaluation];
      const newFingerprint = { ...DEFAULT_FINGERPRINT };

      for (const entry of newHistory) {
        for (const score of entry.scores) {
          newFingerprint[score.dimension] += score.score / score.max_score;
        }
      }

      // Normalize to 0–100 scale
      const count = newHistory.length;
      for (const key of Object.keys(newFingerprint) as Array<keyof SkillFingerprint>) {
        newFingerprint[key] = Math.round((newFingerprint[key] / count) * 100);
      }

      const newState: SessionData = {
        fingerprint: newFingerprint,
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
