import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./hero";
import { BOOKING_URL } from "@/lib/site";

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
      screen.getByText(/Rohan Thomas · Austin, TX · booking new projects/),
    ).toBeInTheDocument();
    expect(screen.getByText(/Six years shipping systems where mistakes are expensive/)).toBeInTheDocument();
  });

  it("renders both magnetic CTAs with correct targets", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /see the work/i })).toHaveAttribute("href", "#work");
    const book = screen.getByRole("link", { name: /book an intro call/i });
    expect(book).toHaveAttribute("href", BOOKING_URL);
    expect(book).toHaveAttribute("target", "_blank");
  });
});
