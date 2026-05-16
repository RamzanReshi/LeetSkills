"use client";

import { SearchIcon, FilterIcon } from "@/components/ui/Icons";
import type { Difficulty, SkillId, SkillTopic } from "@/data/scenarios-meta";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  difficulty: Difficulty | "all";
  onDifficultyChange: (v: Difficulty | "all") => void;
  skillTopics: SkillTopic[];
  activeSkill: SkillId;
  onSkillChange: (v: SkillId) => void;
  completed: number;
  total: number;
}

export default function ScenarioToolbar({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  skillTopics,
  activeSkill,
  onSkillChange,
  completed,
  total,
}: Props) {
  const activeFilterCount = (difficulty === "all" ? 0 : 1) + (activeSkill === "all" ? 0 : 1);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px] flex-1">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search scenarios"
          className="w-full rounded-lg border border-neutral-300 bg-brand-card py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        />
      </div>

      <details className="group relative">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-neutral-300 bg-brand-card px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-brand-primary hover:text-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20">
          <FilterIcon className="h-4 w-4" />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-brand-primary px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
              {activeFilterCount}
            </span>
          )}
        </summary>

        <div className="absolute right-0 z-20 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-xl border border-neutral-200 bg-white p-4 shadow-xl">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Difficulty
            </p>
            <div className="flex flex-wrap gap-2">
              {(["all", "Easy", "Medium", "Hard"] as const).map((value) => {
                const active = difficulty === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onDifficultyChange(value)}
                    className={[
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      active
                        ? "bg-brand-primary text-white"
                        : "border border-neutral-300 text-neutral-700 hover:border-brand-primary hover:text-brand-primary",
                    ].join(" ")}
                  >
                    {value === "all" ? "All Difficulty" : value}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500">
              Skills
            </p>
            <div className="flex max-h-56 flex-wrap gap-2 overflow-y-auto pr-1">
              {skillTopics.map((topic) => {
                const active = activeSkill === topic.id;
                return (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => onSkillChange(topic.id)}
                    className={[
                      "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                      active
                        ? "bg-brand-primary text-white"
                        : "border border-neutral-300 text-neutral-700 hover:border-brand-primary hover:text-brand-primary",
                    ].join(" ")}
                  >
                    {topic.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </details>

      <div className="ml-auto whitespace-nowrap text-xs font-semibold text-neutral-700">
        <span className="text-brand-primary">{completed}</span>
        <span className="text-neutral-500">/{total} Completed</span>
      </div>
    </div>
  );
}
