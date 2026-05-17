"use client";


import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/browser";
import { useSkillStore } from "@/store/useSkillStore";
import {
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
import { useLanguage } from "@/i18n/LanguageProvider";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";

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
  const { t } = useLanguage();
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
      setError(t("profile.signInFirst"));
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
      setMessage(t("settings.saved"));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : t("settings.saveFailed"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10 animate-fade-in">
      <div className="grid gap-5">
        <SettingsSection
          icon={UserIcon}
          title={t("settings.accountProfile")}
          detail={t("settings.accountProfileDetail")}
        >
          <form
            key={profile?.updated_at ?? user?.id}
            onSubmit={handleProfileSubmit}
            className="grid gap-4 sm:grid-cols-2"
          >
            <label className="block">
              <span className="text-sm font-semibold text-neutral-700">{t("auth.fullName")}</span>
              <input
                name="fullName"
                type="text"
                defaultValue={displayName}
                className="mt-1 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-neutral-700">{t("profile.role")}</span>
              <input
                name="role"
                type="text"
                defaultValue={role}
                className="mt-1 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
            </label>
            <div className="sm:col-span-2 rounded-lg bg-neutral-100 px-3 py-2">
              <p className="text-xs font-medium uppercase text-neutral-500">{t("auth.email")}</p>
              <p className="mt-1 break-all text-sm font-medium text-brand-deep">
                {user?.email ?? t("settings.notSignedIn")}
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
                {saving ? t("settings.savingBtn") : t("settings.saveBtn")}
              </button>
            </div>
          </form>
        </SettingsSection>

        <SettingsSection
          icon={SettingsIcon}
          title={t("settings.languagePref")}
          detail={t("settings.languagePrefDetail")}
        >
          <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 bg-white px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-brand-deep">{t("nav.language")}</p>
              <p className="mt-1 text-sm text-neutral-500">{t("settings.languagePrefDetail")}</p>
            </div>
            <LanguageSwitcher />
          </div>
        </SettingsSection>

        <div className="grid gap-5 lg:grid-cols-2">
          <SettingsSection
            icon={SettingsIcon}
            title={t("settings.learning")}
            detail={t("settings.learningDetail")}
          >
            <div className="space-y-3">
              <label className="block">
                <span className="text-sm font-semibold text-neutral-700">{t("settings.sessionLength")}</span>
                <select
                  value={defaultSessionLength}
                  onChange={(event) => setDefaultSessionLength(event.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                >
                  <option value="15 minutes">{t("settings.minutes15")}</option>
                  <option value="25 minutes">{t("settings.minutes25")}</option>
                  <option value="45 minutes">{t("settings.minutes45")}</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-neutral-700">{t("settings.preferredDifficulty")}</span>
                <select
                  value={preferredDifficulty}
                  onChange={(event) => setPreferredDifficulty(event.target.value)}
                  className="mt-1 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
                >
                  <option value="Adaptive">{t("settings.adaptive")}</option>
                  <option value="Foundational">{t("settings.foundational")}</option>
                  <option value="Intermediate">{t("settings.intermediate")}</option>
                  <option value="Advanced">{t("settings.advanced")}</option>
                </select>
              </label>
              <ToggleRow
                title={t("settings.compact")}
                detail={t("settings.compactDetail")}
                enabled={compactMode}
                onChange={setCompactMode}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            icon={BellIcon}
            title={t("settings.notifications")}
            detail={t("settings.notificationsDetail")}
          >
            <div className="space-y-3">
              <ToggleRow
                title={t("settings.reminders")}
                detail={t("settings.remindersDetail")}
                enabled={practiceReminders}
                onChange={setPracticeReminders}
              />
              <ToggleRow
                title={t("settings.weekly")}
                detail={t("settings.weeklyDetail")}
                enabled={weeklyDigest}
                onChange={setWeeklyDigest}
              />
              <ToggleRow
                title={t("settings.hints")}
                detail={t("settings.hintsDetail")}
                enabled={evaluationHints}
                onChange={setEvaluationHints}
              />
            </div>
          </SettingsSection>
        </div>

        <SettingsSection
          icon={SettingsIcon}
          title={t("settings.appearance")}
          detail={t("settings.appearanceDetail")}
        >
          <ThemeToggle detail={t("theme.savedLocal")} />
        </SettingsSection>

        <SettingsSection
          icon={ShieldIcon}
          title={t("settings.privacy")}
          detail={t("settings.privacyDetail")}
        >
          <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-brand-deep">{t("settings.localData")}</h3>
              <p className="mt-1 text-sm text-neutral-500">
                {t("settings.localDataDetail")}
              </p>
              <button
                type="button"
                onClick={resetSession}
                className="mt-4 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
              >
                {t("settings.resetProgress")}
              </button>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <h3 className="text-sm font-semibold text-brand-deep">{t("settings.currentSession")}</h3>
              <p className="mt-1 text-sm text-neutral-500">
                {t("settings.currentSessionDetail")}
              </p>
              <button
                type="button"
                onClick={() => void signOut()}
                className="mt-4 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:border-brand-primary hover:text-brand-primary"
              >
                {t("settings.signOut")}
              </button>
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
}
