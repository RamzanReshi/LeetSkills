"use client";

import React from "react";
import type { SkillFingerprint, DimensionName } from "@/types";

interface WeakDimensionBannerProps {
  fingerprint: SkillFingerprint;
}

export default function WeakDimensionBanner({ fingerprint }: WeakDimensionBannerProps) {
  const weakest = (Object.entries(fingerprint) as [DimensionName, number][])
    .sort((a, b) => a[1] - b[1])[0];

  if (!weakest || weakest[1] === 0) return null;

  const [dimension, score] = weakest;

  const ringStyle = {
    background: `radial-gradient(closest-side, var(--ls-surface) 79%, transparent 80% 100%),
                 conic-gradient(#F59E0B ${score}%, #2D3748 0)`,
  };

  return (
    <div className="w-full max-w-[400px] bg-ls-surface border border-ls-border border-l-[4px] border-l-[#F59E0B] rounded-[12px] px-6 py-5 flex items-center gap-5">
      {/* Warning icon */}
      <div className="flex-shrink-0 text-[#F59E0B] text-[22px] leading-none">
        ⚠
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-ls-green font-mono uppercase tracking-widest text-[11px] mb-1">
          Focus Area
        </p>
        <h3 className="text-ls-text font-bold text-[16px] leading-tight mb-1">
          Your weakest area is {dimension}
        </h3>
        <p className="text-ls-text-muted text-[13px]">
          Score: {score} / 100 — prioritize this in your next attempt
        </p>
      </div>

      {/* Circular score ring */}
      <div
        className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center"
        style={ringStyle}
      >
        <span className="text-ls-text font-bold text-[18px]">{score}</span>
      </div>
    </div>
  );
}
