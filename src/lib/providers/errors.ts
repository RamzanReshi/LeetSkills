type ClassifiedAiError = {
  status: number;
  code: string;
  userMessage: string;
  userAction: string;
  retryable: boolean;
  message: string;
  action: string;
  provider: string;
  model?: string;
  rawMessage: string;
};

const USER_MESSAGE_RETRY =
  "Our AI evaluation servers are processing a lot of submissions right now. Your answer is saved on this page — press Try Again in a moment.";
const USER_MESSAGE_TERMINAL =
  "Our AI evaluation servers are under heavy load. Please wait a few minutes and try again — your work is saved.";
const USER_MESSAGE_HIGH_DEMAND =
  "Our AI evaluation servers are experiencing high demand right now. Wait a few moments and press Try Again — your answer is saved.";
const USER_ACTION_RETRY = "Press Try Again in a moment. Your thinking trace and final response stay on this page.";
const USER_ACTION_TERMINAL = "Wait a few minutes and try again. Your thinking trace and final response stay on this page.";
const USER_ACTION_HIGH_DEMAND = "Wait a few moments, then press Try Again. Your work stays on this page.";

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;

  try {
    return JSON.stringify(err);
  } catch {
    return "Unknown AI provider error";
  }
}

export function classifyAiProviderError(err: unknown): ClassifiedAiError {
  const provider = process.env.AI_PROVIDER ?? "claude";
  const model =
    provider === "gemini"
      ? process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite"
      : undefined;
  const rawMessage = getErrorMessage(err);
  const normalized = rawMessage.toUpperCase();

  if (rawMessage.includes("GEMINI_API_KEY")) {
    return {
      status: 500,
      code: "GEMINI_API_KEY_MISSING",
      userMessage: USER_MESSAGE_TERMINAL,
      userAction: USER_ACTION_TERMINAL,
      retryable: false,
      message: "Gemini is selected, but GEMINI_API_KEY is not set on the backend.",
      action: "Add GEMINI_API_KEY to .env.local and restart the Next.js dev server.",
      provider,
      model,
      rawMessage,
    };
  }

  if (
    normalized.includes("FAILED_PRECONDITION") ||
    rawMessage.includes("free tier is not available")
  ) {
    return {
      status: 402,
      code: "GEMINI_BILLING_OR_REGION_REQUIRED",
      userMessage: USER_MESSAGE_TERMINAL,
      userAction: USER_ACTION_TERMINAL,
      retryable: false,
      message:
        "Gemini rejected the request because the free tier is unavailable for this project or region, or billing is not enabled.",
      action:
        "Enable billing for the Google AI Studio project, or switch AI_PROVIDER to another configured backend for testing.",
      provider,
      model,
      rawMessage,
    };
  }

  if (
    normalized.includes("API_KEY_INVALID") ||
    normalized.includes("INVALID API KEY") ||
    normalized.includes("PERMISSION_DENIED") ||
    normalized.includes("403")
  ) {
    return {
      status: 401,
      code: "AI_API_KEY_INVALID",
      userMessage: USER_MESSAGE_TERMINAL,
      userAction: USER_ACTION_TERMINAL,
      retryable: false,
      message: "The selected AI provider rejected the API key or denied access.",
      action: "Verify the backend API key, provider selection, and project permissions.",
      provider,
      model,
      rawMessage,
    };
  }

  if (
    normalized.includes("UNAVAILABLE") ||
    normalized.includes("OVERLOADED") ||
    normalized.includes("HIGH DEMAND") ||
    normalized.includes("\"CODE\":503") ||
    normalized.includes("503")
  ) {
    return {
      status: 503,
      code: "AI_HIGH_DEMAND",
      userMessage: USER_MESSAGE_HIGH_DEMAND,
      userAction: USER_ACTION_HIGH_DEMAND,
      retryable: true,
      message: "The AI provider is reporting high demand / temporary unavailability.",
      action: "Retry shortly. Consider exponential backoff or routing to a secondary provider for resilience.",
      provider,
      model,
      rawMessage,
    };
  }

  if (normalized.includes("429") || normalized.includes("RATE_LIMIT")) {
    return {
      status: 429,
      code: "AI_RATE_LIMITED",
      userMessage: USER_MESSAGE_RETRY,
      userAction: USER_ACTION_RETRY,
      retryable: true,
      message: "The selected AI provider rate limit or quota was reached.",
      action:
        "Wait and retry, reduce request frequency, or use a provider/project with available quota.",
      provider,
      model,
      rawMessage,
    };
  }

  if (
    normalized.includes("404") ||
    normalized.includes("MODEL NOT FOUND") ||
    normalized.includes("NOT_FOUND")
  ) {
    return {
      status: 400,
      code: "AI_MODEL_NOT_FOUND",
      userMessage: USER_MESSAGE_TERMINAL,
      userAction: USER_ACTION_TERMINAL,
      retryable: false,
      message: "The selected AI model was not found or is not available to this API key.",
      action: "Check the model name and confirm the key has access to that model.",
      provider,
      model,
      rawMessage,
    };
  }

  if (rawMessage.startsWith("parseEvaluation:")) {
    return {
      status: 502,
      code: "AI_RESPONSE_PARSE_FAILED",
      userMessage: USER_MESSAGE_RETRY,
      userAction: USER_ACTION_RETRY,
      retryable: true,
      message:
        "The AI provider responded, but the response did not match the expected evaluation format.",
      action: "Check the backend logs for the parser error and adjust the prompt or model response.",
      provider,
      model,
      rawMessage,
    };
  }

  return {
    status: 502,
    code: "AI_PROVIDER_FAILED",
    userMessage: USER_MESSAGE_RETRY,
    userAction: USER_ACTION_RETRY,
    retryable: true,
    message: "The selected AI provider failed while generating the evaluation.",
    action: "Check the backend logs for the provider error and verify the configured API key.",
    provider,
    model,
    rawMessage,
  };
}
