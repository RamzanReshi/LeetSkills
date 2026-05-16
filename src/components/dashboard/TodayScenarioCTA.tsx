// ============================================================
// LeetSkills MVP — Today's Scenario CTA
// Owner: Yousef (UI/UX & Dashboard)
// ============================================================
// TODO: Call-to-action card linking to the next available scenario

"use client";

import React from "react";
import type { Scenario } from "@/types";

interface TodayScenarioCTAProps {
  scenario: Scenario | null;
  allCompleted: boolean;
}

export default function TodayScenarioCTA({
  scenario,
  allCompleted,
}: TodayScenarioCTAProps) {
  // TODO: Styled CTA card with scenario preview and "Start" button
  // Show "All scenarios completed!" if allCompleted is true
  return (
    <div>
      {allCompleted ? (
        <p>All scenarios completed!</p>
      ) : scenario ? (
        <div>
          <h3>Today&apos;s Challenge</h3>
          <p>{scenario.track}</p>
          <button>Start Scenario</button>
        </div>
      ) : null}
    </div>
  );
}
