"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useLanguage } from "@/i18n/LanguageProvider";

type Mode = "login" | "signup";
const LAST_AUTH_EMAIL_KEY = "leetskills_last_auth_email";

function getSavedAuthEmail() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(LAST_AUTH_EMAIL_KEY) ?? "";
}

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const passwordRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(() =>
    searchParams.get("message") === "account-created"
      ? t("auth.accountCreated")
      : null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";
  const initialEmail = isSignup
    ? ""
    : searchParams.get("email") ?? getSavedAuthEmail();

  useEffect(() => {
    if (!isSignup && initialEmail) {
      passwordRef.current?.focus();
    }
  }, [initialEmail, isSignup]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!isSupabaseConfigured) {
      setError(t("auth.notConfigured"));
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const fullName = String(formData.get("fullName") ?? "");
    const supabase = createClient();
    window.localStorage.setItem(LAST_AUTH_EMAIL_KEY, email);
    setLoading(true);

    try {
      if (isSignup) {
        const origin = window.location.origin;
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
            data: {
              full_name: fullName,
            },
          },
        });

        if (signUpError) throw signUpError;
        router.push(
          `/login?email=${encodeURIComponent(email)}&message=account-created`,
        );
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      router.push(searchParams.get("next") || "/dashboard");
      router.refresh();
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : t("auth.failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignup && (
        <label className="block">
          <span className="text-sm font-semibold text-neutral-700">{t("auth.fullName")}</span>
          <input
            name="fullName"
            type="text"
            autoComplete="name"
            required
            className="mt-1.5 h-12 w-full rounded-lg border border-neutral-300 bg-white px-3 text-base outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 sm:text-sm"
          />
        </label>
      )}

      <label className="block">
        <span className="text-sm font-semibold text-neutral-700">{t("auth.email")}</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={initialEmail}
          autoFocus={!initialEmail}
          required
          className="mt-1.5 h-12 w-full rounded-lg border border-neutral-300 bg-white px-3 text-base outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 sm:text-sm"
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold text-neutral-700">{t("auth.password")}</span>
        <input
          name="password"
          type="password"
          ref={passwordRef}
          autoComplete={isSignup ? "new-password" : "current-password"}
          minLength={6}
          required
          className="mt-1.5 h-12 w-full rounded-lg border border-neutral-300 bg-white px-3 text-base outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 sm:text-sm"
        />
      </label>

      {!isSignup && (
        <div className="text-right">
          <Link href="/forgot-password" className="text-sm font-semibold text-brand-primary hover:underline">
            {t("auth.forgot")}
          </Link>
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-lg border border-brand-primary/20 bg-brand-mint px-3 py-2 text-sm text-brand-deep">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-brand-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? t("auth.working") : isSignup ? t("auth.signUp") : t("auth.signIn")}
      </button>

      <p className="text-center text-sm text-neutral-500">
        {isSignup ? t("auth.haveAccount") : t("auth.newToApp")}{" "}
        <Link href={isSignup ? "/login" : "/signup"} className="font-semibold text-brand-primary hover:underline">
          {isSignup ? t("auth.signInLink") : t("auth.signUpLink")}
        </Link>
      </p>
    </form>
  );
}
