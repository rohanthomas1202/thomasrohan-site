import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { LenisProvider } from "@/components/lenis-provider";
import { Nav } from "@/components/nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thomasrohan.com"),
  title: {
    default: "Rohan Thomas — Full-Stack Engineer",
    template: "%s — Rohan Thomas",
  },
  description:
    "Full-stack engineer shipping trading interfaces moving $3T+ at Charles Schwab. After hours: AI agents, prediction-market scanners, and product UIs.",
  keywords: [
    "Rohan Thomas",
    "full-stack engineer",
    "Charles Schwab",
    "AI agents",
    "LangGraph",
    "Next.js",
  ],
  authors: [{ name: "Rohan Thomas", url: "https://thomasrohan.com" }],
  creator: "Rohan Thomas",
  openGraph: {
    type: "website",
    url: "https://thomasrohan.com",
    title: "Rohan Thomas — Full-Stack Engineer",
    description:
      "Trading interfaces moving $3T+ by day. AI agents and arbitrage scanners after hours.",
    siteName: "Rohan Thomas",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Thomas — Full-Stack Engineer",
    description:
      "Trading interfaces moving $3T+ by day. AI agents and arbitrage scanners after hours.",
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
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-background text-foreground">
        <LenisProvider />
        <Nav />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
