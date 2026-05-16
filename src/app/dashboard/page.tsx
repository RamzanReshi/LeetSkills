"use client";

import React from "react";
import AppShell from "@/components/shell/AppShell";
import FingerprintHero from "@/components/dashboard/FingerprintHero";
import TodayScenarioCTA from "@/components/dashboard/TodayScenarioCTA";
import WeakDimensionBanner from "@/components/dashboard/WeakDimensionBanner";
import { MVP_SCENARIOS } from "@/data/mvp-content";
import type { Scenario } from "@/types";
import { useSkillStore } from "@/store/useSkillStore";

const scenarios = MVP_SCENARIOS as Scenario[];

export default function DashboardPage() {
  const fingerprint = useSkillStore((s) => s.fingerprint);
  const completedScenarioIds = useSkillStore((s) => s.completedScenarioIds);
  const attemptCount = useSkillStore((s) => s.history.length);

  const nextScenario =
    scenarios.find((scenario) => !completedScenarioIds.includes(scenario.id)) ?? null;

  return (
    <AppShell>
      <main className="flex max-w-full flex-col gap-4 overflow-x-hidden p-4 sm:gap-6 sm:p-6">
        <FingerprintHero fingerprint={fingerprint} attemptCount={attemptCount} />
        <TodayScenarioCTA scenario={nextScenario} allCompleted={!nextScenario} />
        <WeakDimensionBanner fingerprint={fingerprint} />
      </main>
    </AppShell>
  );
}
