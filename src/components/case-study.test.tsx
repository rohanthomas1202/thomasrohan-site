import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AgentForgePage from "@/app/work/agentforge-healthcare/page";
import { BOOKING_URL } from "@/lib/site";

describe("AgentForge case study", () => {
  it("renders the title, dek, and TL;DR strip", () => {
    render(<AgentForgePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "AgentForge Healthcare" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Problem")).toBeInTheDocument();
    expect(screen.getByText("Built")).toBeInTheDocument();
    expect(screen.getByText("Proof")).toBeInTheDocument();
  });

  it("renders decisions as decision → why pairs", () => {
    render(<AgentForgePage />);
    expect(screen.getByRole("heading", { name: "Decisions" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 3 }).length).toBeGreaterThanOrEqual(3);
  });

  it("demotes GitHub to a verify link and keeps the booking CTA", () => {
    render(<AgentForgePage />);
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/rohanthomas1202/agentforge-healthcare",
    );
    expect(screen.getByRole("link", { name: /book an intro call/i })).toHaveAttribute(
      "href",
      BOOKING_URL,
    );
    expect(screen.getByRole("link", { name: /rohan thomas/i })).toHaveAttribute("href", "/");
  });
});
