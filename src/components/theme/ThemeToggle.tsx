"use client";

import { MoonIcon, SunIcon } from "@/components/ui/Icons";
import { useTheme } from "./ThemeProvider";
import { useLanguage } from "@/i18n/LanguageProvider";

type ThemeToggleProps = {
  detail?: string;
};

export default function ThemeToggle({ detail }: ThemeToggleProps) {
  const { hydrated, isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const Icon = isDark ? MoonIcon : SunIcon;
  const detailText = detail ?? t("theme.default");

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-neutral-50 px-3 py-2">
      <div>
        <p className="text-xs font-semibold text-brand-deep">{t("theme.title")}</p>
        <p className="text-[11px] text-neutral-500">{detailText}</p>
      </div>
      {hydrated ? (
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={isDark ? t("theme.toLight") : t("theme.toDark")}
          onClick={toggleTheme}
          className={[
            "flex h-8 w-16 shrink-0 items-center rounded-full border p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/25",
            isDark
              ? "justify-end border-brand-primary bg-brand-primary text-white"
              : "justify-start border-neutral-300 bg-white text-brand-primary",
          ].join(" ")}
        >
          <span className="theme-toggle-knob flex h-6 w-6 items-center justify-center rounded-full bg-white text-brand-primary shadow-sm">
            <Icon className="h-4 w-4" />
          </span>
        </button>
      ) : (
        <div className="h-8 w-16 shrink-0 rounded-full border border-neutral-300 bg-neutral-100" aria-hidden="true" />
      )}
    </div>
  );
}
