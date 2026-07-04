import { projects } from "@/content/projects";
import { ProjectCard } from "@/components/project-card";

export function Projects() {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <h2 className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">Work</h2>
      <p className="mt-3 max-w-md text-ink-soft">
        Selected builds. Each one went from problem to deployed system — here&apos;s what I
        decided and why.
      </p>
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-6">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
