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
  // TODO: Highlighted banner showing weakest dimension with icon
  return (
    <div>
      <strong>Focus area:</strong> {dimension}
    </div>
  );
}
