import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./about";
import { roles } from "@/content/experience";

describe("About (Track record)", () => {
  it("renders the section with the consulting-framed intro", () => {
    render(<About />);
    expect(document.getElementById("about")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Track record" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/AI products for domains where wrong answers cost money/),
    ).toBeInTheDocument();
  });

  it("renders one row per role with its headline metric", () => {
    render(<About />);
    for (const r of roles) {
      expect(screen.getByText(r.company)).toBeInTheDocument();
      expect(screen.getByText(r.headline.metric)).toBeInTheDocument();
      expect(screen.getByText(r.headline.label)).toBeInTheDocument();
    }
  });

  it("renders outcome label and period on each row", () => {
    render(<About />);
    for (const r of roles) {
      expect(screen.getByText(`${r.label} · ${r.period}`)).toBeInTheDocument();
    }
  });

  it("renders up to two highlights per role (regression: highlights were dead data)", () => {
    render(<About />);
    for (const r of roles) {
      for (const h of r.highlights.slice(0, 2)) {
        expect(screen.getByText(new RegExp(h.text.slice(0, 40).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))).toBeInTheDocument();
      }
    }
  });
});
