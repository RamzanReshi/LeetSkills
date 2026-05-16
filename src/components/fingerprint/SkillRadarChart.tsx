// ============================================================
// LeetSkills MVP - Skill Radar Chart
// ============================================================

"use client";

import React from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { SkillFingerprint } from "@/types";

interface SkillRadarChartProps {
  fingerprint: SkillFingerprint;
  size?: "sm" | "md" | "lg";
}

export default function SkillRadarChart({
  fingerprint,
  size = "md",
}: SkillRadarChartProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const chartSize = {
    sm: "h-48",
    md: "h-64",
    lg: "h-80",
  }[size];

  const data = Object.entries(fingerprint).map(([dimension, score]) => ({
    dimension,
    score,
  }));

  return (
    <div className={`w-full ${chartSize}`}>
      {mounted ? (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="#D1D5DB" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: "#374151", fontSize: 10, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#6B7280", fontSize: 8 }}
              tickCount={6}
            />
            <Radar
              dataKey="score"
              fill="#1F8A5B"
              fillOpacity={0.25}
              isAnimationActive
              stroke="#1F8A5B"
              strokeWidth={3}
            />
          </RadarChart>
        </ResponsiveContainer>
      ) : null}
    </div>
  );
}
