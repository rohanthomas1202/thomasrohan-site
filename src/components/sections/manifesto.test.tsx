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

import { Manifesto } from "./manifesto";

describe("Manifesto", () => {
  it("renders the manifesto statement words", () => {
    render(<Manifesto />);
    // Words are split into per-word spans (each ends with a non-breaking space).
    expect(screen.getByText(/ships/)).toBeInTheDocument();
    expect(screen.getByText(/agents,/)).toBeInTheDocument();
  });

  it("keeps the about section id", () => {
    const { container } = render(<Manifesto />);
    expect(container.querySelector("#about")).not.toBeNull();
  });
});
