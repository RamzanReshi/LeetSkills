"use client";

import React from "react";
import FingerprintHero from "@/components/dashboard/FingerprintHero";
import TodayScenarioCTA from "@/components/dashboard/TodayScenarioCTA";
import WeakDimensionBanner from "@/components/dashboard/WeakDimensionBanner";
import { useSkillStore } from "@/store/useSkillStore";
import scenarios from "@/data/scenarios.json";
import type { Scenario } from "@/types";

const allScenarios = scenarios as Scenario[];

export default function DashboardPage() {
  const fingerprint = useSkillStore((s) => s.fingerprint);
  const completedScenarioIds = useSkillStore((s) => s.completedScenarioIds);
  const attemptCount = useSkillStore((s) => s.history.length);

  const nextScenario = allScenarios.find((s) => !completedScenarioIds.includes(s.id)) ?? null;
  const allCompleted = allScenarios.length > 0 && completedScenarioIds.length >= allScenarios.length;

  return (
    <main className="container mx-auto flex flex-col items-center gap-8 py-12 px-4 sm:px-6">
      <FingerprintHero fingerprint={fingerprint} attemptCount={attemptCount} />
      <TodayScenarioCTA scenario={nextScenario} allCompleted={allCompleted} />
      <WeakDimensionBanner fingerprint={fingerprint} />
    </main>
  );
}
