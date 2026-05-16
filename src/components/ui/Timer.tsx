// ============================================================
// LeetSkills MVP — Timer Component
// Owner: reshiahmed (Foundation & Infrastructure)
// ============================================================
// TODO: Implement countdown timer with visual urgency states

"use client";

import React from "react";

interface TimerProps {
  totalSeconds: number;
  onTimeUp?: () => void;
}

export default function Timer({ totalSeconds, onTimeUp }: TimerProps) {
  // TODO: Implement countdown with:
  // - MM:SS display
  // - Color changes at 50%, 25%, 10% remaining
  // - onTimeUp callback when timer reaches 0
  return (
    <div>
      <span>{Math.floor(totalSeconds / 60)}:{String(totalSeconds % 60).padStart(2, "0")}</span>
    </div>
  );
}
