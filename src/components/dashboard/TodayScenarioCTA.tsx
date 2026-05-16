// ============================================================
// LeetSkills MVP — Today's Scenario CTA
// Owner: YousefNijim (UI/UX & Dashboard)
// ============================================================
// TODO: Call-to-action card linking to the next available scenario
// ============================================================
"use client";

import React from "react";
import Link from "next/link";
import type { Scenario } from "@/types";

interface TodayScenarioCTAProps {
  scenario: Scenario | null;
  allCompleted: boolean;
}

const TRACK_LABEL: Record<Scenario["track"], string> = {
  "first-principles": "First Principles",
  "productive-struggle": "Productive Struggle",
};

function formatMinutes(seconds: number) {
  const m = Math.round(seconds / 60);
  return `${m} minute${m !== 1 ? "s" : ""}`;
}

function deriveTitle(prompt: string) {
  const first = prompt.split(".")[0].trim();
  return first.length > 52 ? first.slice(0, 52) + "…" : first;
}

export default function TodayScenarioCTA({ scenario, allCompleted }: TodayScenarioCTAProps) {
  if (allCompleted || !scenario) {
    return (
      <div className="w-full max-w-[400px] bg-ls-surface border border-ls-border border-l-[4px] border-l-ls-green rounded-[12px] p-6 flex flex-col items-center justify-center gap-3 min-h-[180px]">
        <span className="text-ls-green text-[32px]">✓</span>
        <p className="text-ls-text font-bold text-[18px] text-center">All scenarios completed!</p>
        <p className="text-ls-text-muted text-[14px] text-center">Check back soon for new challenges.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[400px] bg-ls-surface border border-ls-border border-l-[4px] border-l-ls-green rounded-[12px] p-6 shadow-2xl overflow-hidden flex flex-col">
      {/* Background glow */}
      <div
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full pointer-events-none blur-[64px]"
        style={{ background: "var(--ls-green-glow)" }}
      />

      {/* Label chip */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-ls-green text-[16px] leading-none">◎</span>
        <span className="text-ls-green uppercase tracking-widest font-mono text-[11px] font-medium">
          Today&apos;s Challenge · {TRACK_LABEL[scenario.track]}
        </span>
      </div>

      {/* Scenario info */}
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-ls-text font-bold text-[20px] leading-tight">
          {deriveTitle(scenario.prompt_text)}
        </h2>
        <p className="text-ls-text-muted text-[14px] leading-snug line-clamp-2">
          {scenario.prompt_text}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-ls-text-dim text-[16px] leading-none">⏱</span>
          <span className="text-ls-text-muted text-[13px] font-mono">
            {formatMinutes(scenario.time_limit_seconds)}
          </span>
        </div>
      </div>

      {/* CTA button */}
      <Link
        href={`/scenario/${scenario.id}`}
        className="w-full h-12 bg-ls-green hover:bg-ls-green-dark active:scale-[0.98] transition-all duration-150 rounded-[8px] flex items-center justify-center gap-2 group"
      >
        <span className="text-white font-semibold text-[15px]">Start Scenario</span>
        <span className="text-white text-[18px] group-hover:translate-x-1 transition-transform duration-150">
          →
        </span>
      </Link>
    </div>
  );
}
