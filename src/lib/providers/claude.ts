import Anthropic from "@anthropic-ai/sdk";
import type { EvaluationProvider } from "./types";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY automatically

export const claudeProvider: EvaluationProvider = {
  async complete(systemPrompt: string, userMessage: string): Promise<string> {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const block = message.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") {
      throw new Error("Claude returned no text content");
    }
    return block.text;
  },
};
