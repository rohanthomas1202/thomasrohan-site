import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Projects } from "./projects";
import { projects } from "@/content/projects";

describe("Projects", () => {
  it("renders a work section with all project titles", () => {
    render(<Projects />);
    expect(document.getElementById("work")).toBeInTheDocument();
    for (const p of projects) {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    }
  });

  it("links every project to GitHub, and live demos where present", () => {
    render(<Projects />);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    for (const p of projects) {
      expect(hrefs).toContain(p.href);
      if (p.live) expect(hrefs).toContain(p.live);
    }
  });

  it("makes the whole card clickable via a stretched title link", () => {
    render(<Projects />);
    const title = screen.getByRole("link", { name: /AgentForge Healthcare/ });
    expect(title).toHaveAttribute("href", "https://github.com/rohanthomas1202/agentforge-healthcare");
  });

  it("renders stack tags as individual chips", () => {
    render(<Projects />);
    expect(screen.getAllByText("LangGraph").length).toBeGreaterThan(0);
    expect(screen.getByText("FHIR R4")).toBeInTheDocument();
  });
});
