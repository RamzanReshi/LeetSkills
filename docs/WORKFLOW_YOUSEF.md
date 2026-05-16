# 🎨 Yousef — UI/UX & Dashboard Workflow

> **Role:** UI/UX & Dashboard Lead
> **Branch:** `feat/ui-dashboard`
> **Phase Priority:** Phase 3 (after foundation merges) → Phase 4 (polish)

---

## Your Owned Files

```
src/components/fingerprint/SkillRadarChart.tsx  ← 4-axis Recharts radar chart + Framer Motion
src/components/evaluation/ScoreCard.tsx         ← Individual dimension score display
src/components/evaluation/FeedbackPanel.tsx     ← AI feedback text panel
src/components/evaluation/WeakestCallout.tsx    ← Weakest dimension highlight
src/components/dashboard/FingerprintHero.tsx    ← Dashboard hero section
src/components/dashboard/TodayScenarioCTA.tsx   ← Scenario call-to-action card
src/components/dashboard/WeakDimensionBanner.tsx ← Weakest dimension banner
src/app/dashboard/page.tsx                      ← Dashboard page composition
src/app/results/[id]/page.tsx                   ← Results page composition
```

---

## Phase 3 Tasks — Product Experience (Weeks 2–3)

### Skill Fingerprint (Start Early — Can Prototype Independently)
- [ ] Implement `SkillRadarChart.tsx` with Recharts `RadarChart`
  - 4 axes: Decomposition, Hypothesis Quality, Reasoning Depth, Honesty
  - Scale: 0–100
  - Support `sm`, `md`, `lg` sizes
- [ ] Add Framer Motion animated transitions on score updates
- [ ] Test with mock fingerprint data

### Dashboard Page
- [ ] Implement `FingerprintHero.tsx` — large radar chart with title
- [ ] Implement `TodayScenarioCTA.tsx` — card linking to next scenario
- [ ] Implement `WeakDimensionBanner.tsx` — highlights weakest skill area
- [ ] Compose all into `src/app/dashboard/page.tsx`
- [ ] Integrate with `useSkillStore` for live fingerprint data

### Results Page
- [ ] Implement `ScoreCard.tsx` — dimension name, score bar, feedback text
- [ ] Implement `FeedbackPanel.tsx` — styled AI feedback display
- [ ] Implement `WeakestCallout.tsx` — highlighted callout banner
- [ ] Compose all into `src/app/results/[id]/page.tsx`
- [ ] Include updated `SkillRadarChart` showing new fingerprint state
- [ ] Add "Back to Dashboard" navigation

### Create PR
- [ ] Create PR: `feat/ui-dashboard → main`

## Phase 4 Tasks — UX Polish (Week 4)

- [ ] Page transitions between routes (Framer Motion)
- [ ] Hover effects on all interactive elements
- [ ] Loading skeleton states for dashboard
- [ ] Responsive layout adjustments
- [ ] Color system refinement (score-based color gradients)
- [ ] Visual QA across browsers

---

## Setup Instructions

```bash
# Clone and install
git clone https://github.com/CadPosting/LeetSkills.git
cd LeetSkills
npm install

# Create your branch (after Reshi's foundation merges)
git checkout main
git pull origin main
git checkout -b feat/ui-dashboard

# Start dev server
npm run dev

# When ready, push and create PR
git push origin feat/ui-dashboard
```

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `recharts` | Radar chart visualization |
| `framer-motion` | Animated transitions |
| `zustand` | Read skill store for fingerprint data |

## Recharts Radar Chart Quick Reference

```tsx
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const data = [
  { dimension: "Decomposition", score: 75 },
  { dimension: "Hypothesis Quality", score: 60 },
  { dimension: "Reasoning Depth", score: 80 },
  { dimension: "Honesty", score: 90 },
];

<RadarChart data={data}>
  <PolarGrid />
  <PolarAngleAxis dataKey="dimension" />
  <PolarRadiusAxis domain={[0, 100]} />
  <Radar dataKey="score" fill="#8884d8" fillOpacity={0.6} />
</RadarChart>
```

## Integration Notes

- **Wait for Reshi's `feat/foundation` to merge** before starting your branch.
- You can prototype the radar chart independently using mock data.
- Use Reshi's UI primitives (`Button`, `Card`, `LoadingSpinner`) — don't rebuild them.
- Use types from `src/types/index.ts` — especially `SkillFingerprint`, `DimensionScore`, `Evaluation`.
- The dashboard reads from `useSkillStore` — Ramzan's evaluation flow writes to it.
