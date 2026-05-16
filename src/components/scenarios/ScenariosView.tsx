"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  SCENARIOS_META,
  SCENARIO_CATEGORIES,
  SKILL_TOPICS,
  type CategoryId,
  type SkillId,
  type Difficulty,
} from "@/data/scenarios-meta";
import { useSkillStore } from "@/store/useSkillStore";
import CategoryTabs from "./CategoryTabs";
import ScenarioToolbar from "./ScenarioToolbar";
import ScenarioTable from "./ScenarioTable";

export default function ScenariosView() {
  const completedScenarioIds = useSkillStore((s) => s.completedScenarioIds);
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category") ?? null;
  const search = searchParams?.get("search") ?? searchParams?.get("q") ?? "";
  const initialCategory: CategoryId = SCENARIO_CATEGORIES.some(
    (c) => c.id === categoryParam,
  )
    ? (categoryParam as CategoryId)
    : "all";

  const [activeCategory, setActiveCategory] = useState<CategoryId>(
    search ? "all" : initialCategory,
  );
  const [activeSkill, setActiveSkill] = useState<SkillId>("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const effectiveCategory = search ? "all" : activeCategory;

  function handleSearchChange(value: string) {
    const params = new URLSearchParams(searchParams?.toString());
    const trimmed = value.trim();

    if (trimmed) {
      params.set("search", value);
      params.delete("q");
      params.delete("category");
    } else {
      params.delete("search");
      params.delete("q");
    }

    const query = params.toString();
    router.replace(query ? `/scenarios?${query}` : "/scenarios", { scroll: false });
  }

  function handleCategorySelect(category: CategoryId) {
    setActiveCategory(category);

    if (search) {
      const params = new URLSearchParams(searchParams?.toString());
      params.delete("search");
      params.delete("q");

      if (category !== "all") {
        params.set("category", category);
      } else {
        params.delete("category");
      }

      const query = params.toString();
      router.replace(query ? `/scenarios?${query}` : "/scenarios", { scroll: false });
    }
  }

  const filtered = useMemo(() => {
    const terms = search
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    return SCENARIOS_META.filter(
      (s) => effectiveCategory === "all" || s.category === effectiveCategory,
    )
      .filter((s) => activeSkill === "all" || s.skill === activeSkill)
      .filter((s) => difficulty === "all" || s.difficulty === difficulty)
      .filter(
        (s) =>
          terms.length === 0 ||
          terms.every((term) => s.searchText.includes(term)),
      );
  }, [activeSkill, difficulty, effectiveCategory, search]);

  const completedCount = SCENARIOS_META.filter((s) =>
    completedScenarioIds.includes(s.id),
  ).length;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10 animate-fade-in">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-brand-deep">Scenarios</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Real-world situations for university and workplace readiness — think through them, respond, get evaluated.
        </p>
      </header>

      <div className="mb-5">
        <CategoryTabs
          categories={SCENARIO_CATEGORIES}
          activeId={effectiveCategory}
          onSelect={handleCategorySelect}
        />
      </div>

      <div className="mb-4">
        <ScenarioToolbar
          search={search}
          onSearchChange={handleSearchChange}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          skillTopics={SKILL_TOPICS}
          activeSkill={activeSkill}
          onSkillChange={setActiveSkill}
          completed={completedCount}
          total={SCENARIOS_META.length}
        />
      </div>

      <ScenarioTable scenarios={filtered} completedIds={completedScenarioIds} />
    </div>
  );
}
