// ============================================================
// LeetSkills MVP — Results Page
// Owner: YousefNijim (UI/UX & Dashboard)
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
        <h1 className="text-2xl font-bold text-gray-800">No results yet</h1>
        <p className="mt-2 text-gray-500">
          Complete scenario <code className="text-sm">{scenarioId}</code> to see your evaluation.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Your Results</h1>
        <span className="text-xs text-gray-400">
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
      <WeakestCallout dimension={evaluation.weakest_dimension} />

      {/* Updated skill fingerprint */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Updated Skill Fingerprint
        </h3>
        <SkillRadarChart fingerprint={fingerprint} />
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 active:scale-95 transition-transform"
      >
        Back to Dashboard
      </button>
    </main>
  );
}
