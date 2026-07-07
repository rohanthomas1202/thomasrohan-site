import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TINT_ACCENTS: Record<string, string> = {
  "bg-blue-tint": "var(--blue)",
  "bg-tangerine-tint": "var(--tangerine)",
  "bg-pink-tint": "var(--pink)",
  "bg-green-tint": "var(--green)",
  "bg-violet-tint": "var(--violet)",
};

export function accentFromTint(tintClass: string): string {
  return TINT_ACCENTS[tintClass] ?? "var(--ink)";
}
