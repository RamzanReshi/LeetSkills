"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALES, LOCALE_LABELS, type Locale } from "./dictionaries";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonPadding = compact ? "px-2.5" : "px-3";

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function choose(next: Locale) {
    setLocale(next);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("nav.changeLanguage")}
        aria-expanded={open}
        className={`flex h-8 items-center gap-1.5 rounded-md border border-neutral-200 bg-white ${buttonPadding} text-xs font-semibold text-neutral-700 transition-colors hover:border-brand-primary hover:text-brand-primary`}
      >
        <span aria-hidden className="text-base leading-none">🌐</span>
        <span className="uppercase">{locale}</span>
      </button>

      {open && (
        <div className="absolute end-0 right-0 top-full z-50 mt-2 w-40 rounded-lg border border-neutral-200 bg-white p-1 shadow-xl">
          {LOCALES.map((l) => {
            const active = l === locale;
            return (
              <button
                key={l}
                type="button"
                onClick={() => choose(l)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-brand-mint text-brand-primary"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>{LOCALE_LABELS[l]}</span>
                <span className="text-[10px] font-semibold uppercase text-neutral-400">{l}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
