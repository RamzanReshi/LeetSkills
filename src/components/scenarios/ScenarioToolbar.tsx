"use client";

import { SearchIcon, SortIcon, FilterIcon } from "@/components/ui/Icons";
import type { Difficulty } from "@/data/challenges";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  difficulty: Difficulty | "all";
  onDifficultyChange: (v: Difficulty | "all") => void;
  completed: number;
  total: number;
}

export default function ChallengeToolbar({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  completed,
  total,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px] flex-1">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search challenges"
          className="w-full rounded-lg border border-neutral-300 bg-brand-card py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-500 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
        />
      </div>

      <select
        value={difficulty}
        onChange={(e) => onDifficultyChange(e.target.value as Difficulty | "all")}
        className="rounded-lg border border-neutral-300 bg-brand-card px-3 py-2 text-sm text-neutral-700 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
      >
        <option value="all">All Difficulty</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <button
        type="button"
        aria-label="Sort"
        className="rounded-lg border border-neutral-300 bg-brand-card p-2 text-neutral-700 hover:border-brand-primary hover:text-brand-primary"
      >
        <SortIcon className="h-4 w-4" />
      </button>

      <button
        type="button"
        aria-label="Filter"
        className="rounded-lg border border-neutral-300 bg-brand-card p-2 text-neutral-700 hover:border-brand-primary hover:text-brand-primary"
      >
        <FilterIcon className="h-4 w-4" />
      </button>

      <div className="ml-auto whitespace-nowrap text-xs font-semibold text-neutral-700">
        <span className="text-brand-primary">{completed}</span>
        <span className="text-neutral-500">/{total} Completed</span>
      </div>
    </div>
  );
}
