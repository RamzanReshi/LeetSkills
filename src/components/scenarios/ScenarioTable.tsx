"use client";

import Link from "next/link";
import type { ScenarioMeta } from "@/data/scenarios-meta";
import { CheckIcon } from "@/components/ui/Icons";
import DifficultyBadge from "./DifficultyBadge";

interface Props {
  scenarios: ScenarioMeta[];
  completedIds: string[];
}

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
      <table className="hidden w-full text-left text-sm md:table">
        <thead className="border-b border-neutral-300 bg-neutral-100/60 text-xs uppercase tracking-wider text-neutral-500">
          <tr>
            <th className="w-12 px-4 py-3">Status</th>
            <th className="w-14 px-2 py-3">#</th>
            <th className="px-2 py-3">Title</th>
            <th className="px-2 py-3">Path</th>
            <th className="w-28 px-2 py-3">Baseline</th>
            <th className="w-28 px-4 py-3">Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {scenarios.map((s) => {
            const done = completedIds.includes(s.id);
            return (
              <tr
                key={s.id}
                className="border-b border-neutral-300/60 last:border-b-0 transition-colors even:bg-neutral-50/60 hover:bg-brand-mint/40"
              >
                <td className="px-4 py-3">
                  <StatusDot done={done} />
                </td>
                <td className="px-2 py-3 font-mono text-xs text-neutral-500">{s.number}</td>
                <td className="px-2 py-3">
                  <Link
                    href={`/scenario/${s.id}`}
                    className="font-medium text-neutral-900 hover:text-brand-primary"
                  >
                    {s.id}: {s.title}
                  </Link>
                </td>
                <td className="px-2 py-3 text-neutral-700">{s.categoryLabel}</td>
                <td className="px-2 py-3 font-semibold text-neutral-900">New</td>
                <td className="px-4 py-3">
                  <DifficultyBadge difficulty={s.difficulty} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ul className="divide-y divide-neutral-300/60 md:hidden">
        {scenarios.map((s) => {
          const done = completedIds.includes(s.id);
          return (
            <li key={s.id} className="p-4">
              <Link href={`/scenario/${s.id}`} className="flex items-start gap-3">
                <StatusDot done={done} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[11px] text-neutral-500">#{s.number}</span>
                    <span className="font-medium text-neutral-900">{s.id}: {s.title}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                    <span>{s.categoryLabel}</span>
                    <span>.</span>
                    <span className="font-semibold text-neutral-700">New</span>
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
