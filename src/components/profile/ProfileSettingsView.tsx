"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useSkillStore } from "@/store/useSkillStore";
import {
  ArrowRightIcon,
  BellIcon,
  SettingsIcon,
  ShieldIcon,
  UserIcon,
} from "@/components/ui/Icons";
import {
  getAccountDisplayName,
  getAccountRole,
  useAuth,
} from "@/components/auth/AuthProvider";
import ThemeToggle from "@/components/theme/ThemeToggle";

type ToggleRowProps = {
  title: string;
  detail: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
};

const SETTINGS_STORAGE_KEY = "leetskills.profileSettings";

function readStoredSettings() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) as Partial<{
      defaultSessionLength: string;
      preferredDifficulty: string;
      practiceReminders: boolean;
      weeklyDigest: boolean;
      evaluationHints: boolean;
      compactMode: boolean;
    }> : null;
  } catch {
    return null;
  }
}

function ToggleRow({ title, detail, enabled, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-brand-deep">{title}</p>
        <p className="mt-1 text-sm text-neutral-500">{detail}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/25",
          enabled ? "bg-brand-primary" : "bg-neutral-300",
        ].join(" ")}
      >
        <span
          className={[
            "absolute left-0 top-1 h-4 w-4 rounded-full bg-white transition-transform",
            enabled ? "translate-x-6" : "translate-x-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  detail,
  children,
}: {
  icon: typeof SettingsIcon;
  title: string;
  detail: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-neutral-300 bg-brand-card p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-mint text-brand-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-brand-deep">{title}</h2>
          <p className="mt-1 text-sm text-neutral-500">{detail}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function ProfileSettingsView() {
  const resetSession = useSkillStore((s) => s.resetSession);
  const { user, profile, refreshProfile, signOut } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [defaultSessionLength, setDefaultSessionLength] = useState(
    () => readStoredSettings()?.defaultSessionLength ?? "25 minutes",
  );
  const [preferredDifficulty, setPreferredDifficulty] = useState(
    () => readStoredSettings()?.preferredDifficulty ?? "Adaptive",
  );
  const [practiceReminders, setPracticeReminders] = useState(
    () => readStoredSettings()?.practiceReminders ?? true,
  );
  const [weeklyDigest, setWeeklyDigest] = useState(
    () => readStoredSettings()?.weeklyDigest ?? true,
  );
  const [evaluationHints, setEvaluationHints] = useState(
    () => readStoredSettings()?.evaluationHints ?? false,
  );
  const [compactMode, setCompactMode] = useState(
    () => readStoredSettings()?.compactMode ?? false,
  );

  const displayName = getAccountDisplayName(user, profile);
  const role = getAccountRole(profile);

  useEffect(() => {
    window.localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        defaultSessionLength,
        preferredDifficulty,
        practiceReminders,
        weeklyDigest,
        evaluationHints,
        compactMode,
      }),
    );
  }, [
    compactMode,
    defaultSessionLength,
    evaluationHints,
    practiceReminders,
    preferredDifficulty,
    weeklyDigest,
  ]);

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
      setMessage("Settings saved.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unable to update settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10 animate-fade-in">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-neutral-500">Account</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-deep">
            Settings
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-500">
            Manage account details, learning preferences, notifications, and session controls.
          </p>
        </div>
        <Link
          href="/profile"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-brand-deep transition-colors hover:border-brand-primary hover:text-brand-primary"
        >
          Back to profile
          <ArrowRightIcon className="h-4 w-4 rotate-180" />
        </Link>
      </header>

      <div className="mt-6 grid gap-5">
        <SettingsSection
          icon={UserIcon}
          title="Account profile"
          detail="Keep your public learning profile and Supabase account details current."
        >
          <form
            key={profile?.updated_at ?? user?.id}
            onSubmit={handleProfileSubmit}
            className="grid gap-4 sm:grid-cols-2"
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
            <div className="sm:col-span-2 rounded-lg bg-neutral-100 px-3 py-2">
              <p className="text-xs font-medium uppercase text-neutral-500">Email</p>
              <p className="mt-1 break-all text-sm font-medium text-brand-deep">
                {user?.email ?? "Not signed in"}
              </p>
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
                {saving ? "Saving..." : "Save settings"}
              </button>
            </div>
          </form>
        </SettingsSection>

        <div className="grid gap-5 lg:grid-cols-2">
          <SettingsSection
            icon={SettingsIcon}
            title="Learning preferences"
            detail="Set defaults for how practice sessions should feel."
          >
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-semibold text-neutral-700">Default session length</span>
                <select
                  value={defaultSessionLength}
                  onChange={(event) => setDefaultSessionLength(event.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                >
                  <option>15 minutes</option>
                  <option>25 minutes</option>
                  <option>45 minutes</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-neutral-700">Preferred difficulty</span>
                <select
                  value={preferredDifficulty}
                  onChange={(event) => setPreferredDifficulty(event.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                >
                  <option>Adaptive</option>
                  <option>Foundational</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </label>
              <ToggleRow
                title="Compact practice mode"
                detail="Use denser prompts and scoring panels."
                enabled={compactMode}
                onChange={setCompactMode}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            icon={BellIcon}
            title="Notifications"
            detail="Choose which reminders should appear in your workflow."
          >
            <div className="space-y-3">
              <ToggleRow
                title="Practice reminders"
                detail="Nudge me when I have not practiced today."
                enabled={practiceReminders}
                onChange={setPracticeReminders}
              />
              <ToggleRow
                title="Weekly digest"
                detail="Summarize progress and next focus areas."
                enabled={weeklyDigest}
                onChange={setWeeklyDigest}
              />
              <ToggleRow
                title="Evaluation hints"
                detail="Show coaching hints before submitting."
                enabled={evaluationHints}
                onChange={setEvaluationHints}
              />
            </div>
          </SettingsSection>
        </div>

        <SettingsSection
          icon={SettingsIcon}
          title="Appearance"
          detail="Choose how LeetSkills should look on this device."
        >
          <ThemeToggle detail="Saved locally for this browser." />
        </SettingsSection>

        <SettingsSection
          icon={ShieldIcon}
          title="Privacy and session"
          detail="Control local progress data and authenticated access."
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-brand-deep">Local learning data</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Scenario history and fingerprint scores are stored locally for this browser.
              </p>
              <button
                type="button"
                onClick={resetSession}
                className="mt-4 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
              >
                Reset progress
              </button>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-brand-deep">Current session</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Sign out of this browser while keeping saved profile details intact.
              </p>
              <button
                type="button"
                onClick={() => void signOut()}
                className="mt-4 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
              >
                Sign out
              </button>
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}
