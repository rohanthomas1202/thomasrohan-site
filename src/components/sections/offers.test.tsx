import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Offers } from "./offers";
import { offers } from "@/content/offers";

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

  it("contains no links at all", () => {
    render(<Offers />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
  });

  it("states the production promise in the intro", () => {
    render(<Offers />);
    expect(
      screen.getByText(/Every engagement ends with something running in production\./),
    ).toBeInTheDocument();
  });
});
