"use client";
import { useRef } from "react";
import { useMagnetic } from "@/components/motion/use-magnetic";
import { cn } from "@/lib/utils";

export function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagnetic(ref, 0.3);
  return (
    <a ref={ref} href={href} className={cn("inline-block", className)}>
      {children}
    </a>
  );
}
