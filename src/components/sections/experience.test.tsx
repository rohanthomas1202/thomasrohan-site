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
    default: {
      registerPlugin: vi.fn(),
      fromTo,
      context,
      utils: { toArray: vi.fn(() => []) },
    },
  };
});

vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));

import { Experience } from "./experience";

describe("Experience", () => {
  it("renders Charles Schwab", () => {
    render(<Experience />);
    expect(screen.getByRole("heading", { name: "Charles Schwab" })).toBeInTheDocument();
  });

  it("renders FedEx", () => {
    render(<Experience />);
    expect(screen.getByRole("heading", { name: "FedEx" })).toBeInTheDocument();
  });

  it("renders United Healthcare", () => {
    render(<Experience />);
    expect(screen.getByRole("heading", { name: "United Healthcare" })).toBeInTheDocument();
  });
});
