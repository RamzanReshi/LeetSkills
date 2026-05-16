// ============================================================
// LeetSkills MVP — Loading Spinner Component
// Owner: reshiahmed (Foundation & Infrastructure)
// ============================================================
// TODO: Implement animated loading spinner

"use client";

import React from "react";

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({
  message = "Loading...",
}: LoadingSpinnerProps) {
  // TODO: Style with Tailwind animation (spin, pulse)
  return (
    <div role="status" aria-label={message}>
      <div>{/* Spinner SVG or CSS animation */}</div>
      <p>{message}</p>
    </div>
  );
}
