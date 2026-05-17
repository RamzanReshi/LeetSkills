// ============================================================
// LeetSkills MVP - Scenario Flow Page
// ============================================================

"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { MVP_SCENARIOS } from "@/data/mvp-content";
import type { AttemptErrorState, Evaluation, Scenario } from "@/types";
import ScenarioPrompt from "@/components/scenario/ScenarioPrompt";
import ThinkingTraceInput from "@/components/scenario/ThinkingTraceInput";
import ResponseInput from "@/components/scenario/ResponseInput";
import { useSkillStore } from "@/store/useSkillStore";
import { validateResponse, validateThinkingTrace } from "@/utils/validation";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useLocalizeScenario } from "@/i18n/content";

const scenarios = MVP_SCENARIOS as Scenario[];

type EvaluateErrorPayload = {
  error?:
    | string
    | {
        code?: string;
        message?: string;
        action?: string;
        retryable?: boolean;
        provider_status?: {
          provider?: string;
          status?: number;
        };
      };
  code?: string;
  message?: string;
  action?: string;
  retryable?: boolean;
  provider_status?: {
    provider?: string;
    status?: number;
  };
  details?: {
    provider?: string;
    model?: string;
    message?: string;
    action?: string;
    raw?: string;
  };
};

export default function ScenarioPage() {
  const params = useParams();
  const router = useRouter();
  const { t, locale } = useLanguage();
  const localize = useLocalizeScenario();
  const scenarioId = params.id as string;
  const AI_UNAVAILABLE_MESSAGE = t("scenario.aiUnavailable");
  const AI_TEMPORARILY_UNAVAILABLE_MESSAGE = t("scenario.aiTempUnavailable");

  const baseScenario = scenarios.find((s) => s.id === scenarioId) ?? null;
  const scenario = baseScenario ? localize(baseScenario) : null;
  const activeDraft = useSkillStore((s) => s.activeDrafts[scenarioId]);
  const hydrated = useSkillStore((s) => s.hydrated);
  const recordScenarioStarted = useSkillStore((s) => s.recordScenarioStarted);
  const updateScenarioDraft = useSkillStore((s) => s.updateScenarioDraft);
  const recordScenarioSubmitted = useSkillStore((s) => s.recordScenarioSubmitted);
  const recordEvaluationFailure = useSkillStore((s) => s.recordEvaluationFailure);
  const recordRetryStarted = useSkillStore((s) => s.recordRetryStarted);
  const completeScenarioAttempt = useSkillStore((s) => s.completeScenarioAttempt);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [timeRemaining, setTimeRemaining] = useState(scenario?.time_limit_seconds ?? 0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [thinkingTrace, setThinkingTrace] = useState("");
  const [response, setResponse] = useState("");
  const [traceValid, setTraceValid] = useState(false);
  const [responseValid, setResponseValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorRetryable, setErrorRetryable] = useState<boolean>(true);
  const [errorAction, setErrorAction] = useState<string | null>(null);
  const [failureCount, setFailureCount] = useState(0);
  const [startedAt, setStartedAt] = useState<number | undefined>(undefined);
  const initializedDraftScenarioRef = useRef<string | null>(null);

  useEffect(() => {
    if (scenario) {
      document.title = `${scenario.title} - LeetSkills`;
    } else {
      document.title = t("scenario.metaTitle");
    }
  }, [scenario, t]);

  useEffect(() => {
    if (!hydrated || !activeDraft) return;
    if (initializedDraftScenarioRef.current === scenarioId) return;
    initializedDraftScenarioRef.current = scenarioId;

    const timeout = window.setTimeout(() => {
      const savedThinkingTrace = activeDraft.user_input.thinking_trace;
      const savedResponse = activeDraft.user_input.response;

      setThinkingTrace(savedThinkingTrace);
      setResponse(savedResponse);
      setTraceValid(validateThinkingTrace(savedThinkingTrace).valid);
      setResponseValid(validateResponse(savedResponse).valid);
      setStartedAt(activeDraft.started_at);
      setError(activeDraft.last_failure?.message ?? null);
      setErrorRetryable(activeDraft.last_failure?.retryable ?? true);
      setErrorAction(activeDraft.last_failure?.action ?? null);
      setFailureCount(activeDraft.last_failure?.failure_count ?? (activeDraft.last_failure ? 1 : 0));
      if (activeDraft.last_failure || activeDraft.user_input.response.trim()) {
        setStep(3);
      } else if (activeDraft.user_input.thinking_trace.trim()) {
        setStep(2);
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [activeDraft, hydrated, scenarioId]);

  useEffect(() => {
    if (!timerRunning || timeRemaining <= 0) return;
    const id = setInterval(() => {
      setTimeRemaining((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, timeRemaining]);

  const handleStart = useCallback(() => {
    const timestamp = recordScenarioStarted(scenarioId);
    setStartedAt(timestamp);
    setTimerRunning(true);
    setStep(2);
  }, [recordScenarioStarted, scenarioId]);

  const handleNextToResponse = useCallback(() => {
    updateScenarioDraft(scenarioId, { thinking_trace: thinkingTrace, response });
    setStep(3);
  }, [response, scenarioId, thinkingTrace, updateScenarioDraft]);

  const handleSubmit = useCallback(async () => {
    if (!scenario) return;
    const userInput = { thinking_trace: thinkingTrace, response };
    if (error) {
      recordRetryStarted(scenarioId);
    }
    const submitTimestamp = recordScenarioSubmitted(scenarioId, userInput);
    setStep(4);
    setTimerRunning(false);
    setError(null);
    setErrorRetryable(true);
    setErrorAction(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario_id: scenarioId,
          thinking_trace: thinkingTrace,
          response,
          locale,
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as EvaluateErrorPayload | null;
        if (payload?.details) {
          console.warn("[evaluate] dev details:", payload.details);
        }
        const structuredError = typeof payload?.error === "object" ? payload.error : undefined;
        const providerStatus = structuredError?.provider_status ?? payload?.provider_status;
        const nextFailureCount = (activeDraft?.last_failure?.failure_count ?? failureCount) + 1;
        const errorState: AttemptErrorState = {
          message:
            nextFailureCount > 1
              ? AI_TEMPORARILY_UNAVAILABLE_MESSAGE
              : structuredError?.message ?? payload?.message ?? (typeof payload?.error === "string" ? payload.error : AI_UNAVAILABLE_MESSAGE),
          code: structuredError?.code ?? payload?.code,
          action:
            structuredError?.action ??
            payload?.action ??
            "Retry the submission in a moment. Your thinking trace and final response remain on this page.",
          provider: providerStatus?.provider ?? payload?.details?.provider,
          provider_status: providerStatus?.status,
          model: payload?.details?.model,
          retryable: structuredError?.retryable ?? payload?.retryable ?? true,
          failure_count: nextFailureCount,
          fallback_used: false,
        };
        recordEvaluationFailure(scenarioId, userInput, errorState);
        setError(errorState.message);
        setErrorRetryable(errorState.retryable ?? true);
        setErrorAction(errorState.action ?? null);
        setFailureCount(nextFailureCount);
        setStep(3);
        return;
      }

      const evaluation = (await res.json()) as Evaluation & {
        fallback_used?: boolean;
        error_state?: AttemptErrorState;
      };
      completeScenarioAttempt({
        scenario,
        evaluation,
        userInput,
        startedAt,
        submittedAt: submitTimestamp,
        fallbackUsed: Boolean(evaluation.fallback_used),
        errorState: evaluation.error_state,
      });
      router.push(`/results/${scenarioId}`);
    } catch (err) {
      console.warn("[evaluate] submit failed:", err);
      const nextFailureCount = (activeDraft?.last_failure?.failure_count ?? failureCount) + 1;
      const userMessage = nextFailureCount > 1 ? AI_TEMPORARILY_UNAVAILABLE_MESSAGE : AI_UNAVAILABLE_MESSAGE;
      recordEvaluationFailure(scenarioId, userInput, {
        message: userMessage,
        action: "Retry the submission in a moment. Your thinking trace and final response remain on this page.",
        retryable: true,
        failure_count: nextFailureCount,
        fallback_used: false,
      });
      setError(userMessage);
      setErrorRetryable(true);
      setErrorAction("Retry the submission in a moment. Your thinking trace and final response remain on this page.");
      setFailureCount(nextFailureCount);
      setStep(3);
    }
  }, [
    AI_TEMPORARILY_UNAVAILABLE_MESSAGE,
    AI_UNAVAILABLE_MESSAGE,
    activeDraft,
    completeScenarioAttempt,
    error,
    failureCount,
    locale,
    recordEvaluationFailure,
    recordRetryStarted,
    recordScenarioSubmitted,
    response,
    router,
    scenario,
    scenarioId,
    startedAt,
    thinkingTrace,
  ]);

  if (!scenario) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-brand-deep">{t("scenario.notFound")}</h1>
        <p className="mt-2 text-neutral-500">{t("scenario.notFoundDetail", { id: scenarioId })}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      <div className="flex gap-2 text-xs font-medium text-neutral-500">
        {(
          [
            ["scenario.step.read", "Read"],
            ["scenario.step.think", "Think"],
            ["scenario.step.respond", "Respond"],
            ["scenario.step.submitting", "Submitting"],
          ] as const
        ).map(([key, fallback], i) => (
          <span
            key={fallback}
            className={`rounded-full px-2 py-0.5 ${
              step === i + 1 ? "bg-brand-mint text-brand-primary" : ""
            }`}
          >
            {i + 1}. {t(key)}
          </span>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <ScenarioPrompt scenario={scenario} timeRemaining={timeRemaining} />
          <button onClick={handleStart} className="btn-primary w-full">
            {t("scenario.start")}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <ScenarioPrompt scenario={scenario} timeRemaining={timeRemaining} />
          <ThinkingTraceInput
            value={thinkingTrace}
            onChange={setThinkingTrace}
            onValidChange={setTraceValid}
          />
          <button
            onClick={handleNextToResponse}
            disabled={!traceValid}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
          >
            {t("scenario.next")}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <ScenarioPrompt scenario={scenario} timeRemaining={timeRemaining} />
          <ThinkingTraceInput
            value={thinkingTrace}
            onChange={setThinkingTrace}
            onValidChange={setTraceValid}
          />
          <ResponseInput
            value={response}
            onChange={setResponse}
            onValidChange={setResponseValid}
          />
          {error && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-semibold">{error}</p>
              {errorAction && <p className="mt-1 text-amber-800">{errorAction}</p>}
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={!traceValid || !responseValid}
            className="btn-action w-full disabled:cursor-not-allowed disabled:opacity-40"
          >
            {error ? (errorRetryable ? t("scenario.tryAgain") : t("scenario.tryAgainLater")) : t("scenario.submit")}
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col items-center gap-4 py-16 text-neutral-700">
          <svg className="h-8 w-8 animate-spin text-brand-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm font-medium">{t("scenario.evaluating")}</p>
        </div>
      )}
    </main>
  );
}
