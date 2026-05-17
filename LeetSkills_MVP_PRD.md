# LeetSkills MVP - Product Requirements Document

| Field | Value |
| --- | --- |
| Product | LeetSkills MVP |
| Context | Current functional MVP build |
| Status | Demo-ready, not fully MVP-ready |
| Last Updated | May 16, 2026 |

## 1. Product Summary

LeetSkills is a web app where users practice real-world professional and technical scenarios. Users read a scenario, write a required thinking trace, write a final response, receive AI-evaluated feedback, and build an evolving Skill Fingerprint.

The current MVP stores scenario progress in browser localStorage. It includes optional Supabase Auth and profile data when Supabase env vars are configured, but it does not include database persistence for scenario progress, payments, social features, or an admin dashboard.

## 2. Current Product Loop

The main loop is:

1. User lands on `/dashboard`.
2. User opens a scenario from `/dashboard`, `/scenarios`, or `/path`.
3. User reads the prompt on `/scenario/[id]`.
4. User writes a mandatory thinking trace of at least 80 characters.
5. User writes a final response.
6. App submits to `POST /api/evaluate`.
7. AI returns structured feedback and weighted skill scores, or the route returns a classified provider error.
8. If evaluation succeeds, the app stores the result in Zustand/localStorage.
9. User sees results on `/results/[id]`.
10. Dashboard, profile, path progress, and Skill Fingerprint update from local session data.

## 3. Current Scope

### In Scope

- 30 scenarios in `src/data/mvp-content.ts`.
- 6 learning paths:
  - Software Engineering Problem Solving
  - Debugging, Testing & Quality
  - Professional Communication
  - Teamwork & Conflict Resolution
  - Product Thinking
  - AI Literacy & Responsible Use
- Scenario browser with category, skill, difficulty, and search filters.
- Scenario solve page with timer display, thinking trace input, response input, and submit flow.
- AI feedback route at `POST /api/evaluate`.
- Claude as the default AI provider.
- Gemini as an optional AI provider.
- OpenAI provider stub, not production-ready.
- Classified provider errors when AI evaluation fails.
- Optional Supabase Auth with a `leetskill.profiles` table.
- Skill Fingerprint radar and progress views.
- Dashboard, learning paths, profile, and results pages.
- Scenario progress persistence through Zustand and localStorage.
- Reset local session.

### Out of Scope For Current MVP

- Database persistence for scenario progress and evaluations
- Admin dashboard
- Payments
- Leaderboards
- Social features
- Production analytics
- Full OpenAI provider implementation

## 4. Current Routes

| Route | Current purpose | File |
| --- | --- | --- |
| `/` | Redirects to `/dashboard` | `src/app/page.tsx` |
| `/dashboard` | Main home view with Skill Fingerprint, next scenario CTA, and weakest dimension banner | `src/app/dashboard/page.tsx` |
| `/scenarios` | Scenario browser with filters and completion status | `src/app/scenarios/page.tsx` |
| `/scenario/[id]` | Scenario solve flow | `src/app/scenario/[id]/page.tsx` |
| `/results/[id]` | Evaluation results and updated fingerprint | `src/app/results/[id]/page.tsx` |
| `/path` | Learning paths overview | `src/app/path/page.tsx` |
| `/quest` | Redirects to `/path` | `src/app/quest/page.tsx` |
| `/profile` | Local profile, stats, fingerprint bars, and reset control | `src/app/profile/page.tsx` |
| `/login` | Supabase sign-in page | `src/app/login/page.tsx` |
| `/signup` | Supabase account creation page | `src/app/signup/page.tsx` |
| `/forgot-password` | Password reset request page | `src/app/forgot-password/page.tsx` |
| `/reset-password` | Password update page | `src/app/reset-password/page.tsx` |
| `/auth/callback` | Supabase auth callback route | `src/app/auth/callback/route.ts` |
| `/api/evaluate` | Server route for scenario evaluation | `src/app/api/evaluate/route.ts` |

When Supabase env vars are present, `/dashboard`, `/scenarios`, `/path`, `/quest`, `/profile`, `/scenario/*`, and `/results/*` are protected routes. Without Supabase env vars, the app runs in anonymous local demo mode.

## 5. Current Tech Stack

| Area | Current implementation |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI runtime | React 19 |
| Styling | Tailwind CSS v4 using CSS tokens in `src/app/globals.css` |
| State | Zustand |
| Persistence | Browser localStorage through `src/utils/localStorage.ts` for scenario progress |
| Charts | Recharts |
| Animation | Framer Motion dependency is installed |
| AI SDKs | Anthropic SDK and Google GenAI SDK |
| AI providers | Claude default, Gemini optional, OpenAI stub |
| Auth | Optional Supabase Auth and `leetskill.profiles` profile data |
| Hosting target | Vercel-compatible Next.js app |

## 6. Content Model

The active MVP content is in `src/data/mvp-content.ts`.

Each scenario includes:

- `id`
- `path_id`
- `path_title`
- `title`
- `difficulty`
- `scenario_type`
- `estimated_time`
- `time_limit_seconds`
- `prompt_text`
- `expected_learner_output`
- `skills_graded`
- optional `grading_notes`
- optional `recommended_next_scenario_id`

`src/data/paths.ts` builds learning-path cards from the active MVP paths.

`src/data/scenarios-meta.ts` builds scenario-browser metadata from the active MVP scenarios.

## 7. Skill Fingerprint

The current Skill Fingerprint has 6 axes. The axes are defined in `DASHBOARD_DIMENSIONS` inside `src/data/mvp-content.ts`.

| Axis | Meaning |
| --- | --- |
| Decomposition | Breaks problems into useful parts. |
| Pattern Recognition | Recognizes useful patterns, solution approaches, or likely causes. |
| Execution Quality | Turns plans into reliable action through testing, implementation, prevention, and follow-through. |
| Communication | Explains clearly for the audience. |
| Judgment | Makes practical tradeoffs under constraints. |
| Adaptability | Collaborates and adjusts under ambiguity. |

Current calculation:

- Evaluations are stored in `src/store/useSkillStore.ts`.
- Each rubric skill score is normalized to a 0-100 value.
- Rubric skills map into one or more dashboard dimensions.
- Each dimension is averaged across matching historical skill scores.
- The result is persisted in localStorage.

Current gap:

- AI provider failures are returned as structured errors, but the product still needs a learner-facing retry or fallback decision before production MVP.

## 8. AI Evaluation

Evaluation route: `POST /api/evaluate`

Request body:

```json
{
  "scenario_id": "SE-01",
  "thinking_trace": "user thinking trace",
  "response": "user final response"
}
```

Current behavior:

- Validates `scenario_id`.
- Validates thinking trace length.
- Validates non-empty final response.
- Finds the scenario from `MVP_SCENARIOS`.
- Calls `evaluateSubmission`.
- Uses the configured provider from `AI_PROVIDER`.
- Returns a classified JSON error if live AI evaluation or parsing fails.

Providers:

- `AI_PROVIDER=claude` is the default.
- `AI_PROVIDER=gemini` is supported when `GEMINI_API_KEY` is set.

## 9. Brand Identity & Color Palette

The current app uses the PRD green/gray palette through CSS variables in `src/app/globals.css`.

Core colors:

- Primary Green: `#1F8A5B`
- Action Green: `#27AE60`
- Deep Green: `#123D2A`
- Mint Surface: `#ECFDF3`
- App Background: `#F7FAF6`
- Card Background: `#FFFFFF`
- Gray 900: `#111827`
- Gray 700: `#374151`
- Gray 500: `#6B7280`
- Gray 300: `#D1D5DB`
- Gray 100: `#F3F4F6`

The dashboard fingerprint also uses secondary accent colors for dimension cards.

## 10. MVP Readiness

Current status:

- Demo-ready: yes
- MVP-ready: not fully

Main blockers:

- Dashboard needs better metrics.
- Skill Fingerprint needs clearer product meaning.
- AI provider failures need a product-level retry or fallback decision.
- Scenario progress and evaluations are not persisted to a database.
- No admin dashboard.
- No automated tests or smoke tests.
- Some unfinished UI remains: navbar search, timer TODO, and hardcoded profile data.

## 11. Next Priority

Recommended next work:

1. Improve dashboard metrics and recent activity.
2. Improve Skill Fingerprint explanation and empty state.
3. Improve AI fallback/error handling UX.
4. Add smoke tests for critical routes and `/api/evaluate`.
5. Clean unfinished UI: navbar search, timer TODO, hardcoded profile data.

## 12. Success Criteria

The MVP succeeds when:

1. The full local student loop works reliably.
2. AI feedback is specific to the scenario.
3. Failed AI evaluation is clearly marked and does not mislead users.
4. Skill Fingerprint changes are understandable.
5. Dashboard gives useful next actions.
6. The app is deployable with documented environment variables.
7. Core routes pass smoke tests.

*End of MVP PRD*
