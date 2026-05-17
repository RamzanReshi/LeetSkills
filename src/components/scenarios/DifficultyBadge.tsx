"use client";

import type { Difficulty } from "@/data/scenarios-meta";
import { useLanguage } from "@/i18n/LanguageProvider";

const STYLES: Record<Difficulty, string> = {
  Easy: "difficulty-easy",
  Medium: "difficulty-medium",
  Hard: "difficulty-hard",
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
      className={`difficulty-badge ${STYLES[difficulty]}`}
    >
      {t(KEYS[difficulty])}
    </span>
  );
}
