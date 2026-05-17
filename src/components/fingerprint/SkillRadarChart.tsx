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

  const chart = {
    sm: { className: "h-48 min-h-48", height: 192 },
    md: { className: "h-64 min-h-64", height: 256 },
    lg: { className: "h-80 min-h-80", height: 320 },
  }[size];

  const data = Object.entries(fingerprint).map(([dimension, score]) => ({
    dimension,
    score,
  }));

  return (
    <div className={`w-full min-w-0 ${chart.className}`}>
      {mounted ? (
        <ResponsiveContainer
          width="100%"
          height={chart.height}
          minWidth={0}
          minHeight={chart.height}
          initialDimension={{ width: chart.height, height: chart.height }}
        >
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
