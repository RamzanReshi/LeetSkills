"use client";

import Link from "next/link";

import { ArrowRightIcon, FlameIcon, UserIcon } from "@/components/ui/Icons";
import SkillRadarChart from "@/components/fingerprint/SkillRadarChart";
import {
  getAccountDisplayName,
  getAccountRole,
  useAuth,
} from "@/components/auth/AuthProvider";
import { DASHBOARD_DIMENSIONS, MVP_SCENARIOS } from "@/data/mvp-content";
import { useSkillStore } from "@/store/useSkillStore";
import type { DimensionName, SkillFingerprint } from "@/types";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useDimensionLabel, useDimensionDescription } from "@/i18n/content";

const DIMENSION_CONFIG: Record<DimensionName, { description: string }> =
  DASHBOARD_DIMENSIONS.reduce((acc, dimension) => {
    acc[dimension.dimension] = {
      description: dimension.description,
    };
    return acc;
  }, {} as Record<DimensionName, { description: string }>);

const TOTAL_SCENARIOS = MVP_SCENARIOS.length;

function displayScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function normalizeFingerprint(fingerprint: Record<DimensionName, number>) {
  return Object.fromEntries(
    Object.entries(fingerprint).map(([dimension, score]) => [dimension, displayScore(score)]),
  ) as SkillFingerprint;
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-300 bg-brand-card p-4">
      <p className="text-xs font-medium uppercase text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-brand-deep">{value}</p>
      <p className="mt-1 text-sm text-neutral-500">{detail}</p>
    </div>
  );
}

export default function ProfileView() {
  const { user, profile, signOut } = useAuth();
  const fingerprint = useSkillStore((s) => s.fingerprint);
  const completedAttempts = useSkillStore((s) => s.completedAttempts);
  const completedScenarioIds = useSkillStore((s) => s.completedScenarioIds);
  const { t } = useLanguage();
  const dimensionLabel = useDimensionLabel();
  const dimensionDescription = useDimensionDescription();

  const dimensions = (Object.entries(fingerprint) as [DimensionName, number][])
    .map(([dimension, score]) => [dimension, displayScore(score)] as [DimensionName, number]);
  const profileFingerprint = normalizeFingerprint(fingerprint);
  const scoredDimensions = dimensions.filter(([, score]) => score > 0);
  const averageScore =
    scoredDimensions.length === 0
      ? null
      : Math.round(scoredDimensions.reduce((total, [, score]) => total + score, 0) / scoredDimensions.length);

  const PREVIEW_STATS = [
    { label: t("profile.stat.completed"), value: `${completedScenarioIds.length}/${TOTAL_SCENARIOS}`, detail: t("profile.stat.completedDetail") },
    { label: t("profile.stat.attempts"), value: String(completedAttempts.length), detail: t("profile.stat.attemptsDetail") },
    { label: t("profile.stat.average"), value: averageScore === null ? "0" : String(averageScore), detail: t("profile.stat.averageDetail") },
  ];

  const WEEKLY_PREVIEW = [
    t("profile.day.mon"),
    t("profile.day.tue"),
    t("profile.day.wed"),
    t("profile.day.thu"),
    t("profile.day.fri"),
    t("profile.day.sat"),
    t("profile.day.sun"),
  ];

  const displayName = getAccountDisplayName(user, profile);
  const role = getAccountRole(profile) ?? t("profile.defaultRole");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10 animate-fade-in">
      <header className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-lg border border-neutral-300 bg-brand-card p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-brand-mint text-brand-primary">
                <UserIcon className="h-9 w-9" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">{t("profile.eyebrow")}</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-deep sm:text-3xl">
                  {displayName}
                </h1>
                <p className="mt-1 text-sm text-neutral-500">{role}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-dashed border-brand-primary/30 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase text-brand-primary">{t("profile.learningProgress")}</p>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="mt-3 font-medium text-neutral-700">{t("profile.scenariosCompletion")}</span>
              <span className="font-semibold text-brand-deep">{completedScenarioIds.length}/{TOTAL_SCENARIOS}</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-brand-primary/45"
                style={{ width: `${Math.min(100, Math.round((completedScenarioIds.length / TOTAL_SCENARIOS) * 100))}%` }}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-neutral-300 bg-brand-card p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <FlameIcon className="h-5 w-5 text-brand-action" />
            <h2 className="text-base font-semibold text-brand-deep">{t("profile.weeklyRhythm")}</h2>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-2">
            {WEEKLY_PREVIEW.map((day, index) => (
              <div key={day} className="text-center">
                <div
                  className={[
                    "mx-auto flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold",
                    index < 4
                      ? "border-brand-primary/30 bg-brand-mint/60 text-brand-primary"
                      : "border-neutral-300 bg-neutral-100 text-neutral-500",
                  ].join(" ")}
                >
                  {day.slice(0, 1)}
                </div>
                <p className="mt-2 text-[11px] text-neutral-500">{day}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            {t("profile.comingSoon")}
          </p>
        </section>
      </header>

      <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PREVIEW_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-neutral-300 bg-brand-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-brand-deep">{t("profile.skillFingerprint")}</h2>
              <p className="mt-1 text-sm text-neutral-500">
                {t("profile.skillFingerprintDetail")}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <SkillRadarChart fingerprint={profileFingerprint} size="lg" />
          </div>
        </div>

        <div className="rounded-lg border border-neutral-300 bg-brand-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-brand-deep">{t("profile.fullDimension")}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {dimensions.map(([dimension, score]) => {
              const cfg = DIMENSION_CONFIG[dimension];
              return (
                <div
                  key={dimension}
                  className="rounded-lg border border-neutral-300 bg-brand-card p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="block h-2 w-2 rounded-full bg-brand-primary" />
                      <h3 className="mt-2 text-sm font-bold leading-tight text-brand-primary">
                        {dimensionLabel(dimension)}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-neutral-600">{dimensionDescription(dimension, cfg.description)}</p>
                    </div>
                    <span className="shrink-0 text-xl font-black text-brand-primary">
                      {score}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-brand-primary transition-all"
                      style={{ width: `${Math.max(0, Math.min(score, 100))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-neutral-300 bg-brand-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold text-brand-deep">{t("profile.focusPlan")}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-stretch">
          <div className="rounded-lg bg-brand-mint p-4">
            <p className="text-xs font-medium uppercase text-brand-primary">{t("profile.strongest")}</p>
            <p className="mt-1 font-semibold text-brand-deep">
              {scoredDimensions.length > 0
                ? dimensionLabel([...scoredDimensions].sort((a, b) => b[1] - a[1])[0][0])
                : t("dashboard.level.start")}
            </p>
          </div>
          <div className="rounded-lg bg-neutral-100 p-4">
            <p className="text-xs font-medium uppercase text-neutral-500">{t("profile.nextFocus")}</p>
            <p className="mt-1 font-semibold text-brand-deep">
              {scoredDimensions.length > 0
                ? dimensionLabel([...scoredDimensions].sort((a, b) => a[1] - b[1])[0][0])
                : "0"}
            </p>
          </div>
          <Link
            href="/path"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-brand-deep transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            {t("profile.reviewPaths")}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-neutral-300 bg-brand-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-brand-deep">{t("profile.accountControls")}</h2>
            <p className="mt-1 text-sm text-neutral-500">
              {t("profile.endSession")}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
            >
              {t("nav.signOut")}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
