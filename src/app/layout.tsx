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
      "Trading screens at $3T scale. Prediction markets after hours.",
    siteName: "Rohan Thomas",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Thomas — Trading screens at $3T scale",
    description:
      "Trading screens at $3T scale. Prediction markets after hours.",
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
