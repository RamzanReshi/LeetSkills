// OpenAI provider stub — install openai and fill this in when switching.
// Required env var: OPENAI_API_KEY
import type { EvaluationProvider } from "./types";

export const openaiProvider: EvaluationProvider = {
  async complete(_systemPrompt: string, _userMessage: string): Promise<string> {
    throw new Error(
      "OpenAI provider not configured. Install openai and set OPENAI_API_KEY."
    );
  },
};
