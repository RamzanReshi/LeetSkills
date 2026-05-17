"use client";

import React from "react";
import Link from "next/link";
import AppShell from "@/components/shell/AppShell";
import FingerprintHero from "@/components/dashboard/FingerprintHero";
import WeakDimensionBanner from "@/components/dashboard/WeakDimensionBanner";
import { MVP_PATHS, MVP_SCENARIOS } from "@/data/mvp-content";
import type { CompletedAttempt, Scenario, ScenarioDraft } from "@/types";
import { useSkillStore } from "@/store/useSkillStore";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/Icons";

const scenarios = MVP_SCENARIOS as Scenario[];
const paths = MVP_PATHS;

function isSameLocalDay(timestamp: number, date = new Date()) {
  const attemptDate = new Date(timestamp);
  return (
    attemptDate.getFullYear() === date.getFullYear() &&
    attemptDate.getMonth() === date.getMonth() &&
    attemptDate.getDate() === date.getDate()
  );
}

function formatLastWorked(timestamp?: number) {
  if (!timestamp) return "No saved draft";

  const diffMs = Date.now() - timestamp;
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function getScenario(id: string) {
  return scenarios.find((scenario) => scenario.id === id) ?? null;
}

function getMostRecentDraft(drafts: Record<string, ScenarioDraft>) {
  return Object.values(drafts).sort((a, b) => b.updated_at - a.updated_at)[0] ?? null;
}

function getWeeklyAttempts(attempts: CompletedAttempt[]) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return attempts.filter((attempt) => attempt.timestamps.completed_at >= weekAgo);
}

export default function DashboardPage() {
  const fingerprint = useSkillStore((s) => s.fingerprint);
  const completedScenarioIds = useSkillStore((s) => s.completedScenarioIds);
  const completedAttempts = useSkillStore((s) => s.completedAttempts);
  const activeDrafts = useSkillStore((s) => s.activeDrafts);

  React.useEffect(() => {
    document.title = "Dashboard - LeetSkills";
  }, []);

  const attemptCount = completedAttempts.length;
  const recentDraft = getMostRecentDraft(activeDrafts);
  const draftScenario = recentDraft ? getScenario(recentDraft.scenario_id) : null;
  const nextScenario =
    draftScenario ??
    scenarios.find((scenario) => !completedScenarioIds.includes(scenario.id)) ??
    null;
  const allCompleted = !nextScenario;
  const focusPath = paths.find((path) => path.id === nextScenario?.path_id) ?? paths[0];
  const focusPathCompleted = focusPath.scenario_ids.filter((id) =>
    completedScenarioIds.includes(id),
  ).length;
  const focusPathTotal = focusPath.scenario_ids.length;
  const focusPathProgress = Math.round((focusPathCompleted / focusPathTotal) * 100);
  const todayAttempts = completedAttempts.filter((attempt) =>
    isSameLocalDay(attempt.timestamps.completed_at),
  );
  const lastAttempt = [...completedAttempts].sort(
    (a, b) => b.timestamps.completed_at - a.timestamps.completed_at,
  )[0];
  const weeklyAttempts = getWeeklyAttempts(completedAttempts);
  const weeklyAverage =
    weeklyAttempts.length === 0
      ? null
      : Math.round(
          weeklyAttempts.reduce((total, attempt) => total + attempt.score, 0) /
            weeklyAttempts.length,
        );
  const actionLabel = draftScenario ? "Resume Draft" : "Continue";

  return (
    <AppShell>
      <main className="flex max-w-full flex-col gap-4 overflow-x-hidden p-4 sm:gap-5 sm:p-6">
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
          <div className="glass-card min-w-0 p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand-primary">
                  Dashboard
                </p>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-brand-deep sm:text-3xl">
                  {nextScenario ? nextScenario.title : "All scenarios complete"}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
                  {nextScenario
                    ? `${nextScenario.path_title} - ${nextScenario.estimated_time} - ${nextScenario.difficulty}`
                    : "You have finished every available scenario. Review your fingerprint and keep an eye on new paths."}
                </p>
              </div>

              {nextScenario && (
                <Link
                  href={`/scenario/${nextScenario.id}`}
                  className="btn-primary inline-flex shrink-0 items-center justify-center gap-2"
                >
                  {actionLabel}
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              )}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  Worked Today
                </p>
                <p className="mt-2 text-2xl font-black text-brand-deep">{todayAttempts.length}</p>
                <p className="mt-1 text-xs text-neutral-500">
                  {todayAttempts.length === 1 ? "scenario completed" : "scenarios completed"}
                </p>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  Left Off
                </p>
                <p className="mt-2 truncate text-sm font-bold text-brand-deep">
                  {draftScenario?.title ?? lastAttempt?.scenario_id ?? "Start your first scenario"}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {draftScenario
                    ? formatLastWorked(recentDraft?.updated_at)
                    : lastAttempt
                      ? `Finished ${formatLastWorked(lastAttempt.timestamps.completed_at)}`
                      : "No activity yet"}
                </p>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  Continue
                </p>
                <p className="mt-2 truncate text-sm font-bold text-brand-deep">
                  {nextScenario?.id ?? "Done"}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {nextScenario ? nextScenario.scenario_type : "Review results"}
                </p>
              </div>

              <div className="rounded-lg border border-brand-primary/20 bg-brand-mint p-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-primary">
                  Do Next
                </p>
                <p className="mt-2 text-sm font-bold text-brand-deep">
                  {draftScenario ? "Finish the open draft" : nextScenario ? "Complete one scenario" : "Review weak skill"}
                </p>
                <p className="mt-1 text-xs text-neutral-600">
                  {nextScenario?.time_limit_seconds
                    ? `${Math.floor(nextScenario.time_limit_seconds / 60)} min focus block`
                    : "Use the fingerprint below"}
                </p>
              </div>
            </div>
          </div>

          <aside className="glass-card min-w-0 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand-primary">
                  Focus Path
                </p>
                <h2 className="mt-2 text-xl font-black tracking-tight text-brand-deep">
                  {focusPath.title}
                </h2>
              </div>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-600">
                {focusPathCompleted}/{focusPathTotal}
              </span>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
                <span>Path progress</span>
                <span>{focusPathProgress}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-brand-primary transition-all"
                  style={{ width: `${focusPathProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-neutral-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  This Week
                </p>
                <p className="mt-2 text-2xl font-black text-brand-deep">{weeklyAttempts.length}</p>
                <p className="mt-1 text-xs text-neutral-500">completed</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  Avg Score
                </p>
                <p className="mt-2 text-2xl font-black text-brand-deep">
                  {weeklyAverage ?? "--"}
                </p>
                <p className="mt-1 text-xs text-neutral-500">last 7 days</p>
              </div>
            </div>

            {allCompleted && (
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-brand-mint px-3 py-2 text-sm font-semibold text-brand-primary">
                <CheckIcon className="h-4 w-4" />
                All current scenarios are complete.
              </div>
            )}
          </aside>
        </section>

        <FingerprintHero fingerprint={fingerprint} attemptCount={attemptCount} />
        <WeakDimensionBanner fingerprint={fingerprint} />
      </main>
    </AppShell>
  );
}
