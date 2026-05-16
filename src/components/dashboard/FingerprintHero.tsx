// ============================================================
// LeetSkills MVP — Fingerprint Hero Section
// Owner: Yousef (UI/UX & Dashboard)
// ============================================================
// TODO: Large radar chart display for the dashboard hero area

"use client";

import React from "react";
import type { SkillFingerprint } from "@/types";

interface FingerprintHeroProps {
  fingerprint: SkillFingerprint;
}

export default function FingerprintHero({ fingerprint }: FingerprintHeroProps) {
  // TODO: Full-width hero section with SkillRadarChart (lg size)
  // Include title "Your Skill Fingerprint" and animated entrance
  return (
    <div>
      <h2>Your Skill Fingerprint</h2>
      {/* <SkillRadarChart fingerprint={fingerprint} size="lg" /> */}
      <pre>{JSON.stringify(fingerprint, null, 2)}</pre>
    </div>
  );
}
