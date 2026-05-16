# 🤖 Ramzan — Scenarios & AI Evaluation Workflow

> **Role:** Scenarios & AI Evaluation Lead
> **Branch:** `feat/evaluation`
> **Phase Priority:** Phase 2 (after foundation merges) → Phase 3 → Phase 4

---

## Your Owned Files

```
src/data/scenarios.json                      ← 10 hand-written scenarios (DONE — review & refine)
src/lib/claude.ts                            ← Claude API client wrapper
src/lib/evaluationPrompt.ts                  ← System prompt builder
src/lib/parseEvaluation.ts                   ← JSON response parser + validation
src/lib/fallbackEvaluation.ts                ← Cached fallback system
src/app/api/evaluate/route.ts                ← POST /api/evaluate handler
src/app/scenario/[id]/page.tsx               ← Scenario flow page
src/components/scenario/ScenarioPrompt.tsx    ← Scenario text display
src/components/scenario/ThinkingTraceInput.tsx ← Thinking trace textarea
src/components/scenario/ResponseInput.tsx     ← Response textarea
src/utils/validation.ts                      ← Input validation utilities
```

---

## Phase 2 Tasks — Content & Evaluation (Week 2)

- [ ] Review and refine the 10 scenarios in `scenarios.json`
- [ ] Design calibration examples for each rubric dimension
- [ ] Implement `src/lib/evaluationPrompt.ts` — strict grading system prompt
  - Must enforce: JSON-only output, 4-dimension scoring, scenario specificity
- [ ] Implement `src/lib/claude.ts` — Claude API wrapper using `@anthropic-ai/sdk`
- [ ] Implement `src/lib/parseEvaluation.ts` — parse + validate Claude response
- [ ] Implement `src/lib/fallbackEvaluation.ts` — cached fallback evaluation
- [ ] Implement `src/app/api/evaluate/route.ts` — POST handler
- [ ] Test evaluation pipeline locally with sample submissions

## Phase 3 Tasks — Scenario Flow (Week 3)

- [ ] Implement `src/app/scenario/[id]/page.tsx` — full multi-step flow:
  1. Show scenario prompt + timer
  2. Thinking trace input (validate ≥ 80 chars)
  3. Response input
  4. Submit → loading state → navigate to results
- [ ] Implement `src/components/scenario/ScenarioPrompt.tsx`
- [ ] Implement `src/components/scenario/ThinkingTraceInput.tsx`
- [ ] Implement `src/components/scenario/ResponseInput.tsx`
- [ ] Integrate with reshiahmed's `useSkillStore` to save evaluation
- [ ] Create PR: `feat/evaluation → main`

## Phase 4 Tasks — Reliability (Week 4)

- [ ] Handle API latency (loading states, timeout handling)
- [ ] Handle parsing failures gracefully (fallback system)
- [ ] Edge case testing (empty inputs, API errors, malformed responses)
- [ ] Validate input edge cases in `validation.ts`

---

## Setup Instructions

```bash
# Clone and install
git clone https://github.com/CadPosting/LeetSkills.git
cd LeetSkills
npm install

# Set up API key
cp .env.local.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Create your branch (after reshiahmed's foundation merges)
git checkout main
git pull origin main
git checkout -b feat/evaluation

# Start dev server
npm run dev

# When ready, push and create PR
git push origin feat/evaluation
```

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `@anthropic-ai/sdk` | Claude API client |
| `zustand` | Read/write skill store |

## Evaluation Prompt Contract

```
POST /api/evaluate

Request:
  { scenario_id: string, thinking_trace: string, response: string }

Response:
  {
    scores: DimensionScore[],
    overall_feedback: string,
    weakest_dimension: DimensionName
  }
```

## Integration Notes

- **Wait for reshiahmed's `feat/foundation` to merge** before starting your branch.
- Use the types from `src/types/index.ts` — don't create separate types.
- After evaluation completes, call `useSkillStore.addEvaluation()` to update the fingerprint.
- Fallback evaluation ensures users ALWAYS get results, even if Claude is down.
