// ============================================================
// LeetSkills MVP - Evaluation Orchestrator
// ============================================================

import type { Scenario, Submission, Evaluation } from "@/types";
import { buildEvaluationPrompt } from "@/lib/evaluationPrompt";
import { parseEvaluation } from "@/lib/parseEvaluation";
import { getFallbackEvaluation } from "@/lib/fallbackEvaluation";
import { getProvider } from "@/lib/providers";

export async function evaluateSubmission(
  scenario: Scenario,
  submission: Submission,
): Promise<Evaluation> {
  const systemPrompt = buildEvaluationPrompt(scenario);
  const userMessage = [
    `SCENARIO PROMPT:\n${scenario.prompt_text}`,
    `CANDIDATE THINKING TRACE:\n${submission.thinking_trace}`,
    `CANDIDATE RESPONSE:\n${submission.response}`,
  ].join("\n\n");

  try {
    const raw = await getProvider().complete(systemPrompt, userMessage);
    return parseEvaluation(raw, scenario);
  } catch (err) {
    console.error("evaluateSubmission failed, using fallback:", err);
    return getFallbackEvaluation(scenario);
  }
}
