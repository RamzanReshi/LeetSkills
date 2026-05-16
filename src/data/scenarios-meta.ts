import { MVP_PATHS, MVP_SCENARIOS } from "./mvp-content";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type CategoryId = "all" | (string & {});
export type SkillId = "all" | (string & {});

export interface Category {
  id: CategoryId;
  label: string;
  count: number;
}

export interface SkillTopic {
  id: SkillId;
  label: string;
}

export interface ScenarioMeta {
  id: string;
  number: number;
  title: string;
  category: Exclude<CategoryId, "all">;
  categoryLabel: string;
  skill: Exclude<SkillId, "all">;
  avgScore: number;
  difficulty: Difficulty;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const SCENARIO_CATEGORIES: Category[] = [
  { id: "all", label: "All", count: MVP_SCENARIOS.length },
  ...MVP_PATHS.map((path) => ({
    id: path.id,
    label: path.title,
    count: path.scenario_ids.length,
  })),
];

const primarySkills = new Map<string, string>();
for (const scenario of MVP_SCENARIOS) {
  const primary = scenario.skills_graded[0]?.skill;
  if (primary) primarySkills.set(slugify(primary), primary);
}

export const SKILL_TOPICS: SkillTopic[] = [
  { id: "all", label: "All Skills" },
  ...Array.from(primarySkills, ([id, label]) => ({ id, label })),
];

export const SCENARIOS_META: ScenarioMeta[] = MVP_SCENARIOS.map((scenario) => ({
  id: scenario.id,
  number: scenario.number,
  title: scenario.title,
  category: scenario.path_id,
  categoryLabel: scenario.path_title,
  skill: slugify(scenario.skills_graded[0]?.skill ?? "general"),
  avgScore: 0,
  difficulty: scenario.difficulty,
}));
