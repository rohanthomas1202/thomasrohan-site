import type { Metadata } from "next";
import { Fraunces, Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";
import { Nav } from "@/components/chrome/nav";
import { ScrollProgress } from "@/components/chrome/scroll-progress";
import { Cursor } from "@/components/chrome/cursor";
import { Intro } from "@/components/chrome/intro";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], axes: ["opsz"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://thomasrohan.com"),
  title: {
    default: "Rohan Thomas — Trading screens at $3T scale",
    template: "%s — Rohan Thomas",
  },
  description:
    "Trading screens at $3T scale. Prediction markets after hours. Full-stack engineer at Charles Schwab building portfolio tools, AI agents, and arbitrage scanners.",
  keywords: [
    "Rohan Thomas",
    "full-stack engineer",
    "Charles Schwab",
    "prediction markets",
    "AI agents",
    "LangGraph",
    "Next.js",
  ],
  authors: [{ name: "Rohan Thomas", url: "https://thomasrohan.com" }],
  creator: "Rohan Thomas",
  openGraph: {
    type: "website",
    url: "https://thomasrohan.com",
    title: "Rohan Thomas — Trading screens at $3T scale",
    description:
      "Trading screens at $3T scale. Prediction markets after hours. Full-stack engineer at Charles Schwab — portfolio tools, AI agents, arbitrage scanners.",
    siteName: "Rohan Thomas",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Thomas — Trading screens at $3T scale",
    description:
      "Trading screens at $3T scale. Prediction markets after hours. Full-stack engineer at Charles Schwab — portfolio tools, AI agents, arbitrage scanners.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-background text-foreground">
        <ScrollProgress />
        <Intro />
        <SmoothScrollProvider />
        <Cursor />
        <Nav />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
