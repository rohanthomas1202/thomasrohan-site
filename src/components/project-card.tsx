"use client";
import { useState } from "react";
import { motion, type Variants } from "motion/react";
import { projects, type Accent, type Project } from "@/content/projects";
import { SPRING } from "@/components/motion/springs";
import { columnPosition } from "@/lib/grid";
import { cn } from "@/lib/utils";

const ACCENTS: Record<
  Accent,
  { bg: string; tint: string; deco: string; cssVar: string }
> = {
  blue: { bg: "bg-blue", tint: "bg-blue-tint", deco: "decoration-blue", cssVar: "var(--blue)" },
  tangerine: { bg: "bg-tangerine", tint: "bg-tangerine-tint", deco: "decoration-tangerine", cssVar: "var(--tangerine)" },
  pink: { bg: "bg-pink", tint: "bg-pink-tint", deco: "decoration-pink", cssVar: "var(--pink)" },
  green: { bg: "bg-green", tint: "bg-green-tint", deco: "decoration-green", cssVar: "var(--green)" },
  violet: { bg: "bg-violet", tint: "bg-violet-tint", deco: "decoration-violet", cssVar: "var(--violet)" },
};

export const cardVariants = (tilt: number, delay = 0): Variants => ({
  hidden: { opacity: 0, y: 24, rotate: 0 },
  visible: { opacity: 1, y: 0, scale: 1, rotate: tilt, transition: { ...SPRING.reveal, delay } },
  /* Must re-state opacity/y: when focus routes this variant through the
     whileInView slot, missing props fall back to `hidden` and the card vanishes. */
  hover: { opacity: 1, y: -6, scale: 1.02, rotate: 0, transition: SPRING.hover },
});
const arrowOut: Variants = {
  hidden: { x: "0%", y: "0%" },
  visible: { x: "0%", y: "0%" },
  hover: { x: "110%", y: "-110%", transition: SPRING.arrow },
};
const arrowIn: Variants = {
  hidden: { x: "-110%", y: "110%" },
  visible: { x: "-110%", y: "110%" },
  hover: { x: "0%", y: "0%", transition: SPRING.arrow },
};
const linkArrow: Variants = {
  hidden: { x: 0 },
  visible: { x: 0 },
  hover: { x: 3, transition: SPRING.arrow },
};

function ArrowGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 12L12 4M12 4H6M12 4V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const accent = ACCENTS[project.accent];
  const featured = Boolean(project.featured);
  const primary = project.caseStudy ?? project.live ?? project.href;
  const external = !project.caseStudy;
  const tilt = index % 2 === 0 ? 1 : -1;
  // Cards cascade left-to-right within their grid row on scroll-in.
  const delay = columnPosition(index, projects) * 0.08;
  const [focused, setFocused] = useState(false);
  return (
    <motion.article
      initial="hidden"
      whileInView={focused ? "hover" : "visible"}
      whileHover="hover"
      onFocus={() => setFocused(true)}
      onBlur={(e) => setFocused(e.currentTarget.contains(e.relatedTarget as Node))}
      viewport={{ once: true, margin: "-15% 0px" }}
      variants={cardVariants(tilt, delay)}
      style={{ "--card-accent": accent.cssVar, "--focus-ring": accent.cssVar, transformOrigin: "center bottom" } as React.CSSProperties}
      className={cn(
        "project-card group relative flex flex-col rounded-3xl p-7 sm:p-8",
        accent.tint,
        featured ? "md:col-span-3 md:min-h-80" : project.wide ? "md:col-span-3 md:min-h-72" : "md:col-span-2 md:min-h-72",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full border-2 border-ink/15 bg-paper px-3 py-1 font-mono text-xs text-ink">
          {project.tag}
        </span>
        <motion.a
          href={primary}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          aria-label={`Open ${project.title}`}
          whileTap={{ scale: 0.9, transition: SPRING.press }}
          className={cn(
            "relative flex size-10 items-center justify-center overflow-hidden rounded-full text-paper",
            accent.bg,
          )}
        >
          <motion.span variants={arrowOut} className="absolute inset-0 flex items-center justify-center">
            <ArrowGlyph />
          </motion.span>
          <motion.span variants={arrowIn} className="absolute inset-0 flex items-center justify-center">
            <ArrowGlyph />
          </motion.span>
        </motion.a>
      </div>
      <h3
        className={cn(
          "mt-6 font-display font-bold tracking-tight text-ink",
          featured ? "text-3xl sm:text-4xl" : "text-2xl",
        )}
      >
        {project.title}
      </h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/75">{project.blurb}</p>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
        {project.stack.split(" · ").map((tech) => (
          <span key={tech} className="rounded-full bg-paper px-3 py-1 font-mono text-xs text-ink-soft">
            {tech}
          </span>
        ))}
        <span className="ml-auto font-mono text-xs text-ink-soft">{project.year}</span>
      </div>
      <div className="relative z-10 mt-4 flex gap-4 text-sm font-medium">
        {project.caseStudy && (
          <a
            href={project.caseStudy}
            className={cn("text-ink underline decoration-2 underline-offset-4 hover:opacity-70", accent.deco)}
          >
            Case study{" "}
            <motion.span variants={linkArrow} className="inline-block" aria-hidden>
              →
            </motion.span>
          </a>
        )}
        <a
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className={cn("text-ink underline decoration-2 underline-offset-4 hover:opacity-70", accent.deco)}
        >
          GitHub{" "}
          <motion.span variants={linkArrow} className="inline-block" aria-hidden>
            ↗
          </motion.span>
        </a>
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noreferrer"
            className={cn("text-ink underline decoration-2 underline-offset-4 hover:opacity-70", accent.deco)}
          >
            Live demo{" "}
            <motion.span variants={linkArrow} className="inline-block" aria-hidden>
              ↗
            </motion.span>
          </a>
        )}
      </div>
    </motion.article>
  );
}
