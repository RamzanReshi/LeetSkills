"use client";

import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Profile } from "@/types/supabase";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  configured: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const PROFILE_CACHE_KEY = "leetskills_profile_cache";

function loadCachedProfile(userId: string): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Profile;
    return parsed.id === userId ? parsed : null;
  } catch {
    return null;
  }
}

function saveCachedProfile(profile: Profile | null) {
  if (typeof window === "undefined") return;
  try {
    if (profile) localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
    else localStorage.removeItem(PROFILE_CACHE_KEY);
  } catch {
    // ignore
  }
}

function displayNameFromUser(user: User | null) {
  const metadataName = user?.user_metadata?.full_name;
  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim();
  }

  return user?.email?.split("@")[0] ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(() => isSupabaseConfigured);
  const loadedProfileForUserId = useRef<string | null>(null);
  const authUserIdRef = useRef<string | null>(null);
  const inflightProfileLoad = useRef<Promise<void> | null>(null);

  const supabase = useMemo(() => {
    if (!isSupabaseConfigured) return null;
    return createClient();
  }, []);

  const user = session?.user ?? null;

  const loadProfile = useCallback(async (currentUser: User | null, force = false) => {
    if (!supabase) return;

    if (!currentUser) {
      loadedProfileForUserId.current = null;
      setProfile(null);
      saveCachedProfile(null);
      return;
    }

    if (!force && loadedProfileForUserId.current === currentUser.id) return;
    if (inflightProfileLoad.current && !force) return inflightProfileLoad.current;

    const run = (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      const next: Profile = data ?? {
        id: currentUser.id,
        email: currentUser.email ?? null,
        full_name: displayNameFromUser(currentUser),
        role: "AI-era engineering learner",
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      loadedProfileForUserId.current = currentUser.id;
      setProfile(next);
      saveCachedProfile(next);
    })();

    inflightProfileLoad.current = run;
    try {
      await run;
    } finally {
      inflightProfileLoad.current = null;
    }
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (!supabase) return;

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    await loadProfile(currentUser, true);
  }, [loadProfile, supabase]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let active = true;

    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        if (!active) return;
        try {
          setSession(data.session);
          const u = data.session?.user ?? null;
          authUserIdRef.current = u?.id ?? null;
          if (u) {
            const cached = loadCachedProfile(u.id);
            if (cached) {
              loadedProfileForUserId.current = u.id;
              setProfile(cached);
            }
          }
          await loadProfile(u);
        } finally {
          if (active) setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      const nextUserId = nextSession?.user?.id ?? null;
      const prevUserId = authUserIdRef.current;
      const userChanged = nextUserId !== prevUserId;
      authUserIdRef.current = nextUserId;
      setSession(nextSession);
      // Skip redundant profile fetch when same user (e.g. INITIAL_SESSION, TOKEN_REFRESHED).
      if (nextUserId && nextUserId === prevUserId && event !== "USER_UPDATED") {
        setLoading(false);
        return;
      }
      setLoading(true);
      void loadProfile(nextSession?.user ?? null)
        .catch(() => {
          // Keep the current session usable if the profile fetch is temporarily unavailable.
        })
        .finally(() => {
          setLoading(false);
        });
      if (userChanged && (event === "SIGNED_IN" || event === "SIGNED_OUT")) {
        router.refresh();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadProfile, router, supabase]);

  const signOut = useCallback(async () => {
    if (!supabase) return;

    await supabase.auth.signOut();
    loadedProfileForUserId.current = null;
    authUserIdRef.current = null;
    saveCachedProfile(null);
    setSession(null);
    setProfile(null);
    router.push("/login");
    router.refresh();
  }, [router, supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      loading,
      configured: Boolean(supabase),
      refreshProfile,
      signOut,
    }),
    [loading, profile, refreshProfile, session, signOut, supabase, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}

export function getAccountDisplayName(user: User | null, profile: Profile | null) {
  return profile?.full_name || displayNameFromUser(user) || "Learner";
}

export function getAccountRole(profile: Profile | null) {
  return profile?.role || "AI-era engineering learner";
}
