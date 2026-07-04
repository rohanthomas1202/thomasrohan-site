import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://thomasrohan.com";
  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    ...projects
      .filter((p) => p.caseStudy)
      .map((p) => ({
        url: `${base}${p.caseStudy}`,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  ];
}
