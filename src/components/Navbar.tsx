"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SCENARIOS_META } from "@/data/scenarios-meta";
import { useSkillStore } from "@/store/useSkillStore";
import {
  BookIcon,
  CloseIcon,
  CompassIcon,
  DashboardIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
  UserIcon,
} from "@/components/ui/Icons";
import {
  getAccountDisplayName,
  getAccountRole,
  useAuth,
} from "@/components/auth/AuthProvider";
import { useLanguage } from "@/i18n/LanguageProvider";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";
import { useDimensionLabel } from "@/i18n/content";
import ThemeToggle from "@/components/theme/ThemeToggle";

const dropdownLinks = [
  { key: "nav.dashboard", href: "/dashboard", icon: DashboardIcon },
  { key: "nav.scenarios", href: "/scenarios", icon: BookIcon },
  { key: "nav.learningPath", href: "/path", icon: CompassIcon },
  { key: "nav.profile", href: "/profile", icon: UserIcon },
  { key: "nav.settings", href: "/settings", icon: SettingsIcon },
] as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function strengthLabelKey(score: number) {
  if (score >= 80) return "nav.profileStrong";
  if (score >= 60) return "nav.profileDeveloping";
  if (score > 0) return "nav.profileNeedsFocus";
  return "nav.profileNotStarted";
}

function displayScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [navSearch, setNavSearch] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const fingerprint = useSkillStore((s) => s.fingerprint);
  const completedAttempts = useSkillStore((s) => s.completedAttempts);
  const completedScenarioIds = useSkillStore((s) => s.completedScenarioIds);
  const hydrateSession = useSkillStore((s) => s.hydrateSession);
  const syncWithUser = useSkillStore((s) => s.syncWithUser);
  const { user, profile, loading, signOut } = useAuth();
  const { t } = useLanguage();
  const dimensionLabel = useDimensionLabel();
  const authReady = !loading;
  const isSignedIn = authReady && Boolean(user);
  const displayName = authReady ? getAccountDisplayName(user, profile) : "";
  const role = getAccountRole(profile);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (loading) return;
    void syncWithUser(user?.id ?? null);
  }, [loading, syncWithUser, user?.id]);

  const completed = SCENARIOS_META.filter((scenario) =>
    completedScenarioIds.includes(scenario.id),
  ).length;
  const progress = Math.round((completed / SCENARIOS_META.length) * 100);
  const averageScore =
    completedAttempts.length === 0
      ? null
      : Math.round(
          completedAttempts.reduce((sum, attempt) => sum + attempt.score, 0) /
            completedAttempts.length,
        );
  const initials = getInitials(displayName);

  const isActiveLink = (href: string) =>
    pathname === href ||
    (href !== "/dashboard" && href !== "/profile" && pathname?.startsWith(href)) ||
    (href === "/settings" && pathname?.startsWith("/profile/settings"));

  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;

      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }

      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setMobileMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const query = navSearch.trim();

    if (!query) {
      if (pathname?.startsWith("/scenarios")) {
        const params = new URLSearchParams(window.location.search);
        if (!params.has("search") && !params.has("q")) return;

        params.delete("search");
        params.delete("q");
        const nextUrl = params.toString() ? `/scenarios?${params.toString()}` : "/scenarios";
        const timeout = window.setTimeout(() => {
          router.replace(nextUrl, { scroll: false });
        }, 200);

        return () => window.clearTimeout(timeout);
      }

      return;
    }

    const timeout = window.setTimeout(() => {
      router.replace(`/scenarios?search=${encodeURIComponent(query)}`, {
        scroll: false,
      });
      setMobileMenuOpen(false);
      setProfileOpen(false);
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [navSearch, pathname, router]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white">
      <div className="flex h-[50px] w-screen max-w-[100vw] items-center justify-between px-4">
        <div className="flex h-full items-center">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
            <div className="relative h-8 w-8">
              <Image
                src="/leetskills_logo_no_background.png"
                alt="LeetSkills Logo"
                fill
                sizes="32px"
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-deep">
              Leet<span className="font-normal text-brand-primary">Skills</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher compact />

          <div className="relative hidden md:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              value={navSearch}
              onChange={(event) => setNavSearch(event.target.value)}
              placeholder={t("nav.search")}
              className="h-8 w-40 rounded-md bg-neutral-100 pl-9 pr-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-300"
            />
          </div>

          <div ref={mobileMenuRef} className="relative md:hidden">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((open) => !open);
                setProfileOpen(false);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 transition-colors hover:bg-neutral-100"
              aria-label={mobileMenuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>

            {mobileMenuOpen && (
              <div className="absolute right-0 top-full z-50 mt-3 w-56 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl shadow-neutral-900/15 ring-1 ring-neutral-900/5">
                {(authReady
                  ? isSignedIn
                    ? dropdownLinks
                    : [
                        { key: "nav.signIn", href: "/login", icon: UserIcon },
                        { key: "nav.createAccount", href: "/signup", icon: UserIcon },
                      ] as const
                  : []
                ).map(({ href, key, icon: Icon }) => {
                  const active = isActiveLink(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        active
                          ? "bg-brand-mint text-brand-primary"
                          : "text-neutral-700 hover:bg-neutral-100 hover:text-brand-primary"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{t(key)}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div ref={profileRef} className="relative">
            {!authReady ? (
              <div className="hidden h-8 w-[154px] md:block" aria-hidden="true" />
            ) : isSignedIn ? (
              <button
                type="button"
                aria-label={t("nav.openProfile")}
                aria-expanded={profileOpen}
                onClick={() => {
                  setProfileOpen((open) => !open);
                  setMobileMenuOpen(false);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-xs font-bold text-white shadow-sm ring-1 ring-brand-primary/20 transition-all hover:ring-2 hover:ring-brand-primary/25"
              >
                {initials}
              </button>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-1.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-brand-primary"
                >
                  {t("nav.signIn")}
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-brand-primary px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover"
                >
                  {t("nav.createAccount")}
                </Link>
              </div>
            )}

            {isSignedIn && profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-3 w-[320px] rounded-2xl border border-neutral-200 bg-white p-4 shadow-2xl shadow-neutral-900/15 ring-1 ring-neutral-900/5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-brand-deep">{displayName}</p>
                    <p className="truncate text-xs text-neutral-500">{role}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="rounded-lg border border-neutral-300 p-1.5 text-brand-primary transition-colors hover:border-brand-primary hover:bg-brand-mint"
                    aria-label={t("nav.openSettings")}
                  >
                    <SettingsIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-brand-primary transition-colors hover:border-brand-primary hover:bg-brand-mint"
                  >
                    {t("nav.view")} -&gt;
                  </Link>
                </div>
              </div>

              <div className="mb-4 border-y border-neutral-200 py-3">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-neutral-700">
                  <span>{t("nav.scenarioProgress")}</span>
                  <span className="text-brand-primary">
                    {completed}/{SCENARIOS_META.length} - {progress}%
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-brand-primary transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-3 divide-x divide-neutral-200 text-center">
                  <div>
                    <p className="text-lg font-black text-brand-deep">
                      {averageScore === null ? "-" : averageScore}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                      {t("nav.avgScore")}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-brand-deep">{completed}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                      {t("nav.completed")}
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-brand-deep">{completedAttempts.length}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                      {t("nav.attempts")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                  {t("nav.skillFingerprint")}
                </p>
                <div className="space-y-2">
                  {Object.entries(fingerprint).map(([name, score]) => {
                    const clampedScore = displayScore(score);
                    return (
                      <div key={name} className="grid grid-cols-[1fr_120px_24px] items-center gap-2 text-xs">
                        <span className="truncate text-neutral-700">{dimensionLabel(name)}</span>
                        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                          <div
                            className="h-full rounded-full bg-brand-primary transition-all duration-700"
                            style={{ width: `${clampedScore}%` }}
                          />
                        </div>
                        <span className="text-right font-semibold text-brand-primary">{clampedScore}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-4">
                <ThemeToggle detail={t("nav.textSizeApplies")} />
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-neutral-500">
                  {t(strengthLabelKey(Math.max(...Object.values(fingerprint).map(displayScore))))}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      void signOut();
                    }}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:border-brand-primary hover:text-brand-primary"
                  >
                    {t("nav.signOut")}
                  </button>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
