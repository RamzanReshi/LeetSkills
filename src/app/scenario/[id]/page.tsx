// ============================================================
// LeetSkills MVP — Scenario Flow Page
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================
// Steps: 1 = Read prompt  2 = Thinking trace  3 = Response  4 = Submitting

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import scenariosData from "@/data/scenarios.json";
import type { Scenario, Evaluation } from "@/types";
import ScenarioPrompt from "@/components/scenario/ScenarioPrompt";
import ThinkingTraceInput from "@/components/scenario/ThinkingTraceInput";
import ResponseInput from "@/components/scenario/ResponseInput";
import { useSkillStore } from "@/store/useSkillStore";

const scenarios = scenariosData as Scenario[];

export default function ScenarioPage() {
  const params = useParams();
  const router = useRouter();
  const scenarioId = params.id as string;

  const scenario = scenarios.find((s) => s.id === scenarioId) ?? null;

  const addEvaluation = useSkillStore((s) => s.addEvaluation);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [timeRemaining, setTimeRemaining] = useState(scenario?.time_limit_seconds ?? 0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [thinkingTrace, setThinkingTrace] = useState("");
  const [response, setResponse] = useState("");
  const [traceValid, setTraceValid] = useState(false);
  const [responseValid, setResponseValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Countdown timer — only ticks while step 1 or 2 or 3 is active
  useEffect(() => {
    if (!timerRunning || timeRemaining <= 0) return;
    const id = setInterval(() => {
      setTimeRemaining((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning, timeRemaining]);

  const handleStart = useCallback(() => {
    setTimerRunning(true);
    setStep(2);
  }, []);

  const handleNextToResponse = useCallback(() => {
    setStep(3);
  }, []);

  const handleSubmit = useCallback(async () => {
    setStep(4);
    setTimerRunning(false);
    setError(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario_id: scenarioId,
          thinking_trace: thinkingTrace,
          response,
        }),
      });

      const evaluation: Evaluation = await res.json();
      addEvaluation(evaluation);
      router.push(`/results/${scenarioId}`);
    } catch (err) {
      console.error("Submit failed:", err);
      setError("Something went wrong submitting your response. Please try again.");
      setStep(3);
    }
  }, [scenarioId, thinkingTrace, response, router]);

  if (!scenario) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-brand-deep">Scenario not found</h1>
        <p className="mt-2 text-neutral-500">No scenario with ID &quot;{scenarioId}&quot; exists.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-10">
      {/* Step indicator */}
      <div className="flex gap-2 text-xs font-medium text-neutral-500">
        {(["Read", "Think", "Respond", "Submitting"] as const).map((label, i) => (
          <span
            key={label}
            className={`rounded-full px-2 py-0.5 ${
              step === i + 1 ? "bg-brand-mint text-brand-primary" : ""
            }`}
          >
            {i + 1}. {label}
          </span>
        ))}
      </div>

      {/* Step 1 — Read scenario */}
      {step === 1 && (
        <div className="space-y-6">
          <ScenarioPrompt scenario={scenario} timeRemaining={timeRemaining} />
          <button
            onClick={handleStart}
            className="btn-primary w-full"
          >
            Start — timer begins now
          </button>
        </div>
      )}

      {/* Step 2 — Thinking trace */}
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
            Next — write your response
          </button>
        </div>
      )}

      {/* Step 3 — Response */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="rounded-lg border border-neutral-300 bg-neutral-100 p-3 text-xs text-neutral-500">
            Thinking trace saved ({thinkingTrace.length} chars). Now write your final response.
          </div>
          <ResponseInput
            value={response}
            onChange={setResponse}
            onValidChange={setResponseValid}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={!responseValid}
            className="btn-action w-full disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit for evaluation
          </button>
        </div>
      )}

      {/* Step 4 — Loading */}
      {step === 4 && (
        <div className="flex flex-col items-center gap-4 py-16 text-neutral-700">
          <svg className="h-8 w-8 animate-spin text-brand-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm font-medium">Evaluating your submission…</p>
        </div>
      )}
    </main>
  );
}
