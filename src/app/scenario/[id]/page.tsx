// ============================================================
// LeetSkills MVP — Scenario Flow Page
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================
// TODO: Implement the full scenario flow:
// Step 1: Show scenario prompt + timer
// Step 2: Thinking trace input (min 80 chars)
// Step 3: Response input
// Step 4: Submit to /api/evaluate
// Step 5: Navigate to results page

"use client";

import React from "react";
import { useParams } from "next/navigation";

export default function ScenarioPage() {
  const params = useParams();
  const scenarioId = params.id as string;

  // TODO: Load scenario from scenarios.json by ID
  // TODO: Implement multi-step form flow
  // TODO: Integrate Timer component
  // TODO: Submit to /api/evaluate
  // TODO: Navigate to /results/[id] on completion

  return (
    <main>
      <h1>Scenario: {scenarioId}</h1>
      <p>Scenario flow page — implement in Phase 3</p>
      {/* <ScenarioPrompt /> */}
      {/* <Timer /> */}
      {/* <ThinkingTraceInput /> */}
      {/* <ResponseInput /> */}
      {/* <Button>Submit</Button> */}
    </main>
  );
}
