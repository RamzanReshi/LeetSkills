"use client";

import type { Difficulty } from "@/data/scenarios-meta";
import { useLanguage } from "@/i18n/LanguageProvider";

const STYLES: Record<Difficulty, string> = {
  Easy: "bg-brand-mint text-brand-primary",
  Medium: "bg-amber-50 text-amber-700",
  Hard: "bg-red-50 text-red-700",
};

const KEYS: Record<Difficulty, string> = {
  Easy: "scenarios.easy",
  Medium: "scenarios.medium",
  Hard: "scenarios.hard",
};

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const { t } = useLanguage();
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLES[difficulty]}`}
    >
      {t(KEYS[difficulty])}
    </span>
  );
}
