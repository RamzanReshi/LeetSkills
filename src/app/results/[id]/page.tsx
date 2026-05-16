// ============================================================
// LeetSkills MVP — Results Page
// Owner: Yousef (UI/UX & Dashboard)
// ============================================================

"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSkillStore } from "@/store/useSkillStore";
import scenariosData from "@/data/scenarios.json";
import type { Scenario } from "@/types";
import ScoreCard from "@/components/evaluation/ScoreCard";
import FeedbackPanel from "@/components/evaluation/FeedbackPanel";
import WeakestCallout from "@/components/evaluation/WeakestCallout";
import SkillRadarChart from "@/components/fingerprint/SkillRadarChart";

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const scenarioId = params.id as string;

  const history = useSkillStore((s) => s.history);
  const fingerprint = useSkillStore((s) => s.fingerprint);
  const completedIds = useSkillStore((s) => s.completedScenarioIds);

  const evaluation = [...history]
    .reverse()
    .find((e) => e.scenario_id === scenarioId);

  const nextScenario = (scenariosData as Scenario[]).find(
    (s) => !completedIds.includes(s.id) && s.id !== scenarioId
  );

  if (!evaluation) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-brand-deep">No results yet</h1>
        <p className="mt-2 text-neutral-500">
          Complete scenario <code className="text-sm">{scenarioId}</code> to see your evaluation.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="btn-primary mt-6"
        >
          Back to Dashboard
        </button>
      </main>
    );
  }

  const weakestScore = evaluation.scores.find(
    (score) => score.dimension === evaluation.weakest_dimension
  );

  const overallPct = Math.round(
    evaluation.scores.reduce((s, d) => s + (d.score / d.max_score) * 100, 0) /
      evaluation.scores.length
  );

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:py-10 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary">
            Evaluation Complete
          </p>
          <h1 className="mt-1 text-2xl font-bold text-brand-deep">Your Results</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-brand-mint px-4 py-2 text-center ring-1 ring-neutral-200">
            <p className="text-2xl font-black text-brand-deep leading-none">{overallPct}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Score</p>
          </div>
          <span className="text-xs text-neutral-400">
            {new Date(evaluation.timestamp).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* 4 dimension score cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {evaluation.scores.map((score) => (
          <ScoreCard key={score.dimension} score={score} />
        ))}
      </div>

      {/* Overall feedback */}
      <FeedbackPanel feedback={evaluation.overall_feedback} />

      {/* Weakest dimension callout */}
      {weakestScore ? (
        <WeakestCallout
          dimension={evaluation.weakest_dimension}
          score={weakestScore.score}
          maxScore={weakestScore.max_score}
        />
      ) : null}

      {/* Updated skill fingerprint */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-brand-primary">
          Updated Skill Fingerprint
        </h3>
        <SkillRadarChart fingerprint={fingerprint} size="md" />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row pt-1">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex-1 rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-700 hover:border-brand-primary hover:text-brand-primary transition-colors"
        >
          ← Back to Dashboard
        </button>
        {nextScenario ? (
          <Link
            href={`/scenario/${nextScenario.id}`}
            className="btn-primary flex-1 inline-flex items-center justify-center gap-2 text-sm group"
          >
            Next Scenario
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </Link>
        ) : (
          <Link
            href="/scenarios"
            className="btn-primary flex-1 inline-flex items-center justify-center gap-2 text-sm"
          >
            All Scenarios →
          </Link>
        )}
      </div>
    </main>
  );
}
