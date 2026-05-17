"use client";

import React from "react";
import { validateThinkingTrace } from "@/utils/validation";
import { useLanguage } from "@/i18n/LanguageProvider";

const MIN_CHARS = 80;

interface ThinkingTraceInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
}

export default function ThinkingTraceInput({
  value,
  onChange,
  onValidChange,
}: ThinkingTraceInputProps) {
  const { t } = useLanguage();
  const { valid, charCount } = validateThinkingTrace(value);
  const remaining = Math.max(0, MIN_CHARS - charCount);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    onChange(next);
    onValidChange?.(validateThinkingTrace(next).valid);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">
        {t("scenario.thinkingTrace")}
        <span className="ml-1 text-xs text-neutral-500">{t("scenario.thinkingMin", { n: MIN_CHARS })}</span>
      </label>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={t("scenario.thinkingPlaceholder")}
        rows={8}
        className={`w-full rounded-lg border bg-brand-card px-3 py-2 text-sm leading-relaxed text-neutral-900 outline-none transition-colors focus:ring-2 ${
          value.length > 0 && !valid
            ? "border-red-400 focus:ring-red-200"
            : "border-neutral-300 focus:ring-brand-primary/30 focus:border-brand-primary"
        }`}
      />
      <div className="flex justify-between text-xs">
        {value.length > 0 && !valid ? (
          <span className="text-red-600">{t("scenario.charsNeeded", { n: remaining })}</span>
        ) : valid ? (
          <span className="text-brand-primary">{t("scenario.looksGood")}</span>
        ) : (
          <span className="text-neutral-500">{t("scenario.startTyping")}</span>
        )}
        <span className="text-neutral-500">{t("scenario.charCount", { n: charCount })}</span>
      </div>
    </div>
  );
}
