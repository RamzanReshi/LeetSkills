"use client";

import React from "react";
import SkillRadarChart from "@/components/fingerprint/SkillRadarChart";
import { DASHBOARD_DIMENSIONS } from "@/data/mvp-content";
import type { DimensionName, SkillFingerprint } from "@/types";
import { useLanguage } from "@/i18n/LanguageProvider";

interface FingerprintHeroProps {
  fingerprint: SkillFingerprint;
  attemptCount?: number;
}

const COLORS = ["#3B82F6", "#7C3AED", "#D97706", "#1F8A5B", "#DC2626", "#0891B2"];
const LIGHT_BACKGROUNDS = ["#EFF6FF", "#F5F3FF", "#FFFBEB", "#ECFDF3", "#FEF2F2", "#ECFEFF"];

const DIMENSION_CONFIG: Record<DimensionName, { description: string; color: string; lightBg: string }> =
  DASHBOARD_DIMENSIONS.reduce((acc, dimension, index) => {
    acc[dimension.dimension] = {
      description: dimension.description,
      color: COLORS[index % COLORS.length],
      lightBg: LIGHT_BACKGROUNDS[index % LIGHT_BACKGROUNDS.length],
    };
    return acc;
  }, {} as Record<DimensionName, { description: string; color: string; lightBg: string }>);

function strengthKey(score: number) {
  if (score >= 80) return "fingerprint.strong";
  if (score >= 60) return "fingerprint.developing";
  return "fingerprint.needsFocus";
}

function overallKey(avg: number) {
  if (avg >= 85) return "fingerprint.expert";
  if (avg >= 70) return "fingerprint.proficient";
  if (avg >= 50) return "fingerprint.developing";
  return "fingerprint.beginner";
}

export default function FingerprintHero({
  fingerprint,
  attemptCount = 0,
}: FingerprintHeroProps) {
  const { t } = useLanguage();
  const dimensions = Object.entries(fingerprint) as [DimensionName, number][];
  const average =
    dimensions.reduce((total, [, score]) => total + score, 0) /
    Math.max(dimensions.length, 1);

  return (
    <section
      className="glass-card w-full min-w-0 overflow-hidden p-4 animate-fade-in sm:max-w-full sm:p-8"
      style={{ maxWidth: "calc(100vw - 2rem)" }}
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3 sm:mb-8 sm:gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-brand-primary">
            {t("fingerprint.eyebrow")}
          </p>
          <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-brand-deep sm:text-3xl">
            {t("fingerprint.title")}
          </h2>
        </div>
        <div className="flex gap-3">
          <div className="min-w-[72px] rounded-xl bg-brand-mint px-4 py-2.5 text-center ring-1 ring-neutral-200 sm:min-w-[80px] sm:rounded-2xl sm:px-5 sm:py-3">
            <p className="text-2xl font-black leading-none text-brand-deep sm:text-3xl">
              {Math.round(average)}
            </p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              {t(overallKey(average))}
            </p>
          </div>
          <div className="min-w-[72px] rounded-xl bg-neutral-50 px-4 py-2.5 text-center ring-1 ring-neutral-200 sm:min-w-[80px] sm:rounded-2xl sm:px-5 sm:py-3">
            <p className="text-2xl font-black leading-none text-brand-deep sm:text-3xl">{attemptCount}</p>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              {t("fingerprint.scenarios")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-start">
        <div className="relative flex min-w-0 items-center justify-center py-4">
          <div className="relative z-10 mx-auto aspect-square w-full min-w-0 max-w-[280px]">
            <SkillRadarChart fingerprint={fingerprint} size="lg" />
          </div>
        </div>

        <div
          className="grid w-full max-w-full min-w-0 gap-3"
          style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
        >
          {dimensions.map(([dimension, score]) => {
            const cfg = DIMENSION_CONFIG[dimension];
            return (
              <div
                key={dimension}
                className="min-w-0 rounded-xl p-3 transition-shadow hover:shadow-md sm:p-4"
                style={{
                  backgroundColor: cfg.lightBg,
                  outline: `1px solid ${cfg.color}33`,
                }}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div
                      className="inline-block w-2 h-2 rounded-full mb-1.5"
                      style={{ backgroundColor: cfg.color }}
                    />
                    <h3 className="break-words text-sm font-bold leading-tight" style={{ color: cfg.color }}>
                      {dimension}
                    </h3>
                    <p className="mt-0.5 hidden text-xs leading-snug text-neutral-500 min-[420px]:block">
                      {cfg.description}
                    </p>
                  </div>
                  <span
                    className="shrink-0 font-mono text-xl font-black leading-none sm:text-2xl"
                    style={{ color: cfg.color }}
                  >
                    {score}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/70">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.max(0, Math.min(score, 100))}%`,
                      backgroundColor: cfg.color,
                    }}
                  />
                </div>
                <p
                  className="mt-1.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: cfg.color }}
                >
                  {t(strengthKey(score))}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
