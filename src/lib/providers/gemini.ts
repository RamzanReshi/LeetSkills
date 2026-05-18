import { GoogleGenAI } from "@google/genai";
import type { EvaluationProvider } from "./types";

// Hard ceiling on output tokens. Keeps spend bounded even if the model
// tries to ramble; evaluation JSON fits comfortably under this.
const MAX_OUTPUT_TOKENS = 4096;
// Abort the request if the model stalls — prevents hung sockets.
const REQUEST_TIMEOUT_MS = 60_000;

export const geminiProvider: EvaluationProvider = {
  async complete(systemPrompt: string, userMessage: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is required when AI_PROVIDER=gemini.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
        contents: userMessage,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          temperature: 0.2,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          abortSignal: controller.signal,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Gemini returned no text content.");
      }

      return text;
    } finally {
      clearTimeout(timeout);
    }
  },
};
