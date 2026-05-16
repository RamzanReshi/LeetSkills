"use client";

import React from "react";
import type { DimensionScore, DimensionName } from "@/types";

interface ScoreCardProps {
  score: DimensionScore;
}

const DIMENSION_COLORS: Record<DimensionName, { color: string; lightBg: string }> = {
  Decomposition: { color: "#3B82F6", lightBg: "#EFF6FF" },
  "Hypothesis Quality": { color: "#7C3AED", lightBg: "#F5F3FF" },
  "Reasoning Depth": { color: "#D97706", lightBg: "#FFFBEB" },
  Honesty: { color: "#1F8A5B", lightBg: "#ECFDF3" },
};

export default function ScoreCard({ score }: ScoreCardProps) {
  const pct = Math.round((score.score / score.max_score) * 100);
  const cfg = DIMENSION_COLORS[score.dimension as DimensionName] ?? {
    color: "#1F8A5B",
    lightBg: "#ECFDF3",
  };

  return (
    <div
      className="rounded-xl px-5 py-4 transition-shadow hover:shadow-md"
      style={{
        backgroundColor: cfg.lightBg,
        outline: `1px solid ${cfg.color}33`,
      }}
    >
      <div className="flex justify-between items-start mb-3 gap-2">
        <div className="min-w-0">
          <div
            className="inline-block w-2 h-2 rounded-full mb-1.5"
            style={{ backgroundColor: cfg.color }}
          />
          <p className="font-bold text-[15px] text-neutral-900 leading-tight">{score.dimension}</p>
        </div>
        <span
          className="font-mono font-black text-xl leading-none shrink-0"
          style={{ color: cfg.color }}
        >
          {score.score}/{score.max_score}
        </span>
      </div>

      <div className="w-full h-[5px] bg-white/70 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: cfg.color }}
        />
      </div>

      <p className="text-neutral-600 text-[13px] leading-[1.5]">{score.feedback}</p>
    </div>
  );
}
