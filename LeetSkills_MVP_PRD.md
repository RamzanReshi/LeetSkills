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

## 4. In Scope (Build These)

### 4.1 Scenarios

-   10 hand-written scenarios total
-   5 from Track 1 (First Principles Thinking)
-   5 from Track 4 (Productive Struggle)
-   Stored as static JSON in repo
-   Each scenario includes: `id`, `track`, `prompt_text`,
    `time_limit_seconds`, `rubric_dimensions[]`

### 4.2 Core Product Loop

1.  Scenario screen\
2.  Thinking trace input (minimum 80 chars)\
3.  Response input\
4.  Submit to Claude API\
5.  Evaluation screen with scores + Skill Fingerprint update

### 4.3 AI Evaluation

-   One Claude API call per submission
-   Structured JSON output
-   4 dimensions scored
-   Strict grading prompt
-   Fallback reliability system with cached evaluation if live parsing
    fails

### 4.4 Skill Fingerprint

-   4-axis radar chart
-   Axes: Decomposition, Hypothesis Quality, Reasoning Depth, Honesty
-   Browser state via Zustand
-   Animated updates with Framer Motion

### 4.5 Dashboard

-   Skill Fingerprint hero
-   Today's Scenario CTA
-   Weakest dimension callout
-   No unnecessary social or gamification systems

### 4.6 Sessions

-   Anonymous
-   localStorage persistence
-   Reset session

------------------------------------------------------------------------

## 5. Out of Scope

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

## 6. Build Roadmap

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

## 7. Technical Decisions

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

## 8. Evaluation Prompt Contract

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

## 9. Success Criteria

The MVP succeeds if:

1.  Product is live and deployable\
2.  Full user loop functions without breakage\
3.  Skill Fingerprint updates clearly\
4.  AI feedback is scenario-specific\
5.  Product experience is reliable and repeatable

------------------------------------------------------------------------

## 10. Known Product Risks

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

## 11. Decisions Needed Before Build

-   Claude API ownership\
-   Deployment ownership\
-   Scenario content owner\
-   Evaluation prompt owner\
-   Production environment readiness

------------------------------------------------------------------------

*End of MVP PRD*
