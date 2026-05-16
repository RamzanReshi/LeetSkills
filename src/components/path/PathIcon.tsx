import type { LearningPath } from "@/data/paths";

const PATHS: Record<LearningPath["iconKey"], string> = {
  engineering: "M4 7h16M4 12h16M4 17h10M16 15l2 2 3-4",
  quality: "M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4zm-3 9l2 2 4-5",
  comm: "M4 5h16v10H7l-3 3V5z",
  team: "M9 11a3 3 0 100-6 3 3 0 000 6zm10 0a3 3 0 100-6 3 3 0 000 6zM4 20a5 5 0 0110 0M14 20a5 5 0 0110 0",
  product: "M4 6h16M4 12h10M4 18h7m7-6l3 3-3 3m-4-3h7",
  ai: "M8 4h8l2 4h2v8h-2l-2 4H8l-2-4H4V8h2l2-4zm0 6a2 2 0 104 0 2 2 0 00-4 0zm6 4a2 2 0 104 0 2 2 0 00-4 0z",
};

export default function PathIcon({ iconKey, className }: { iconKey: LearningPath["iconKey"]; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={PATHS[iconKey]} />
    </svg>
  );
}
