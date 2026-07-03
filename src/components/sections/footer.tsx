import { Reveal, RevealItem } from "@/components/motion/reveal";
import { CopyEmail } from "@/components/copy-email";

export function Footer() {
  return (
    <footer id="contact" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-16 pt-8">
      <Reveal>
        <RevealItem>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">Contact</p>
        </RevealItem>
        <RevealItem>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <a
              href="mailto:contact@thomasrohan.com"
              className="email-fill font-display text-[clamp(1.1rem,6.5vw,3.75rem)] font-bold tracking-tight text-ink"
            >
              <span aria-hidden className="fill">
                contact@thomasrohan.com
              </span>
              contact@thomasrohan.com
            </a>
            <CopyEmail email="contact@thomasrohan.com" />
          </div>
        </RevealItem>
        <RevealItem>
          <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-line pt-6 text-sm">
            <a
              href="https://github.com/rohanthomas1202"
              target="_blank"
              rel="noreferrer"
              className="text-ink hover:underline"
            >
              GitHub ↗
            </a>
            <a
              href="https://linkedin.com/in/RohanSThomas"
              target="_blank"
              rel="noreferrer"
              className="text-ink hover:underline"
            >
              LinkedIn ↗
            </a>
            <span className="ml-auto text-ink-soft">Built in Austin. © 2026 Rohan Thomas.</span>
          </div>
        </RevealItem>
      </Reveal>
    </footer>
  );
}
