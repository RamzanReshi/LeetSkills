import type { CategoryId } from "./scenarios-meta";
import { MVP_PATHS } from "./mvp-content";

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  levels: number;
  completed: number;
  difficulty: string;
  category: Exclude<CategoryId, "all">;
  categoryLabel: string;
  iconKey: "engineering" | "quality" | "comm" | "team" | "product" | "ai";
}

export const LEARNING_PATHS: LearningPath[] = MVP_PATHS.map((path) => ({
  id: path.id,
  title: path.title,
  description: path.description,
  levels: path.scenario_ids.length,
  completed: 0,
  difficulty: path.difficulty,
  category: path.id,
  categoryLabel: path.title,
  iconKey: path.iconKey,
}));
