"use client";

import { useEffect } from "react";
import AppShell from "@/components/shell/AppShell";
import PathHero from "@/components/path/PathHero";
import PathCard from "@/components/path/PathCard";
import { LEARNING_PATHS } from "@/data/paths";
import { useLanguage } from "@/i18n/LanguageProvider";
import { PATH_CONTENT } from "@/i18n/contentDictionaries";

export default function PathPage() {
  const { t, locale } = useLanguage();
  const localizedPaths = LEARNING_PATHS.map((p) => {
    const override = PATH_CONTENT[p.id]?.[locale];
    if (!override) return p;
    return { ...p, title: override.title, description: override.description, categoryLabel: override.title };
  });

  useEffect(() => {
    document.title = t("path.metaTitle");
  }, [t]);

  return (
    <AppShell>
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10 animate-fade-in">
        <PathHero />

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-brand-deep">{t("path.choose")}</h2>
          <p className="mt-1 text-sm text-neutral-500">{t("path.chooseDetail")}</p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            {localizedPaths.map((p) => (
              <PathCard key={p.id} path={p} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
