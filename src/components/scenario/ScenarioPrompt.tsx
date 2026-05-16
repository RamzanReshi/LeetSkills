// ============================================================
// LeetSkills MVP — Scenario Prompt Display
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================

"use client";

import React from "react";
import type { Scenario } from "@/types";

interface ScenarioPromptProps {
  scenario: Scenario;
  /** Remaining seconds — parent owns the countdown timer */
  timeRemaining: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const TRACK_LABEL: Record<Scenario["track"], string> = {
  "first-principles": "First Principles",
  "productive-struggle": "Productive Struggle",
};

export default function ScenarioPrompt({ scenario, timeRemaining }: ScenarioPromptProps) {
  const isLow = timeRemaining <= 60;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="inline-block rounded-full bg-brand-mint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-primary">
          {TRACK_LABEL[scenario.track]}
        </span>
        <span
          className={`font-mono text-lg font-bold tabular-nums ${
            isLow ? "text-red-600" : "text-neutral-700"
          }`}
          aria-label={`Time remaining: ${formatTime(timeRemaining)}`}
        >
          {formatTime(timeRemaining)}
        </span>
      </div>
      <p className="whitespace-pre-wrap text-base leading-relaxed text-neutral-900">
        {scenario.prompt_text}
      </p>
      <p className="text-xs text-neutral-500">
        Time limit: {Math.floor(scenario.time_limit_seconds / 60)} minutes
      </p>
    </div>
  );
}
