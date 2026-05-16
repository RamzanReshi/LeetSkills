# LeetSkills MVP --- Product Requirements Document

  Field          Value
  -------------- ----------------------
  Product        LeetSkills MVP
  Owner          Ramzan
  Context        Functional MVP Build
  Status         Ready to build
  Last Updated   May 16, 2026

------------------------------------------------------------------------

## 1. Context

LeetSkills is being built as a focused MVP designed to deliver a
complete, reliable user experience around scenario-based skill
evaluation. Every requirement in this PRD must directly serve the final
functional product. Anything that does not strengthen the product loop,
usability, or reliability is cut.

------------------------------------------------------------------------

## 2. The One-Sentence Product

**A web app where users complete real-world scenarios through structured
reasoning, receive AI-evaluated multidimensional feedback, and
continuously build an evolving Skill Fingerprint.**

That single loop is the entire MVP. Everything below serves it.

------------------------------------------------------------------------

## 3. The Product Goal

Users must experience, in one seamless product loop:

1.  A scenario appears with constraints and timer\
2.  User writes a mandatory thinking trace\
3.  User writes a response\
4.  AI returns multi-dimensional scores with specific feedback\
5.  The Skill Fingerprint visibly updates to reflect growth

If all 5 happen reliably and clearly, the MVP succeeds.

------------------------------------------------------------------------

## 4. Brand Identity & Color Palette

### 4.1 Logo Colors

- Logo Primary Green: `#1F8A5B` — main logo shape / outline
- Logo Action Green: `#27AE60` — accent highlight, active detail, progress feel
- Logo Deep Green: `#123D2A` — strong contrast, dark logo version
- Logo Mint Fill: `#ECFDF3` — soft inner fill or background version
- Logo Background Gray: `#F3F4F6` — logo presentation background

### 4.2 Core Product Palette

- Primary Green: `#1F8A5B` — main CTA, active states, progress
- Action Green: `#27AE60` — submit buttons, learning actions
- Deep Green: `#123D2A` — headers, dark sections, brand anchor
- Mint Surface: `#ECFDF3` — success backgrounds, learning surfaces
- App Background: `#F7FAF6` — main page background
- Card Background: `#FFFFFF` — cards, forms, dashboard panels

### 4.3 Five Gray Shades

- Gray 900: `#111827` — main headings, primary text
- Gray 700: `#374151` — body text, labels
- Gray 500: `#6B7280` — muted text, helper copy
- Gray 300: `#D1D5DB` — borders, dividers, disabled states
- Gray 100: `#F3F4F6` — light gray surfaces, logo background

### 4.4 Recommended Logo Usage

**Primary Logo**
- Logo outline: `#1F8A5B`
- Inner fill or soft background: `#ECFDF3`
- Background: `#F3F4F6`

**Strong Logo Version**
- Logo mark: `#123D2A`
- Accent: `#27AE60`
- Background: `#FFFFFF`

**App Icon Version**
- Circle background: `#1F8A5B`
- Logo/cloud mark: `#FFFFFF`
- Optional accent: `#ECFDF3`

### 4.5 UI Mapping

- Primary CTA: `#1F8A5B`
- Submit Button: `#27AE60`
- CTA Hover: `#166A45`
- Dashboard Background: `#F7FAF6`
- Card Background: `#FFFFFF`
- Skill Fingerprint Highlight: `#1F8A5B`
- Success Surface: `#ECFDF3`
- Main Text: `#111827`
- Secondary Text: `#374151`
- Muted Text: `#6B7280`
- Borders: `#D1D5DB`
- Neutral Surface: `#F3F4F6`

### 4.6 Tailwind Tokens

```js
colors: {
  brand: {
    primary: "#1F8A5B",
    action: "#27AE60",
    deep: "#123D2A",
    mint: "#ECFDF3",
    background: "#F7FAF6",
    card: "#FFFFFF"
  },
  neutral: {
    900: "#111827",
    700: "#374151",
    500: "#6B7280",
    300: "#D1D5DB",
    100: "#F3F4F6"
  }
}
```

------------------------------------------------------------------------

## 5. In Scope (Build These)

### 5.1 Scenarios

-   10 hand-written scenarios total
-   5 from Track 1 (First Principles Thinking)
-   5 from Track 4 (Productive Struggle)
-   Stored as static JSON in repo
-   Each scenario includes: `id`, `track`, `prompt_text`,
    `time_limit_seconds`, `rubric_dimensions[]`

### 5.2 Core Product Loop

1.  Scenario screen\
2.  Thinking trace input (minimum 80 chars)\
3.  Response input\
4.  Submit to Claude API\
5.  Evaluation screen with scores + Skill Fingerprint update

### 5.3 AI Evaluation

-   One Claude API call per submission
-   Structured JSON output
-   4 dimensions scored
-   Strict grading prompt
-   Fallback reliability system with cached evaluation if live parsing
    fails

### 5.4 Skill Fingerprint

-   4-axis radar chart
-   Axes: Decomposition, Hypothesis Quality, Reasoning Depth, Honesty
-   Browser state via Zustand
-   Animated updates with Framer Motion

### 5.5 Dashboard

-   Skill Fingerprint hero
-   Today's Scenario CTA
-   Weakest dimension callout
-   No unnecessary social or gamification systems

### 5.6 Sessions

-   Anonymous
-   localStorage persistence
-   Reset session

------------------------------------------------------------------------

## 6. Out of Scope

-   Authentication
-   Database persistence
-   Leaderboards
-   Social systems
-   Advanced modes
-   Mobile optimization
-   Additional tracks
-   Payments
-   Admin systems

------------------------------------------------------------------------

## 7. Build Roadmap

### Phase 1 --- Foundation

-   Next.js setup
-   Tailwind
-   Vercel deployment
-   Core routes

### Phase 2 --- Content + Evaluation

-   Scenario writing
-   Rubric design
-   Calibration examples
-   Claude integration

### Phase 3 --- Product Experience

-   Skill Fingerprint
-   Dashboard
-   Full flow integration

### Phase 4 --- Reliability + Polish

-   UX polish
-   Loading states
-   Error handling
-   Deployment QA
-   Launch readiness

------------------------------------------------------------------------

## 8. Technical Decisions

  Decision    Choice
  ----------- -------------------
  Framework   Next.js 14
  Styling     Tailwind CSS
  State       Zustand
  Charts      Recharts
  Animation   Framer Motion
  AI          Claude Sonnet 4.6
  Storage     localStorage
  Hosting     Vercel

------------------------------------------------------------------------

## 9. Evaluation Prompt Contract

**POST /api/evaluate**

### Request:

-   scenario_id
-   thinking_trace
-   response

### Response:

-   scores
-   feedback
-   weakest_dimension

### System Priorities:

-   Scenario specificity
-   Calibration consistency
-   JSON-only output
-   Reliability fallback

------------------------------------------------------------------------

## 10. Success Criteria

The MVP succeeds if:

1.  Product is live and deployable\
2.  Full user loop functions without breakage\
3.  Skill Fingerprint updates clearly\
4.  AI feedback is scenario-specific\
5.  Product experience is reliable and repeatable

------------------------------------------------------------------------

## 11. Known Product Risks

-   API latency\
-   Parsing failures\
-   User misuse\
-   Visualization clarity\
-   Scoring inconsistency

### Mitigation:

-   Cached fallback\
-   Validation\
-   QA\
-   Calibration\
-   Deployment testing

------------------------------------------------------------------------

## 12. Decisions Needed Before Build

-   Claude API ownership\
-   Deployment ownership\
-   Scenario content owner\
-   Evaluation prompt owner\
-   Production environment readiness

------------------------------------------------------------------------

*End of MVP PRD*
