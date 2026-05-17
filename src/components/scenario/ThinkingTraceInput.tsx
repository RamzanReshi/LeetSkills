// ============================================================
// LeetSkills MVP — Thinking Trace Input
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================

"use client";

import React from "react";
import { validateThinkingTrace } from "@/utils/validation";

const MIN_CHARS = 80;

interface ThinkingTraceInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Called whenever validity changes so parent can gate the Next button */
  onValidChange?: (isValid: boolean) => void;
}

export default function ThinkingTraceInput({
  value,
  onChange,
  onValidChange,
}: ThinkingTraceInputProps) {
  const { valid, charCount } = validateThinkingTrace(value);
  const remaining = Math.max(0, MIN_CHARS - charCount);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    onChange(next);
    onValidChange?.(validateThinkingTrace(next).valid);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-neutral-700">
          Thinking Trace
          <span className="ml-1 text-xs text-neutral-500">(min {MIN_CHARS} chars)</span>
        </label>
      </div>

      <details className="rounded-lg border border-neutral-200 bg-neutral-50 cursor-pointer">
        <summary className="px-3 py-2 text-xs font-semibold text-neutral-600 list-none flex items-center justify-between select-none">
          <span>💡 Need a starting point?</span>
          <span className="text-neutral-400 text-[10px] font-normal">tap to expand</span>
        </summary>
        <ul className="px-4 pb-3 pt-1 space-y-1 text-xs text-neutral-600 list-disc list-inside leading-relaxed">
          <li>What is the core problem? Break it into sub-components.</li>
          <li>What assumptions am I making — which could be wrong?</li>
          <li>What would I check first, and why that before other things?</li>
          <li>What are the most likely failure modes or edge cases?</li>
          <li>What remains uncertain, and what would resolve that?</li>
        </ul>
      </details>

      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Show your reasoning process — what assumptions are you making, what are you ruling out, what's your approach? Example: I am assuming..., I need to decide..., I am ruling out..., so my approach is..."
        rows={8}
        className={`w-full rounded-lg border bg-brand-card px-3 py-2 text-sm leading-relaxed text-neutral-900 outline-none transition-colors focus:ring-2 ${
          value.length > 0 && !valid
            ? "border-red-400 focus:ring-red-200"
            : "border-neutral-300 focus:ring-brand-primary/30 focus:border-brand-primary"
        }`}
      />
      <div className="flex justify-between text-xs">
        {value.length > 0 && !valid ? (
          <span className="text-red-600">{remaining} more characters needed</span>
        ) : valid ? (
          <span className="text-brand-primary">Looks good</span>
        ) : (
          <span className="text-neutral-500">Start typing your thinking trace…</span>
        )}
        <span className="text-neutral-500">{charCount} chars</span>
      </div>
    </div>
  );
}
