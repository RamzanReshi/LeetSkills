import type { Difficulty } from "@/data/scenarios-meta";

const STYLES: Record<Difficulty, string> = {
  Easy: "bg-brand-mint text-brand-primary",
  Medium: "bg-amber-50 text-amber-700",
  Hard: "bg-red-50 text-red-700",
};

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLES[difficulty]}`}
    >
      {difficulty}
    </span>
  );
}
