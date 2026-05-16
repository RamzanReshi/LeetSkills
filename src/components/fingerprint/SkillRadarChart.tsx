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
import { AnimatePresence, motion } from "framer-motion";
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

  // Changes in scores trigger a re-animation via key
  const fingerprintKey = Object.values(fingerprint).join("-");

  return (
    <motion.div
      className={`w-full ${chartSize}`}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <AnimatePresence mode="wait">
        {mounted ? (
          <motion.div
            key={fingerprintKey}
            className="w-full h-full"
            initial={{ opacity: 0.5, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
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
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
