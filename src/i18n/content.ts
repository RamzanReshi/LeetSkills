"use client";

import { useLanguage } from "./LanguageProvider";
import {
  DIFFICULTY_LABELS,
  DIMENSION_DESCRIPTIONS,
  DIMENSION_LABELS,
  PATH_CONTENT,
  SCENARIO_CONTENT,
  SKILL_LABELS,
  type PathContent,
  type ScenarioContent,
} from "./contentDictionaries";
import { getScenarioById, getPathById } from "@/data/mvp-content";
import type { MvpScenario, MvpPath } from "@/data/mvp-content";

export function useLocalizedScenario(id: string | null | undefined): MvpScenario | null {
  const { locale } = useLanguage();
  if (!id) return null;
  const base = getScenarioById(id);
  if (!base) return null;
  if (locale === "en") return base;
  const override = SCENARIO_CONTENT[id]?.[locale];
  if (!override) return base;
  return { ...base, ...override };
}

export function useLocalizeScenario() {
  const { locale } = useLanguage();
  return <T extends { id: string }>(scenario: T): T => {
    if (locale === "en") return scenario;
    const override = SCENARIO_CONTENT[scenario.id]?.[locale];
    return override ? { ...scenario, ...override } : scenario;
  };
}

export function useLocalizedPath(id: string | null | undefined): MvpPath | null {
  const { locale } = useLanguage();
  if (!id) return null;
  const base = getPathById(id);
  if (!base) return null;
  if (locale === "en") return base;
  const override = PATH_CONTENT[id]?.[locale];
  if (!override) return base;
  return { ...base, ...override };
}

export function useLocalizePath() {
  const { locale } = useLanguage();
  return <T extends { id: string; title: string; description?: string }>(p: T): T => {
    if (locale === "en") return p;
    const override = PATH_CONTENT[p.id]?.[locale];
    if (!override) return p;
    return { ...p, title: override.title, description: override.description ?? p.description } as T;
  };
}

export function useSkillLabel() {
  const { locale } = useLanguage();
  return (skill: string): string => {
    if (locale === "en") return skill;
    return SKILL_LABELS[skill]?.[locale] ?? skill;
  };
}

export function useDimensionLabel() {
  const { locale } = useLanguage();
  return (dimension: string): string => {
    if (locale === "en") return dimension;
    return DIMENSION_LABELS[dimension]?.[locale] ?? dimension;
  };
}

export function useDimensionDescription() {
  const { locale } = useLanguage();
  return (dimension: string, fallback: string): string => {
    if (locale === "en") return fallback;
    return DIMENSION_DESCRIPTIONS[dimension]?.[locale] ?? fallback;
  };
}

export function useDifficultyLabel() {
  const { locale } = useLanguage();
  return (difficulty: string): string => {
    if (locale === "en") return difficulty;
    return DIFFICULTY_LABELS[difficulty]?.[locale] ?? difficulty;
  };
}

export type { ScenarioContent, PathContent };
