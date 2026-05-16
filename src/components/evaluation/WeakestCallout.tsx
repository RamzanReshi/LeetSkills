// ============================================================
// LeetSkills MVP — Weakest Dimension Callout
// Owner: Yousef (UI/UX & Dashboard)
// ============================================================
// TODO: Implement highlighted callout for weakest dimension

"use client";

import React from "react";
import type { DimensionName } from "@/types";

interface WeakestCalloutProps {
  dimension: DimensionName;
}

export default function WeakestCallout({ dimension }: WeakestCalloutProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <span className="mt-0.5 text-amber-500 text-lg" aria-hidden>⚠</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
          Focus area for next session
        </p>
        <p className="text-sm font-medium text-amber-900">{dimension}</p>
        <p className="text-xs text-amber-700 mt-0.5">
          This was your lowest-scoring dimension. Prioritise it in your next scenario.
        </p>
      </div>
    </div>
  );
}
