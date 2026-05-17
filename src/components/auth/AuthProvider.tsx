"use client";

import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

  const supabase = useMemo(() => {
    if (!isSupabaseConfigured) return null;
    return createClient();
  }, []);

  const user = session?.user ?? null;

  const loadProfile = useCallback(async (currentUser: User | null) => {
    if (!supabase) return;

    if (!currentUser) {
      setProfile(null);
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
      return;
    }

    setProfile({
      id: currentUser.id,
      email: currentUser.email ?? null,
      full_name: displayNameFromUser(currentUser),
      role: "AI-era engineering learner",
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (!supabase) return;

    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    await loadProfile(currentUser);
  }, [loadProfile, supabase]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      void loadProfile(data.session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      void loadProfile(nextSession?.user ?? null);
      router.refresh();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadProfile, router, supabase]);

  const signOut = useCallback(async () => {
    if (!supabase) return;

    await supabase.auth.signOut();
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
