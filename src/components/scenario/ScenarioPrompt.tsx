// ============================================================
// LeetSkills MVP — Scenario Prompt Display
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================
// TODO: Implement scenario prompt display with constraints and timer

"use client";

import React from "react";
import type { Scenario } from "@/types";

interface ScenarioPromptProps {
  scenario: Scenario;
}

export default function ScenarioPrompt({ scenario }: ScenarioPromptProps) {
  // TODO: Display scenario text, track badge, time limit, constraints
  return (
    <div>
      <span>{scenario.track}</span>
      <p>{scenario.prompt_text}</p>
    </div>
  );
}
