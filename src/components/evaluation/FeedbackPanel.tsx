"use client";

import React from "react";

interface FeedbackPanelProps {
  strengths: string[];
  improvements: string[];
  improvedExample: string;
}

export default function FeedbackPanel({
  strengths,
  improvements,
  improvedExample,
}: FeedbackPanelProps) {
  return (
    <div className="bg-ls-surface border border-ls-border border-l-[4px] border-l-ls-green rounded-[10px] px-6 py-5 shadow-lg">
      <div className="flex justify-between items-center mb-5 pb-5 border-b border-ls-border">
        <div className="flex items-center gap-2">
          <span className="text-ls-green text-[18px] leading-none">*</span>
          <span className="text-ls-text font-bold text-[16px]">AI Feedback</span>
        </div>
        <div className="bg-ls-border px-3 py-[2px] rounded-full">
          <span className="text-ls-green font-mono text-[11px] uppercase tracking-wider">
            Weighted Rubric
          </span>
        </div>
      </div>

      <div className="space-y-5 text-[14px] leading-[1.65] text-ls-text">
        <section>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-ls-green">
            What went well
          </h3>
          <ul className="list-disc space-y-1 pl-5 opacity-90">
            {strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-ls-green">
            What to improve
          </h3>
          <ul className="list-disc space-y-1 pl-5 opacity-90">
            {improvements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg bg-neutral-50 p-4 ring-1 ring-ls-border">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-ls-green">
            Better example response
          </h3>
          <p className="whitespace-pre-wrap opacity-90">{improvedExample}</p>
        </section>
      </div>
    </div>
  );
}
