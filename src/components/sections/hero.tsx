import { MagneticLink } from "@/components/magnetic-link";

export function Hero() {
  return (
    <section className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-6 pt-24 pb-16">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
        Rohan Thomas · Austin, TX · open to collabs
      </p>
      <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl">
        I build AI products — agents, dev tools, and the interfaces around them.
      </h1>
      <p className="mt-6 max-w-xl text-lg text-ink-soft">
        Full-stack engineer at Charles Schwab. Five shipped side projects and counting.
      </p>
      <div className="mt-10 flex flex-wrap items-center gap-4">
        <MagneticLink
          href="#work"
          className="rounded-full bg-ink px-7 py-3.5 font-medium text-paper"
        >
          See the work ↓
        </MagneticLink>
        <MagneticLink
          href="mailto:claude@thomasrohan.com"
          className="rounded-full border-2 border-ink px-7 py-3.5 font-medium text-ink"
        >
          Say hi
        </MagneticLink>
      </div>
    </section>
  );
}
