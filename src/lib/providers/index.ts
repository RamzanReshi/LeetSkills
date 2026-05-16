// Factory: reads AI_PROVIDER env var to pick a backend.
// Valid values: "claude" (default) | "gemini" | "openai"
import type { EvaluationProvider } from "./types";
import { claudeProvider } from "./claude";
import { geminiProvider } from "./gemini";
import { openaiProvider } from "./openai";

export function getProvider(): EvaluationProvider {
  const provider = process.env.AI_PROVIDER ?? "claude";

  switch (provider) {
    case "gemini":
      return geminiProvider;
    case "openai":
      return openaiProvider;
    case "claude":
    default:
      return claudeProvider;
  }
}
