import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./about";
import { roles } from "@/content/experience";

describe("About", () => {
  it("renders the about section with the intro paragraph", () => {
    render(<About />);
    expect(document.getElementById("about")).toBeInTheDocument();
    expect(screen.getByText(/I'm Rohan — a full-stack engineer in Austin, TX\./)).toBeInTheDocument();
  });

  it("renders one compressed row per role with its headline metric", () => {
    render(<About />);
    for (const r of roles) {
      expect(screen.getByText(r.company)).toBeInTheDocument();
      expect(screen.getByText(r.headline.metric)).toBeInTheDocument();
      expect(screen.getByText(r.headline.label)).toBeInTheDocument();
    }
  });

  it("renders role and period on each row", () => {
    render(<About />);
    for (const r of roles) {
      expect(screen.getByText(`${r.role} · ${r.period}`)).toBeInTheDocument();
    }
  });
});
