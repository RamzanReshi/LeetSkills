"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSkillStore } from "@/store/useSkillStore";
import { SCENARIOS_META } from "@/data/scenarios-meta";
import { DashboardIcon, BookIcon, CompassIcon, UserIcon } from "@/components/ui/Icons";

const USER_NAME = "Ahmed Reshi";
const USER_INITIALS = "AR";
const USER_ROLE = "AI-era engineering learner";

const FONT_SIZES = { sm: "14px", md: "16px", lg: "18px" } as const;
type FontSize = keyof typeof FONT_SIZES;

const DIMENSION_COLORS: Record<string, string> = {
  Decomposition: "#3B82F6",
  "Hypothesis Quality": "#7C3AED",
  "Reasoning Depth": "#D97706",
  Honesty: "#1F8A5B",
};

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: DashboardIcon },
  { href: "/scenarios", label: "Scenarios", icon: BookIcon },
  { href: "/path", label: "Learning Path", icon: CompassIcon },
  { href: "/profile", label: "Profile", icon: UserIcon },
];

export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("md");
  const [confirmReset, setConfirmReset] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const fingerprint = useSkillStore((s) => s.fingerprint);
  const history = useSkillStore((s) => s.history);
  const completedIds = useSkillStore((s) => s.completedScenarioIds);
  const resetSession = useSkillStore((s) => s.resetSession);

  const completedCount = completedIds.length;
  const totalCount = SCENARIOS_META.length;
  const completionPct = Math.round((completedCount / totalCount) * 100);

  const avgScore =
    history.length === 0
      ? 0
      : Math.round(
          (history.reduce((sum, e) => {
            return (
              sum +
              e.scores.reduce((s, d) => s + d.score / d.max_score, 0) /
                e.scores.length
            );
          }, 0) /
            history.length) *
            100
        );

  const dims = Object.entries(fingerprint) as [string, number][];
  const strongest = [...dims].sort((a, b) => b[1] - a[1])[0];
  const weakest = [...dims].sort((a, b) => a[1] - b[1])[0];
  const hasData = dims.some(([, v]) => v > 0);

  // Load saved font size on mount
  useEffect(() => {
    const saved = localStorage.getItem("ls-font-size") as FontSize | null;
    if (saved && FONT_SIZES[saved]) {
      setFontSize(saved);
      document.documentElement.style.fontSize = FONT_SIZES[saved];
    }
  }, []);

  const applyFontSize = (size: FontSize) => {
    setFontSize(size);
    document.documentElement.style.fontSize = FONT_SIZES[size];
    localStorage.setItem("ls-font-size", size);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setConfirmReset(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setConfirmReset(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetSession();
    setConfirmReset(false);
    setOpen(false);
    router.push("/dashboard");
  };

  const close = () => {
    setOpen(false);
    setConfirmReset(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Avatar trigger */}
      <button
        onClick={() => {
          setOpen((v) => !v);
          setConfirmReset(false);
        }}
        aria-label="Open profile menu"
        aria-expanded={open}
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold tracking-wide transition-all ${
          open
            ? "bg-brand-primary text-white ring-2 ring-brand-primary/30"
            : "bg-brand-mint text-brand-primary hover:bg-brand-primary hover:text-white"
        }`}
      >
        {USER_INITIALS}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl ring-1 ring-black/5 animate-fade-in sm:w-80"
          role="menu"
          aria-label="Profile menu"
        >
          {/* ── User header ── */}
          <div className="flex items-center gap-3 border-b border-neutral-100 bg-brand-mint/30 px-4 py-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white shadow-sm">
              {USER_INITIALS}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-brand-deep">{USER_NAME}</p>
              <p className="truncate text-xs text-neutral-500">{USER_ROLE}</p>
            </div>
            <Link
              href="/profile"
              onClick={close}
              className="shrink-0 rounded-lg border border-brand-primary/30 bg-white px-2.5 py-1 text-[11px] font-semibold text-brand-primary transition-colors hover:bg-brand-mint"
            >
              View →
            </Link>
          </div>

          {/* ── Progress bar ── */}
          <div className="border-b border-neutral-100 px-4 py-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-700">Scenario progress</span>
              <span className="text-xs font-bold text-brand-primary">
                {completedCount}/{totalCount} · {completionPct}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-brand-primary transition-all duration-700"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>

          {/* ── Quick stats ── */}
          <div className="grid grid-cols-3 divide-x divide-neutral-100 border-b border-neutral-100">
            {[
              { label: "Avg Score", value: hasData ? `${avgScore}%` : "—" },
              { label: "Completed", value: String(completedCount) },
              { label: "Attempts", value: String(history.length) },
            ].map((s) => (
              <div key={s.label} className="py-3 text-center">
                <p className="text-lg font-black leading-none text-brand-deep">{s.value}</p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-neutral-500">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* ── Skill fingerprint mini-bars ── */}
          <div className="border-b border-neutral-100 px-4 py-3">
            <p className="mb-2.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Skill Fingerprint
            </p>
            <div className="space-y-2">
              {dims.map(([dim, score]) => (
                <div key={dim} className="flex items-center gap-2">
                  <span className="w-[100px] shrink-0 truncate text-[11px] text-neutral-600">
                    {dim}
                  </span>
                  <div className="h-1 flex-1 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${score}%`,
                        backgroundColor: DIMENSION_COLORS[dim] ?? "#1F8A5B",
                      }}
                    />
                  </div>
                  <span
                    className="w-6 shrink-0 text-right text-[11px] font-bold"
                    style={{ color: DIMENSION_COLORS[dim] ?? "#1F8A5B" }}
                  >
                    {score}
                  </span>
                </div>
              ))}
            </div>

            {hasData && strongest && weakest && (
              <div className="mt-3 flex gap-2">
                <div className="flex-1 rounded-lg bg-brand-mint px-2.5 py-1.5">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-brand-primary">
                    Top
                  </p>
                  <p className="truncate text-[11px] font-bold text-brand-deep">{strongest[0]}</p>
                </div>
                <div className="flex-1 rounded-lg bg-amber-50 px-2.5 py-1.5">
                  <p className="text-[9px] font-bold uppercase tracking-wide text-amber-600">
                    Focus
                  </p>
                  <p className="truncate text-[11px] font-bold text-brand-deep">{weakest[0]}</p>
                </div>
              </div>
            )}
          </div>

          {/* ── Navigation ── */}
          <div className="border-b border-neutral-100 px-2 py-2">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const isActive = !!pathname?.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={close}
                  role="menuitem"
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-brand-mint text-brand-primary"
                      : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* ── Accessibility — text size ── */}
          <div className="border-b border-neutral-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-neutral-700">Text size</p>
                <p className="text-[10px] text-neutral-400">Applies site-wide</p>
              </div>
              <div className="flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
                <button
                  onClick={() => applyFontSize("sm")}
                  aria-label="Small text"
                  aria-pressed={fontSize === "sm"}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-all ${
                    fontSize === "sm"
                      ? "bg-white text-brand-primary shadow-sm"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  A
                </button>
                <button
                  onClick={() => applyFontSize("md")}
                  aria-label="Medium text"
                  aria-pressed={fontSize === "md"}
                  className={`rounded-md px-2.5 py-1 text-[14px] font-bold transition-all ${
                    fontSize === "md"
                      ? "bg-white text-brand-primary shadow-sm"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  A
                </button>
                <button
                  onClick={() => applyFontSize("lg")}
                  aria-label="Large text"
                  aria-pressed={fontSize === "lg"}
                  className={`rounded-md px-2.5 py-1 text-[17px] font-bold transition-all ${
                    fontSize === "lg"
                      ? "bg-white text-brand-primary shadow-sm"
                      : "text-neutral-400 hover:text-neutral-600"
                  }`}
                >
                  A
                </button>
              </div>
            </div>
          </div>

          {/* ── Account: reset ── */}
          <div className="px-4 py-3">
            <button
              onClick={handleReset}
              className={`w-full rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                confirmReset
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "border border-neutral-200 text-neutral-500 hover:border-red-300 hover:text-red-500"
              }`}
            >
              {confirmReset ? "⚠ Confirm — erase all progress" : "Reset progress"}
            </button>
            {confirmReset && (
              <button
                onClick={() => setConfirmReset(false)}
                className="mt-1.5 w-full text-center text-[11px] text-neutral-400 hover:text-neutral-600"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
