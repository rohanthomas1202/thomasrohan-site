import { projects, type Project } from "@/content/projects";
import { cn } from "@/lib/utils";

const ACCENTS: Record<string, { text: string; bg: string; tint: string }> = {
  "AgentForge Healthcare": { text: "text-blue", bg: "bg-blue", tint: "bg-blue-tint" },
  "Alcohol Label Verifier": { text: "text-tangerine", bg: "bg-tangerine", tint: "bg-tangerine-tint" },
  ChatBridge: { text: "text-pink", bg: "bg-pink", tint: "bg-pink-tint" },
  Shipyard: { text: "text-green", bg: "bg-green", tint: "bg-green-tint" },
  "HypeInvest V2": { text: "text-violet", bg: "bg-violet", tint: "bg-violet-tint" },
};
const FEATURED = new Set(["AgentForge Healthcare", "Alcohol Label Verifier"]);

function Card({ project, index }: { project: Project; index: number }) {
  const accent = ACCENTS[project.title] ?? ACCENTS.ChatBridge;
  const featured = FEATURED.has(project.title);
  const primary = project.live ?? project.href;
  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-3xl p-7 transition-transform duration-300 hover:rotate-0 sm:p-8",
        accent.tint,
        index % 2 === 0 ? "rotate-[1deg]" : "rotate-[-1deg]",
        featured ? "md:col-span-3 md:min-h-80" : "md:col-span-2 md:min-h-72",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full border-2 border-ink/15 bg-paper px-3 py-1 font-mono text-xs text-ink">
          {project.tag}
        </span>
        <span
          aria-hidden
          className={cn(
            "flex size-10 items-center justify-center rounded-full text-lg text-paper",
            accent.bg,
          )}
        >
          ↗
        </span>
      </div>
      <h3
        className={cn(
          "mt-6 font-display font-bold tracking-tight text-ink",
          featured ? "text-3xl sm:text-4xl" : "text-2xl",
        )}
      >
        <a href={primary} target="_blank" rel="noreferrer" className="after:absolute after:inset-0">
          {project.title}
        </a>
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
        <a href={project.href} target="_blank" rel="noreferrer" className={cn("hover:underline", accent.text)}>
          GitHub ↗
        </a>
        {project.live && (
          <a href={project.live} target="_blank" rel="noreferrer" className={cn("hover:underline", accent.text)}>
            Live demo ↗
          </a>
        )}
      </div>
    </article>
  );
}

export function Projects() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">Work</h2>
      <p className="mt-3 max-w-md text-ink-soft">
        Five shipped side projects. Every card links out — GitHub always, live demo when there is one.
      </p>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-6">
        {projects.map((p, i) => (
          <Card key={p.title} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
