"use client";

import React from "react";

interface WeakestCalloutProps {
  skill: string;
  rating: number;
  weight: number;
}

export default function WeakestCallout({ skill, rating, weight }: WeakestCalloutProps) {
  return (
    <div
      className="w-full rounded-[8px] px-5 py-[14px] flex items-center justify-between gap-4"
      style={{
        background: "rgba(245, 158, 11, 0.06)",
        border: "1px solid rgba(245, 158, 11, 0.25)",
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-9 h-9 flex items-center justify-center rounded-[8px] flex-shrink-0 text-[#F59E0B] text-[18px]"
          style={{ background: "rgba(245, 158, 11, 0.15)" }}
        >
          !
        </div>

        <div className="flex flex-col">
          <span className="text-ls-text font-bold text-[15px] leading-tight">
            Weakest this attempt: {skill}
          </span>
          <span className="text-ls-text-muted text-[13px] leading-tight mt-1">
            Rating {rating}/4 with weight {weight} - focus here next
          </span>
        </div>
      </div>
    </div>
  );
}
