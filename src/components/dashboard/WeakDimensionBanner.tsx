// ============================================================
// LeetSkills MVP — Weak Dimension Banner
// Owner: YousefNijim (UI/UX & Dashboard)
// ============================================================
// TODO: Dashboard banner highlighting the user's weakest dimension

"use client";

import React from "react";
import type { SkillFingerprint, DimensionName } from "@/types";

interface WeakDimensionBannerProps {
  fingerprint: SkillFingerprint;
}

export default function WeakDimensionBanner({
  fingerprint,
}: WeakDimensionBannerProps) {
  // TODO: Find weakest dimension and display improvement suggestion
  const weakest = (Object.entries(fingerprint) as [DimensionName, number][])
    .sort((a, b) => a[1] - b[1])[0];

  if (!weakest || weakest[1] === 0) return null;

  return (
    <div>
      <p>Your weakest area: <strong>{weakest[0]}</strong></p>
      <p>Focus on this dimension in your next scenario.</p>
    </div>
  );
}
