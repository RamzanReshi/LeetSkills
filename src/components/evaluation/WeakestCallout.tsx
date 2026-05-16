"use client";

import React from "react";
import type { DimensionName } from "@/types";

interface WeakestCalloutProps {
  dimension: DimensionName;
  score: number;
  maxScore: number;
}

export default function WeakestCallout({ dimension, score, maxScore }: WeakestCalloutProps) {
  return (
    <div
      className="w-full rounded-xl px-4 py-4 flex flex-wrap items-center gap-3 sm:flex-nowrap sm:justify-between sm:px-5"
      style={{
        background: "rgba(245, 158, 11, 0.06)",
        border: "1px solid rgba(245, 158, 11, 0.25)",
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 flex items-center justify-center rounded-lg flex-shrink-0 text-[#F59E0B] text-base"
          style={{ background: "rgba(245, 158, 11, 0.15)" }}
        >
          ⚠
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-neutral-900 font-bold text-[14px] leading-tight">
            Weakest this attempt: {dimension}
          </span>
          <span className="text-neutral-500 text-[12px] leading-tight mt-0.5">
            Score {score}/{maxScore} — this pulled your overall result down
          </span>
        </div>
      </div>
      <div className="shrink-0 ml-auto sm:ml-0">
        <span className="text-brand-primary text-[13px] font-semibold flex items-center gap-1 hover:underline cursor-pointer">
          See tips →
        </span>
      </div>
    </div>
  );
}
