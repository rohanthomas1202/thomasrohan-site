"use client";
import { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useMagnetic } from "@/components/motion/use-magnetic";
import { SPRING } from "@/components/motion/springs";
import { cn } from "@/lib/utils";

export function MagneticLink({
  href,
  className,
  children,
  target,
  rel,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { x, y } = useMagnetic(ref, 0.3);
  const labelX = useTransform(x, (v) => v * -0.2);
  const labelY = useTransform(y, (v) => v * -0.2);
  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      style={{ x, y }}
      whileTap={{ scaleX: 1.03, scaleY: 0.95, transition: SPRING.press }}
      className={cn("inline-block", className)}
    >
      <motion.span style={{ x: labelX, y: labelY }} className="inline-block">
        {children}
      </motion.span>
    </motion.a>
  );
}
