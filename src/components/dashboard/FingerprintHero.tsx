"use client";

import React from "react";
import SkillRadarChart from "@/components/fingerprint/SkillRadarChart";
import type { DimensionName, SkillFingerprint } from "@/types";

interface FingerprintHeroProps {
  fingerprint: SkillFingerprint;
  attemptCount?: number;
}

const dimensionDescriptions: Record<DimensionName, string> = {
  Decomposition: "Breaks problems into useful parts",
  "Hypothesis Quality": "Forms specific, testable explanations",
  "Reasoning Depth": "Connects evidence to conclusions",
  Honesty: "Names uncertainty and limits clearly",
};

export default function FingerprintHero({
  fingerprint,
  attemptCount = 0,
}: FingerprintHeroProps) {
  const dimensions = Object.entries(fingerprint) as [DimensionName, number][];
  const average =
    dimensions.reduce((total, [, score]) => total + score, 0) /
    Math.max(dimensions.length, 1);

  return (
    <section className="glass-card w-full max-w-4xl p-8 animate-fade-in">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary">
            Cognitive Profile
          </p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-brand-deep">Your Skill Fingerprint</h2>
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-brand-mint p-4 ring-1 ring-neutral-300">
          <div className="text-right">
            <p className="text-4xl font-black text-brand-deep">{Math.round(average)}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Overall Rating
            </p>
          </div>
          <div className="h-10 w-[1px] bg-neutral-300" />
          <div className="text-left">
            <p className="text-lg font-bold text-brand-primary">{attemptCount}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              Scenarios
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_350px] lg:items-center">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
          {dimensions.map(([dimension, score]) => (
            <div key={dimension} className="group">
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-bold text-neutral-900 group-hover:text-brand-primary transition-colors">
                    {dimension}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {dimensionDescriptions[dimension]}
                  </p>
                </div>
                <span className="font-mono text-xl font-black text-brand-deep">{score}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-action transition-all duration-1000 ease-out"
                  style={{ width: `${Math.max(0, Math.min(score, 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="relative flex justify-center py-4">
          <div className="absolute inset-0 bg-brand-mint blur-3xl rounded-full opacity-60" />
          <div className="relative z-10 w-full aspect-square max-w-[320px]">
            <SkillRadarChart fingerprint={fingerprint} size="lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
