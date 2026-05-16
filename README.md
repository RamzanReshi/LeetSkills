# LeetSkills MVP

A web app where users complete real-world scenarios through structured reasoning, receive AI-evaluated multidimensional feedback, and continuously build an evolving Skill Fingerprint.

## Tech Stack

| Tech | Purpose |
|------|--------|
| Next.js 14 | Framework (App Router) |
| Tailwind CSS | Styling |
| Zustand | State management |
| Recharts | Radar chart visualization |
| Framer Motion | Animations |
| Claude (Anthropic) | AI evaluation |
| localStorage | Session persistence |
| Vercel | Hosting |

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Team & Workflows

| Contributor | Role | Branch | Workflow Doc |
|-------------|------|--------|--------------|
| **reshiahmed** | Foundation & Infrastructure | `feat/foundation` | [WORKFLOW_RESHIAHMED.md](docs/WORKFLOW_RESHIAHMED.md) |
| **Ramzan** | Scenarios & AI Evaluation | `feat/evaluation` | [WORKFLOW_RAMZAN.md](docs/WORKFLOW_RAMZAN.md) |
| **YousefNijim** | UI/UX & Dashboard | `feat/ui-dashboard` | [WORKFLOW_YOUSEFNIJIM.md](docs/WORKFLOW_YOUSEFNIJIM.md) |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/evaluate/       # POST /api/evaluate (Claude)
│   ├── dashboard/          # Dashboard page
│   ├── scenario/[id]/      # Scenario flow page
│   └── results/[id]/       # Evaluation results page
├── components/
│   ├── ui/                 # Shared primitives (reshiahmed)
│   ├── scenario/           # Scenario flow components (Ramzan)
│   ├── evaluation/         # Score display components (YousefNijim)
│   ├── fingerprint/        # Radar chart (YousefNijim)
│   └── dashboard/          # Dashboard sections (YousefNijim)
├── data/                   # Static scenario JSON (Ramzan)
├── lib/                    # Claude API + evaluation pipeline (Ramzan)
├── store/                  # Zustand state management (reshiahmed)
├── types/                  # Shared TypeScript types (reshiahmed)
└── utils/                  # Helpers (reshiahmed + Ramzan)
```

## Build Phases

1. **Phase 1 — Foundation** (reshiahmed): Project setup, routing, UI primitives, state management
2. **Phase 2 — Content + Evaluation** (Ramzan): Scenarios, Claude integration, API route
3. **Phase 3 — Product Experience** (YousefNijim + Ramzan): Dashboard, radar chart, scenario flow
4. **Phase 4 — Reliability + Polish** (All): Error handling, loading states, deployment QA

## Product Loop

1. Scenario appears with constraints and timer
2. User writes a mandatory thinking trace (≥ 80 chars)
3. User writes a response
4. AI returns multi-dimensional scores with feedback
5. Skill Fingerprint visibly updates

---

See [LeetSkills_MVP_PRD.md](LeetSkills_MVP_PRD.md) for the full product requirements document.
