// ============================================================
// LeetSkills MVP - Results Page
// ============================================================

"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSkillStore } from "@/store/useSkillStore";
import { getScenarioById } from "@/data/mvp-content";
import ScoreCard from "@/components/evaluation/ScoreCard";
import FeedbackPanel from "@/components/evaluation/FeedbackPanel";
import WeakestCallout from "@/components/evaluation/WeakestCallout";
import SkillRadarChart from "@/components/fingerprint/SkillRadarChart";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useLocalizeScenario } from "@/i18n/content";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const localize = useLocalizeScenario();
  const scenarioId = params.id as string;

  const completedAttempts = useSkillStore((s) => s.completedAttempts);
  const hydrated = useSkillStore((s) => s.hydrated);

  const attempt = hydrated
    ? [...completedAttempts].reverse().find((entry) => entry.scenario_id === scenarioId)
    : undefined;

  const baseScenario = attempt ? getScenarioById(attempt.ai_feedback.scenario_id) : undefined;
  const scenario = baseScenario ? localize(baseScenario) : undefined;

  React.useEffect(() => {
    if (scenario) {
      document.title = `${scenario.title} - LeetSkills`;
    } else {
      document.title = t("results.metaTitle");
    }
  }, [scenario, t]);

  if (!hydrated) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-brand-deep">{t("results.loading")}</h1>
      </main>
    );
  }

  if (!attempt) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-brand-deep">{t("results.noResults")}</h1>
        <p className="mt-2 text-neutral-500">
          {t("results.completeToSee", { id: scenarioId })}
        </p>
        <button onClick={() => router.push("/dashboard")} className="btn-primary mt-6">
          {t("results.back")}
        </button>
      </main>
    );
  }

  const evaluation = attempt.ai_feedback;
  const weakestScore = [...evaluation.skill_scores].sort(
    (a, b) => a.rating_0_to_4 - b.rating_0_to_4 || b.weight - a.weight,
  )[0];
  const recommendedBase = evaluation.recommended_next_scenario_id
    ? getScenarioById(evaluation.recommended_next_scenario_id)
    : null;
  const recommended = recommendedBase ? localize(recommendedBase) : null;

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
            {scenario?.path_title ?? evaluation.path_id}
          </p>
          <h1 className="text-xl font-bold text-brand-deep">{t("results.yourResults")}</h1>
          {attempt.fallback_used ? (
            <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
              {t("results.fallbackNotice")}
            </p>
          ) : null}
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl font-black text-brand-primary">
            {evaluation.overall_score}
          </p>
          <p className="text-xs text-neutral-500">
            {new Date(evaluation.timestamp).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {evaluation.skill_scores.map((score) => (
          <ScoreCard key={score.skill} score={score} />
        ))}
      </div>

      <FeedbackPanel
        strengths={evaluation.strengths}
        improvements={evaluation.improvements}
        improvedExample={evaluation.improved_example_response}
      />

      {weakestScore ? (
        <WeakestCallout
          skill={weakestScore.skill}
          rating={weakestScore.rating_0_to_4}
          weight={weakestScore.weight}
        />
      ) : null}

      {recommended ? (
        <Link
          href={`/scenario/${recommended.id}`}
          className="block rounded-lg border border-brand-primary/25 bg-brand-mint p-4 text-sm text-brand-deep transition-colors hover:border-brand-primary"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
            {t("results.recommended")}
          </span>
          <span className="mt-1 block font-semibold">{recommended.id}: {recommended.title}</span>
        </Link>
      ) : null}

      <div className="rounded-lg border border-neutral-300 bg-brand-card p-4 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
          {t("results.updatedFingerprint")}
        </h3>
        <SkillRadarChart fingerprint={attempt.fingerprint_after} />
      </div>

      <button
        onClick={() => router.push(`/scenario/${scenarioId}`)}
        className="btn-action w-full"
      >
        {t("results.tryAgainSameScenario")}
      </button>
      <button onClick={() => router.push("/dashboard")} className="btn-primary w-full">
        {t("results.back")}
      </button>
    </main>
  );
}
