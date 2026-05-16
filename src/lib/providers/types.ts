// Shared contract every AI provider must implement.
// Swap providers by changing AI_PROVIDER in .env.local — nothing else changes.
export interface EvaluationProvider {
  complete(systemPrompt: string, userMessage: string): Promise<string>;
}
