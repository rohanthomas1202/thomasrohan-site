import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Nav } from "@/components/nav";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

const description =
  "I build AI products — agents, dev tools, and the interfaces around them. Full-stack engineer at Charles Schwab in Austin, TX. Five shipped side projects and counting. Open to collabs.";

export const metadata: Metadata = {
  metadataBase: new URL("https://thomasrohan.com"),
  title: {
    default: "Rohan Thomas — I build AI products",
    template: "%s — Rohan Thomas",
  },
  description,
  keywords: ["Rohan Thomas", "full-stack engineer", "AI agents", "dev tools", "Austin", "Next.js"],
  authors: [{ name: "Rohan Thomas", url: "https://thomasrohan.com" }],
  creator: "Rohan Thomas",
  openGraph: {
    type: "website",
    url: "https://thomasrohan.com",
    title: "Rohan Thomas — I build AI products",
    description,
    siteName: "Rohan Thomas",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Thomas — I build AI products",
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
        <Nav />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
