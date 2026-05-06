# thomasrohan.com

Personal site for [Rohan Thomas](https://github.com/rohanthomas1202) — full-stack engineer at Charles Schwab, building AI agents and trading tools after hours.

→ Live at **[thomasrohan.com](https://thomasrohan.com)**

## Stack

- [Next.js 16](https://nextjs.org) — App Router, Turbopack
- [React 19](https://react.dev), TypeScript
- [Tailwind CSS v4](https://tailwindcss.com)
- [GSAP](https://gsap.com) + ScrollTrigger — scroll choreography
- [Motion](https://motion.dev) — component micro-interactions
- [Lenis](https://lenis.darkroom.engineering) — smooth scroll
- [Vercel Analytics](https://vercel.com/docs/analytics)

## Run locally

```bash
pnpm install
pnpm dev
```

Then open [localhost:3000](http://localhost:3000).

## Layout

```
src/
├── app/
│   ├── layout.tsx          # root metadata, fonts, analytics
│   ├── page.tsx            # composes the home sections
│   ├── globals.css         # Tailwind theme + accent token
│   ├── opengraph-image.tsx # dynamic OG card
│   └── icon.tsx            # favicon
├── components/
│   ├── hero.tsx
│   ├── nav.tsx
│   ├── footer.tsx
│   ├── lenis-provider.tsx
│   └── sections/
│       ├── manifesto.tsx
│       ├── work-grid.tsx
│       └── marquee.tsx
└── lib/
    └── utils.ts
```

The accent color (`--accent: #c5ff00`) lives in `src/app/globals.css`.
