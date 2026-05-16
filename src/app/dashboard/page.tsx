// ============================================================
// LeetSkills MVP — Dashboard Page
// Owner: YousefNijim (UI/UX & Dashboard)
// ============================================================
// TODO: Implement the main dashboard with:
// - Skill Fingerprint hero (radar chart)
// - Today's Scenario CTA
// - Weakest dimension callout
// - Session reset option
// ============================================================
"use client";

import React from "react";
import FingerprintHero from "@/components/dashboard/FingerprintHero";
import TodayScenarioCTA from "@/components/dashboard/TodayScenarioCTA";
import scenarios from "@/data/scenarios.json";
import type { Scenario } from "@/types";

const MOCK_FINGERPRINT = {
  Decomposition: 75,
  "Hypothesis Quality": 60,
  "Reasoning Depth": 80,
  Honesty: 90,
};

const MOCK_COMPLETED = ["fp-001"];

const nextScenario = (scenarios as Scenario[]).find(
  (s) => !MOCK_COMPLETED.includes(s.id)
) ?? null;

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-ls-bg flex flex-col items-center justify-center gap-6 p-8">
      <FingerprintHero fingerprint={MOCK_FINGERPRINT} attemptCount={3} />
      <TodayScenarioCTA scenario={nextScenario} allCompleted={false} />
      {/* <WeakDimensionBanner /> */}
    </main>
  );
}
