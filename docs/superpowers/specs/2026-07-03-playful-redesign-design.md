# Playful Redesign — Design Spec

**Date:** 2026-07-03
**Status:** Approved by Rohan (2026-07-03)
**Supersedes:** `2026-05-28-cinematic-portfolio-design.md` (cinematic-depth direction scrapped; PR #1 to be closed unmerged)

## Brief

Complete visual + copy overhaul of thomasrohan.com. The cinematic-depth
direction (dark, lime, heavy GSAP choreography, avatar) is abandoned.

- **Audience:** founders & collaborators — the site leads with shipped work
  and invites people to build with Rohan.
- **Vibe:** playful & personal — color, character, springy interaction.
- **Voice:** plain & direct — no metaphors, no day/night wordplay, no puns.
- **Shape:** single scrolling page. Projects link out (GitHub / live demo);
  no internal case-study routes.
- **No avatar.** Personality comes from color and interaction, not a mascot.

**Core principle:** playfulness lives in the design; plainness lives in the
words. The old site did the reverse (theatrical copy, self-serious visuals) —
that inversion is what read as cringe.

## Look & Feel

- **Canvas:** warm cream background (`#FAF6EF` or near), near-black ink text
  (`#1A1815` or near). No dark mode in v1.
- **Accents:** a fixed palette of five saturated colors — electric blue,
  tangerine, pink, leaf green, violet. Each project card owns exactly one.
  Defined as CSS custom properties in `globals.css`.
- **Type:**
  - Display: **Bricolage Grotesque** (Google Fonts, variable) via `next/font`.
  - Body: **Inter**.
  - Mono (stack tags only): Geist Mono or JetBrains Mono.
- **Shape language:** chunky rounded corners (~24px), sticker-style tag
  chips, project cards resting at ±1° rotation that spring straight on hover.

## Motion

Simplify the animation stack drastically.

**Removed:** GSAP + ScrollTrigger, Lenis smooth scroll, custom cursor, intro
curtain, pointer-store parallax engine, hero particle canvas.

**Kept:**
- `motion/react` springs for hover states and in-view section reveals
  (`whileInView`, once-only, small translate + fade).
- `useMagnetic` for the two hero CTAs only.
- `usePrefersReducedMotion` gating on all animation.

**One signature moment:** hero headline words get a spring "jelly" nudge and
a random accent-color highlight on hover. Everything else stays quiet.

## Page Structure (single scroll)

### 1. Hero
- Eyebrow: `Rohan Thomas · Austin, TX · open to collabs`
- Headline (plain, direct):
  > **I build AI products — agents, dev tools, and the interfaces around them.**
- Sub-line: *Full-stack engineer at Charles Schwab. Five shipped side
  projects and counting.*
- CTAs: **See the work ↓** (anchor to projects) / **Say hi** (mailto).
  Both magnetic.

### 2. Projects (the star section)
- All 5 projects from `src/content/projects.ts`, content unchanged.
- Color-blocked cards; **AgentForge Healthcare** and **Alcohol Label
  Verifier** (has live demo) featured at larger size.
- Each card: title, blurb, stack tags (mono chips), year, tag, outbound
  link(s) — GitHub always, live demo when present. Cards are fully
  clickable with a visible arrow-out affordance.

### 3. About
- One plain first-person paragraph (who, where, what he cares about
  building).
- Experience compressed to **3 one-liner rows** — Schwab, FedEx, UHC — each
  with a single headline metric (e.g. "$3T+ AUM tooling", "+30% peak
  throughput", "−80% processing time"). No resume bullet lists. Sourced
  from `src/content/experience.ts` (data file may keep full detail; the
  component renders the compressed view).

### 4. Contact footer
- Oversized `contact@thomasrohan.com` mailto with a hover fill effect.
- GitHub + LinkedIn links.
- Small plain sign-off line.

## Engineering

- **Branch:** new `redesign/playful` cut from `main`. PR #1
  (`redesign/cinematic-depth`) closed unmerged — confirm with Rohan before
  closing.
- **Delete:** `src/components/chrome/`, `src/components/hero/`,
  `src/components/motion/` (except `use-magnetic`), `src/lib/parallax.ts`,
  `src/lib/intro.ts`, hero-fx canvas, and their tests.
- **Keep:** `src/content/*` (typed content + tests), `useMagnetic` +
  `src/lib/magnetic.ts`, `usePrefersReducedMotion`, Vitest + RTL harness.
- **Dependencies:** remove `gsap` and `lenis`; keep `motion`.
- **New components:** `src/components/sections/` (hero, projects, about,
  footer) + a minimal top nav (name + anchor links, no active-section
  observer needed for v1).
- **Quality gates:** `pnpm test`, `pnpm lint`, `pnpm build` green at every
  commit. All animation gated on reduced-motion. Semantic headings, alt
  text, focus-visible states.
- **Deploy:** `main` auto-deploys production. Nothing merges to `main`
  without Rohan's explicit go-ahead; branch pushes produce Vercel preview
  URLs for review.

## Out of Scope (v1)

- Dark mode
- Case-study pages / `/writing`
- Blog, CMS, analytics changes
- Avatar in any form
- New copy for project blurbs (existing blurbs already read plain)
