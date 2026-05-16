// Gemini provider stub — install @google/generative-ai and fill this in when switching.
// Required env var: GEMINI_API_KEY
import type { EvaluationProvider } from "./types";

export const geminiProvider: EvaluationProvider = {
  async complete(_systemPrompt: string, _userMessage: string): Promise<string> {
    throw new Error(
      "Gemini provider not configured. Install @google/generative-ai and set GEMINI_API_KEY."
    );
  },
};
