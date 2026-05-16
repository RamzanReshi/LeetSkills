// ============================================================
// LeetSkills MVP — POST /api/evaluate
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================
// Handles: POST /api/evaluate
// Request:  { scenario_id, thinking_trace, response }
// Response: Evaluation object (or fallback on AI failure)

import { NextRequest, NextResponse } from "next/server";
import scenarios from "@/data/scenarios.json";
import { evaluateSubmission } from "@/lib/claude";
import { getFallbackEvaluation } from "@/lib/fallbackEvaluation";
import { validateThinkingTrace, validateResponse } from "@/utils/validation";
import type { Submission } from "@/types";

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { scenario_id, thinking_trace, response } = body as {
    scenario_id?: string;
    thinking_trace?: string;
    response?: string;
  };

  if (!scenario_id || typeof scenario_id !== "string") {
    return NextResponse.json({ error: "scenario_id is required" }, { status: 400 });
  }

  const traceValidation = validateThinkingTrace(thinking_trace ?? "");
  if (!traceValidation.valid) {
    return NextResponse.json({ error: traceValidation.message }, { status: 400 });
  }

  const responseValidation = validateResponse(response ?? "");
  if (!responseValidation.valid) {
    return NextResponse.json({ error: responseValidation.message }, { status: 400 });
  }

  const scenario = (scenarios as { id: string }[]).find(
    (s) => s.id === scenario_id
  );
  if (!scenario) {
    return NextResponse.json({ error: `Scenario "${scenario_id}" not found` }, { status: 404 });
  }

  const submission: Submission = {
    scenario_id,
    thinking_trace: (thinking_trace as string).trim(),
    response: (response as string).trim(),
  };

  try {
    // evaluateSubmission already catches provider/parse errors and returns fallback
    const evaluation = await evaluateSubmission(scenario as never, submission);
    return NextResponse.json(evaluation, { status: 200 });
  } catch (err) {
    console.error("Unhandled error in /api/evaluate:", err);
    return NextResponse.json(getFallbackEvaluation(scenario_id), { status: 200 });
  }
}
