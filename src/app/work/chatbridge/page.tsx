import type { Metadata } from "next";
import { CaseStudy, type CaseStudyData } from "@/components/case-study";

const data: CaseStudyData = {
  slug: "chatbridge",
  tag: "Platform",
  title: "ChatBridge",
  dek: "A plugin runtime built into the open-source Chatbox client: iframe-isolated plugins with a strict lifecycle protocol, registered as tools the AI can call mid-conversation.",
  tintClass: "bg-pink-tint",
  tldr: {
    problem:
      "Chat apps want plugins, but third-party code in your UI is a liability — and a plugin the AI can't see or drive is just an embed.",
    built:
      "A plugin system layered onto the Chatbox codebase — 11K+ lines across 67 files: iframe isolation, a postMessage lifecycle protocol with timeouts and retry, AI-callable plugin tools via Zod schemas, and a JWT-authenticated Hono proxy in front of all LLM calls.",
    proof:
      "41 passing Vitest tests and four working plugins: chess against Stockfish WASM, weather, Spotify with real OAuth, and a code runner.",
  },
  context: [
    "ChatBridge started from a question: what does it take for a chat client to host interactive plugins that the AI itself can use? Not widgets beside the conversation — tools inside it, where the model can read a chess position mid-game and suggest a move.",
    "Rather than build a chat app from scratch, I extended Chatbox, the open-source client, and spent the effort on what didn't exist: the plugin runtime, the AI-tool bridge, and the server hardening. Shipping 11K+ lines into someone else's large codebase was half the exercise.",
  ],
  built: [
    "Plugins are static bundles rendered in iframes that speak a strict postMessage lifecycle — ready, invoke, state, complete, error. A plugin that hangs hits a 30-second timeout with a visible error and a retry button, and a 500-millisecond invoke retry papers over iframe boot races. Each plugin also registers as an AI-callable tool through the Vercel AI SDK with Zod schemas, so the model can query and drive plugin state mid-chat.",
    "In front of the LLM sits a Hono server with JWT authentication and SSRF protection that blocks requests to private networks. The proof plugins are deliberately varied: a chess engine running Stockfish compiled to WASM with four difficulty levels, an Open-Meteo weather forecast, Spotify playlist creation over a real OAuth2 PKCE flow, and a code runner that renders AI-generated HTML apps inline.",
  ],
  decisions: [
    {
      decision: "Extend Chatbox instead of building a chat app",
      why: "The plugin runtime was the point. Building on an existing open-source codebase meant the work went into the hard new part — and proved I can land a large feature in code I didn't write.",
    },
    {
      decision: "Plugins are tools, not embeds",
      why: "Every plugin registers a Zod-schema tool the AI can call, so the model participates: ask it what to play in the chess plugin and it reads the live board state before answering.",
    },
    {
      decision: "A lifecycle protocol instead of ad-hoc postMessage",
      why: "Ready, invoke, state, complete, error — with timeouts, error surfaces, and retry defined once. Ad-hoc message passing is where plugin systems go to rot.",
    },
    {
      decision: "Assume the plugin will hang",
      why: "A 30-second timeout with a visible error and retry button, plus an invoke retry for iframe boot races. The commit history is full of the real bugs this caught — Safari quirks, OAuth cross-tab flows, race conditions.",
    },
    {
      decision: "Harden the proxy, not just the prompt",
      why: "All LLM traffic goes through a JWT-authenticated Hono server that refuses to fetch private network addresses. Server-side SSRF protection is cheaper than trusting every future plugin author.",
    },
  ],
  proves:
    "Platform work is contract design: a lifecycle protocol third parties can't hold wrong, an AI-tool bridge that makes plugins conversational, and the assumption that hosted code will misbehave — enforced server-side.",
  github: "https://github.com/rohanthomas1202/chatbridge",
};

export const metadata: Metadata = {
  title: "ChatBridge case study",
  description: data.dek,
  openGraph: {
    type: "article",
    url: "/work/chatbridge",
    title: "ChatBridge case study",
    description: data.dek,
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChatBridge case study",
    description: data.dek,
    images: ["/opengraph-image"],
  },
};

export default function ChatBridgeCaseStudy() {
  return <CaseStudy data={data} />;
}
