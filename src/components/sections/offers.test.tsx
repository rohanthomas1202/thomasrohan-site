import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Offers } from "./offers";
import { offers } from "@/content/offers";
import { BOOKING_URL } from "@/lib/site";

describe("Offers", () => {
  it("renders the offers section with all three engagements", () => {
    render(<Offers />);
    expect(document.getElementById("offers")).toBeInTheDocument();
    expect(offers.length).toBe(3);
    for (const o of offers) {
      expect(screen.getByText(o.title)).toBeInTheDocument();
      expect(screen.getByText(o.timeline)).toBeInTheDocument();
      expect(screen.getByText(o.blurb)).toBeInTheDocument();
    }
  });

  it("every offer card links to the booking page", () => {
    render(<Offers />);
    const links = screen.getAllByRole("link", { name: /book an intro call/i });
    expect(links.length).toBe(3);
    for (const l of links) {
      expect(l).toHaveAttribute("href", BOOKING_URL);
      expect(l).toHaveAttribute("target", "_blank");
    }
  });

  it("states the production promise in the intro", () => {
    render(<Offers />);
    expect(
      screen.getByText(/Every engagement ends with something running in production — not a deck\./),
    ).toBeInTheDocument();
  });
});
