"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function AuthCard({
  titleKey,
  subtitleKey,
  children,
}: {
  titleKey: string;
  subtitleKey: string;
  children: ReactNode;
}) {
  const { t } = useLanguage();

  return (
    <div className="min-h-[calc(100svh-50px)] bg-brand-bg px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100svh-6.5rem)] w-full max-w-6xl flex-col justify-center gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)] lg:items-center lg:gap-10">
        <section className="hidden min-w-0 lg:block">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/leetskills_logo_no_background.png" alt={t("brand.name")} width={44} height={44} priority />
            <span className="text-3xl font-bold tracking-tight text-brand-deep">
              Leet<span className="font-normal text-brand-primary">Skills</span>
            </span>
          </Link>
          <h1 className="mt-10 max-w-xl text-5xl font-black leading-tight tracking-tight text-brand-deep">
            {t("auth.heroTitle")}
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-neutral-700">
            {t("auth.heroDetail")}
          </p>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3" aria-hidden="true">
            {[72, 54, 86].map((value) => (
              <div key={value} className="rounded-lg border border-neutral-300 bg-brand-card p-4">
                <span className="block h-2 w-8 rounded-full bg-brand-primary" />
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full rounded-full bg-brand-primary/60" style={{ width: `${value}%` }} />
                </div>
                <div className="mt-3 h-2 w-2/3 rounded-full bg-neutral-100" />
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-lg border border-neutral-300 bg-brand-card p-5 shadow-sm sm:p-7 lg:mx-0">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">
              {t("auth.eyebrow")}
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-brand-deep sm:text-3xl">{t(titleKey)}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">{t(subtitleKey)}</p>
          </div>
          {children}
        </section>
      </div>
    </div>
  );
}
