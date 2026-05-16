// ============================================================
// LeetSkills MVP — Evaluation Orchestrator
// Owner: Ramzan (Scenarios & AI Evaluation)
// ============================================================
// Usage:
//   import { evaluateSubmission } from "@/lib/claude";
//   const result = await evaluateSubmission(scenario, submission);

import type { Scenario, Submission, Evaluation } from "@/types";
import { buildEvaluationPrompt } from "@/lib/evaluationPrompt";
import { parseEvaluation } from "@/lib/parseEvaluation";
import { getFallbackEvaluation } from "@/lib/fallbackEvaluation";
import { getProvider } from "@/lib/providers";

/**
 * Send a submission to the active AI provider for evaluation.
 * Falls back to a neutral evaluation if the provider or parser fails.
 * Switch providers by setting AI_PROVIDER in .env.local.
 */
export async function evaluateSubmission(
  scenario: Scenario,
  submission: Submission
): Promise<Evaluation> {
  const systemPrompt = buildEvaluationPrompt(scenario);
  const userMessage = [
    `SCENARIO PROMPT:\n${scenario.prompt_text}`,
    `CANDIDATE THINKING TRACE:\n${submission.thinking_trace}`,
    `CANDIDATE RESPONSE:\n${submission.response}`,
  ].join("\n\n");

  try {
    const raw = await getProvider().complete(systemPrompt, userMessage);
    return parseEvaluation(raw, scenario.id);
  } catch (err) {
    console.error("evaluateSubmission failed, using fallback:", err);
    return getFallbackEvaluation(scenario.id);
  }
}
