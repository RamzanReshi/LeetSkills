"use client";

import React from "react";
import { validateResponse } from "@/utils/validation";
import { useLanguage } from "@/i18n/LanguageProvider";

interface ResponseInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidChange?: (isValid: boolean) => void;
}

export default function ResponseInput({
  value,
  onChange,
  onValidChange,
}: ResponseInputProps) {
  const { t } = useLanguage();
  const { valid } = validateResponse(value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    onChange(next);
    onValidChange?.(validateResponse(next).valid);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">
        {t("scenario.yourResponse")}
      </label>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={t("scenario.responsePlaceholder")}
        rows={10}
        className={`w-full rounded-lg border bg-brand-card px-3 py-2 text-sm leading-relaxed text-neutral-900 outline-none transition-colors focus:ring-2 ${
          value.length > 0 && !valid
            ? "border-red-400 focus:ring-red-200"
            : "border-neutral-300 focus:ring-brand-primary/30 focus:border-brand-primary"
        }`}
      />
      {value.length > 0 && !valid && (
        <p className="text-xs text-red-600">{t("scenario.responseEmpty")}</p>
      )}
    </div>
  );
}
