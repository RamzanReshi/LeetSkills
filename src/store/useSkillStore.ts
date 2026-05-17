// ============================================================
// LeetSkills MVP - Zustand Store
// ============================================================

import { create } from "zustand";
import type {
  AttemptErrorState,
  AttemptSyncStatus,
  CompletedAttempt,
  Evaluation,
  LearningEvent,
  Scenario,
  ScenarioDraft,
  SessionData,
  SkillFingerprint,
  UserInputSnapshot,
} from "@/types";
import { DASHBOARD_DIMENSIONS, getDashboardDimensionsForSkill } from "@/data/mvp-content";
import { loadSession, saveSession, clearSession } from "@/utils/localStorage";
import { createClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchAttempts, fetchAttemptsHead, insertAttempt } from "@/lib/supabase/attemptsSync";

const SYNC_CACHE_KEY = "leetskills_sync_meta";
const SYNC_TTL_MS = 60_000;

type SyncMeta = {
  userId: string;
  count: number;
  maxCompletedAt: string | null;
  syncedAt: number;
};

function loadSyncMeta(): SyncMeta | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SYNC_CACHE_KEY);
    return raw ? (JSON.parse(raw) as SyncMeta) : null;
  } catch {
    return null;
  }
}

function saveSyncMeta(meta: SyncMeta) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SYNC_CACHE_KEY, JSON.stringify(meta));
  } catch {
    // ignore quota
  }
}

const inFlightSyncs = new Map<string, Promise<void>>();

interface SkillStore extends SessionData {
  completedAttempts: CompletedAttempt[];
  events: LearningEvent[];
  activeDrafts: Record<string, ScenarioDraft>;
  hydrated: boolean;
  currentUserId: string | null;
  attemptsSyncing: boolean;
  syncedUserId: string | null;
  hydrateSession: () => void;
  syncWithUser: (userId: string | null) => Promise<void>;
  recordScenarioStarted: (scenarioId: string) => number;
  updateScenarioDraft: (scenarioId: string, userInput: UserInputSnapshot) => void;
  recordScenarioSubmitted: (scenarioId: string, userInput: UserInputSnapshot) => number;
  recordEvaluationFailure: (
    scenarioId: string,
    userInput: UserInputSnapshot,
    errorState: AttemptErrorState,
  ) => void;
  recordRetryStarted: (scenarioId: string) => void;
  completeScenarioAttempt: (input: {
    scenario: Scenario;
    evaluation: Evaluation;
    userInput: UserInputSnapshot;
    startedAt?: number;
    submittedAt?: number;
    fallbackUsed?: boolean;
    errorState?: AttemptErrorState;
  }) => CompletedAttempt;
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

function isCompletedAttempt(value: unknown): value is CompletedAttempt {
  if (typeof value !== "object" || value === null) return false;
  const attempt = value as Partial<CompletedAttempt>;
  return (
    typeof attempt.id === "string" &&
    typeof attempt.scenario_id === "string" &&
    typeof attempt.score === "number" &&
    attempt.completion_status === "completed" &&
    typeof attempt.user_input === "object" &&
    attempt.user_input !== null &&
    isEvaluation(attempt.ai_feedback)
  );
}

function isLearningEvent(value: unknown): value is LearningEvent {
  if (typeof value !== "object" || value === null) return false;
  const event = value as Partial<LearningEvent>;
  return typeof event.id === "string" && typeof event.type === "string" && typeof event.timestamp === "number";
}

function eventId(type: string, scenarioId?: string) {
  const parts = ["evt", type, scenarioId, Date.now(), Math.random().toString(36).slice(2, 8)];
  return parts.filter(Boolean).join("_");
}

function attemptId(scenarioId: string, timestamp: number) {
  return `attempt_${scenarioId}_${timestamp}`;
}

function buildEvent(
  type: LearningEvent["type"],
  scenarioId?: string,
  payload?: Record<string, unknown>,
  timestamp = Date.now(),
): LearningEvent {
  return {
    id: eventId(type, scenarioId),
    type,
    scenario_id: scenarioId,
    timestamp,
    payload,
  };
}

function normalizeSession(session: SessionData | null): SessionData | null {
  if (!session || typeof session !== "object") return null;
  if (!Array.isArray(session.history) || !session.history.every(isEvaluation)) return null;
  if (!Array.isArray(session.completedScenarioIds)) return null;

  const completedAttempts = Array.isArray(session.completedAttempts)
    ? session.completedAttempts.filter(isCompletedAttempt).map((attempt) => ({
        ...attempt,
        syncStatus: attempt.syncStatus === "syncing" ? "local_only" : attempt.syncStatus,
      }))
    : [];
  const history = completedAttempts.length > 0
    ? completedAttempts.map((attempt) => attempt.ai_feedback)
    : session.history;
  const activeDrafts =
    session.activeDrafts && typeof session.activeDrafts === "object"
      ? session.activeDrafts
      : {};
  const events = Array.isArray(session.events) ? session.events.filter(isLearningEvent) : [];

  return {
    fingerprint: calculateFingerprint(history),
    history,
    completedAttempts,
    events,
    activeDrafts,
    completedScenarioIds: [
      ...new Set([
        ...session.completedScenarioIds.filter((id): id is string => typeof id === "string"),
        ...completedAttempts.map((attempt) => attempt.scenario_id),
      ]),
    ],
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

function mergeAttemptsById(
  local: CompletedAttempt[],
  remote: CompletedAttempt[],
): CompletedAttempt[] {
  const byId = new Map<string, CompletedAttempt>();
  for (const a of local) byId.set(a.id, a);
  for (const a of remote) byId.set(a.id, a); // server wins on collision
  return Array.from(byId.values()).sort(
    (a, b) => a.timestamps.completed_at - b.timestamps.completed_at,
  );
}

function attemptsToHistory(attempts: CompletedAttempt[]): Evaluation[] {
  return attempts.map((a) => a.ai_feedback);
}

function attemptsToScenarioIds(attempts: CompletedAttempt[]): string[] {
  return Array.from(new Set(attempts.map((a) => a.scenario_id)));
}

function setAttemptSyncStatus(
  attempts: CompletedAttempt[],
  id: string,
  status: AttemptSyncStatus,
): CompletedAttempt[] {
  return attempts.map((a) => (a.id === id ? { ...a, syncStatus: status } : a));
}

export const useSkillStore = create<SkillStore>((set, get) => ({
  fingerprint: DEFAULT_FINGERPRINT,
  history: [],
  completedAttempts: [],
  events: [],
  activeDrafts: {},
  completedScenarioIds: [],
  hydrated: false,
  currentUserId: null,
  attemptsSyncing: false,
  syncedUserId: null,

  hydrateSession: () => {
    const session = normalizeSession(loadSession(get().currentUserId));
    set({
      fingerprint: session?.fingerprint ?? DEFAULT_FINGERPRINT,
      history: session?.history ?? [],
      completedAttempts: session?.completedAttempts ?? [],
      events: session?.events ?? [],
      activeDrafts: session?.activeDrafts ?? {},
      completedScenarioIds: session?.completedScenarioIds ?? [],
      hydrated: true,
    });
  },

  syncWithUser: async (userId: string | null) => {
    const previousUserId = get().currentUserId;
    if (!get().hydrated || previousUserId !== userId) {
      const session = normalizeSession(loadSession(userId));
      set({
        fingerprint: session?.fingerprint ?? DEFAULT_FINGERPRINT,
        history: session?.history ?? [],
        completedAttempts: session?.completedAttempts ?? [],
        events: session?.events ?? [],
        activeDrafts: session?.activeDrafts ?? {},
        completedScenarioIds: session?.completedScenarioIds ?? [],
        hydrated: true,
        currentUserId: userId,
      });
    } else {
      set({ currentUserId: userId });
    }

    if (!userId || !isSupabaseConfigured) {
      set({ attemptsSyncing: false, syncedUserId: userId });
      return;
    }

    // Dedupe concurrent calls for same user.
    const existing = inFlightSyncs.get(userId);
    if (existing) return existing;

    set({ attemptsSyncing: true });

    const uploadPending = async (client: ReturnType<typeof createClient>) => {
      const pending = get().completedAttempts.filter(
        (a) => a.syncStatus === "local_only" || a.syncStatus === "sync_failed",
      );
      for (const attempt of pending) {
        set((state) => ({
          completedAttempts: setAttemptSyncStatus(state.completedAttempts, attempt.id, "syncing"),
        }));
        const ok = await insertAttempt(client, attempt, userId);
        set((state) => {
          if (state.currentUserId !== userId) return {};
          const updated = setAttemptSyncStatus(
            state.completedAttempts,
            attempt.id,
            ok ? "synced" : "sync_failed",
          );
          const newState: SessionData = {
            fingerprint: state.fingerprint,
            history: state.history,
            completedAttempts: updated,
            events: state.events,
            activeDrafts: state.activeDrafts,
            completedScenarioIds: state.completedScenarioIds,
          };
          saveSession(newState, userId);
          return { completedAttempts: updated };
        });
      }
    };

    const doFullSync = async (
      client: ReturnType<typeof createClient>,
    ): Promise<{ count: number; maxCompletedAt: string | null } | null> => {
      const fetchStartedAt = Date.now();
      const remote = await fetchAttempts(client, userId);
      if (remote === null) return null;

      set((state) => {
        if (state.currentUserId !== userId) return {};
        const safeLocal = state.completedAttempts.filter(
          (a) => a.timestamps.completed_at <= fetchStartedAt,
        );
        const newerLocal = state.completedAttempts.filter(
          (a) => a.timestamps.completed_at > fetchStartedAt,
        );
        const merged = mergeAttemptsById(safeLocal, remote);
        const finalAttempts = mergeAttemptsById(merged, newerLocal);

        const remoteIds = new Set(remote.map((a) => a.id));
        const tagged = finalAttempts.map<CompletedAttempt>((a) => {
          if (remoteIds.has(a.id)) return { ...a, syncStatus: "synced" };
          if (a.syncStatus === "synced") return { ...a, syncStatus: "sync_failed" };
          return { ...a, syncStatus: a.syncStatus ?? "local_only" };
        });

        const newHistory = attemptsToHistory(tagged);
        const newFingerprint = calculateFingerprint(newHistory);
        const newCompletedIds = attemptsToScenarioIds(tagged);

        const newState: SessionData = {
          fingerprint: newFingerprint,
          history: newHistory,
          completedAttempts: tagged,
          events: state.events,
          activeDrafts: state.activeDrafts,
          completedScenarioIds: newCompletedIds,
        };
        saveSession(newState, userId);
        return { ...newState, hydrated: true };
      });

      await uploadPending(client);

      const maxCompletedAt = remote.reduce<string | null>((max, a) => {
        const iso = new Date(a.timestamps.completed_at).toISOString();
        return !max || iso > max ? iso : max;
      }, null);
      return { count: remote.length, maxCompletedAt };
    };

    const run = (async () => {
      const client = createClient();
      const meta = loadSyncMeta();
      const sameUser = meta?.userId === userId;
      const fresh = !!meta && sameUser && Date.now() - meta.syncedAt < SYNC_TTL_MS;

      if (fresh) {
        await uploadPending(client);
        return;
      }

      const head = await fetchAttemptsHead(client, userId);
      if (
        head &&
        meta &&
        sameUser &&
        head.count === meta.count &&
        head.maxCompletedAt === meta.maxCompletedAt
      ) {
        saveSyncMeta({ ...meta, syncedAt: Date.now() });
        await uploadPending(client);
        return;
      }

      const result = await doFullSync(client);
      if (result) {
        saveSyncMeta({
          userId,
          count: result.count,
          maxCompletedAt: result.maxCompletedAt,
          syncedAt: Date.now(),
        });
      }
    })();

    inFlightSyncs.set(userId, run);
    try {
      await run;
    } finally {
      inFlightSyncs.delete(userId);
      set({ attemptsSyncing: false, syncedUserId: userId });
    }
  },

  recordScenarioStarted: (scenarioId: string) => {
    const timestamp = Date.now();
    set((state) => {
      const savedSession = state.hydrated ? null : normalizeSession(loadSession(state.currentUserId));
      const baseActiveDrafts = savedSession?.activeDrafts ?? state.activeDrafts;
      const newState: SessionData = {
        fingerprint: savedSession?.fingerprint ?? state.fingerprint,
        history: savedSession?.history ?? state.history,
        completedAttempts: savedSession?.completedAttempts ?? state.completedAttempts,
        completedScenarioIds: savedSession?.completedScenarioIds ?? state.completedScenarioIds,
        events: [
          ...(savedSession?.events ?? state.events),
          buildEvent("scenario_started", scenarioId, undefined, timestamp),
        ],
        activeDrafts: {
          ...baseActiveDrafts,
          [scenarioId]: {
            scenario_id: scenarioId,
            user_input: baseActiveDrafts[scenarioId]?.user_input ?? {
              thinking_trace: "",
              response: "",
            },
            started_at: baseActiveDrafts[scenarioId]?.started_at ?? timestamp,
            updated_at: timestamp,
          },
        },
      };
      saveSession(newState, state.currentUserId);
      return { ...newState, hydrated: true };
    });
    return timestamp;
  },

  updateScenarioDraft: (scenarioId: string, userInput: UserInputSnapshot) =>
    set((state) => {
      const savedSession = state.hydrated ? null : normalizeSession(loadSession(state.currentUserId));
      const timestamp = Date.now();
      const baseActiveDrafts = savedSession?.activeDrafts ?? state.activeDrafts;
      const current = baseActiveDrafts[scenarioId];
      const newState: SessionData = {
        fingerprint: savedSession?.fingerprint ?? state.fingerprint,
        history: savedSession?.history ?? state.history,
        completedAttempts: savedSession?.completedAttempts ?? state.completedAttempts,
        completedScenarioIds: savedSession?.completedScenarioIds ?? state.completedScenarioIds,
        events: [
          ...(savedSession?.events ?? state.events),
          buildEvent("draft_updated", scenarioId, { has_response: userInput.response.trim().length > 0 }, timestamp),
        ],
        activeDrafts: {
          ...baseActiveDrafts,
          [scenarioId]: {
            scenario_id: scenarioId,
            user_input: userInput,
            started_at: current?.started_at ?? timestamp,
            submitted_at: current?.submitted_at,
            last_failure: current?.last_failure,
            updated_at: timestamp,
          },
        },
      };
      saveSession(newState, state.currentUserId);
      return { ...newState, hydrated: true };
    }),

  recordScenarioSubmitted: (scenarioId: string, userInput: UserInputSnapshot) => {
    const timestamp = Date.now();
    set((state) => {
      const savedSession = state.hydrated ? null : normalizeSession(loadSession(state.currentUserId));
      const baseActiveDrafts = savedSession?.activeDrafts ?? state.activeDrafts;
      const current = baseActiveDrafts[scenarioId];
      const newState: SessionData = {
        fingerprint: savedSession?.fingerprint ?? state.fingerprint,
        history: savedSession?.history ?? state.history,
        completedAttempts: savedSession?.completedAttempts ?? state.completedAttempts,
        completedScenarioIds: savedSession?.completedScenarioIds ?? state.completedScenarioIds,
        events: [
          ...(savedSession?.events ?? state.events),
          buildEvent("scenario_submitted", scenarioId, undefined, timestamp),
        ],
        activeDrafts: {
          ...baseActiveDrafts,
          [scenarioId]: {
            scenario_id: scenarioId,
            user_input: userInput,
            started_at: current?.started_at ?? timestamp,
            submitted_at: timestamp,
            updated_at: timestamp,
          },
        },
      };
      saveSession(newState, state.currentUserId);
      return { ...newState, hydrated: true };
    });
    return timestamp;
  },

  recordEvaluationFailure: (scenarioId, userInput, errorState) =>
    set((state) => {
      const savedSession = state.hydrated ? null : normalizeSession(loadSession(state.currentUserId));
      const timestamp = Date.now();
      const baseActiveDrafts = savedSession?.activeDrafts ?? state.activeDrafts;
      const current = baseActiveDrafts[scenarioId];
      const newState: SessionData = {
        fingerprint: savedSession?.fingerprint ?? state.fingerprint,
        history: savedSession?.history ?? state.history,
        completedAttempts: savedSession?.completedAttempts ?? state.completedAttempts,
        completedScenarioIds: savedSession?.completedScenarioIds ?? state.completedScenarioIds,
        events: [
          ...(savedSession?.events ?? state.events),
          buildEvent("ai_evaluation_failed", scenarioId, { message: errorState.message }, timestamp),
        ],
        activeDrafts: {
          ...baseActiveDrafts,
          [scenarioId]: {
            scenario_id: scenarioId,
            user_input: userInput,
            started_at: current?.started_at ?? timestamp,
            submitted_at: current?.submitted_at,
            updated_at: timestamp,
            last_failure: errorState,
          },
        },
      };
      saveSession(newState, state.currentUserId);
      return { ...newState, hydrated: true };
    }),

  recordRetryStarted: (scenarioId) =>
    set((state) => {
      const savedSession = state.hydrated ? null : normalizeSession(loadSession(state.currentUserId));
      const newState: SessionData = {
        fingerprint: savedSession?.fingerprint ?? state.fingerprint,
        history: savedSession?.history ?? state.history,
        completedAttempts: savedSession?.completedAttempts ?? state.completedAttempts,
        completedScenarioIds: savedSession?.completedScenarioIds ?? state.completedScenarioIds,
        events: [
          ...(savedSession?.events ?? state.events),
          buildEvent("retry_started", scenarioId),
        ],
        activeDrafts: savedSession?.activeDrafts ?? state.activeDrafts,
      };
      saveSession(newState, state.currentUserId);
      return { ...newState, hydrated: true };
    }),

  completeScenarioAttempt: ({
    scenario,
    evaluation,
    userInput,
    startedAt,
    submittedAt,
    fallbackUsed = false,
    errorState,
  }) => {
    const completedAt = Date.now();
    const evaluatedAt = evaluation.timestamp || completedAt;
    let completedAttempt: CompletedAttempt | null = null;

    set((state) => {
      const savedSession = state.hydrated ? null : normalizeSession(loadSession(state.currentUserId));
      const baseHistory = savedSession?.history ?? state.history;
      const baseCompletedAttempts = savedSession?.completedAttempts ?? state.completedAttempts;
      const baseCompletedScenarioIds = savedSession?.completedScenarioIds ?? state.completedScenarioIds;
      const baseActiveDrafts = savedSession?.activeDrafts ?? state.activeDrafts;
      const baseEvents = savedSession?.events ?? state.events;
      const currentDraft = baseActiveDrafts[scenario.id];
      const fingerprintBefore = calculateFingerprint(baseHistory);
      const newHistory = [...baseHistory, evaluation];
      const fingerprintAfter = calculateFingerprint(newHistory);
      const userId = get().currentUserId;
      const attempt: CompletedAttempt = {
        id: attemptId(scenario.id, completedAt),
        scenario_id: scenario.id,
        path_id: scenario.path_id,
        difficulty: scenario.difficulty,
        user_input: userInput,
        thinking_trace: userInput.thinking_trace,
        final_response: userInput.response,
        ai_feedback: evaluation,
        score: evaluation.overall_score,
        skill_scores: evaluation.skill_scores,
        fingerprint_before: fingerprintBefore,
        fingerprint_after: fingerprintAfter,
        fallback_used: fallbackUsed,
        error_state: errorState,
        timestamps: {
          started_at: startedAt ?? currentDraft?.started_at ?? completedAt,
          submitted_at: submittedAt ?? currentDraft?.submitted_at ?? completedAt,
          evaluated_at: evaluatedAt,
          completed_at: completedAt,
        },
        completion_status: "completed",
        syncStatus: userId ? "syncing" : "local_only",
      };
      completedAttempt = attempt;

      const remainingDrafts = { ...baseActiveDrafts };
      delete remainingDrafts[scenario.id];
      const newState: SessionData = {
        fingerprint: fingerprintAfter,
        history: newHistory,
        completedAttempts: [...baseCompletedAttempts, attempt],
        completedScenarioIds: [...new Set([...baseCompletedScenarioIds, scenario.id])],
        activeDrafts: remainingDrafts,
        events: [
          ...baseEvents,
          buildEvent("ai_evaluation_completed", scenario.id, { attempt_id: attempt.id, fallback_used: fallbackUsed }, evaluatedAt),
          buildEvent("scenario_completed", scenario.id, { attempt_id: attempt.id }, completedAt),
        ],
      };

      saveSession(newState, state.currentUserId);
      return { ...newState, hydrated: true };
    });

    const result: CompletedAttempt | null = completedAttempt;
    if (!result) {
      throw new Error("Unable to complete scenario attempt.");
    }

    const userId = get().currentUserId;
    if (userId && isSupabaseConfigured) {
      const toSync: CompletedAttempt = result;
      void (async () => {
        try {
          const client = createClient();
          const ok = await insertAttempt(client, toSync, userId);
          set((state) => {
            if (state.currentUserId !== userId) return {};
            const updated = setAttemptSyncStatus(
              state.completedAttempts,
              toSync.id,
              ok ? "synced" : "sync_failed",
            );
            const newState: SessionData = {
              fingerprint: state.fingerprint,
              history: state.history,
              completedAttempts: updated,
              events: state.events,
              activeDrafts: state.activeDrafts,
              completedScenarioIds: state.completedScenarioIds,
            };
            saveSession(newState, userId);
            return { completedAttempts: updated };
          });
        } catch (error) {
          if (process.env.NODE_ENV !== "production") {
            console.error("[useSkillStore] remote insert threw", error);
          }
          set((state) => {
            if (state.currentUserId !== userId) return {};
            const updated = setAttemptSyncStatus(
              state.completedAttempts,
              toSync.id,
              "sync_failed",
            );
            const newState: SessionData = {
              fingerprint: state.fingerprint,
              history: state.history,
              completedAttempts: updated,
              events: state.events,
              activeDrafts: state.activeDrafts,
              completedScenarioIds: state.completedScenarioIds,
            };
            saveSession(newState, userId);
            return { completedAttempts: updated };
          });
        }
      })();
    }

    return result;
  },

  resetSession: () => {
    const userId = get().currentUserId;
    const newState: SessionData = {
      fingerprint: DEFAULT_FINGERPRINT,
      history: [],
      completedAttempts: [],
      events: [buildEvent("session_reset")],
      activeDrafts: {},
      completedScenarioIds: [],
    };
    clearSession(userId);
    if (typeof window !== "undefined") {
      try { localStorage.removeItem(SYNC_CACHE_KEY); } catch { /* ignore */ }
    }
    saveSession(newState, userId);
    set({ ...newState, hydrated: true, syncedUserId: null });
  },
}));
