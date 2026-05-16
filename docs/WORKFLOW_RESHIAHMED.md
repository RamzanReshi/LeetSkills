# 🔧 reshiahmed — Foundation & Infrastructure Workflow

> **Role:** Foundation & Backend Lead
> **Branch:** `feat/foundation`
> **Phase Priority:** Phase 1 (start immediately) → Phase 4 (polish)

---

## Your Owned Files

```
src/app/layout.tsx              ← Root layout (fonts, metadata, providers)
src/app/page.tsx                ← Landing page (redirect to /dashboard)
src/app/globals.css             ← Tailwind directives + design tokens
src/components/ui/Button.tsx    ← Reusable button (primary/secondary/ghost)
src/components/ui/Card.tsx      ← Card container
src/components/ui/Timer.tsx     ← Countdown timer with urgency states
src/components/ui/TextArea.tsx  ← TextArea with character count
src/components/ui/LoadingSpinner.tsx ← Animated loading spinner
src/store/useSkillStore.ts      ← Zustand state management
src/types/index.ts              ← All shared TypeScript interfaces
src/utils/localStorage.ts       ← Session persistence helpers
next.config.ts                  ← Next.js configuration
tailwind.config.ts              ← Tailwind configuration
tsconfig.json                   ← TypeScript configuration
package.json                    ← Dependencies
.env.local.example              ← API key template
.gitignore                      ← Git ignore rules
README.md                       ← Project documentation
```

---

## Phase 1 Tasks — Foundation (Week 1)

- [ ] Set up Vercel deployment (connect GitHub repo)
- [ ] Configure Tailwind design tokens (colors, fonts, spacing)
- [ ] Implement `src/app/layout.tsx` — root layout with Inter font, metadata
- [ ] Implement `src/app/page.tsx` — redirect to `/dashboard`
- [ ] Implement all `src/components/ui/*` components with Tailwind styling
- [ ] Implement `src/components/ui/Timer.tsx` — countdown with urgency colors
- [ ] Review and finalize `src/types/index.ts` (already stubbed)
- [ ] Review and finalize `src/store/useSkillStore.ts` (already stubbed)
- [ ] Review and finalize `src/utils/localStorage.ts` (already stubbed)
- [ ] Ensure `npm run build` passes cleanly
- [ ] Create PR: `feat/foundation → main`

## Phase 4 Tasks — Reliability & Polish (Week 4)

- [ ] Add global error boundary component
- [ ] Add loading states for all async operations
- [ ] Configure `.env` on Vercel for production
- [ ] Update `README.md` with setup and deployment instructions
- [ ] Final deployment QA on Vercel
- [ ] Verify full product loop end-to-end

---

## Setup Instructions

```bash
# Clone and install
git clone https://github.com/CadPosting/LeetSkills.git
cd LeetSkills
npm install

# Create your branch
git checkout -b feat/foundation

# Start dev server
npm run dev

# When ready, push and create PR
git push origin feat/foundation
```

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `zustand` | State management |
| `tailwindcss` | Styling |
| `next` | Framework |

## Integration Notes

- **Your branch merges first.** Ramzan and YousefNijim depend on your types, store, and UI components.
- Keep `src/types/index.ts` stable — any changes require notifying the team.
- The `useSkillStore` is the single source of truth for session state.
