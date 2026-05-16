// ============================================================
// LeetSkills MVP — localStorage Helpers
// Owner: reshiahmed (Foundation & Infrastructure)
// ============================================================

import type { SessionData } from "@/types";

const STORAGE_KEY = "leetskills_session";

/** Load session from localStorage. Returns null if not found or invalid. */
export function loadSession(): SessionData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

/** Save session to localStorage. */
export function saveSession(session: SessionData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Failed to save session:", error);
  }
}

/** Clear session from localStorage. */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
