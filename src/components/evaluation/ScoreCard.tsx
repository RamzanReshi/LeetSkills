// ============================================================
// LeetSkills MVP — Score Card Component
// Owner: Yousef (UI/UX & Dashboard)
// ============================================================
// TODO: Implement individual dimension score display

"use client";

import React from "react";
import type { DimensionScore } from "@/types";

interface ScoreCardProps {
  score: DimensionScore;
}

const SCORE_COLOR = (pct: number) => {
  if (pct >= 0.7) return { bar: "bg-green-500", text: "text-green-700" };
  if (pct >= 0.4) return { bar: "bg-yellow-400", text: "text-yellow-700" };
  return { bar: "bg-red-400", text: "text-red-700" };
};

export default function ScoreCard({ score }: ScoreCardProps) {
  const pct = score.score / score.max_score;
  const color = SCORE_COLOR(pct);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-700">{score.dimension}</h4>
        <span className={`text-sm font-bold tabular-nums ${color.text}`}>
          {score.score}/{score.max_score}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${color.bar}`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{score.feedback}</p>
    </div>
  );
}
