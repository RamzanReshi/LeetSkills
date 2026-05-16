"use client";

import type { Category, CategoryId } from "@/data/scenarios-meta";

interface Props {
  categories: Category[];
  activeId: CategoryId;
  onSelect: (id: CategoryId) => void;
}

export default function CategoryTabs({ categories, activeId, onSelect }: Props) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 pt-1 px-1 scrollbar-thin">
      {categories.map((cat) => {
        const active = cat.id === activeId;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={[
              "flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-brand-deep text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-100/70",
            ].join(" ")}
          >
            <span>{cat.label}</span>
            <span
              className={[
                "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                active ? "bg-white/20 text-white" : "bg-white text-neutral-700",
              ].join(" ")}
            >
              {cat.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
