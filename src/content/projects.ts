export type Project = {
  title: string;
  blurb: string;
  stack: string;
  year: string;
  tag: string;
  href: string;
  live?: string;
  caseStudy?: string;
};

export const projects: Project[] = [
  {
    title: "AgentForge Healthcare",
    blurb: `Clinical staff can’t trust an agent that’s right "usually." A FHIR-native healthcare agent — 14 tools, a 6-layer verification pipeline, a 92-case eval suite. Every answer checked before a human sees it.`,
    stack: "Python · LangGraph · FHIR R4",
    year: "2026",
    tag: "AI Agent",
    href: "https://github.com/rohanthomas1202/agentforge-healthcare",
    caseStudy: "/work/agentforge-healthcare",
  },
  {
    title: "Alcohol Label Verifier",
    blurb:
      "TTB label review is manual, slow, and fine-heavy. This pipeline turns a label upload into a structured compliance verdict in seconds — with a violation report you can act on.",
    stack: "TypeScript · Next.js · Claude Vision",
    year: "2026",
    tag: "Vision AI",
    href: "https://github.com/rohanthomas1202/Alcohol-Label-Verifier",
    live: "https://alcohol-label-verifier-two.vercel.app",
    caseStudy: "/work/alcohol-label-verifier",
  },
  {
    title: "ChatBridge",
    blurb:
      "A chat platform that treats plugins as untrusted code — sandboxed iframe runtime, with chess (Stockfish WASM), weather, and Spotify OAuth plugins shipped to prove the model.",
    stack: "React · Zustand · Mantine · Hono",
    year: "2026",
    tag: "Platform",
    href: "https://github.com/rohanthomas1202/chatbridge",
  },
  {
    title: "Shipyard",
    blurb:
      "An autonomous coding agent on LangGraph + Claude — surgical file edits, sub-agent coordination, injectable context. Everything it taught me feeds the agents I ship for clients.",
    stack: "Python · LangGraph · Claude",
    year: "2026",
    tag: "Dev Tools",
    href: "https://github.com/rohanthomas1202/Shipyard",
  },
  {
    title: "HypeInvest V2",
    blurb:
      "Real-time retail-sentiment index aggregating Reddit, YouTube, Bluesky, and StockTwits into one tradeable signal. (Won HackUTD.)",
    stack: "Next.js 15 · React 19 · FastAPI",
    year: "2026",
    tag: "Fintech",
    href: "https://github.com/rohanthomas1202/HypeInvest-V2",
  },
];
