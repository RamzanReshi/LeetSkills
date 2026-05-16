// ============================================================
// LeetSkills MVP — Feedback Panel Component
// Owner: YousefNijim (UI/UX & Dashboard)
// ============================================================
// TODO: Implement AI feedback display panel

"use client";

import React from "react";

interface FeedbackPanelProps {
  feedback: string;
}

export default function FeedbackPanel({ feedback }: FeedbackPanelProps) {
  // TODO: Styled feedback panel with clear typography
  return (
    <div>
      <h3>AI Feedback</h3>
      <p>{feedback}</p>
    </div>
  );
}
