"use client";

import React from "react";

interface FeedbackPanelProps {
  feedback: string;
}

export default function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  return (
    <div className="rounded-xl border border-neutral-200 border-l-4 border-l-brand-primary bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-mint flex items-center justify-center text-brand-primary text-base leading-none">
            ✦
          </div>
          <span className="font-bold text-neutral-900 text-[16px]">AI Feedback</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-600">
            Claude Evaluated
          </span>
        </div>
      </div>
      <p className="text-neutral-700 text-[15px] leading-[1.75]">{feedback}</p>
    </div>
  );
}
