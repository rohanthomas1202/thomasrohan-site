export type Project = {
  title: string;
  blurb: string;
  stack: string;
  year: string;
  tag: string;
  href: string;
  live?: string;
};

export const projects: Project[] = [
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
