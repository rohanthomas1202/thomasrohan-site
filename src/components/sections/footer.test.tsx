import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./footer";
import { BOOKING_URL } from "@/lib/site";

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

  it("offers a booking link as the email alternative", () => {
    render(<Footer />);
    const book = screen.getByRole("link", { name: /book a 30-minute intro call/i });
    expect(book).toHaveAttribute("href", BOOKING_URL);
    expect(book).toHaveAttribute("target", "_blank");
  });
});
