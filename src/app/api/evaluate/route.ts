// ============================================================
// LeetSkills MVP — POST /api/evaluate
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================
// TODO: Implement the evaluation API route
//
// Handles: POST /api/evaluate
// Request:  { scenario_id, thinking_trace, response }
// Response: { scores, feedback, weakest_dimension }

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // TODO: Implement in Phase 2
  // 1. Parse and validate request body
  // 2. Load scenario from scenarios.json by ID
  // 3. Call evaluateSubmission() from lib/claude.ts
  // 4. Return structured evaluation response
  // 5. On failure, return fallback evaluation
  return NextResponse.json(
    { error: "Not implemented — Phase 2" },
    { status: 501 }
  );
}
