// ============================================================
// LeetSkills MVP — Skill Radar Chart
// Owner: Yousef (UI/UX & Dashboard) — implemented by Ramzan
// ============================================================

"use client";

import React from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import type { SkillFingerprint } from "@/types";

interface SkillRadarChartProps {
  fingerprint: SkillFingerprint;
  size?: "sm" | "md" | "lg";
}

const SIZE_HEIGHT: Record<"sm" | "md" | "lg", number> = {
  sm: 200,
  md: 280,
  lg: 360,
};

export default function SkillRadarChart({
  fingerprint,
  size = "md",
}: SkillRadarChartProps) {
  const data = [
    { axis: "Decomposition", value: fingerprint["Decomposition"] },
    { axis: "Hypothesis", value: fingerprint["Hypothesis Quality"] },
    { axis: "Reasoning", value: fingerprint["Reasoning Depth"] },
    { axis: "Honesty", value: fingerprint["Honesty"] },
  ];

  return (
    <ResponsiveContainer width="100%" height={SIZE_HEIGHT[size]}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fontSize: 11, fill: "#6b7280" }}
        />
        <Radar
          dataKey="value"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.25}
          dot={{ r: 3, fill: "#3b82f6" }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
