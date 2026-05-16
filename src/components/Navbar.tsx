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
  UserIcon,
} from "@/components/ui/Icons";
import {
  getAccountDisplayName,
  getAccountRole,
  useAuth,
} from "@/components/auth/AuthProvider";

const dropdownLinks = [
  { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  { name: "Scenarios", href: "/scenarios", icon: BookIcon },
  { name: "Learning Path", href: "/path", icon: CompassIcon },
  { name: "Profile", href: "/profile", icon: UserIcon },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function strengthLabel(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Developing";
  if (score > 0) return "Needs focus";
  return "Not started";
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
  const history = useSkillStore((s) => s.history);
  const completedScenarioIds = useSkillStore((s) => s.completedScenarioIds);
  const resetSession = useSkillStore((s) => s.resetSession);
  const { user, profile, signOut } = useAuth();
  const isSignedIn = Boolean(user);
  const displayName = getAccountDisplayName(user, profile);
  const role = getAccountRole(profile);

  const completed = SCENARIOS_META.filter((scenario) =>
    completedScenarioIds.includes(scenario.id),
  ).length;
  const progress = Math.round((completed / SCENARIOS_META.length) * 100);
  const averageScore =
    history.length === 0
      ? null
      : Math.round(
          history.reduce((sum, entry) => sum + entry.overall_score, 0) /
            history.length,
        );
  const initials = getInitials(displayName);

  const isActiveLink = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));

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
        const timeout = window.setTimeout(() => {
          router.replace("/scenarios", { scroll: false });
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
                src="/logo-v2.png"
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
          <div className="relative hidden md:block">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-4 w-4 text-neutral-400" />
            </div>
            <input
              type="text"
              value={navSearch}
              onChange={(event) => setNavSearch(event.target.value)}
              placeholder="Search scenarios"
              className="h-8 w-40 rounded-md bg-neutral-100 pl-9 pr-3 text-sm transition-all focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-300"
            />
          </div>

          <div ref={profileRef} className="relative">
            {isSignedIn ? (
              <button
                type="button"
                aria-label="Open profile menu"
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
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-brand-primary px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover"
                >
                  Create account
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
                <Link
                  href="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="shrink-0 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-brand-primary transition-colors hover:border-brand-primary hover:bg-brand-mint"
                >
                  View -&gt;
                </Link>
              </div>

              <div className="mb-4 border-y border-neutral-200 py-3">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-neutral-700">
                  <span>Scenario progress</span>
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
                      Avg score
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-brand-deep">{completed}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                      Completed
                    </p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-brand-deep">{history.length}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
                      Attempts
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">
                  Skill fingerprint
                </p>
                <div className="space-y-2">
                  {Object.entries(fingerprint).map(([name, score]) => (
                    <div key={name} className="grid grid-cols-[1fr_120px_24px] items-center gap-2 text-xs">
                      <span className="truncate text-neutral-700">{name}</span>
                      <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className="h-full rounded-full bg-brand-primary transition-all duration-700"
                          style={{ width: `${Math.max(0, Math.min(score, 100))}%` }}
                        />
                      </div>
                      <span className="text-right font-semibold text-brand-primary">{score}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between gap-3 rounded-lg bg-neutral-50 px-3 py-2">
                <div>
                  <p className="text-xs font-semibold text-brand-deep">Text size</p>
                  <p className="text-[11px] text-neutral-500">Applies site-wide</p>
                </div>
                <div className="flex items-center rounded-lg border border-neutral-200 bg-white p-1 text-neutral-500">
                  <span className="px-2 text-xs">A</span>
                  <span className="rounded-md bg-brand-mint px-2 text-sm font-bold text-brand-primary">A</span>
                  <span className="px-2 text-base font-semibold">A</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] text-neutral-500">
                  {strengthLabel(Math.max(...Object.values(fingerprint)))} profile
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetSession}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:border-brand-primary hover:text-brand-primary"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      void signOut();
                    }}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:border-brand-primary hover:text-brand-primary"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
            )}
          </div>

          <div ref={mobileMenuRef} className="relative md:hidden">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((open) => !open);
                setProfileOpen(false);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 transition-colors hover:bg-neutral-100"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
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
                {(isSignedIn
                  ? dropdownLinks
                  : [
                      { name: "Sign in", href: "/login", icon: UserIcon },
                      { name: "Create account", href: "/signup", icon: UserIcon },
                    ]
                ).map(({ href, name, icon: Icon }) => {
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
                      <span>{name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
