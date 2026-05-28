# Cinematic-Depth Portfolio — Design Spec

**Date:** 2026-05-28
**Project:** thomasrohan.com redesign
**Status:** Approved (design direction + Phase 1 prototype signed off)

---

## 1. Goal

Rebuild Rohan Thomas's personal site into a world-class, cinematic-depth portfolio: real 3D parallax, editorial typography, and a signature cartoon avatar — while staying fast, accessible, and credible for a Charles Schwab + AI-engineering hiring audience.

The destination is a **full multi-page site**. We build it in **three shippable phases on one shared engine**, starting with the home page.

## 2. Locked decisions

| Dimension | Decision |
| --- | --- |
| **Direction** | **B — Cinematic Depth**: real 3D parallax (mouse + scroll), receding perspective grid, depth-stacked tilt cards, scroll-pinned section transitions. Senior & fast, not a tech demo. |
| **Typography** | **Fraunces** (display serif) × **Inter** (body) × existing mono for eyebrows/labels. Loaded via `next/font`. |
| **Color** | Evolve the existing brand: lime `--accent: #c5ff00` on near-black `#050505`, fg `#f5f5f5`, muted `#8a8a8a`. Keep across favicon/OG. |
| **Scope** | Full multi-page site, phased. |
| **Flourishes** | All four: (1) custom cursor + magnetic CTAs, (2) cinematic intro reveal, (3) lightweight WebGL hero accent, (4) scroll-pinned 3D reveals. |
| **Avatar** | User-provided cartoon (`Rohan_Animated.png`). **Static character** (no blink/eye-follow). Transparent cutout, sits on a gentle parallax layer. |

## 3. Foundation (the reusable engine — Phase 1 builds this)

This is the real value: everything Phases 2–3 reuse.

### 3.1 Design tokens (`globals.css` / theme)
- Fonts wired through `next/font`: `--font-fraunces`, `--font-inter`, keep `--font-geist-mono` (or swap to a chosen mono).
- Type scale: display (Fraunces, `line-height ~0.9`, tight tracking), headings, body (Inter), mono labels.
- Color tokens (unchanged values), plus depth/elevation tokens and a motion-token set (durations, eases — standardize on `cubic-bezier(.16,1,.3,1)` "expo-out" feel).
- Spacing scale + max content width (`~1300px`).

### 3.2 Motion & 3D system
- **Lenis** smooth scroll (already present) as the scroll backbone; integrate with GSAP ScrollTrigger ticker.
- **`<Parallax>` primitive**: wraps children, applies depth-based transform from a shared pointer + scroll store (avoid per-component listeners — one rAF loop, context/store driven). `depth` prop controls intensity.
- **Scroll choreography**: GSAP + ScrollTrigger for pinned reveals, scrubs, count-ups, line reveals.
- **`useReducedMotion`** (exists) gates/simplifies everything; CSS `@media (prefers-reduced-motion: reduce)` as backstop (exists).

### 3.3 Global furniture (components)
- **Custom cursor**: lerp-following ring + dot, grows over `[data-hover]` interactive elements, blends over content. Disabled on touch/coarse pointers and under reduced-motion.
- **Magnetic button hook** (`useMagnetic`): translates element toward pointer within radius; resets on leave.
- **Nav**: morphs to blurred/bordered on scroll (exists); add section-aware active state.
- **Scroll progress** indicator (thin lime bar or numeric).
- **Intro reveal**: brief branded preloader (monogram + counter) that wipes up and triggers hero line-reveal. Runs once per session (sessionStorage), skipped under reduced-motion.

### 3.4 WebGL hero accent — **lightweight, not full three.js**
- A subtle GPU/particle shimmer behind the hero parallax only.
- Implementation: prefer a tiny lib (**OGL**, ~tens of KB) or a hand-rolled WebGL/canvas particle field. **No full three.js / R3F** for an accent — keeps bundle + perf in check.
- Must lazy-load (dynamic import, client-only), pause when offscreen/tab hidden, and **degrade gracefully** to the CSS radial-gradient glow when WebGL is unavailable or reduced-motion is on.

### 3.5 Avatar pipeline
- Ship a **pre-cut transparent PNG** (cleaner than runtime chroma-key). Source: `Rohan_Animated.png` → background removed → `public/` at ~1500–2000px.
- Rendered via `next/image`, on a `<Parallax>` layer with a lime radial glow backing. Static; container parallaxes.

### 3.6 Non-functional baseline
- **Accessibility**: reduced-motion fully respected; keyboard nav + focus-visible; semantic landmarks; alt text; cursor/custom-effects never trap interaction; AA contrast.
- **Performance**: Lighthouse green; LCP = hero text (not blocked by WebGL); fonts `display:swap` + preconnect; WebGL/heavy effects code-split; images optimized; respect `save-data`/low-power where feasible.
- **Mobile**: lighter parallax, avatar dims/repositions, no custom cursor, intro shortened.
- **SEO/analytics**: preserve current metadata, OG image, favicon, Vercel Analytics.

## 4. Phase 1 — Foundation + Cinematic Home page

Sections (evolving current content; treatments confirmed via prototype):

1. **Hero** — intro reveal → giant Fraunces headline rises line-by-line; avatar floats on parallax layer over receding grid floor; WebGL particle accent; status eyebrow; magnetic "View work" + "Get in touch"; scroll cue. Mouse moves depth layers.
2. **Manifesto** — statement scrubbed word-by-word on scroll; words brighten + lift slightly in z; soft depth fog.
3. **Selected Work** — TruthLayer featured in a 3D-tilting card (screenshot parallaxes within frame); project grid as depth-stacked cards that assemble on scroll + flip to lime on hover. (Links out; full case studies are Phase 2.)
4. **Experience** — Schwab/FedEx/UHC timeline; each role slides in on a parallax layer; headline metrics count up on enter.
5. **Stack marquee** — two opposing infinite rows, edges blurred into depth.
6. **Contact / Footer** — oversized "Let's build." with avatar peeking on a parallax layer; magnetic email CTA; cinematic footer.

**Phase 1 done = ** foundation engine + home page live on a Vercel preview, reduced-motion + mobile + Lighthouse verified.

## 5. Phase 2 — Work (case studies)

- Routed pages (e.g. `/work/[slug]`) for TruthLayer, AgentForge Healthcare, and 1–2 others.
- Each: scroll-driven story (problem → approach → result), metrics, visuals/screenshots, stack, links — reusing the parallax + choreography engine.
- Work index / improved grid linking in.

## 6. Phase 3 — About + Writing + polish

- **About** page led by the avatar: longer narrative, journey, the "$3T by day / AI by night" story, photo-slot optional.
- **Writing/Notes** (optional): MDX-driven posts, if desired.
- Final pass: perf/a11y/SEO hardening, cross-page transitions, OG-per-page, QA.

## 7. Architecture / file structure (target)

```
src/
├── app/
│   ├── layout.tsx                 # fonts, providers (Lenis, cursor, intro), metadata
│   ├── page.tsx                   # home composition
│   ├── work/[slug]/page.tsx       # Phase 2
│   ├── about/page.tsx             # Phase 3
│   └── globals.css                # tokens
├── components/
│   ├── chrome/                    # nav, footer, cursor, intro, scroll-progress
│   ├── motion/                    # Parallax, choreography hooks, useMagnetic, pointer store
│   ├── hero/                      # hero + webgl accent (lazy)
│   └── sections/                  # manifesto, work-grid, experience, marquee
├── content/                       # project + experience data (typed)
└── lib/                           # reduced-motion, utils, hooks
```

## 8. Tech stack

Keep: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind v4, GSAP + ScrollTrigger, Motion, Lenis, Vercel Analytics.
Add: `@next/font` Fraunces + Inter; a small WebGL lib (OGL) **or** hand-rolled canvas for the hero accent.

## 9. Out of scope / open

- No full three.js scene (accent only).
- No avatar character animation (static, per decision).
- Writing/Notes section is optional (decide at Phase 3).
- Mono typeface: keep Geist Mono unless a better pairing is chosen during Phase 1.

## 10. Risks & mitigations

- **Over-animation / gimmick risk** → restraint, reduced-motion parity, "senior not demo" bar.
- **Perf regressions from WebGL/parallax** → code-split, offscreen-pause, mobile-light, LCP = text.
- **Avatar cutout quality** → pre-cut transparent asset, not runtime keying.
- **Scope creep across phases** → each phase shippable; gate before next.
