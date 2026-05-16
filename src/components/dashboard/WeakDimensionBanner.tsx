"use client";

import type { SkillFingerprint, DimensionName } from "@/types";
import { TrendingDownIcon } from "@/components/ui/Icons";

interface WeakDimensionBannerProps {
  fingerprint: SkillFingerprint;
}

export default function WeakDimensionBanner({ fingerprint }: WeakDimensionBannerProps) {
  const weakest = (Object.entries(fingerprint) as [DimensionName, number][])
    .sort((a, b) => a[1] - b[1])[0];

  if (!weakest || weakest[1] === 0) return null;

  const [dimension, score] = weakest;

  return (
    <section className="glass-card-static w-full p-4 sm:p-6 flex items-center gap-4 sm:gap-6 border-l-4 border-l-brand-primary animate-fade-in [animation-delay:400ms]">
      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-mint flex items-center justify-center text-brand-primary">
        <TrendingDownIcon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-primary mb-1">
          Growth Opportunity
        </p>
        <h3 className="text-lg sm:text-xl font-bold text-brand-deep tracking-tight">
          Enhance your <span className="text-brand-primary">{dimension}</span>
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Currently at {score}% — focusing on this dimension will yield the highest cognitive gains.
        </p>
      </div>

      <div className="relative flex-shrink-0 w-16 h-16 hidden sm:block">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="transparent" stroke="var(--neutral-100)" strokeWidth="8" />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="transparent"
            stroke="var(--brand-primary)"
            strokeWidth="8"
            strokeDasharray={2 * Math.PI * 34}
            strokeDashoffset={2 * Math.PI * 34 * (1 - score / 100)}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-black text-brand-deep">{score}</span>
        </div>
      </div>
    </section>
  );
}
