"use client";

import React from "react";
import type { DimensionScore } from "@/types";

interface ScoreCardProps {
  score: DimensionScore;
}

export default function ScoreCard({ score }: ScoreCardProps) {
  const pct = Math.round((score.score / score.max_score) * 100);

  return (
    <div className="bg-ls-surface border border-ls-border rounded-[10px] px-5 py-4 hover:border-ls-green/30 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <span className="text-ls-text font-bold text-[16px]">{score.dimension}</span>
        <span className="text-ls-green font-bold text-[16px] font-mono">
          {score.score}/{score.max_score}
        </span>
      </div>

      <div className="w-full h-[6px] bg-ls-border rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #1A4A34 0%, #3EAF72 100%)",
          }}
        />
      </div>

      <p className="text-ls-text-muted text-[13px] leading-[1.5]">{score.feedback}</p>
    </div>
  );
}
