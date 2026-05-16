"use client";

import Link from "next/link";
import type { ScenarioMeta } from "@/data/scenarios-meta";
import { CheckIcon } from "@/components/ui/Icons";
import DifficultyBadge from "./DifficultyBadge";

interface Props {
  scenarios: ScenarioMeta[];
  completedIds: string[];
}

// TODO: /scenario/[id] currently only resolves for engineering scenarios in scenarios.json.
// Wire mock soft-skill scenarios to the solve route once content is seeded.

function StatusDot({ done }: { done: boolean }) {
  if (done) {
    return (
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-primary text-white">
        <CheckIcon className="h-3 w-3" />
      </span>
    );
  }
  return <span className="inline-block h-5 w-5 rounded-full border-2 border-neutral-300" />;
}

export default function ScenarioTable({ scenarios, completedIds }: Props) {
  if (scenarios.length === 0) {
    return (
      <div className="glass-card p-10 text-center text-sm text-neutral-500">
        No scenarios match your filters.
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
          {scenarios.map((s) => {
            const done = completedIds.includes(s.id);
            return (
              <tr
                key={s.id}
                className={[
                  "border-b border-neutral-300/60 last:border-b-0 transition-colors hover:bg-brand-mint/40",
                  done ? "bg-brand-mint/20" : "even:bg-neutral-50/60",
                ].join(" ")}
              >
                <td className="px-4 py-3">
                  <StatusDot done={done} />
                </td>
                <td className="px-2 py-3 font-mono text-xs text-neutral-400">{s.number}</td>
                <td className="px-2 py-3">
                  <Link
                    href={`/scenario/${s.id}`}
                    className={`font-medium hover:text-brand-primary transition-colors ${
                      done ? "text-neutral-400" : "text-neutral-900"
                    }`}
                  >
                    {s.title}
                  </Link>
                </td>
                <td className={`px-2 py-3 ${done ? "text-neutral-400" : "text-neutral-700"}`}>
                  {s.categoryLabel}
                </td>
                <td className={`px-2 py-3 font-semibold ${done ? "text-neutral-400" : "text-neutral-900"}`}>
                  {s.avgScore}%
                </td>
                <td className="px-4 py-3">
                  <DifficultyBadge difficulty={s.difficulty} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mobile card list */}
      <ul className="divide-y divide-neutral-300/60 md:hidden">
        {scenarios.map((s) => {
          const done = completedIds.includes(s.id);
          return (
            <li key={s.id} className={`p-4 ${done ? "bg-brand-mint/20" : ""}`}>
              <Link href={`/scenario/${s.id}`} className="flex items-start gap-3">
                <StatusDot done={done} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[11px] text-neutral-400">#{s.number}</span>
                    <span className={`font-medium ${done ? "text-neutral-400" : "text-neutral-900"}`}>
                      {s.title}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                    <span>{s.categoryLabel}</span>
                    <span>·</span>
                    <span className="font-semibold text-neutral-700">{s.avgScore}%</span>
                    <DifficultyBadge difficulty={s.difficulty} />
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
