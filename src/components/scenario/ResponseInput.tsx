// ============================================================
// LeetSkills MVP — Response Input
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================
// TODO: Implement response textarea

"use client";

import React from "react";

interface ResponseInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ResponseInput({
  value,
  onChange,
}: ResponseInputProps) {
  // TODO: TextArea for final response
  return (
    <div>
      <label>Your Response</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your final response..."
      />
    </div>
  );
}
