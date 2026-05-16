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
      className="w-full rounded-[8px] px-5 py-[14px] flex items-center justify-between gap-4"
      style={{
        background: "rgba(245, 158, 11, 0.06)",
        border: "1px solid rgba(245, 158, 11, 0.25)",
      }}
    >
      <div className="flex items-center gap-4">
        {/* Amber icon badge */}
        <div
          className="w-9 h-9 flex items-center justify-center rounded-[8px] flex-shrink-0 text-[#F59E0B] text-[18px]"
          style={{ background: "rgba(245, 158, 11, 0.15)" }}
        >
          ⚠
        </div>

        {/* Text */}
        <div className="flex flex-col">
          <span className="text-ls-text font-bold text-[15px] leading-tight">
            Weakest this attempt: {dimension}
          </span>
          <span className="text-ls-text-muted text-[13px] leading-tight mt-1">
            Score {score}/{maxScore} — this pulled your overall result down
          </span>
        </div>
      </div>

      {/* See tips link */}
      <div className="flex-shrink-0">
        <span className="text-ls-green text-[13px] font-medium flex items-center gap-1 hover:underline cursor-pointer">
          See tips →
        </span>
      </div>
    </div>
  );
}
