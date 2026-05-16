// ============================================================
// LeetSkills MVP — Skill Radar Chart
// Owner: YousefNijim (UI/UX & Dashboard)
// ============================================================
"use client";

import React, { useMemo } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { motion } from "framer-motion";
import type { SkillFingerprint } from "@/types";

interface SkillRadarChartProps {
  fingerprint: SkillFingerprint;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = { sm: 200, md: 320, lg: 480 };
const FONT_SIZE_MAP = { sm: 9, md: 12, lg: 14 };

export default function SkillRadarChart({
  fingerprint,
  size = "md",
}: SkillRadarChartProps) {
  const px = SIZE_MAP[size];
  const fontSize = FONT_SIZE_MAP[size];

  const data = useMemo(
    () => [
      { dimension: "Decomposition", score: fingerprint.Decomposition },
      { dimension: "Hypothesis Quality", score: fingerprint["Hypothesis Quality"] },
      { dimension: "Reasoning Depth", score: fingerprint["Reasoning Depth"] },
      { dimension: "Honesty", score: fingerprint.Honesty },
    ],
    [fingerprint]
  );

  return (
    <motion.div
      key={JSON.stringify(fingerprint)}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ width: px, height: px }}
    >
      <RadarChart
        width={px}
        height={px}
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={px * 0.38}
      >
        <PolarGrid stroke="var(--ls-border)" strokeWidth={1} />
        <PolarAngleAxis
          dataKey="dimension"
          tick={{ fill: "var(--ls-text-muted)", fontSize, fontWeight: 500 }}
        />
        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          dataKey="score"
          fill="var(--ls-green)"
          fillOpacity={0.25}
          stroke="var(--ls-green)"
          strokeWidth={size === "sm" ? 4 : 3}
          dot={{ fill: "var(--ls-green)", r: size === "sm" ? 3 : 4 }}
          isAnimationActive={true}
          animationBegin={0}
          animationDuration={600}
          animationEasing="ease-out"
        />
      </RadarChart>
    </motion.div>
  );
}
