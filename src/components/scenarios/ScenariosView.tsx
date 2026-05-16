"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category") ?? null;
  const initialCategory: CategoryId = SCENARIO_CATEGORIES.some(
    (c) => c.id === categoryParam,
  )
    ? (categoryParam as CategoryId)
    : "all";

  const [activeCategory, setActiveCategory] = useState<CategoryId>(initialCategory);
  const [activeSkill, setActiveSkill] = useState<SkillId>("all");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SCENARIOS_META.filter(
      (s) => activeCategory === "all" || s.category === activeCategory,
    )
      .filter((s) => activeSkill === "all" || s.skill === activeSkill)
      .filter((s) => difficulty === "all" || s.difficulty === difficulty)
      .filter(
        (s) =>
          !q ||
          s.title.toLowerCase().includes(q) ||
          s.categoryLabel.toLowerCase().includes(q),
      );
  }, [activeCategory, activeSkill, difficulty, search]);

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
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      <div className="mb-4">
        <ScenarioToolbar
          search={search}
          onSearchChange={setSearch}
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
