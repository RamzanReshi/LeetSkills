"use client";

import React from "react";
import type { SkillScore } from "@/types";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useSkillLabel } from "@/i18n/content";

interface ScoreCardProps {
  score: SkillScore;
}

export default function ScoreCard({ score }: ScoreCardProps) {
  const { t } = useLanguage();
  const skillLabel = useSkillLabel();
  const pct = Math.round((score.rating_0_to_4 / 4) * 100);

  return (
    <div className="bg-ls-surface border border-ls-border rounded-[10px] px-5 py-4 hover:border-ls-green/40 transition-colors shadow-sm">
      <div className="flex justify-between items-start gap-4 mb-4">
        <span className="text-ls-text font-bold text-[16px] leading-tight">{skillLabel(score.skill)}</span>
        <span className="text-ls-green font-bold text-[16px] font-mono whitespace-nowrap">
          {score.rating_0_to_4}/4
        </span>
      </div>

      <div className="w-full h-[6px] bg-neutral-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #123D2A 0%, #27AE60 100%)",
          }}
        />
      </div>

      <div className="mb-3 flex justify-between text-[11px] font-mono text-ls-text-muted">
        <span>{t("results.weight", { n: score.weight })}</span>
        <span>{t("results.points", { n: score.weighted_score.toFixed(1) })}</span>
      </div>

      <p className="text-ls-text-muted text-[13px] leading-[1.5]">{score.feedback}</p>
    </div>
  );
}
