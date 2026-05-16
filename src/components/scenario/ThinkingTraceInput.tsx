// ============================================================
// LeetSkills MVP — Thinking Trace Input
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================
// TODO: Implement thinking trace textarea with 80-char minimum validation

"use client";

import React from "react";

interface ThinkingTraceInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ThinkingTraceInput({
  value,
  onChange,
}: ThinkingTraceInputProps) {
  // TODO: TextArea with live validation (min 80 chars)
  return (
    <div>
      <label>Thinking Trace</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Show your reasoning process... (minimum 80 characters)"
      />
    </div>
  );
}
