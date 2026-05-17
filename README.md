# LeetSkills MVP

LeetSkills is a web app where users complete real-world scenarios through structured reasoning, receive AI-evaluated multidimensional feedback, and build an evolving Skill Fingerprint.

Current status:

- Demo-ready: yes
- MVP-ready: not fully
- Persistence: browser localStorage for scenario progress
- Auth: optional Supabase Auth and profile data when configured
- Active content: 30 scenarios across 6 learning paths

## Tech Stack

| Tech | Purpose |
| --- | --- |
| Next.js 16 | App Router framework |
| React 19 | UI runtime |
| Tailwind CSS v4 | Styling and design tokens |
| Zustand | Client state management |
| localStorage | Browser scenario progress persistence |
| Recharts | Skill Fingerprint radar chart |
| Framer Motion | Animation dependency |
| Anthropic SDK | Claude evaluation provider |
| Google GenAI SDK | Optional Gemini evaluation provider |
| Supabase | Optional auth and profile storage |

## Product Scope

The current app includes:

- 30 scenario prompts in `src/data/mvp-content.ts`
- 6 learning paths in `src/data/mvp-content.ts`
- Scenario browser at `/scenarios`
- Scenario solve flow at `/scenario/[id]`
- Evaluation results at `/results/[id]`
- Dashboard at `/dashboard`
- Learning paths page at `/path`
- Profile page at `/profile`
- Optional login, signup, password reset, and auth callback routes
- AI evaluation API route at `/api/evaluate`
- Zustand/localStorage progress tracking
- Optional Supabase Auth with a `leetskill.profiles` table
- 6-axis Skill Fingerprint

The current app does not include:

- Database persistence for scenario progress and evaluations
- Admin dashboard
- Payments
- Leaderboards
- Production analytics
- Complete OpenAI provider support

## Skill Fingerprint

The current Skill Fingerprint uses 6 axes:

| Axis | Meaning |
| --- | --- |
| Decomposition | Breaks problems into useful parts. |
| Pattern Recognition | Recognizes useful patterns, solution approaches, or likely causes. |
| Execution Quality | Turns plans into reliable action. |
| Communication | Explains clearly for the audience. |
| Judgment | Makes practical tradeoffs under constraints. |
| Adaptability | Collaborates and adjusts under ambiguity. |

The fingerprint is calculated in `src/store/useSkillStore.ts` from saved evaluation history. Rubric-level scores are normalized to 0-100 and mapped into the 6 dashboard dimensions defined in `src/data/mvp-content.ts`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Redirects to `/dashboard` |
| `/dashboard` | Main dashboard with fingerprint, next scenario, and weakest dimension |
| `/scenarios` | Scenario browser with filters |
| `/scenario/[id]` | Scenario prompt, thinking trace, response, and submit flow |
| `/results/[id]` | AI feedback, scores, recommended next scenario, and updated fingerprint |
| `/path` | Learning paths overview |
| `/quest` | Redirects to `/path` |
| `/profile` | Local profile, stats, fingerprint bars, and reset progress |
| `/login` | Supabase sign-in page |
| `/signup` | Supabase account creation page |
| `/forgot-password` | Password reset request page |
| `/reset-password` | Password update page |
| `/auth/callback` | Supabase auth callback route |
| `/api/evaluate` | Server route for AI evaluation |

When Supabase env vars are present, `/dashboard`, `/scenarios`, `/path`, `/quest`, `/profile`, `/scenario/*`, and `/results/*` are protected routes. Without Supabase env vars, the app runs in anonymous local demo mode.

## AI Evaluation

`POST /api/evaluate` accepts:

```json
{
  "scenario_id": "SE-01",
  "thinking_trace": "at least 80 characters",
  "response": "final response"
}
```

Provider behavior:

- Claude is the default provider.
- Gemini is optional with `AI_PROVIDER=gemini`.
- If live AI evaluation or parsing fails, the route returns a classified JSON error with a suggested action.

Environment variables currently expected by the code:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
AI_PROVIDER=claude
ANTHROPIC_API_KEY=
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

See `.env.local.example` for the full template.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to `/dashboard`.

For live Claude evaluation, set `ANTHROPIC_API_KEY` in `.env.local`. To enable Supabase Auth, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, then apply `supabase/migrations/leetskilldb_schema.sql`. See `docs/SUPABASE_AUTH.md` for setup details.

## Project Structure

```text
src/
├── app/
│   ├── api/evaluate/       # POST /api/evaluate
│   ├── auth/callback/      # Supabase auth callback
│   ├── dashboard/          # Dashboard page
│   ├── forgot-password/    # Password reset request
│   ├── login/              # Login page
│   ├── path/               # Learning paths page
│   ├── profile/            # Profile page
│   ├── quest/              # Redirects to /path
│   ├── reset-password/     # Password update
│   ├── scenario/[id]/      # Scenario solve flow
│   ├── results/[id]/       # Evaluation results
│   ├── scenarios/          # Scenario browser
│   └── signup/             # Signup page
├── components/
│   ├── dashboard/          # Dashboard sections
│   ├── evaluation/         # Feedback and score display
│   ├── fingerprint/        # Radar chart
│   ├── path/               # Learning path cards
│   ├── profile/            # Profile view
│   ├── scenario/           # Scenario solve components
│   ├── scenarios/          # Scenario browser components
│   ├── shell/              # App shell and sidebar
│   └── ui/                 # Shared primitives/icons
├── data/                   # Active MVP content and metadata
├── lib/                    # Evaluation prompt, parser, fallback, providers
│   └── supabase/           # Supabase browser/server/middleware clients
├── store/                  # Zustand session store
├── types/                  # Shared TypeScript types
└── utils/                  # Validation and localStorage helpers
```

## MVP Readiness

Demo-ready: yes.

MVP-ready: not fully.

Main blockers:

- Dashboard needs better metrics.
- Skill Fingerprint needs clearer meaning and empty/fallback states.
- AI provider failures need a product-level retry or fallback decision.
- Scenario progress and evaluations are not persisted to a database.
- No admin dashboard.
- No automated tests or smoke tests.
- Some unfinished UI remains: navbar search, timer TODO, hardcoded profile data.

## Next Priority

1. Improve dashboard.
2. Improve Skill Fingerprint.
3. Improve AI fallback/error handling UX.
4. Add smoke tests.
5. Clean unfinished UI: navbar search, timer TODO, hardcoded profile data.

See [LeetSkills_MVP_PRD.md](LeetSkills_MVP_PRD.md) for the current product requirements document.
