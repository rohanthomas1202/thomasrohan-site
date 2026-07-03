import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./hero";

describe("Hero", () => {
  it("renders the headline verbatim", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "I build AI products — agents, dev tools, and the interfaces around them.",
      }),
    ).toBeInTheDocument();
  });

  it("renders the eyebrow and sub-line", () => {
    render(<Hero />);
    expect(screen.getByText(/Rohan Thomas · Austin, TX · open to collabs/)).toBeInTheDocument();
    expect(screen.getByText(/Full-stack engineer at Charles Schwab\./)).toBeInTheDocument();
  });

  it("renders both magnetic CTAs with correct targets", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /see the work/i })).toHaveAttribute("href", "#work");
    expect(screen.getByRole("link", { name: /say hi/i })).toHaveAttribute(
      "href",
      "mailto:claude@thomasrohan.com",
    );
  });
});
