import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./hero";

describe("Hero", () => {
  it("renders the headline verbatim", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "I build AI products that survive production.",
      }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow and sub-line", () => {
    render(<Hero />);
    expect(
      screen.getByText(/Rohan Thomas · Austin, TX · taking new projects/),
    ).toBeInTheDocument();
    expect(screen.getByText(/six years shipping systems where mistakes are expensive/i)).toBeInTheDocument();
  });

  it("renders both magnetic CTAs as internal anchors", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /see the work/i })).toHaveAttribute("href", "#work");
    const touch = screen.getByRole("link", { name: /get in touch/i });
    expect(touch).toHaveAttribute("href", "#contact");
    expect(touch).not.toHaveAttribute("target");
  });

  it("has no booking link", () => {
    render(<Hero />);
    expect(screen.queryByRole("link", { name: /book/i })).toBeNull();
  });
});
