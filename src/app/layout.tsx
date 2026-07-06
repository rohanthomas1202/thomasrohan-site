import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { MotionProvider } from "@/components/motion/motion-provider";
import { AVAILABILITY } from "@/lib/now";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

const availabilitySentence = AVAILABILITY.charAt(0).toUpperCase() + AVAILABILITY.slice(1);
const description = `I build and ship production AI systems: agents, evals, and the interfaces around them. Based in Austin, TX. ${availabilitySentence}.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://thomasrohan.com"),
  title: {
    default: "Rohan Thomas — AI products that survive production",
    template: "%s — Rohan Thomas",
  },
  description,
  keywords: ["Rohan Thomas", "AI consultant", "AI agents", "LLM evals", "AI product engineering", "Austin"],
  authors: [{ name: "Rohan Thomas", url: "https://thomasrohan.com" }],
  creator: "Rohan Thomas",
  openGraph: {
    type: "website",
    url: "https://thomasrohan.com",
    title: "Rohan Thomas — AI products that survive production",
    description,
    siteName: "Rohan Thomas",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Thomas — AI products that survive production",
    description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${inter.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-paper text-ink">
        <MotionProvider>
          <Nav />
          {children}
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
