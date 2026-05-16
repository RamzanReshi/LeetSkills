"use client";

import type { SkillTopic, SkillId } from "@/data/scenarios-meta";

interface Props {
  topics: SkillTopic[];
  activeId: SkillId;
  onSelect: (id: SkillId) => void;
}

export default function SkillChips({ topics, activeId, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {topics.map((t) => {
        const active = t.id === activeId;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={[
              "rounded-full px-3 py-1 text-xs font-medium transition-colors",
              active
                ? "bg-brand-primary text-white"
                : "border border-neutral-300 text-neutral-700 hover:border-brand-primary hover:text-brand-primary",
            ].join(" ")}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
