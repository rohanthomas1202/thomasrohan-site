"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SPRING } from "@/components/motion/springs";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return;
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy email address"
      className="inline-flex w-24 items-center justify-center rounded-full border-2 border-ink px-3 py-1.5 font-mono text-xs text-ink"
    >
      <span aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "copied" : "copy"}
            initial={{ opacity: 0, scale: 0.85, filter: "blur(2px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.85, filter: "blur(2px)" }}
            transition={SPRING.highlight}
          >
            {copied ? "Copied" : "Copy"}
          </motion.span>
        </AnimatePresence>
      </span>
      <span aria-live="polite" className="sr-only">{copied ? "Copied" : ""}</span>
    </button>
  );
}
