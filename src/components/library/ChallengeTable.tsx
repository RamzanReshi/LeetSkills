"use client";

import Link from "next/link";
import type { Challenge } from "@/data/challenges";
import { CheckIcon } from "@/components/ui/Icons";
import DifficultyBadge from "./DifficultyBadge";

interface Props {
  challenges: Challenge[];
  completedIds: string[];
}

// TODO: /scenario/[id] currently only resolves for engineering scenarios in scenarios.json.
// Wire mock soft-skill challenges to the solve route once content is seeded.

function StatusDot({ done }: { done: boolean }) {
  if (done) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-mint text-brand-primary">
        <CheckIcon className="h-3.5 w-3.5" />
      </span>
    );
  }
  return <span className="inline-block h-5 w-5 rounded-full border border-neutral-300" />;
}

export default function ChallengeTable({ challenges, completedIds }: Props) {
  if (challenges.length === 0) {
    return (
      <div className="glass-card p-10 text-center text-sm text-neutral-500">
        No challenges match your filters.
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Desktop table */}
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="border-b border-neutral-300 bg-neutral-100/60 text-xs uppercase tracking-wider text-neutral-500">
          <tr>
            <th className="w-12 px-4 py-3">Status</th>
            <th className="w-14 px-2 py-3">#</th>
            <th className="px-2 py-3">Title</th>
            <th className="px-2 py-3">Category</th>
            <th className="w-28 px-2 py-3">Avg Score</th>
            <th className="w-28 px-4 py-3">Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {challenges.map((c) => {
            const done = completedIds.includes(c.id);
            return (
              <tr
                key={c.id}
                className="border-b border-neutral-300/60 last:border-b-0 transition-colors even:bg-neutral-50/60 hover:bg-brand-mint/40"
              >
                <td className="px-4 py-3">
                  <StatusDot done={done} />
                </td>
                <td className="px-2 py-3 font-mono text-xs text-neutral-500">{c.number}</td>
                <td className="px-2 py-3">
                  <Link
                    href={`/scenario/${c.id}`}
                    className="font-medium text-neutral-900 hover:text-brand-primary"
                  >
                    {c.title}
                  </Link>
                </td>
                <td className="px-2 py-3 text-neutral-700">{c.categoryLabel}</td>
                <td className="px-2 py-3 font-semibold text-neutral-900">{c.avgScore}%</td>
                <td className="px-4 py-3">
                  <DifficultyBadge difficulty={c.difficulty} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile card list */}
      <ul className="divide-y divide-neutral-300/60 md:hidden">
        {challenges.map((c) => {
          const done = completedIds.includes(c.id);
          return (
            <li key={c.id} className="p-4">
              <Link href={`/scenario/${c.id}`} className="flex items-start gap-3">
                <StatusDot done={done} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[11px] text-neutral-500">#{c.number}</span>
                    <span className="font-medium text-neutral-900">{c.title}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                    <span>{c.categoryLabel}</span>
                    <span>·</span>
                    <span className="font-semibold text-neutral-700">{c.avgScore}%</span>
                    <DifficultyBadge difficulty={c.difficulty} />
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
