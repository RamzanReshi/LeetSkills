"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompletedAttempt, Evaluation, SkillFingerprint, SkillScore } from "@/types";
import type { Database, Json } from "@/types/supabase";

type Client = SupabaseClient<Database, "leetskill">;
type AttemptRow = Database["leetskill"]["Tables"]["completed_attempts"]["Row"];
type AttemptInsert = Database["leetskill"]["Tables"]["completed_attempts"]["Insert"];

function isDev() {
  return process.env.NODE_ENV !== "production";
}

function logDevError(label: string, error: unknown) {
  if (isDev()) {
    console.warn(`[attemptsSync] ${label}`, error);
  }
}

function isPostgrestError(error: unknown): error is { code?: string } {
  return typeof error === "object" && error !== null && "code" in error;
}

function toIso(ts: number) {
  return new Date(ts).toISOString();
}

function fromIso(iso: string) {
  return new Date(iso).getTime();
}

export function attemptToInsert(
  attempt: CompletedAttempt,
  userId: string,
): AttemptInsert {
  return {
    id: attempt.id,
    user_id: userId,
    scenario_id: attempt.scenario_id,
    path_id: attempt.path_id,
    difficulty: attempt.difficulty,
    thinking_trace: attempt.thinking_trace,
    final_response: attempt.final_response,
    score: attempt.score,
    skill_scores: attempt.skill_scores as unknown as Json,
    ai_feedback: attempt.ai_feedback as unknown as Json,
    fingerprint_before: attempt.fingerprint_before as unknown as Json,
    fingerprint_after: attempt.fingerprint_after as unknown as Json,
    fallback_used: attempt.fallback_used,
    error_state: (attempt.error_state ?? null) as unknown as Json | null,
    started_at: toIso(attempt.timestamps.started_at),
    submitted_at: toIso(attempt.timestamps.submitted_at),
    evaluated_at: toIso(attempt.timestamps.evaluated_at),
    completed_at: toIso(attempt.timestamps.completed_at),
  };
}

export function rowToAttempt(row: AttemptRow): CompletedAttempt {
  const evaluation = row.ai_feedback as unknown as Evaluation;
  return {
    id: row.id,
    scenario_id: row.scenario_id,
    path_id: evaluation.path_id,
    difficulty: evaluation.difficulty,
    user_input: { thinking_trace: row.thinking_trace, response: row.final_response },
    thinking_trace: row.thinking_trace,
    final_response: row.final_response,
    ai_feedback: evaluation,
    score: Number(row.score),
    skill_scores: row.skill_scores as unknown as SkillScore[],
    fingerprint_before: row.fingerprint_before as unknown as SkillFingerprint,
    fingerprint_after: row.fingerprint_after as unknown as SkillFingerprint,
    fallback_used: row.fallback_used,
    error_state: row.error_state ? (row.error_state as unknown as CompletedAttempt["error_state"]) : undefined,
    timestamps: {
      started_at: fromIso(row.started_at),
      submitted_at: fromIso(row.submitted_at),
      evaluated_at: fromIso(row.evaluated_at),
      completed_at: fromIso(row.completed_at),
    },
    completion_status: "completed",
    syncStatus: "synced",
  };
}

export async function insertAttempt(
  client: Client,
  attempt: CompletedAttempt,
  userId: string,
): Promise<boolean> {
  try {
    const { error } = await client
      .from("completed_attempts")
      .upsert(attemptToInsert(attempt, userId), {
        onConflict: "id",
        ignoreDuplicates: true,
      });
    if (error) {
      if (isPostgrestError(error) && error.code === "23505") {
        return true;
      }
      logDevError("insert failed", error);
      return false;
    }
    return true;
  } catch (error) {
    logDevError("insert threw", error);
    return false;
  }
}

export type AttemptsHead = { count: number; maxCompletedAt: string | null };

export async function fetchAttemptsHead(
  client: Client,
  userId: string,
): Promise<AttemptsHead | null> {
  try {
    const { data, error, count } = await client
      .from("completed_attempts")
      .select("completed_at", { count: "exact" })
      .eq("user_id", userId)
      .order("completed_at", { ascending: false })
      .limit(1);
    if (error) {
      logDevError("head fetch failed", error);
      return null;
    }
    return {
      count: count ?? 0,
      maxCompletedAt: data?.[0]?.completed_at ?? null,
    };
  } catch (error) {
    logDevError("head fetch threw", error);
    return null;
  }
}

export async function fetchAttempts(
  client: Client,
  userId: string,
): Promise<CompletedAttempt[] | null> {
  try {
    const { data, error } = await client
      .from("completed_attempts")
      .select("*")
      .eq("user_id", userId)
      .order("completed_at", { ascending: true });
    if (error) {
      logDevError("fetch failed", error);
      return null;
    }
    return (data ?? []).map(rowToAttempt);
  } catch (error) {
    logDevError("fetch threw", error);
    return null;
  }
}
