// ============================================================
// LeetSkills MVP - POST /api/evaluate
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { MVP_SCENARIOS } from "@/data/mvp-content";
import { evaluateSubmission } from "@/lib/claude";
import { classifyAiProviderError } from "@/lib/providers/errors";
import { rateLimit } from "@/lib/rateLimit";
import { createClient } from "@/lib/supabase/server";
import {
  MAX_TOTAL_INPUT_CHARS,
  estimateTokens,
  looksLikeGibberish,
  truncateToTokenBudget,
  validateResponse,
  validateThinkingTrace,
} from "@/utils/validation";
import type { Scenario, Submission } from "@/types";

const scenarios = MVP_SCENARIOS as Scenario[];

// Per-user (or per-IP) AI usage caps.
const USER_LIMIT_PER_MIN = 5;
const USER_LIMIT_PER_DAY = 60;
const ANON_LIMIT_PER_MIN = 2;
const ANON_LIMIT_PER_DAY = 10;
// Token budget across thinking trace + response sent to the model.
const MAX_INPUT_TOKENS = 2000;

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function rateLimitHeaders(short: ReturnType<typeof rateLimit>, day: ReturnType<typeof rateLimit>) {
  return {
    "X-RateLimit-Limit-Minute": String(short.limit),
    "X-RateLimit-Remaining-Minute": String(short.remaining),
    "X-RateLimit-Limit-Day": String(day.limit),
    "X-RateLimit-Remaining-Day": String(day.remaining),
  };
}

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

  let trimmedTrace = (thinking_trace as string).trim();
  let trimmedResponse = (response as string).trim();

  if (looksLikeGibberish(trimmedTrace) || looksLikeGibberish(trimmedResponse)) {
    return NextResponse.json(
      {
        code: "INPUT_LOW_EFFORT",
        message:
          "Your submission looks like placeholder or random text. Write a genuine thinking trace and response so the AI can give meaningful feedback.",
        action:
          "Edit your answer with real reasoning about the scenario, then submit again.",
        retryable: true,
      },
      { status: 422 },
    );
  }
  // Hard char ceiling — defensive; client maxLength should already enforce.
  if (trimmedTrace.length + trimmedResponse.length > MAX_TOTAL_INPUT_CHARS) {
    trimmedTrace = trimmedTrace.slice(0, MAX_TOTAL_INPUT_CHARS);
    trimmedResponse = trimmedResponse.slice(
      0,
      Math.max(0, MAX_TOTAL_INPUT_CHARS - trimmedTrace.length),
    );
  }

  // Token-budget enforcement: truncate (keep the start) rather than reject.
  // Split budget proportionally to the original sizes so neither field is zeroed out.
  const traceTokens = estimateTokens(trimmedTrace);
  const responseTokens = estimateTokens(trimmedResponse);
  const totalTokens = traceTokens + responseTokens;
  if (totalTokens > MAX_INPUT_TOKENS) {
    const traceShare = traceTokens / totalTokens;
    const traceBudget = Math.max(50, Math.floor(MAX_INPUT_TOKENS * traceShare));
    const responseBudget = Math.max(50, MAX_INPUT_TOKENS - traceBudget);
    trimmedTrace = truncateToTokenBudget(trimmedTrace, traceBudget);
    trimmedResponse = truncateToTokenBudget(trimmedResponse, responseBudget);
  }

  const scenario = scenarios.find((s) => s.id === scenario_id);
  if (!scenario) {
    return NextResponse.json({ error: `Scenario "${scenario_id}" not found` }, { status: 404 });
  }

  // Identify caller — prefer authenticated user, fall back to IP for anon.
  let identity = `ip:${clientIp(request)}`;
  let perMin = ANON_LIMIT_PER_MIN;
  let perDay = ANON_LIMIT_PER_DAY;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      identity = `user:${data.user.id}`;
      perMin = USER_LIMIT_PER_MIN;
      perDay = USER_LIMIT_PER_DAY;
    }
  } catch {
    // Supabase not configured — stay on anon limits.
  }

  const minuteCheck = rateLimit(`evaluate:min:${identity}`, perMin, 60_000);
  const dayCheck = rateLimit(`evaluate:day:${identity}`, perDay, 24 * 60 * 60_000);
  const headers = rateLimitHeaders(minuteCheck, dayCheck);

  if (!minuteCheck.allowed || !dayCheck.allowed) {
    const which = !minuteCheck.allowed ? minuteCheck : dayCheck;
    const retryAfter = Math.max(1, Math.ceil((which.resetAt - Date.now()) / 1000));
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Please slow down.",
        retry_after_seconds: retryAfter,
        scope: !minuteCheck.allowed ? "minute" : "day",
      },
      { status: 429, headers: { ...headers, "Retry-After": String(retryAfter) } },
    );
  }

  const submission: Submission = {
    scenario_id,
    thinking_trace: trimmedTrace,
    response: trimmedResponse,
  };

  try {
    const evaluation = await evaluateSubmission(scenario, submission, safeLocale);
    return NextResponse.json(evaluation, { status: 200, headers });
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
      { status: issue.status, headers },
    );
  }
}
