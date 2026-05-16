// ============================================================
// LeetSkills MVP — Score Card Component
// Owner: YousefNijim (UI/UX & Dashboard)
// ============================================================
// TODO: Implement individual dimension score display

"use client";

import React from "react";
import type { DimensionScore } from "@/types";

interface ScoreCardProps {
  score: DimensionScore;
}

export default function ScoreCard({ score }: ScoreCardProps) {
  // TODO: Display dimension name, score/max, feedback text
  // Style with color gradient based on score percentage
  return (
    <div>
      <h4>{score.dimension}</h4>
      <p>{score.score} / {score.max_score}</p>
      <p>{score.feedback}</p>
    </div>
  );
}
