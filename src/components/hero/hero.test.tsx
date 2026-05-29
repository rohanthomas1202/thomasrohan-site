import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Reduced motion → hero reveals immediately and skips transforms.
vi.mock("@/lib/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

import { Hero } from "./hero";

describe("Hero", () => {
  it("renders the four headline phrases", () => {
    render(<Hero />);
    expect(screen.getByText("Trading screens")).toBeInTheDocument();
    expect(screen.getByText("scale.", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Prediction markets")).toBeInTheDocument();
    expect(screen.getByText("after hours.")).toBeInTheDocument();
  });

  it("renders the eyebrow", () => {
    render(<Hero />);
    expect(
      screen.getByText("Austin, TX — open to new work", { exact: false }),
    ).toBeInTheDocument();
  });

  it("renders both CTAs", () => {
    render(<Hero />);
    expect(screen.getByText("View work")).toBeInTheDocument();
    expect(screen.getByText("Get in touch")).toBeInTheDocument();
  });

  it("renders the avatar image with descriptive alt text", () => {
    render(<Hero />);
    expect(
      screen.getByAltText("Illustrated portrait of Rohan Thomas"),
    ).toBeInTheDocument();
  });
});
