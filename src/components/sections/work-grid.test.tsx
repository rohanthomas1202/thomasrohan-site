import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

vi.mock("gsap", () => {
  const fromTo = vi.fn();
  const revert = vi.fn();
  const context = vi.fn(() => ({ revert }));
  return {
    default: { registerPlugin: vi.fn(), fromTo, context, utils: { toArray: vi.fn(() => []) } },
  };
});

vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));

import { WorkGrid } from "./work-grid";
import { projects } from "@/content/projects";

describe("WorkGrid", () => {
  it("renders the featured TruthLayer heading", () => {
    render(<WorkGrid />);
    expect(screen.getByRole("heading", { name: "TruthLayer" })).toBeInTheDocument();
  });

  it("renders all project titles from projects data", () => {
    render(<WorkGrid />);
    for (const p of projects) {
      expect(screen.getByRole("heading", { name: p.title })).toBeInTheDocument();
    }
  });
});
