"use client";

import { cn } from "@/lib/utils";

type Project = {
  title: string;
  blurb: string;
  stack: string;
  year: string;
  tag: string;
  href: string;
  live?: string;
};

const projects: Project[] = [
  {
    title: "EdgeTerminal",
    blurb:
      "Real-time cross-market arbitrage scanner pairing Polymarket and Kalshi via FAISS + Claude matching, fee-adjusted spreads, settlement-verified P&L.",
    stack: "Python · FastAPI · Next.js · Claude",
    year: "2026",
    tag: "Quant",
    href: "https://github.com/rohanthomas1202/EdgeTerminal",
    live: "https://frontend-indol-five-84.vercel.app",
  },
  {
    title: "AgentForge Healthcare",
    blurb:
      "AI healthcare agent on OpenEMR FHIR R4, orchestrated with LangGraph across 5 tools and a 3-layer verification stack. 57-case eval suite.",
    stack: "Python · LangGraph · FHIR R4",
    year: "2026",
    tag: "AI Agent",
    href: "https://github.com/rohanthomas1202/agentforge-healthcare",
  },
  {
    title: "Alcohol Label Verifier",
    blurb:
      "Claude-Vision pipeline that audits TTB compliance on alcohol labels — uploads to verdict in seconds, with structured violation reports.",
    stack: "TypeScript · Next.js · Claude Vision",
    year: "2026",
    tag: "Vision AI",
    href: "https://github.com/rohanthomas1202/Alcohol-Label-Verifier",
    live: "https://alcohol-label-verifier-nine.vercel.app",
  },
  {
    title: "ChatBridge",
    blurb:
      "Plugin-based AI chat platform with sandboxed iframe runtime; ships chess (Stockfish WASM), weather, and Spotify OAuth plugins out of the box.",
    stack: "React · Zustand · Mantine · Hono",
    year: "2026",
    tag: "Platform",
    href: "https://github.com/rohanthomas1202/chatbridge",
  },
  {
    title: "Shipyard",
    blurb:
      "Autonomous coding agent built on LangGraph + Claude — surgical file edits, sub-agent coordination, injectable context.",
    stack: "Python · LangGraph · Claude",
    year: "2026",
    tag: "Dev Tools",
    href: "https://github.com/rohanthomas1202/Shipyard",
  },
  {
    title: "HypeInvest V2",
    blurb:
      "HackUTD-winning sentiment platform: a real-time Hype Index aggregating Reddit, YouTube, Bluesky, and StockTwits into actionable signal.",
    stack: "Next.js 15 · React 19 · FastAPI",
    year: "2026",
    tag: "Fintech",
    href: "https://github.com/rohanthomas1202/HypeInvest-V2",
  },
];

export function WorkGrid() {
  return (
    <section
      id="work"
      className="border-t border-border px-6 py-32 sm:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              02 / Selected Work
            </p>
            <h2 className="display mt-3 text-5xl sm:text-7xl">
              Selected
              <br />
              <span className="text-accent">work.</span>
            </h2>
          </div>
          <a
            href="https://github.com/rohanthomas1202"
            target="_blank"
            rel="noreferrer"
            className="hidden text-sm text-muted transition-colors hover:text-foreground sm:block"
          >
            View all on GitHub →
          </a>
        </div>

        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <li
              key={p.title}
              className={cn(
                "group relative aspect-[4/5] overflow-hidden bg-background transition-colors hover:bg-accent",
              )}
            >
              <a
                href={p.live ?? p.href}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 flex flex-col justify-between p-6"
              >
                <div className="flex justify-between font-mono text-xs uppercase tracking-widest">
                  <span className="text-muted group-hover:text-black/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-muted group-hover:text-black/70">
                    {p.tag}
                  </span>
                </div>
                <div>
                  <h3 className="display text-4xl transition-transform duration-500 ease-[cubic-bezier(0.2,0.9,0.1,1)] group-hover:-translate-y-1 group-hover:text-black sm:text-5xl">
                    {p.title}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-xs text-muted transition-colors group-hover:text-black/80">
                    {p.blurb}
                  </p>
                  <div className="mt-4 flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted group-hover:text-black/70">
                    <span>{p.stack}</span>
                    <span>{p.year}</span>
                  </div>
                </div>
              </a>
              <div
                aria-hidden
                className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-black transition-transform duration-500 group-hover:scale-x-100"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
