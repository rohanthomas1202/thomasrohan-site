import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/use-prefers-reduced-motion", () => ({
  usePrefersReducedMotion: () => true,
}));

import { Footer } from "./footer";

describe("Footer", () => {
  it("renders the email address", () => {
    render(<Footer />);
    expect(screen.getByText("contact@thomasrohan.com")).toBeInTheDocument();
  });

  it("renders the GitHub and LinkedIn links", () => {
    render(<Footer />);
    const github = screen.getByText(/GitHub/);
    const linkedin = screen.getByText(/LinkedIn/);
    expect(github).toBeInTheDocument();
    expect(linkedin).toBeInTheDocument();
    expect(github.closest("a")).toHaveAttribute(
      "href",
      "https://github.com/rohanthomas1202",
    );
    expect(linkedin.closest("a")).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/RohanSThomas",
    );
  });
});
