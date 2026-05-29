"use client";

import { useRef } from "react";
import Image from "next/image";
import { Parallax } from "@/components/motion/parallax";
import { useMagnetic } from "@/components/motion/use-magnetic";

export function Footer() {
  const emailRef = useRef<HTMLAnchorElement>(null);
  useMagnetic(emailRef);

  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-border px-6 pt-32 pb-10"
    >
      {/* Decorative avatar peeking from the bottom-right corner. */}
      <Parallax
        depth={20}
        className="pointer-events-none absolute -right-12 -bottom-16 -z-10 select-none opacity-20 sm:right-0 sm:-bottom-24 sm:opacity-40"
      >
        <Image
          src="/rohan-avatar.png"
          alt=""
          width={360}
          height={360}
          aria-hidden
          className="h-auto w-[220px] sm:w-[360px]"
        />
      </Parallax>

      <div className="relative mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">
          04 / Contact
        </p>
        <h2 className="display mt-3 text-6xl sm:text-8xl lg:text-[10rem]">
          Let&apos;s
          <br />
          <span className="text-accent">build.</span>
        </h2>
        <div className="mt-12 grid gap-10 border-t border-border pt-10 sm:grid-cols-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Email
            </p>
            <a
              ref={emailRef}
              data-hover
              href="mailto:contact@thomasrohan.com"
              className="mt-2 inline-block text-lg hover:text-accent"
            >
              contact@thomasrohan.com
            </a>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Elsewhere
            </p>
            <ul className="mt-2 space-y-1 text-lg">
              <li>
                <a
                  data-hover
                  href="https://github.com/rohanthomas1202"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent"
                >
                  GitHub ↗
                </a>
              </li>
              <li>
                <a
                  data-hover
                  href="https://www.linkedin.com/in/RohanSThomas"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent"
                >
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a
                  data-hover
                  href="tel:+14695167477"
                  className="hover:text-accent"
                >
                  469 · 516 · 7477
                </a>
              </li>
            </ul>
          </div>
          <div className="sm:text-right">
            <p className="font-mono text-xs uppercase tracking-widest text-muted">
              Based in
            </p>
            <p className="mt-2 text-lg">Austin, TX</p>
            <p className="mt-1 text-sm text-muted">
              UT Dallas — BS CS, 2022
            </p>
          </div>
        </div>
        <div className="mt-16 flex justify-between font-mono text-xs uppercase tracking-widest text-muted">
          <span>© 2026 Rohan Thomas</span>
          <span>v0.1 — Built with Next.js</span>
        </div>
      </div>
    </footer>
  );
}
