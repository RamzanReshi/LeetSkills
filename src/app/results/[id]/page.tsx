// ============================================================
// LeetSkills MVP — Results Page
// Owner: Yousef (UI/UX & Dashboard)
// ============================================================
// TODO: Implement evaluation results display:
// - 4 ScoreCards (one per dimension)
// - Feedback panel
// - Weakest dimension callout
// - Updated Skill Fingerprint radar chart
// - "Back to Dashboard" CTA

"use client";

import React from "react";
import { useParams } from "next/navigation";

export default function ResultsPage() {
  const params = useParams();
  const scenarioId = params.id as string;

  // TODO: Load latest evaluation from store by scenarioId
  // TODO: Display scores, feedback, and updated fingerprint

  return (
    <main>
      <h1>Results: {scenarioId}</h1>
      <p>Results page — implement in Phase 3</p>
      {/* <ScoreCard /> x4 */}
      {/* <FeedbackPanel /> */}
      {/* <WeakestCallout /> */}
      {/* <SkillRadarChart /> */}
      {/* <Button>Back to Dashboard</Button> */}
    </main>
  );
}
