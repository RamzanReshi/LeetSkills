"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRightIcon, FlameIcon, SettingsIcon, UserIcon } from "@/components/ui/Icons";
import {
  getAccountDisplayName,
  getAccountRole,
  useAuth,
} from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/browser";

const PREVIEW_STATS = [
  { label: "Completed", value: "0/24", detail: "Practice scenarios finished" },
  { label: "Attempts", value: "0", detail: "Evaluated responses" },
  { label: "Average", value: "--", detail: "Across scored dimensions" },
];

const WEEKLY_PREVIEW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const FINGERPRINT_PREVIEW = [
  ["Prompt Clarity", 74],
  ["Problem Framing", 62],
  ["Debugging Judgment", 48],
  ["Communication", 69],
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
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const displayName = getAccountDisplayName(user, profile);
  const role = getAccountRole(profile);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!user) {
      setError("You need to sign in before editing your profile.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const nextRole = String(formData.get("role") ?? "").trim();
    const supabase = createClient();
    setSaving(true);

    try {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email ?? null,
        full_name: fullName || null,
        role: nextRole || null,
        updated_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      await supabase.auth.updateUser({
        data: {
          full_name: fullName,
        },
      });

      await refreshProfile();
      setMessage("Profile updated.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

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
                  {displayName}
                </h1>
                <p className="mt-1 text-sm text-neutral-500">{role}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href="/settings"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-brand-deep transition-colors hover:border-brand-primary hover:text-brand-primary"
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Link>
              <Link
                href="/scenarios"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover"
              >
                Continue practice
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-dashed border-brand-primary/30 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase text-brand-primary">
              Coming soon: progress tracking
            </p>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="mt-3 font-medium text-neutral-700">Scenarios completion</span>
              <span className="font-semibold text-brand-deep">Preview</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
              <div
                className="h-full rounded-full bg-brand-primary/45"
                style={{ width: "42%" }}
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
            {WEEKLY_PREVIEW.map((day, index) => (
              <div key={day} className="text-center">
                <div
                  className={[
                    "mx-auto flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-semibold",
                    index < 4
                      ? "border-brand-primary/30 bg-brand-mint/60 text-brand-primary"
                      : "border-neutral-300 bg-neutral-100 text-neutral-500",
                  ].join(" ")}
                >
                  {day.slice(0, 1)}
                </div>
                <p className="mt-2 text-[11px] text-neutral-500">{day}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            Coming soon: progress tracking
          </p>
        </section>
      </header>

      <section className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PREVIEW_STATS.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
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
            {FINGERPRINT_PREVIEW.map(([name, score]) => (
              <div key={name}>
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-neutral-700">{name}</span>
                  <span className="font-semibold text-brand-deep">Preview</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                  <div
                    className="h-full rounded-full bg-brand-primary/45"
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
                Coming soon: progress tracking
              </p>
            </div>
            <div className="rounded-lg bg-neutral-100 p-4">
              <p className="text-xs font-medium uppercase text-neutral-500">Next focus</p>
              <p className="mt-1 font-semibold text-brand-deep">
                Preview recommendation
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
              End this authenticated session.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
            >
              Sign out
            </button>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-lg border border-neutral-300 bg-brand-card p-5 sm:p-6">
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold text-brand-deep">Supabase profile</h2>
          <p className="mt-1 text-sm text-neutral-500">
            These fields are stored in the leetskill profiles table for the current user.
          </p>
          <form
            key={profile?.updated_at ?? user?.id}
            onSubmit={handleProfileSubmit}
            className="mt-5 grid gap-4 sm:grid-cols-2"
          >
            <label className="block">
              <span className="text-sm font-semibold text-neutral-700">Full name</span>
              <input
                name="fullName"
                type="text"
                defaultValue={displayName}
                className="mt-1 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-neutral-700">Role</span>
              <input
                name="role"
                type="text"
                defaultValue={role}
                className="mt-1 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
            </label>
            <div className="sm:col-span-2">
              <p className="text-sm text-neutral-500">{user?.email}</p>
            </div>
            {error && (
              <p className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}
            {message && (
              <p className="sm:col-span-2 rounded-lg border border-brand-primary/20 bg-brand-mint px-3 py-2 text-sm text-brand-deep">
                {message}
              </p>
            )}
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
