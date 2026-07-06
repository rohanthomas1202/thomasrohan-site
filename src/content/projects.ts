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
  /* Widens the card to half a row (col-span-3) without featured styling,
     so a trailing pair of cards fills the 6-column grid instead of leaving a hole. */
  wide?: boolean;
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
    title: "TruthLayer",
    blurb:
      "Polymarket and Kalshi often price the same event, worded two different ways. TruthLayer matches contracts with embeddings plus Claude verification, streams fee-adjusted spreads, and grades every call against real settlement outcomes — the scoreboard is proof, not theory.",
    stack: "Python · FAISS · Claude",
    year: "2026",
    tag: "Arb Scanner",
    href: "https://github.com/rohanthomas1202/truthlayer",
    caseStudy: "/work/truthlayer",
    accent: "violet",
  },
  {
    title: "Shipyard",
    blurb:
      "An autonomous coding agent built on LangGraph. It plans typed edit steps, makes anchor-based file edits with fuzzy fallback, fans work out to parallel sub-agents, and routes each task to the right model tier. Most of what I know about agents came from building it.",
    stack: "Python · LangGraph · FastAPI",
    year: "2026",
    tag: "Dev Tools",
    href: "https://github.com/rohanthomas1202/Shipyard",
    caseStudy: "/work/shipyard",
    accent: "green",
  },
  {
    title: "ChatBridge",
    blurb:
      "A plugin runtime built into the open-source Chatbox client. Plugins live in iframes behind a postMessage lifecycle protocol and register as tools the AI can call mid-chat — chess (Stockfish WASM), weather, and Spotify prove the model works.",
    stack: "React · Zustand · Mantine · Hono",
    year: "2026",
    tag: "Platform",
    href: "https://github.com/rohanthomas1202/chatbridge",
    caseStudy: "/work/chatbridge",
    accent: "pink",
  },
  {
    title: "PokerStats",
    blurb:
      "Online players get HUD stats; live players get a notebook. PokerStats logs a hand in under three seconds and turns your history into VPIP, c-bet%, and a leak report — every stat formula verified against worked examples in a 121-test suite.",
    stack: "Swift 6 · SwiftUI · SwiftData",
    year: "2026",
    tag: "iOS App",
    href: "https://github.com/rohanthomas1202/PokerStats",
    caseStudy: "/work/pokerstats",
    accent: "tangerine",
    wide: true,
  },
  {
    title: "HypeInvest V2",
    blurb:
      "Scores Reddit, YouTube, and news sentiment with Claude and blends it into one hype signal from −100 to +100. Sources fail independently, so one API outage degrades the index instead of breaking it. Rebuilt from a HackUTD project that won Goldman Sachs' investment-strategy challenge.",
    stack: "Next.js 16 · React 19 · FastAPI",
    year: "2026",
    tag: "Fintech",
    href: "https://github.com/rohanthomas1202/HypeInvest-V2",
    caseStudy: "/work/hypeinvest",
    accent: "blue",
    wide: true,
  },
];
