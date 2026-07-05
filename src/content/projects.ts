export type Accent = "blue" | "tangerine" | "pink" | "green" | "violet";

export type Project = {
  title: string;
  blurb: string;
  stack: string;
  year: string;
  tag: string;
  href: string;
  live?: string;
  caseStudy?: string;
  accent: Accent;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "AgentForge Healthcare",
    blurb:
      "A healthcare agent built on OpenEMR's FHIR API, with 14 tools, a 6-layer verification pipeline, and a 92-case eval suite. Clinical staff can't act on answers that are only usually right, so every answer gets checked.",
    stack: "Python · LangGraph · FHIR R4",
    year: "2026",
    tag: "AI Agent",
    href: "https://github.com/rohanthomas1202/agentforge-healthcare",
    caseStudy: "/work/agentforge-healthcare",
    accent: "blue",
    featured: true,
  },
  {
    title: "Alcohol Label Verifier",
    blurb:
      "TTB label review is usually done by eye. This pipeline reads a label image and returns a field-by-field compliance verdict in seconds, with a violation report you can act on.",
    stack: "TypeScript · Next.js · Claude Vision",
    year: "2026",
    tag: "Vision AI",
    href: "https://github.com/rohanthomas1202/Alcohol-Label-Verifier",
    live: "https://alcohol-label-verifier-two.vercel.app",
    caseStudy: "/work/alcohol-label-verifier",
    accent: "tangerine",
    featured: true,
  },
  {
    title: "ChatBridge",
    blurb:
      "A chat platform that treats plugins as untrusted code and runs them in sandboxed iframes. Ships with chess (Stockfish WASM), weather, and Spotify plugins to prove the model works.",
    stack: "React · Zustand · Mantine · Hono",
    year: "2026",
    tag: "Platform",
    href: "https://github.com/rohanthomas1202/chatbridge",
    accent: "pink",
  },
  {
    title: "Shipyard",
    blurb:
      "An autonomous coding agent built on LangGraph and Claude. It makes precise file edits, coordinates sub-agents, and takes injected context. Most of what I know about agents came from building it.",
    stack: "Python · LangGraph · Claude",
    year: "2026",
    tag: "Dev Tools",
    href: "https://github.com/rohanthomas1202/Shipyard",
    accent: "green",
  },
  {
    title: "HypeInvest V2",
    blurb:
      "A real-time sentiment index that pulls Reddit, YouTube, Bluesky, and StockTwits into one tradeable signal. Won HackUTD.",
    stack: "Next.js 15 · React 19 · FastAPI",
    year: "2026",
    tag: "Fintech",
    href: "https://github.com/rohanthomas1202/HypeInvest-V2",
    accent: "violet",
  },
];
