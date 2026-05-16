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
      <label className="block text-sm font-medium text-neutral-700">
        Thinking Trace
        <span className="ml-1 text-xs text-neutral-500">(minimum {MIN_CHARS} characters)</span>
      </label>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Show your reasoning process — what assumptions are you making, what are you ruling out, what's your approach?"
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
