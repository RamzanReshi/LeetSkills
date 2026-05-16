"use client";

import React from "react";
import SkillRadarChart from "@/components/fingerprint/SkillRadarChart";
import type { DimensionName, SkillFingerprint } from "@/types";

interface FingerprintHeroProps {
  fingerprint: SkillFingerprint;
  attemptCount?: number;
}

const DIMENSION_CONFIG: Record<
  DimensionName,
  { description: string; color: string; lightBg: string }
> = {
  Decomposition: {
    description: "Breaks problems into useful parts",
    color: "#3B82F6",
    lightBg: "#EFF6FF",
  },
  "Hypothesis Quality": {
    description: "Forms specific, testable explanations",
    color: "#7C3AED",
    lightBg: "#F5F3FF",
  },
  "Reasoning Depth": {
    description: "Connects evidence to conclusions",
    color: "#D97706",
    lightBg: "#FFFBEB",
  },
  Honesty: {
    description: "Names uncertainty and limits clearly",
    color: "#1F8A5B",
    lightBg: "#ECFDF3",
  },
};

function getStrengthLabel(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Developing";
  return "Needs Focus";
}

function getOverallLabel(avg: number) {
  if (avg >= 85) return "Expert";
  if (avg >= 70) return "Proficient";
  if (avg >= 50) return "Developing";
  return "Beginner";
}

export default function FingerprintHero({
  fingerprint,
  attemptCount = 0,
}: FingerprintHeroProps) {
  const dimensions = Object.entries(fingerprint) as [DimensionName, number][];
  const average =
    dimensions.reduce((total, [, score]) => total + score, 0) /
    Math.max(dimensions.length, 1);

  return (
    <section className="glass-card w-full p-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary">
            Cognitive Profile
          </p>
          <h2 className="mt-1.5 text-3xl font-bold tracking-tight text-brand-deep">
            Your Skill Fingerprint
          </h2>
        </div>
        <div className="flex gap-3">
          <div className="rounded-2xl bg-brand-mint px-5 py-3 ring-1 ring-neutral-200 text-center min-w-[80px]">
            <p className="text-3xl font-black text-brand-deep leading-none">
              {Math.round(average)}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              {getOverallLabel(average)}
            </p>
          </div>
          <div className="rounded-2xl bg-neutral-50 px-5 py-3 ring-1 ring-neutral-200 text-center min-w-[80px]">
            <p className="text-3xl font-black text-brand-deep leading-none">{attemptCount}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Scenarios
            </p>
          </div>
        </div>
      </div>

      {/* Chart + Dimension Cards */}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-start">
        {/* Radar Chart */}
        <div className="relative flex items-center justify-center py-4">
          <div
            className="absolute rounded-full blur-3xl opacity-50"
            style={{
              inset: "10%",
              background: "radial-gradient(circle, #ECFDF3 0%, transparent 70%)",
            }}
          />
          <div className="relative z-10 w-full aspect-square max-w-[280px] mx-auto">
            <SkillRadarChart fingerprint={fingerprint} size="lg" />
          </div>
        </div>

        {/* Dimension Cards Grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          {dimensions.map(([dimension, score]) => {
            const cfg = DIMENSION_CONFIG[dimension];
            return (
              <div
                key={dimension}
                className="rounded-xl p-4 transition-shadow hover:shadow-md"
                style={{
                  backgroundColor: cfg.lightBg,
                  outline: `1px solid ${cfg.color}33`,
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <div
                      className="inline-block w-2 h-2 rounded-full mb-1.5"
                      style={{ backgroundColor: cfg.color }}
                    />
                    <h3 className="font-bold text-sm leading-tight" style={{ color: cfg.color }}>
                      {dimension}
                    </h3>
                    <p className="mt-0.5 text-xs text-neutral-500 leading-snug">
                      {cfg.description}
                    </p>
                  </div>
                  <span
                    className="font-mono text-2xl font-black shrink-0 leading-none"
                    style={{ color: cfg.color }}
                  >
                    {score}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/70">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.max(0, Math.min(score, 100))}%`,
                      backgroundColor: cfg.color,
                    }}
                  />
                </div>
                <p
                  className="mt-1.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: cfg.color }}
                >
                  {getStrengthLabel(score)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
