// ============================================================
// LeetSkills MVP — localStorage Helpers
// Owner: Reshi (Foundation & Infrastructure)
// ============================================================

import type { SessionData } from "@/types";

const STORAGE_KEY = "leetskills_session";

function getSessionStorageKey(userId?: string | null): string {
  return userId ? `${STORAGE_KEY}:${userId}` : `${STORAGE_KEY}:anonymous`;
}

/** Load session from localStorage. Returns null if not found or invalid. */
export function loadSession(userId?: string | null): SessionData | null {
  if (typeof window === "undefined") return null;

  try {
    const scopedRaw = localStorage.getItem(getSessionStorageKey(userId));
    const raw = scopedRaw ?? (userId ? null : localStorage.getItem(STORAGE_KEY));
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

/** Save session to localStorage. */
export function saveSession(session: SessionData, userId?: string | null): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(getSessionStorageKey(userId), JSON.stringify(session));
  } catch (error) {
    console.error("Failed to save session:", error);
  }
}

/** Clear session from localStorage. */
export function clearSession(userId?: string | null): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getSessionStorageKey(userId));
  if (!userId) localStorage.removeItem(STORAGE_KEY);
}
