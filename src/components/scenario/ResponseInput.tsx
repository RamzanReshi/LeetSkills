// ============================================================
// LeetSkills MVP — Response Input
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================

"use client";

import React from "react";
import { validateResponse } from "@/utils/validation";

interface ResponseInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Called whenever validity changes so parent can gate the Submit button */
  onValidChange?: (isValid: boolean) => void;
}

export default function ResponseInput({
  value,
  onChange,
  onValidChange,
}: ResponseInputProps) {
  const { valid } = validateResponse(value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    onChange(next);
    onValidChange?.(validateResponse(next).valid);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Your Response
      </label>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Write your final, structured response to the scenario."
        rows={10}
        className={`w-full rounded-lg border px-3 py-2 text-sm leading-relaxed outline-none transition-colors focus:ring-2 ${
          value.length > 0 && !valid
            ? "border-red-400 focus:ring-red-300"
            : "border-gray-300 focus:ring-blue-300"
        }`}
      />
      {value.length > 0 && !valid && (
        <p className="text-xs text-red-500">Response cannot be empty.</p>
      )}
    </div>
  );
}
