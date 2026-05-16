# LeetSkills MVP

LeetSkills is a web app where users complete real-world scenarios through structured reasoning, receive AI-evaluated multidimensional feedback, and build an evolving Skill Fingerprint.

Current status:

- Demo-ready: yes
- MVP-ready: not fully
- Persistence: anonymous browser localStorage
- Active content: 30 scenarios across 6 learning paths

## Tech Stack

| Tech | Purpose |
| --- | --- |
| Next.js 16 | App Router framework |
| React 19 | UI runtime |
| Tailwind CSS v4 | Styling and design tokens |
| Zustand | Client state management |
| localStorage | Anonymous session persistence |
| Recharts | Skill Fingerprint radar chart |
| Framer Motion | Animation dependency |
| Anthropic SDK | Claude evaluation provider |
| Google GenAI SDK | Optional Gemini evaluation provider |

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
- AI evaluation API route at `/api/evaluate`
- Zustand/localStorage progress tracking
- 6-axis Skill Fingerprint

The current app does not include:

- Authentication
- Database persistence
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
| `/api/evaluate` | Server route for AI evaluation |

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
- OpenAI exists as a stub and is not ready for production use.
- If live AI evaluation or parsing fails, the app returns a neutral fallback evaluation.

Environment variables currently expected by the code:

```bash
AI_PROVIDER=claude
ANTHROPIC_API_KEY=...
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash
```

Note: `.env.local.example` is currently missing and should be added next.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The root route redirects to `/dashboard`.

For live Claude evaluation, set `ANTHROPIC_API_KEY` in `.env.local`. Without a working provider key, `/api/evaluate` can fall back to a neutral placeholder evaluation.

## Project Structure

```text
src/
├── app/
│   ├── api/evaluate/       # POST /api/evaluate
│   ├── dashboard/          # Dashboard page
│   ├── path/               # Learning paths page
│   ├── profile/            # Profile page
│   ├── quest/              # Redirects to /path
│   ├── scenario/[id]/      # Scenario solve flow
│   ├── results/[id]/       # Evaluation results
│   └── scenarios/          # Scenario browser
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
- Fallback AI scores must be marked clearly or excluded from real progress.
- No auth or database.
- No admin dashboard.
- Missing `.env.local.example`.
- No automated tests or smoke tests.
- Some unfinished UI remains: navbar search, timer TODO, hardcoded profile data.

## Next Priority

1. Improve dashboard.
2. Improve Skill Fingerprint.
3. Add `.env.local.example`.
4. Improve AI fallback/error handling.
5. Add smoke tests.
6. Clean unfinished UI: navbar search, timer TODO, hardcoded profile data.

See [LeetSkills_MVP_PRD.md](LeetSkills_MVP_PRD.md) for the current product requirements document.
