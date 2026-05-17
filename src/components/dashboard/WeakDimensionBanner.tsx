"use client";

import React from "react";
import type { SkillFingerprint, DimensionName } from "@/types";
import { TrendingDownIcon } from "@/components/ui/Icons";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useDimensionLabel } from "@/i18n/content";

interface WeakDimensionBannerProps {
  fingerprint: SkillFingerprint;
}

export default function WeakDimensionBanner({ fingerprint }: WeakDimensionBannerProps) {
  const { t } = useLanguage();
  const dimensionLabel = useDimensionLabel();
  const weakest = (Object.entries(fingerprint) as [DimensionName, number][])
    .sort((a, b) => a[1] - b[1])[0];

  if (!weakest || weakest[1] === 0) return null;

  const [dimensionKey, score] = weakest;
  const dimension = dimensionLabel(dimensionKey);

  return (
    <section className="glass-card w-full max-w-4xl p-6 flex items-center gap-6 border-l-4 border-l-brand-primary animate-fade-in [animation-delay:400ms]">
      <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-brand-mint flex items-center justify-center text-brand-primary">
        <TrendingDownIcon className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-primary mb-1">
          {t("weak.eyebrow")}
        </p>
        <h3 className="text-xl font-bold text-brand-deep tracking-tight">
          {t("weak.title", { dimension }).split(dimension)[0]}
          <span className="text-brand-primary">{dimension}</span>
          {t("weak.title", { dimension }).split(dimension)[1] ?? ""}
        </h3>
        <p className="text-sm text-neutral-500 mt-1">
          {t("weak.detail", { score })}
        </p>
      </div>

      <div className="relative flex-shrink-0 w-20 h-20">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="transparent"
            stroke="var(--neutral-100)"
            strokeWidth="8"
          />
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
          <span className="text-lg font-black text-brand-deep">{score}</span>
        </div>
      </div>
    </section>
  );
}
