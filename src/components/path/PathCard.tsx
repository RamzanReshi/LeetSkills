"use client";

import Link from "next/link";
import type { LearningPath } from "@/data/paths";
import { MVP_PATHS } from "@/data/mvp-content";
import { useSkillStore } from "@/store/useSkillStore";
import { ArrowRightIcon } from "@/components/ui/Icons";
import PathIcon from "./PathIcon";
import PathProgress from "./PathProgress";
import { useLanguage } from "@/i18n/LanguageProvider";

export default function PathCard({ path }: { path: LearningPath }) {
  const { t } = useLanguage();
  const completedScenarioIds = useSkillStore((s) => s.completedScenarioIds);
  const mvpPath = MVP_PATHS.find((item) => item.id === path.id);
  const completed = mvpPath
    ? mvpPath.scenario_ids.filter((id) => completedScenarioIds.includes(id)).length
    : path.completed;
  const started = completed > 0;
  const href = `/scenarios?category=${path.category}`;
  const ctaLabel = started ? t("path.continue") : t("path.start");

  return (
    <Link
      href={href}
      className="glass-card group flex flex-col gap-4 p-6 transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-mint text-brand-primary">
          <PathIcon iconKey={path.iconKey} className="h-6 w-6" />
        </div>
        <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-700">
          {path.difficulty}
        </span>
      </div>

      <div>
        <h3 className="text-lg font-semibold tracking-tight text-brand-deep">{path.title}</h3>
        <p className="mt-1 text-sm text-neutral-500">{path.description}</p>
      </div>

      <div className="mt-auto flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span className="font-medium text-neutral-700">{t("path.scenarios", { n: path.levels })}</span>
          <span>
            {completed}/{path.levels}
          </span>
        </div>

        <PathProgress completed={completed} total={path.levels} />

        <span className="inline-flex items-center justify-center gap-2 self-start rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors group-hover:bg-brand-primary-hover">
          {ctaLabel}
          <ArrowRightIcon className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
