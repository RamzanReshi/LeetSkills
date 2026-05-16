import type { CategoryId } from "./challenges";

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  levels: number;
  completed: number;
  difficulty: string;
  category: Exclude<CategoryId, "all">;
  categoryLabel: string;
  iconKey: "comm" | "team" | "career" | "leadership" | "presentation" | "ai";
}

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "path-comm",
    title: "Professional Communication Path",
    description:
      "Practice clear, respectful, and effective written communication for academic and workplace situations.",
    levels: 12,
    completed: 0,
    difficulty: "Easy to Medium",
    category: "professional-communication",
    categoryLabel: "Professional Communication",
    iconKey: "comm",
  },
  {
    id: "path-team",
    title: "Teamwork & Conflict Path",
    description:
      "Build confidence handling group tension, difficult teammates, and collaborative decision-making.",
    levels: 10,
    completed: 0,
    difficulty: "Medium to Hard",
    category: "teamwork-conflict",
    categoryLabel: "Teamwork & Conflict",
    iconKey: "team",
  },
  {
    id: "path-career",
    title: "Career Readiness Path",
    description:
      "Prepare for interviews, networking, follow-up emails, and early-career professional situations.",
    levels: 11,
    completed: 0,
    difficulty: "Easy to Medium",
    category: "career-readiness",
    categoryLabel: "Career Readiness",
    iconKey: "career",
  },
  {
    id: "path-leadership",
    title: "Leadership Decision Path",
    description:
      "Practice leading under pressure, making tradeoffs, and communicating decisions clearly.",
    levels: 9,
    completed: 0,
    difficulty: "Medium to Hard",
    category: "leadership-decision-making",
    categoryLabel: "Leadership & Decision-Making",
    iconKey: "leadership",
  },
  {
    id: "path-pitch",
    title: "Presentation & Pitch Path",
    description:
      "Improve how you structure ideas, pitch projects, and respond to audience feedback.",
    levels: 8,
    completed: 0,
    difficulty: "Easy to Hard",
    category: "presentation-pitching",
    categoryLabel: "Presentation & Pitching",
    iconKey: "presentation",
  },
  {
    id: "path-ai",
    title: "AI Literacy Path",
    description:
      "Learn when and how to use AI responsibly for school, work, and communication.",
    levels: 7,
    completed: 0,
    difficulty: "Easy to Medium",
    category: "ai-literacy",
    categoryLabel: "AI Literacy",
    iconKey: "ai",
  },
];
