// ============================================================
// LeetSkills MVP — Feedback Panel Component
// Owner: Yousef (UI/UX & Dashboard)
// ============================================================
// TODO: Implement AI feedback display panel

"use client";

import React from "react";

interface FeedbackPanelProps {
  feedback: string;
}

export default function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  return (
    <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 space-y-1">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-blue-600">
        Overall Feedback
      </h3>
      <p className="text-sm text-gray-700 leading-relaxed">{feedback}</p>
    </div>
  );
}
