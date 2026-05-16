// ============================================================
// LeetSkills MVP — Skill Radar Chart
// Owner: Yousef (UI/UX & Dashboard)
// ============================================================
// TODO: Implement 4-axis radar chart with Recharts + Framer Motion
//
// Axes: Decomposition, Hypothesis Quality, Reasoning Depth, Honesty
// - Animated transitions on score updates (Framer Motion)
// - Scale: 0–100
// - Responsive sizing

"use client";

import React from "react";
import type { SkillFingerprint } from "@/types";

interface SkillRadarChartProps {
  fingerprint: SkillFingerprint;
  size?: "sm" | "md" | "lg";
}

export default function SkillRadarChart({
  fingerprint,
  size = "md",
}: SkillRadarChartProps) {
  // TODO: Implement with Recharts RadarChart + Framer Motion
  return (
    <div>
      <p>Skill Radar Chart — implement with Recharts</p>
      <pre>{JSON.stringify(fingerprint, null, 2)}</pre>
    </div>
  );
}
