"use client";

import React from "react";

interface FeedbackPanelProps {
  feedback: string;
}

export default function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  return (
    <div className="bg-ls-surface border border-ls-border border-l-[4px] border-l-ls-green rounded-[10px] px-6 py-5 shadow-lg">
      <div className="flex flex-wrap gap-3 justify-between items-center mb-5 pb-5 border-b border-ls-border">
        <div className="flex items-center gap-2">
          <span className="text-ls-green text-[18px] leading-none">✦</span>
          <span className="text-ls-text font-bold text-[16px]">AI Feedback</span>
        </div>
        <div className="bg-ls-border px-3 py-[2px] rounded-full">
          <span className="text-ls-green font-mono text-[11px] uppercase tracking-wider">
            Claude Evaluated
          </span>
        </div>
      </div>

      <p className="text-ls-text text-[15px] leading-[1.7] opacity-90">
        {feedback}
      </p>
    </div>
  );
}
