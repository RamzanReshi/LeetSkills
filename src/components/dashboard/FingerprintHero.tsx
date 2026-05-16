// ============================================================
// LeetSkills MVP — Fingerprint Hero Section
// Owner: YousefNijim (UI/UX & Dashboard)
// ============================================================
// TODO: Large radar chart display for the dashboard hero area
// ============================================================
"use client";

import React from "react";
import type { SkillFingerprint, DimensionName } from "@/types";
import SkillRadarChart from "@/components/fingerprint/SkillRadarChart";

interface FingerprintHeroProps {
  fingerprint: SkillFingerprint;
  attemptCount: number;
}

const DIMENSIONS: DimensionName[] = [
  "Decomposition",
  "Hypothesis Quality",
  "Reasoning Depth",
  "Honesty",
];

export default function FingerprintHero({ fingerprint, attemptCount }: FingerprintHeroProps) {
  return (
    <div className="w-full max-w-[400px] bg-ls-surface border border-ls-border rounded-[12px] p-6 shadow-2xl">
      <header className="mb-6">
        <h2 className="text-ls-text font-bold text-[20px] leading-tight mb-1">
          Your Skill Fingerprint
        </h2>
        <p className="text-ls-text-muted text-[14px]">
          Based on {attemptCount} {attemptCount === 1 ? "attempt" : "attempts"}
        </p>
      </header>

      <div className="flex justify-center items-center mb-6">
        <SkillRadarChart fingerprint={fingerprint} size="md" />
      </div>

      <div>
        {DIMENSIONS.map((dim, i) => (
          <div
            key={dim}
            className={`flex items-center justify-between py-4 border-t border-ls-border-subtle ${
              i === DIMENSIONS.length - 1 ? "border-b" : ""
            }`}
          >
            <span className="text-ls-text-muted text-[15px]">{dim}</span>
            <span className="bg-ls-green text-white font-bold text-[13px] px-3 py-1 rounded-full min-w-[40px] text-center">
              {fingerprint[dim]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
