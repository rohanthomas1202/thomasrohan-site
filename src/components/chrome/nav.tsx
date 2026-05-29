"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Work", href: "#work", id: "work" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Stack", href: "#stack", id: "stack" },
  { label: "Contact", href: "#contact", id: "contact" },
];

const SECTION_IDS = ["work", "experience", "stack", "contact"] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Scroll-blur state (existing behaviour)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active-section tracking via IntersectionObserver
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        // Pick whichever tracked section has the highest visibility ratio
        let bestId: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratios.entries()) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        setActiveId(bestRatio > 0 ? bestId : null);
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0] },
    );

    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-md bg-background/60 border-b border-border"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a
          href="#top"
          data-hover
          className="font-mono text-sm tracking-tight"
        >
          ROHAN<span className="text-accent">.</span>THOMAS
        </a>
        <nav className="hidden gap-8 md:flex">
          {links.map((l) => {
            const isActive = activeId === l.id;
            return (
              <a
                key={l.href}
                href={l.href}
                data-hover
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "text-sm transition-colors hover:text-foreground",
                  isActive
                    ? "text-foreground underline decoration-accent decoration-2 underline-offset-4"
                    : "text-muted",
                )}
              >
                {l.label}
              </a>
            );
          })}
        </nav>
        <a
          href="#contact"
          data-hover
          className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-black transition-transform hover:scale-105"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}
