"use client";

import { useState } from "react";
import { LOCALES, LOCALE_LABELS, type Locale } from "./dictionaries";
import { useLanguage } from "./LanguageProvider";

export default function LanguageOnboarding() {
  const { locale, setLocale, hasOnboarded, markOnboarded, t } = useLanguage();
  const [selected, setSelected] = useState<Locale>(locale);

  if (hasOnboarded) return null;

  function confirm() {
    setLocale(selected);
    markOnboarded();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/50 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold tracking-tight text-brand-deep">
          {t("lang.onboarding.title")}
        </h2>
        <p className="mt-2 text-sm text-neutral-600">{t("lang.onboarding.subtitle")}</p>

        <div className="mt-5 grid gap-2">
          {LOCALES.map((l) => {
            const active = l === selected;
            return (
              <button
                key={l}
                type="button"
                onClick={() => setSelected(l)}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors ${
                  active
                    ? "border-brand-primary bg-brand-mint text-brand-primary"
                    : "border-neutral-200 hover:border-brand-primary/40"
                }`}
              >
                <span className="text-base font-semibold">{LOCALE_LABELS[l]}</span>
                <span className="text-xs font-semibold uppercase text-neutral-500">{l}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={confirm}
          className="mt-5 w-full rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover"
        >
          {t("lang.onboarding.continue")}
        </button>
      </div>
    </div>
  );
}
