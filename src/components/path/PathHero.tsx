"use client";

import { useLanguage } from "@/i18n/LanguageProvider";

export default function PathHero() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden rounded-2xl border border-neutral-300 bg-brand-mint/60 px-6 py-10 sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(circle at 90% 20%, rgba(31,138,91,0.12) 0, transparent 40%), radial-gradient(circle at 10% 90%, rgba(31,138,91,0.10) 0, transparent 40%)",
        }}
      />
      <svg
        aria-hidden
        className="pointer-events-none absolute right-6 top-1/2 hidden h-24 w-64 -translate-y-1/2 text-brand-primary/30 md:block"
        viewBox="0 0 320 120"
        fill="none"
      >
        <path
          d="M0 90 C 60 90, 80 30, 140 30 S 240 90, 320 90"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="4 6"
        />
        <circle cx="20" cy="88" r="5" fill="currentColor" />
        <circle cx="140" cy="30" r="5" fill="currentColor" />
        <circle cx="240" cy="74" r="5" fill="currentColor" />
        <circle cx="310" cy="90" r="5" fill="currentColor" />
      </svg>
      <div className="relative max-w-xl">
        <span className="inline-flex items-center rounded-full bg-brand-card px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-brand-primary ring-1 ring-brand-primary/20">
          {t("path.eyebrow")}
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand-deep sm:text-4xl">
          {t("path.title")}
        </h1>
        <p className="mt-2 text-sm text-neutral-700 sm:text-base">
          {t("path.subtitle")}
        </p>
      </div>
    </section>
  );
}
