"use client";

import React from "react";
import AppShell from "@/components/shell/AppShell";
import FingerprintHero from "@/components/dashboard/FingerprintHero";
import TodayScenarioCTA from "@/components/dashboard/TodayScenarioCTA";
import WeakDimensionBanner from "@/components/dashboard/WeakDimensionBanner";
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
    <AppShell>
      <main className="flex flex-col gap-6 p-6">
        <FingerprintHero fingerprint={MOCK_FINGERPRINT} attemptCount={3} />
        <TodayScenarioCTA scenario={nextScenario} allCompleted={false} />
        <WeakDimensionBanner fingerprint={MOCK_FINGERPRINT} />
      </main>
    </AppShell>
  );
}
