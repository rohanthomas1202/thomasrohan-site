import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";

describe("Footer", () => {
  it("renders the oversized mailto", () => {
    render(<Footer />);
    const mail = screen.getByRole("link", { name: /contact@thomasrohan\.com/i });
    expect(mail).toHaveAttribute("href", "mailto:contact@thomasrohan.com");
  });

  it("renders GitHub and LinkedIn links", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/rohanthomas1202",
    );
    expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
      "href",
      "https://linkedin.com/in/RohanSThomas",
    );
  });

  it("renders a plain sign-off", () => {
    render(<Footer />);
    expect(screen.getByText(/Built in Austin/)).toBeInTheDocument();
  });

  it("renders the Work with me eyebrow and reply promise", () => {
    render(<Footer />);
    expect(screen.getByText("Work with me")).toBeInTheDocument();
    expect(
      screen.getByText(/I reply within 24 hours, usually with questions\./),
    ).toBeInTheDocument();
  });

  it("has no booking link", () => {
    render(<Footer />);
    expect(screen.queryByRole("link", { name: /book/i })).toBeNull();
  });
});
