import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

import { Marquee } from "./marquee";

describe("Marquee", () => {
  it("renders stack items", () => {
    render(<Marquee />);
    // Items are duplicated for the seamless loop and appear in both rows.
    expect(screen.getAllByText("TypeScript").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Claude").length).toBeGreaterThan(0);
  });

  it("keeps the stack section id", () => {
    const { container } = render(<Marquee />);
    expect(container.querySelector("#stack")).not.toBeNull();
  });
});
