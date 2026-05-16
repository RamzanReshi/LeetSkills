"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CHALLENGES,
  CHALLENGE_CATEGORIES,
  SKILL_TOPICS,
  type CategoryId,
  type SkillId,
  type Difficulty,
} from "@/data/challenges";
import { useSkillStore } from "@/store/useSkillStore";
import CategoryTabs from "./CategoryTabs";
import SkillChips from "./SkillChips";
import ChallengeToolbar from "./ChallengeToolbar";
import ChallengeTable from "./ChallengeTable";

export default function LibraryView() {
  const completedScenarioIds = useSkillStore((s) => s.completedScenarioIds);
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category") ?? null;
  const initialCategory: CategoryId = CHALLENGE_CATEGORIES.some(
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
    return CHALLENGES.filter((c) => activeCategory === "all" || c.category === activeCategory)
      .filter((c) => activeSkill === "all" || c.skill === activeSkill)
      .filter((c) => difficulty === "all" || c.difficulty === difficulty)
      .filter(
        (c) =>
          !q ||
          c.title.toLowerCase().includes(q) ||
          c.categoryLabel.toLowerCase().includes(q),
      );
  }, [activeCategory, activeSkill, difficulty, search]);

  const completedCount = CHALLENGES.filter((c) =>
    completedScenarioIds.includes(c.id),
  ).length;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10 animate-fade-in">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-brand-deep">Practice Library</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Scenario-based soft skill challenges for university and workplace readiness.
        </p>
      </header>

      <div className="mb-5">
        <CategoryTabs
          categories={CHALLENGE_CATEGORIES}
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      <div className="mb-5">
        <SkillChips topics={SKILL_TOPICS} activeId={activeSkill} onSelect={setActiveSkill} />
      </div>

      <div className="mb-4">
        <ChallengeToolbar
          search={search}
          onSearchChange={setSearch}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          completed={completedCount}
          total={CHALLENGES.length}
        />
      </div>

      <ChallengeTable challenges={filtered} completedIds={completedScenarioIds} />
    </div>
  );
}
