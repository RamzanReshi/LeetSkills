"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALES,
  RTL_LOCALES,
  dictionaries,
  type Locale,
} from "./dictionaries";

const STORAGE_KEY = "leetskills.locale";
const ONBOARDED_KEY = "leetskills.localeChosen";

type Vars = Record<string, string | number>;

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Vars) => string;
  hasOnboarded: boolean;
  markOnboarded: () => void;
  dir: "ltr" | "rtl";
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name) => {
    const v = vars[name];
    return v === undefined ? `{${name}}` : String(v);
  });
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [hasOnboarded, setHasOnboarded] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.setTimeout(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const chosen = window.localStorage.getItem(ONBOARDED_KEY) === "true";
      if (isLocale(stored)) {
        setLocaleState(stored);
      }
      setHasOnboarded(chosen);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
  }, [hydrated, locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  const markOnboarded = useCallback(() => {
    setHasOnboarded(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ONBOARDED_KEY, "true");
    }
  }, []);

  const t = useCallback(
    (key: string, vars?: Vars) => {
      const fromLocale = dictionaries[locale]?.[key];
      const fromFallback = dictionaries[DEFAULT_LOCALE][key];
      const template = fromLocale ?? fromFallback ?? key;
      return interpolate(template, vars);
    },
    [locale],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      hasOnboarded,
      markOnboarded,
      dir: RTL_LOCALES.includes(locale) ? "rtl" : "ltr",
    }),
    [hasOnboarded, locale, markOnboarded, setLocale, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used inside LanguageProvider.");
  }
  return ctx;
}

export function useT() {
  return useLanguage().t;
}
