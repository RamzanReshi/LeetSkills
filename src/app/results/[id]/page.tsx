// ============================================================
// LeetSkills MVP — Results Page
// Owner: Yousef (UI/UX & Dashboard)
// ============================================================

"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useSkillStore } from "@/store/useSkillStore";
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

  // Most recent evaluation for this scenario
  const evaluation = [...history]
    .reverse()
    .find((e) => e.scenario_id === scenarioId);

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

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-brand-deep">Your Results</h1>
        <span className="text-xs text-neutral-500">
          {new Date(evaluation.timestamp).toLocaleDateString()}
        </span>
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
      <div className="rounded-lg border border-neutral-300 bg-brand-card p-4 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-primary">
          Updated Skill Fingerprint
        </h3>
        <SkillRadarChart fingerprint={fingerprint} />
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="btn-primary w-full"
      >
        Back to Dashboard
      </button>
    </main>
  );
}
