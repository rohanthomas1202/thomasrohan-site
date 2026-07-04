# Consulting Storefront — Design Spec

**Date:** 2026-07-04
**Branch:** redesign/playful
**Source:** CRO audit of thomasrohan.com (this session). User approved all audit recommendations and locked four decisions via Q&A.

## Goal

Convert the site from a job-seeker portfolio into an independent consulting storefront. Same design language, motion system, and single-page frame — the copy, information architecture, and conversion mechanics change.

## Locked decisions

| Decision | Choice |
|---|---|
| Booking link | `https://cal.com/rohanthomas` (user claims/creates the account; free tier) |
| Availability claim | "booking new projects" — evergreen, no date to go stale |
| Positioning | High-stakes AI: *AI products that survive production — for domains where wrong answers cost money* |
| Offers | Three engagements: AI product sprint (2–4 wks) · Embedded build · Advisory/eval review |

## Honesty constraints (hard rules)

- No fabricated testimonials, logos, or client names. The testimonial audit item is **out of scope** until real ones exist.
- Timeline claims must match `experience.ts`: UHC intern 2020, FedEx co-op 2021–2022, Schwab 2022→present. "Six years shipping systems" (2020–2026) and "four years at Schwab" are the ceilings. Never "eight years."
- Availability copy is the generic "booking new projects" — no slot counts, no quarters.
- Case-study pages are written from each repo's actual README (fetched at implementation time). No invented metrics or users.
- AgentForge numbers come from the current README: **14 tools, 6-layer verification pipeline, 92-case eval suite** (the site's old 5/3/57 figures are stale — update them). The eval dataset is open source (MIT) at `rohanthomas1202/healthcare-agent-eval`.
- Label Verifier was built as a take-home proof of concept. Its case study frames it as a POC build — never as client work, and the fictional stakeholder names from the brief (Marcus, Jenny, Dave, Sarah) never appear on the site.

## Page structure

Single page, new section order:

```
Nav (fixed)
Hero
Work            (#work    — 5 cards; top 2 link to internal case studies)
Offers          (#offers  — NEW section)
Track record    (#about   — renamed label; highlights now rendered)
Now line
Contact         (#contact — footer)
```

New routes:

- `/work/agentforge-healthcare`
- `/work/alcohol-label-verifier`

Two static route files sharing a `CaseStudy` layout component (no dynamic `[slug]` route — YAGNI for 2 pages).

## Section-by-section spec (exact copy)

### Nav (`nav.tsx`)

Links: `Work → #work`, `Offers → #offers`, `Track record → #about`, `Contact → #contact`. Section ids unchanged (`#about` keeps its id; only the label changes).

### Hero (`hero.tsx`, `hero-headline.tsx`)

- Eyebrow: `Rohan Thomas · Austin, TX · booking new projects`
- Headline (`HEADLINE` const — word-highlight animation unchanged, word count may differ):
  `I build AI products that survive production.`
- Subhead:
  `Six years shipping systems where mistakes are expensive — portfolio tools on $3T+ in assets at Charles Schwab, 50K packages a day at FedEx, healthcare claims at UnitedHealth. Now I bring that bar to AI.`
- CTA 1 (filled): `See the work ↓` → `#work` (unchanged)
- CTA 2 (outlined): `Book an intro call` → `https://cal.com/rohanthomas`, `target="_blank" rel="noreferrer"`

### Work (`projects.tsx`, `projects.ts`, `project-card.tsx`)

Section intro replaces both existing sentences:
`Selected builds. Each one went from problem to deployed system — here's what I decided and why.`

Blurb rewrites in `projects.ts` (problem-first):

- **AgentForge Healthcare:** `Clinical staff can't trust an agent that's right "usually." A FHIR-native healthcare agent — 14 tools, a 6-layer verification pipeline, a 92-case eval suite. Every answer checked before a human sees it.`
- **Alcohol Label Verifier:** `TTB label review is manual, slow, and fine-heavy. This pipeline turns a label upload into a structured compliance verdict in seconds — with a violation report you can act on.`
- **ChatBridge:** `A chat platform that treats plugins as untrusted code — sandboxed iframe runtime, with chess (Stockfish WASM), weather, and Spotify OAuth plugins shipped to prove the model.`
- **Shipyard:** `An autonomous coding agent on LangGraph + Claude — surgical file edits, sub-agent coordination, injectable context. Everything it taught me feeds the agents I ship for clients.`
- **HypeInvest V2:** `Real-time retail-sentiment index aggregating Reddit, YouTube, Bluesky, and StockTwits into one tradeable signal. (Won HackUTD.)`

Card link behavior:

- `Project` type gains optional `caseStudy?: string` (internal path).
- AgentForge → `caseStudy: "/work/agentforge-healthcare"`, Label Verifier → `caseStudy: "/work/alcohol-label-verifier"`.
- In `project-card.tsx`, the primary (title/whole-card) link prefers `caseStudy` over `live` over `href`; internal links render without `target="_blank"`. The two case-study cards add a `Case study →` link as the first footer link; GitHub/Live demo links remain.

### Offers (NEW: `offers.ts`, `sections/offers.tsx`)

Section: `id="offers"`, heading `Offers`, intro line:
`Three ways to work with me. Every engagement ends with something running in production — not a deck.`

Content file `src/content/offers.ts`:

```ts
export type Offer = { title: string; timeline: string; blurb: string };
```

1. **AI product sprint** · `2–4 weeks` · `Prototype to production: a scoped build that ships with an eval suite and a deployment — not a demo.`
2. **Embedded build** · `monthly` · `I join your team and ship the agent, eval, and interface layer alongside your engineers. Short loops, working software every week.`
3. **Advisory & eval review** · `1–2 weeks` · `Architecture and eval review for AI features already in flight — find the failure modes before your users do.`

Layout: three cards in the existing tint/accent design language (reuse tint backgrounds + rounded-3xl pattern from project cards, no per-card motion beyond the standard `Reveal`). Each card footer links `Book an intro call ↗` → cal.com link.

### Track record (`about.tsx`, `experience.ts`)

- Heading: `Track record` (id stays `about`).
- Bio paragraph replaces current one entirely:
  `I'm Rohan — an engineer in Austin, TX building AI products for domains where wrong answers cost money. I spent four years on portfolio tools at Charles Schwab, where a bad deploy touches $3T+ in assets; that's the reliability bar I bring to AI. I work best embedded with small teams: short loops, working software every week, no decks.`
- Role rows: replace job-title labels with outcome labels via a new `label` field on `Role` (keep `role` field for data fidelity or repurpose — implementer's choice, but the rendered text is):
  - Charles Schwab → `Portfolio tooling · 2022 → Present`
  - FedEx → `Logistics systems · 2021 → 2022`
  - United Healthcare → `Claims platform · 2020`
- **Render highlights:** under each row, render the first two `highlights` entries as a small muted list (text + bolded metric), matching the row accent. No expand/collapse — always visible, small type. This resurrects the currently-dead `highlights` data.

### Now line (`now.ts`, `now-line.tsx`)

`NOW_PHRASE = "building AI agents · taking on new projects"`. Commit clause behavior unchanged.

### Contact (`footer.tsx`)

- Eyebrow: `Contact` → `Work with me`
- Under the email + copy button, add:
  `Tell me what you're building and where it's stuck — I reply within 24 hours, usually with questions.`
  followed by link: `Or skip the email — book a 30-minute intro call ↗` → cal.com link.
- Bottom bar (GitHub/LinkedIn/copyright) unchanged.

### Case-study pages (NEW)

Shared component `src/components/case-study.tsx` + two route files under `src/app/work/<slug>/page.tsx`. Each page:

1. **Back link** `← Rohan Thomas` to `/`
2. **Header:** tag pill, title, one-line dek (accent color matches the project's card accent)
3. **TL;DR strip:** three short cells — Problem / Built / Proof (e.g. "92-case open-source eval suite" for AgentForge; "upload → verdict in seconds" for Label Verifier)
4. **Context** — the business problem, 1–2 short paragraphs
5. **What I built** — architecture in prose, client-readable
6. **Decisions** — 3–5 "decision → why" pairs (the consulting sales pitch: judgment, not tasks)
7. **What this proves** — one paragraph translating the build into what a client can hire
8. **Footer links:** `GitHub ↗` (the verify-me link, demoted here), `Live demo ↗` when it exists, and a `Book an intro call ↗` CTA.

Content is drafted from the repos' READMEs (`rohanthomas1202/agentforge-healthcare`, `rohanthomas1202/Alcohol-Label-Verifier`) fetched at implementation time; any claim not supported by the README/code is omitted. Each page exports `metadata` (title via the existing `%s — Rohan Thomas` template, description = the dek). Pages are statically rendered, styled with existing tokens (paper/ink/tints, display font), standard `Reveal` motion only.

### Meta / OG (`layout.tsx`, `opengraph-image.tsx`)

- Title default: `Rohan Thomas — AI products that survive production`
- Description (also OG/Twitter): `I design and ship production AI systems — agents, evals, and the interfaces around them — for domains where wrong answers cost money. Austin, TX. Booking new projects.`
- Keywords: `["Rohan Thomas", "AI consultant", "AI agents", "LLM evals", "AI product engineering", "Austin"]`
- `opengraph-image.tsx`: text updated to the new headline + `Austin, TX · booking new projects` line (visual style unchanged).

## Testing

- Update copy assertions in existing tests: `hero.test.tsx`, `hero-headline.test.tsx` (if it asserts HEADLINE text), `about.test.tsx`, `projects.test.tsx`, `footer.test.tsx`, `nav.test.tsx`, `now.test.ts`, `content.test.ts`.
- New tests: offers section renders all three offers with the booking link; About renders highlight metrics (regression against the dead-data bug); case-study pages render heading + GitHub link; project cards with `caseStudy` link internally (no `target="_blank"` on primary link) while others link out.
- `pnpm test` and `pnpm build` green; verify the page flow in the browser (dev server) before completion.

## Out of scope

- Testimonials / client logos (no real ones yet — revisit when they exist)
- Pricing on the site
- Blog, additional pages beyond the two case studies
- Any change to the motion system, palette, or fonts
- Creating the cal.com account itself (user action; site ships pointing at `cal.com/rohanthomas`)
