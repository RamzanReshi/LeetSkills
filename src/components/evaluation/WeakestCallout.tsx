"use client";

import React from "react";
import { motion } from "framer-motion";
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
        <div
          className="w-9 h-9 flex items-center justify-center rounded-[8px] flex-shrink-0 text-[#F59E0B] text-[18px]"
          style={{ background: "rgba(245, 158, 11, 0.15)" }}
        >
          ⚠
        </div>

        <div className="flex flex-col">
          <span className="text-ls-text font-bold text-[15px] leading-tight">
            Weakest this attempt: {dimension}
          </span>
          <span className="text-ls-text-muted text-[13px] leading-tight mt-1">
            Score {score}/{maxScore} — this pulled your overall result down
          </span>
        </div>
      </div>

      <motion.div
        className="flex-shrink-0 cursor-pointer"
        whileHover="hover"
      >
        <span className="text-ls-green text-[13px] font-medium flex items-center gap-1">
          See tips
          <motion.span
            variants={{ hover: { x: 4 } }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            →
          </motion.span>
        </span>
      </motion.div>
    </div>
  );
}
