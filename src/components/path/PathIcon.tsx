import type { LearningPath } from "@/data/paths";

const PATHS: Record<LearningPath["iconKey"], string> = {
  comm: "M4 5h16v10H7l-3 3V5z",
  team: "M9 11a3 3 0 100-6 3 3 0 000 6zm10 0a3 3 0 100-6 3 3 0 000 6zM4 20a5 5 0 0110 0M14 20a5 5 0 0110 0",
  career: "M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2h3v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7h3zm2-2v2h8V5H8z",
  leadership: "M5 21l3-8 4 3 4-6 4 11H5z",
  presentation: "M3 4h18v12H13l-1 4-1-4H3V4zm4 4h10M7 12h6",
  ai: "M8 4h8l2 4h2v8h-2l-2 4H8l-2-4H4V8h2l2-4zm0 6a2 2 0 104 0 2 2 0 00-4 0zm6 4a2 2 0 104 0 2 2 0 00-4 0z",
};

export default function PathIcon({ iconKey, className }: { iconKey: LearningPath["iconKey"]; className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={PATHS[iconKey]} />
    </svg>
  );
}
