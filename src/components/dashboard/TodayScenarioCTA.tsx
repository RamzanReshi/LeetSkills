"use client";

import React from "react";
import Link from "next/link";
import type { Scenario } from "@/types";
import { CheckIcon, ArrowRightIcon } from "@/components/ui/Icons";

interface TodayScenarioCTAProps {
  scenario: Scenario | null;
  allCompleted: boolean;
}

export default function TodayScenarioCTA({
  scenario,
  allCompleted,
}: TodayScenarioCTAProps) {
  const trackLabel =
    scenario?.track === "first-principles"
      ? "First Principles"
      : "Productive Struggle";

  return (
    <section className="glass-card w-full max-w-4xl p-8 animate-fade-in [animation-delay:200ms]">
      {allCompleted ? (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-mint text-brand-primary mb-4">
            <CheckIcon className="w-6 h-6" />
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary">
            Mission Complete
          </p>
          <h3 className="mt-3 text-2xl font-bold text-brand-deep">
            All scenarios mastered
          </h3>
          <p className="mt-3 text-neutral-500 max-w-md mx-auto">
            Excellent work. You&apos;ve cleared all currently available cognitive scenarios.
            New scenarios will arrive soon.
          </p>
        </div>
      ) : scenario ? (
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary">
                Active Protocol
              </p>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-neutral-100 border border-neutral-300 rounded-full text-neutral-500">
                Level 1
              </span>
            </div>
            <h3 className="text-3xl font-black text-brand-deep tracking-tight">{trackLabel}</h3>
            <p className="line-clamp-2 text-base text-neutral-700 leading-relaxed max-w-xl">
              {scenario.prompt_text}
            </p>
          </div>
          <Link
            href={`/scenario/${scenario.id}`}
            className="btn-primary inline-flex items-center gap-2 group whitespace-nowrap"
          >
            Launch Scenario
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
