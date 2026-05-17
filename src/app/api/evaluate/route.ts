// ============================================================
// LeetSkills MVP - POST /api/evaluate
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { MVP_SCENARIOS } from "@/data/mvp-content";
import { evaluateSubmission } from "@/lib/claude";
import { classifyAiProviderError } from "@/lib/providers/errors";
import { validateThinkingTrace, validateResponse } from "@/utils/validation";
import type { Scenario, Submission } from "@/types";

const scenarios = MVP_SCENARIOS as Scenario[];

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { scenario_id, thinking_trace, response, locale } = body as {
    scenario_id?: string;
    thinking_trace?: string;
    response?: string;
    locale?: string;
  };
  const safeLocale = locale === "ar" || locale === "tr" ? locale : "en";

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

  const scenario = scenarios.find((s) => s.id === scenario_id);
  if (!scenario) {
    return NextResponse.json({ error: `Scenario "${scenario_id}" not found` }, { status: 404 });
  }

  const submission: Submission = {
    scenario_id,
    thinking_trace: (thinking_trace as string).trim(),
    response: (response as string).trim(),
  };

  try {
    const evaluation = await evaluateSubmission(scenario, submission, safeLocale);
    return NextResponse.json(evaluation, { status: 200 });
  } catch (err) {
    const issue = classifyAiProviderError(err);
    console.error("AI evaluation failed:", issue);

    const isDev = process.env.NODE_ENV === "development";
    const providerStatus = {
      provider: issue.provider,
      status: issue.status,
    };
    const errorPayload = {
      code: issue.code,
      message: issue.userMessage,
      action: issue.userAction,
      retryable: issue.retryable,
      provider_status: providerStatus,
    };

    return NextResponse.json(
      {
        error: errorPayload,
        code: issue.code,
        message: issue.userMessage,
        action: issue.userAction,
        retryable: issue.retryable,
        provider_status: providerStatus,
        details: isDev
          ? {
              provider: issue.provider,
              model: issue.model,
              message: issue.message,
              action: issue.action,
              raw: issue.rawMessage,
            }
          : undefined,
      },
      { status: issue.status },
    );
  }
}
