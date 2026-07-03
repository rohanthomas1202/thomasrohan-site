import { MagneticLink } from "@/components/magnetic-link";
import { HeroHeadline } from "@/components/sections/hero-headline";

export function Hero() {
  return (
    <section className="mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-6 pt-24 pb-16">
      <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
        Rohan Thomas · Austin, TX · open to collabs
      </p>
      <HeroHeadline />
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
          href="mailto:contact@thomasrohan.com"
          className="rounded-full border-2 border-ink px-7 py-3.5 font-medium text-ink"
        >
          Say hi
        </MagneticLink>
      </div>
    </section>
  );
}
