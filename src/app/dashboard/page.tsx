"use client";

import React from "react";
import Link from "next/link";
import AppShell from "@/components/shell/AppShell";
import SkillRadarChart from "@/components/fingerprint/SkillRadarChart";
import { MVP_PATHS, MVP_SCENARIOS } from "@/data/mvp-content";
import type { CompletedAttempt, DimensionName, Scenario, ScenarioDraft, SkillFingerprint } from "@/types";
import { useSkillStore } from "@/store/useSkillStore";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/Icons";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useLocalizeScenario, useDifficultyLabel } from "@/i18n/content";

const scenarios = MVP_SCENARIOS as Scenario[];
const paths = MVP_PATHS;

function formatLastWorked(t: (k: string, v?: Record<string, string | number>) => string, timestamp?: number) {
  if (!timestamp) return t("dashboard.noSavedDraft");

  const diffMs = Date.now() - timestamp;
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) return t("dashboard.minAgo", { n: minutes });

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t("dashboard.hrAgo", { n: hours });

  const days = Math.floor(hours / 24);
  return days === 1 ? t("dashboard.dayAgo", { n: days }) : t("dashboard.daysAgo", { n: days });
}

function getScenario(id: string) {
  return scenarios.find((scenario) => scenario.id === id) ?? null;
}

function getMostRecentDraft(drafts: Record<string, ScenarioDraft>) {
  return Object.values(drafts).sort((a, b) => b.updated_at - a.updated_at)[0] ?? null;
}

function formatEstimatedTime(value: string) {
  return value.replace(" minutes", " min").replace(" minute", " min");
}

function getWeeklyAttempts(attempts: CompletedAttempt[]) {
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return attempts.filter((attempt) => attempt.timestamps.completed_at >= weekAgo);
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalizeFingerprint(fingerprint: Record<DimensionName, number>) {
  return Object.fromEntries(
    Object.entries(fingerprint).map(([dimension, score]) => [dimension, clampScore(score)]),
  ) as SkillFingerprint;
}

function getCurrentStreak(attempts: CompletedAttempt[]) {
  const completedDays = new Set(
    attempts.map((attempt) => new Date(attempt.timestamps.completed_at).toDateString()),
  );
  let streak = 0;
  const cursor = new Date();

  while (completedDays.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function getFingerprintSummary(fingerprint: Record<DimensionName, number>, attemptCount: number) {
  const dimensions = (Object.entries(fingerprint) as [DimensionName, number][])
    .map(([dimension, score]) => [dimension, clampScore(score)] as [DimensionName, number]);
  const scored = dimensions.filter(([, score]) => score > 0);
  const average =
    attemptCount === 0 || scored.length === 0
      ? null
      : Math.round(scored.reduce((total, [, score]) => total + score, 0) / scored.length);
  const strongest = scored.length > 0 ? [...scored].sort((a, b) => b[1] - a[1])[0] : null;
  const weakest = scored.length > 0 ? [...scored].sort((a, b) => a[1] - b[1])[0] : null;

  let levelKey = "dashboard.level.start";
  if (average !== null) {
    if (average >= 85) levelKey = "dashboard.level.advanced";
    else if (average >= 70) levelKey = "dashboard.level.proficient";
    else if (average >= 50) levelKey = "dashboard.level.developing";
    else levelKey = "dashboard.level.building";
  }

  return { average, levelKey, strongest, weakest };
}

function getScenarioPathProgress(pathId: Scenario["path_id"], completedScenarioIds: string[]) {
  const path = paths.find((item) => item.id === pathId) ?? paths[0];
  const completed = path.scenario_ids.filter((id) => completedScenarioIds.includes(id)).length;
  const total = path.scenario_ids.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { path, completed, total, percent };
}

function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`rounded-full bg-neutral-100 ${className}`} />;
}

function DashboardSkeleton() {
  return (
    <AppShell>
      <main
        className="flex max-w-full animate-pulse flex-col gap-4 overflow-x-hidden p-4 sm:gap-5 sm:p-6"
        aria-busy="true"
      >
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
          <div className="glass-card min-w-0 p-5 sm:p-6">
            <SkeletonLine className="h-3 w-36" />
            <SkeletonLine className="mt-4 h-8 w-2/3 max-w-md" />
            <SkeletonLine className="mt-4 h-4 w-full max-w-xl" />
            <SkeletonLine className="mt-3 h-4 w-5/6 max-w-lg" />
            <div className="mt-8 flex items-center justify-between">
              <SkeletonLine className="h-3 w-24" />
              <SkeletonLine className="h-3 w-12" />
            </div>
            <SkeletonLine className="mt-3 h-2 w-full" />
            <div className="mt-6 flex gap-3">
              <SkeletonLine className="h-11 w-40 rounded-lg" />
              <SkeletonLine className="h-11 w-28 rounded-lg" />
            </div>
          </div>

          <aside className="glass-card min-w-0 p-5 sm:p-6">
            <SkeletonLine className="h-3 w-28" />
            <SkeletonLine className="mt-4 h-6 w-56" />
            <SkeletonLine className="mt-5 h-4 w-full" />
            <SkeletonLine className="mt-3 h-4 w-4/5" />
            <SkeletonLine className="mt-8 h-2 w-full" />
          </aside>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.95fr)]">
          <div className="glass-card p-5 sm:p-6">
            <SkeletonLine className="h-3 w-40" />
            <SkeletonLine className="mt-4 h-8 w-44" />
            <div className="mt-8 flex min-h-[280px] items-center justify-center">
              <div className="h-56 w-56 rounded-full bg-neutral-100" />
            </div>
          </div>
          <div className="glass-card p-5 sm:p-6">
            <SkeletonLine className="h-3 w-40" />
            <SkeletonLine className="mt-4 h-6 w-32" />
            <div className="mt-6 space-y-5">
              <SkeletonLine className="h-12 w-full rounded-lg" />
              <SkeletonLine className="h-12 w-full rounded-lg" />
              <SkeletonLine className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </section>

        <section className="glass-card p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <SkeletonLine className="h-16 rounded-lg" />
            <SkeletonLine className="h-16 rounded-lg" />
            <SkeletonLine className="h-16 rounded-lg" />
            <SkeletonLine className="h-16 rounded-lg" />
          </div>
        </section>
      </main>
    </AppShell>
  );
}

export default function DashboardPage() {
  const fingerprint = useSkillStore((s) => s.fingerprint);
  const completedScenarioIds = useSkillStore((s) => s.completedScenarioIds);
  const completedAttempts = useSkillStore((s) => s.completedAttempts);
  const activeDrafts = useSkillStore((s) => s.activeDrafts);
  const hydrated = useSkillStore((s) => s.hydrated);
  const attemptsSyncing = useSkillStore((s) => s.attemptsSyncing);
  const syncedUserId = useSkillStore((s) => s.syncedUserId);
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const localize = useLocalizeScenario();
  const difficultyLabel = useDifficultyLabel();

  React.useEffect(() => {
    document.title = t("dashboard.title");
  }, [t]);

  const waitingForAttemptSync = Boolean(user) && (attemptsSyncing || syncedUserId !== user?.id);
  if (!hydrated || authLoading || waitingForAttemptSync) {
    return <DashboardSkeleton />;
  }

  const attemptCount = completedAttempts.length;
  const recentDraft = getMostRecentDraft(activeDrafts);
  const draftScenario = recentDraft ? getScenario(recentDraft.scenario_id) : null;
  const nextScenario =
    draftScenario ??
    scenarios.find((scenario) => !completedScenarioIds.includes(scenario.id)) ??
    null;
  const continueScenarioBase = getScenario("PC-02") ?? nextScenario;
  const continueScenario = continueScenarioBase ? localize(continueScenarioBase) : null;
  const allCompleted = !nextScenario;
  const focusPathProgressData = getScenarioPathProgress(
    continueScenario?.path_id ?? nextScenario?.path_id ?? paths[0].id,
    completedScenarioIds,
  );
  const weeklyAttempts = getWeeklyAttempts(completedAttempts);
  const weeklyAverage =
    weeklyAttempts.length === 0
      ? null
      : Math.round(
          weeklyAttempts.reduce((total, attempt) => total + attempt.score, 0) /
            weeklyAttempts.length,
        );
  const currentStreak = getCurrentStreak(completedAttempts);
  const fingerprintSummary = getFingerprintSummary(fingerprint, attemptCount);
  const dashboardFingerprint = normalizeFingerprint(fingerprint);
  const focusScenariosHref = `/scenarios?category=${focusPathProgressData.path.id}`;
  const recommendedScenarios = scenarios
    .filter((scenario) => scenario.id !== continueScenario?.id && !completedScenarioIds.includes(scenario.id))
    .slice(0, 3)
    .map((s) => localize(s));

  return (
    <AppShell>
      <main className="flex max-w-full flex-col gap-4 overflow-x-hidden p-4 sm:gap-5 sm:p-6">
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.85fr)]">
          <div className="glass-card min-w-0 p-5 sm:p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand-primary">
                  {t("dashboard.continueLearning")}
                </p>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-brand-deep sm:text-3xl">
                  {continueScenario?.title ?? t("dashboard.allComplete")}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">
                  {continueScenario
                    ? `${continueScenario.path_title} · ${difficultyLabel(continueScenario.difficulty)} · ${formatEstimatedTime(continueScenario.estimated_time)}`
                    : t("dashboard.allCompleteDetail")}
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-700">
                  {t("dashboard.practiceLine")}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
                <span>{t("dashboard.pathProgress")}</span>
                <span>
                  {focusPathProgressData.completed}/{focusPathProgressData.total}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-brand-primary transition-all"
                  style={{ width: `${focusPathProgressData.percent}%` }}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              {continueScenario && (
                <Link
                  href={`/scenario/${continueScenario.id}`}
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  {t("dashboard.resumeScenario")}
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              )}
              <Link
                href={focusScenariosHref}
                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-brand-deep transition-colors hover:border-brand-primary hover:text-brand-primary"
              >
                {t("dashboard.viewPath")}
              </Link>
            </div>
          </div>

          <aside className="glass-card min-w-0 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand-primary">
                  {t("dashboard.focusPath")}
                </p>
                <h2 className="mt-2 text-xl font-black tracking-tight text-brand-deep">
                  {focusPathProgressData.path.title}
                </h2>
              </div>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-600">
                {focusPathProgressData.completed}/{focusPathProgressData.total}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              {t("dashboard.keepPathMoving")}
            </p>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
                <span>{t("dashboard.pathProgress")}</span>
                <span>{focusPathProgressData.percent}%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-brand-primary transition-all"
                  style={{ width: `${focusPathProgressData.percent}%` }}
                />
              </div>
            </div>

            {draftScenario && (
              <div className="mt-5 rounded-lg border border-brand-primary/20 bg-brand-mint p-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  {t("dashboard.openDraft")}
                </p>
                <p className="mt-2 truncate text-sm font-bold text-brand-deep">{draftScenario.title}</p>
                <p className="mt-1 text-xs text-neutral-600">{formatLastWorked(t, recentDraft?.updated_at)}</p>
              </div>
            )}

            {allCompleted && (
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-brand-mint px-3 py-2 text-sm font-semibold text-brand-primary">
                <CheckIcon className="h-4 w-4" />
                {t("dashboard.allCurrentComplete")}
              </div>
            )}
          </aside>
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.95fr)]">
          <div className="glass-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand-primary">
                  {t("dashboard.skillFingerprint")}
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-brand-deep">
                  {fingerprintSummary.average === null ? t("dashboard.noScoreYet") : t("dashboard.overall", { n: fingerprintSummary.average })}
                </h2>
                <p className="mt-1 text-sm text-neutral-500">{t(fingerprintSummary.levelKey)}</p>
              </div>
              <Link
                href="/profile"
                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-brand-deep transition-colors hover:border-brand-primary hover:text-brand-primary"
              >
                {t("dashboard.viewFullProfile")}
              </Link>
            </div>

            <div className="mt-5 flex min-h-[280px] items-center justify-center">
              <div className="w-full max-w-[380px]">
                <SkillRadarChart fingerprint={dashboardFingerprint} size="md" />
              </div>
            </div>
          </div>

          <div className="glass-card p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand-primary">
                  {t("dashboard.recommendedNext")}
                </p>
                <h2 className="mt-2 text-xl font-black tracking-tight text-brand-deep">
                  {t("dashboard.threeReps")}
                </h2>
              </div>
            </div>

            <div className="mt-5 divide-y divide-neutral-200">
              {recommendedScenarios.length > 0 ? (
                recommendedScenarios.map((scenario) => (
                  <Link
                    key={scenario.id}
                    href={`/scenario/${scenario.id}`}
                    className="flex items-center justify-between gap-4 py-3 transition-colors hover:text-brand-primary"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-brand-deep">{scenario.title}</p>
                      <p className="mt-1 truncate text-xs text-neutral-500">
                        {scenario.path_title} · {difficultyLabel(scenario.difficulty)} · {formatEstimatedTime(scenario.estimated_time)}
                      </p>
                    </div>
                    <ArrowRightIcon className="h-4 w-4 shrink-0 text-brand-primary" />
                  </Link>
                ))
              ) : (
                <div className="rounded-lg border border-brand-primary/20 bg-brand-mint p-4 text-sm font-semibold text-brand-deep">
                  {t("dashboard.allCurrentComplete")}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="glass-card p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-brand-primary">
              {t("dashboard.weeklyStats")}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:min-w-[720px]">
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">{t("dashboard.thisWeek")}</p>
                <p className="mt-1 text-xl font-black text-brand-deep">{weeklyAttempts.length}</p>
                <p className="mt-0.5 text-[11px] text-neutral-500">{t("dashboard.weekCompleted")}</p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">{t("dashboard.averageScore")}</p>
                <p className="mt-1 text-lg font-black leading-tight text-brand-deep">
                  {weeklyAverage === null ? t("dashboard.noScoreYet") : weeklyAverage}
                </p>
                <p className="mt-0.5 text-[11px] text-neutral-500">{t("dashboard.last7Days")}</p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">{t("dashboard.currentStreak")}</p>
                <p className="mt-1 text-xl font-black text-brand-deep">{currentStreak}</p>
                <p className="mt-0.5 text-[11px] text-neutral-500">{currentStreak === 1 ? t("dashboard.dayActive") : t("dashboard.daysActive")}</p>
              </div>
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">{t("dashboard.totalCompleted")}</p>
                <p className="mt-1 text-xl font-black text-brand-deep">{completedScenarioIds.length}</p>
                <p className="mt-0.5 text-[11px] text-neutral-500">{t("dashboard.practiceScenarios")}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
