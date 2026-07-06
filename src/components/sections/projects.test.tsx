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

  it("card titles are plain text, only the arrow button opens the project", () => {
    render(<Projects />);
    expect(screen.queryByRole("link", { name: "AgentForge Healthcare" })).toBeNull();
    const arrow = screen.getByRole("link", { name: "Open AgentForge Healthcare" });
    expect(arrow).toHaveAttribute("href", "/work/agentforge-healthcare");
    expect(arrow).not.toHaveAttribute("target");
  });

  it("adds an internal case-study link on cards that have one, keeping GitHub", () => {
    render(<Projects />);
    const caseLinks = screen.getAllByRole("link", { name: /case study/i });
    expect(caseLinks.map((a) => a.getAttribute("href"))).toEqual([
      "/work/agentforge-healthcare",
      "/work/alcohol-label-verifier",
    ]);
    for (const p of projects) {
      if (p.caseStudy) expect(screen.getAllByRole("link").map((a) => a.getAttribute("href"))).toContain(p.href);
    }
  });

  it("arrow buttons on cards without a case study open externally in a new tab", () => {
    render(<Projects />);
    const chat = screen.getByRole("link", { name: "Open ChatBridge" });
    expect(chat).toHaveAttribute("href", "https://github.com/rohanthomas1202/chatbridge");
    expect(chat).toHaveAttribute("target", "_blank");
  });

  it("renders stack tags as individual chips", () => {
    render(<Projects />);
    expect(screen.getAllByText("LangGraph").length).toBeGreaterThan(0);
    expect(screen.getByText("FHIR R4")).toBeInTheDocument();
  });

  it("packs the md 6-column grid into complete rows with no holes", () => {
    let fill = 0;
    for (const p of projects) {
      const span = p.featured || p.wide ? 3 : 2;
      // a card that would straddle the row edge wraps and leaves a hole
      expect(fill + span).toBeLessThanOrEqual(6);
      fill = (fill + span) % 6;
    }
    expect(fill).toBe(0);
  });

  it("never repeats an accent within a row or between horizontal neighbors", () => {
    let fill = 0;
    let row: string[] = [];
    for (const p of projects) {
      const span = p.featured || p.wide ? 3 : 2;
      if (fill + span > 6) {
        fill = 0;
        row = [];
      }
      expect(row).not.toContain(p.accent);
      row.push(p.accent);
      fill += span;
      if (fill === 6) {
        fill = 0;
        row = [];
      }
    }
  });

  it("gives every card its own selection accent via CSS var", () => {
    render(<Projects />);
    const cards = document.querySelectorAll(".project-card");
    expect(cards.length).toBe(projects.length);
    cards.forEach((c) => {
      expect((c as HTMLElement).style.getPropertyValue("--card-accent")).not.toBe("");
    });
  });
});
