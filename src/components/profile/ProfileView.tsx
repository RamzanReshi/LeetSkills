"use client";

import Link from "next/link";
import { SCENARIOS_META } from "@/data/scenarios-meta";
import { useSkillStore } from "@/store/useSkillStore";
import { ArrowRightIcon, CheckIcon, FlameIcon, UserIcon } from "@/components/ui/Icons";

const DISPLAY_NAME = "Ahmed Reshi";
const ROLE = "AI-era engineering learner";

const WEEKLY_ACTIVITY = [
  { day: "Mon", done: true },
  { day: "Tue", done: true },
  { day: "Wed", done: false },
  { day: "Thu", done: true },
  { day: "Fri", done: true },
  { day: "Sat", done: false },
  { day: "Sun", done: false },
];

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-300 bg-brand-card p-4">
      <p className="text-xs font-medium uppercase text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-brand-deep">{value}</p>
      <p className="mt-1 text-sm text-neutral-500">{detail}</p>
    </div>
  );
}

export default function ProfileView() {
  const fingerprint = useSkillStore((s) => s.fingerprint);
  const history = useSkillStore((s) => s.history);
  const completedScenarioIds = useSkillStore((s) => s.completedScenarioIds);
  const resetSession = useSkillStore((s) => s.resetSession);

  const completedScenarios = SCENARIOS_META.filter((scenario) =>
    completedScenarioIds.includes(scenario.id),
  );
  const completionPct = Math.round((completedScenarios.length / SCENARIOS_META.length) * 100);
  const strongest = Object.entries(fingerprint).sort((a, b) => b[1] - a[1])[0];
  const weakest = Object.entries(fingerprint).sort((a, b) => a[1] - b[1])[0];
  const averageScore =
    history.length === 0
      ? 0
      : Math.round(
          history.reduce((sum, entry) => {
            const total = entry.scores.reduce(
              (scoreSum, score) => scoreSum + score.score / score.max_score,
              0,
            );
            return sum + total / entry.scores.length;
          }, 0) /
            history.length *
            100,
        );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10 animate-fade-in">
      <header className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-lg border border-neutral-300 bg-brand-card p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-brand-mint text-brand-primary">
                <UserIcon className="h-9 w-9" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-neutral-500">Profile</p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-deep sm:text-3xl">
                  {DISPLAY_NAME}
                </h1>
                <p className="mt-1 text-sm text-neutral-500">{ROLE}</p>
              </div>
            </div>
            <Link
              href="/scenarios"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover"
            >
              Continue practice
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-neutral-700">Scenarios completion</span>
              <span className="font-semibold text-brand-deep">{completionPct}%</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-brand-primary transition-all duration-700"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-neutral-300 bg-brand-card p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <FlameIcon className="h-5 w-5 text-brand-action" />
            <h2 className="text-base font-semibold text-brand-deep">Weekly rhythm</h2>
          </div>
          <div className="mt-5 grid grid-cols-7 gap-2">
            {WEEKLY_ACTIVITY.map((item) => (
              <div key={item.day} className="text-center">
                <div
                  className={[
                    "mx-auto flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold",
                    item.done
                      ? "border-brand-primary bg-brand-mint text-brand-primary"
                      : "border-neutral-300 bg-neutral-100 text-neutral-500",
                  ].join(" ")}
                >
                  {item.done ? <CheckIcon className="h-4 w-4" /> : item.day.slice(0, 1)}
                </div>
                <p className="mt-2 text-[11px] text-neutral-500">{item.day}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            Four active days this week. Keep sessions short and consistent.
          </p>
        </section>
      </header>

      <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Completed"
          value={`${completedScenarios.length}/${SCENARIOS_META.length}`}
          detail="Practice scenarios finished"
        />
        <StatCard label="Attempts" value={`${history.length}`} detail="Evaluated responses" />
        <StatCard label="Average" value={`${averageScore}%`} detail="Across scored dimensions" />
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-neutral-300 bg-brand-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-brand-deep">Skill fingerprint</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Current scoring profile from completed evaluations.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {Object.entries(fingerprint).map(([name, score]) => (
              <div key={name}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-neutral-700">{name}</span>
                  <span className="font-semibold text-brand-deep">{score}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-brand-primary transition-all duration-700"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-neutral-300 bg-brand-card p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-brand-deep">Focus plan</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-lg bg-brand-mint p-4">
              <p className="text-xs font-medium uppercase text-brand-primary">Strongest area</p>
              <p className="mt-1 font-semibold text-brand-deep">
                {strongest[0]} · {strongest[1]}%
              </p>
            </div>
            <div className="rounded-lg bg-neutral-100 p-4">
              <p className="text-xs font-medium uppercase text-neutral-500">Next focus</p>
              <p className="mt-1 font-semibold text-brand-deep">
                {weakest[0]} · {weakest[1]}%
              </p>
            </div>
            <Link
              href="/path"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-brand-deep transition-colors hover:border-brand-primary hover:text-brand-primary"
            >
              Review learning paths
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-neutral-300 bg-brand-card p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-brand-deep">Account controls</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Reset local progress when you want a fresh practice baseline.
            </p>
          </div>
          <button
            type="button"
            onClick={resetSession}
            className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
          >
            Reset progress
          </button>
        </div>
      </section>
    </div>
  );
}
