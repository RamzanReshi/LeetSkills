// ============================================================
// LeetSkills MVP - Scenario Prompt Display
// ============================================================

"use client";

import React from "react";
import type { Scenario } from "@/types";

interface ScenarioPromptProps {
  scenario: Scenario;
  timeRemaining: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function ScenarioPrompt({ scenario, timeRemaining }: ScenarioPromptProps) {
  const isLow = timeRemaining <= 60;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-block rounded-full bg-brand-mint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-primary">
            {scenario.path_title}
          </span>
          <span className="inline-block rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-700">
            {scenario.difficulty}
          </span>
        </div>
        <span
          className={`font-mono text-lg font-bold tabular-nums ${
            isLow ? "text-red-600" : "text-neutral-700"
          }`}
          aria-label={`Time remaining: ${formatTime(timeRemaining)}`}
        >
          {formatTime(timeRemaining)}
        </span>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {scenario.id} - {scenario.scenario_type} - {scenario.estimated_time}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-deep">
          {scenario.title}
        </h1>
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
