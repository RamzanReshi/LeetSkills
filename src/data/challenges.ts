export type Difficulty = "Easy" | "Medium" | "Hard";

export type CategoryId =
  | "all"
  | "professional-communication"
  | "teamwork-conflict"
  | "career-readiness"
  | "leadership-decision-making"
  | "presentation-pitching"
  | "ai-literacy";

export type SkillId =
  | "all"
  | "emails"
  | "conflict"
  | "interviews"
  | "leadership"
  | "presentations"
  | "feedback"
  | "teamwork"
  | "ai-use";

export interface Category {
  id: CategoryId;
  label: string;
  count: number;
}

export interface SkillTopic {
  id: SkillId;
  label: string;
}

export interface Challenge {
  id: string;
  number: number;
  title: string;
  category: Exclude<CategoryId, "all">;
  categoryLabel: string;
  skill: Exclude<SkillId, "all">;
  avgScore: number;
  difficulty: Difficulty;
}

export const CHALLENGE_CATEGORIES: Category[] = [
  { id: "all", label: "All", count: 100 },
  { id: "professional-communication", label: "Professional Communication", count: 24 },
  { id: "teamwork-conflict", label: "Teamwork & Conflict", count: 18 },
  { id: "career-readiness", label: "Career Readiness", count: 21 },
  { id: "leadership-decision-making", label: "Leadership & Decision-Making", count: 15 },
  { id: "presentation-pitching", label: "Presentation & Pitching", count: 12 },
  { id: "ai-literacy", label: "AI Literacy", count: 10 },
];

export const SKILL_TOPICS: SkillTopic[] = [
  { id: "all", label: "All Skills" },
  { id: "emails", label: "Emails" },
  { id: "conflict", label: "Conflict" },
  { id: "interviews", label: "Interviews" },
  { id: "leadership", label: "Leadership" },
  { id: "presentations", label: "Presentations" },
  { id: "feedback", label: "Feedback" },
  { id: "teamwork", label: "Teamwork" },
  { id: "ai-use", label: "AI Use" },
];

export const CHALLENGES: Challenge[] = [
  {
    id: "ch-001",
    number: 1,
    title: "Reply to a Professor About a Missed Deadline",
    category: "professional-communication",
    categoryLabel: "Professional Communication",
    skill: "emails",
    avgScore: 72,
    difficulty: "Easy",
  },
  {
    id: "ch-002",
    number: 2,
    title: "Handle a Teammate Who Is Not Contributing",
    category: "teamwork-conflict",
    categoryLabel: "Teamwork & Conflict",
    skill: "teamwork",
    avgScore: 64,
    difficulty: "Medium",
  },
  {
    id: "ch-003",
    number: 3,
    title: "Answer “Tell Me About Yourself”",
    category: "career-readiness",
    categoryLabel: "Career Readiness",
    skill: "interviews",
    avgScore: 69,
    difficulty: "Easy",
  },
  {
    id: "ch-004",
    number: 4,
    title: "Lead a Team Through a Last-Minute Change",
    category: "leadership-decision-making",
    categoryLabel: "Leadership & Decision-Making",
    skill: "leadership",
    avgScore: 58,
    difficulty: "Hard",
  },
  {
    id: "ch-005",
    number: 5,
    title: "Improve a Weak Project Pitch",
    category: "presentation-pitching",
    categoryLabel: "Presentation & Pitching",
    skill: "presentations",
    avgScore: 61,
    difficulty: "Medium",
  },
  {
    id: "ch-006",
    number: 6,
    title: "Respond Professionally to Critical Feedback",
    category: "professional-communication",
    categoryLabel: "Professional Communication",
    skill: "feedback",
    avgScore: 66,
    difficulty: "Medium",
  },
  {
    id: "ch-007",
    number: 7,
    title: "Decide When to Use AI for an Assignment",
    category: "ai-literacy",
    categoryLabel: "AI Literacy",
    skill: "ai-use",
    avgScore: 74,
    difficulty: "Easy",
  },
  {
    id: "ch-008",
    number: 8,
    title: "Resolve Conflict Between Two Group Members",
    category: "teamwork-conflict",
    categoryLabel: "Teamwork & Conflict",
    skill: "conflict",
    avgScore: 55,
    difficulty: "Hard",
  },
  {
    id: "ch-009",
    number: 9,
    title: "Write a Follow-Up Email After an Interview",
    category: "career-readiness",
    categoryLabel: "Career Readiness",
    skill: "emails",
    avgScore: 71,
    difficulty: "Easy",
  },
  {
    id: "ch-010",
    number: 10,
    title: "Present Bad News to a Project Team",
    category: "leadership-decision-making",
    categoryLabel: "Leadership & Decision-Making",
    skill: "leadership",
    avgScore: 57,
    difficulty: "Hard",
  },
];
