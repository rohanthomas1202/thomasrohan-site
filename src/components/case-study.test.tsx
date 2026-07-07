import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// The real Link needs the ViewTransitions provider + app router; jsdom gets a plain anchor.
vi.mock("next-view-transitions", () => ({
  Link: ({ children, ...props }: React.ComponentProps<"a">) => <a {...props}>{children}</a>,
}));

import AgentForgePage from "@/app/work/agentforge-healthcare/page";
import LabelVerifierPage from "@/app/work/alcohol-label-verifier/page";

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

  it("renders a reading-progress bar tinted with the page accent", () => {
    render(<AgentForgePage />);
    const bar = document.querySelector(".reading-progress") as HTMLElement;
    expect(bar).toBeInTheDocument();
    expect(bar.getAttribute("style")).toContain("var(--blue)");
    expect(bar).toHaveAttribute("aria-hidden");
  });

  it("names the h1 for the view-transition morph from the home card", () => {
    render(<AgentForgePage />);
    const h1 = screen.getByRole("heading", { level: 1, name: "AgentForge Healthcare" });
    expect(h1.style.viewTransitionName).toBe("cs-agentforge-healthcare");
  });

  it("keeps GitHub as a verify link and the back-home link, with no booking CTA", () => {
    render(<AgentForgePage />);
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/rohanthomas1202/agentforge-healthcare",
    );
    expect(screen.queryByRole("link", { name: /book/i })).toBeNull();
    expect(screen.getByRole("link", { name: /rohan thomas/i })).toHaveAttribute("href", "/");
  });
});

describe("Label Verifier case study", () => {
  it("renders title, live demo, and GitHub links with no booking CTA", () => {
    render(<LabelVerifierPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Alcohol Label Verifier" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /live demo/i })).toHaveAttribute(
      "href",
      "https://alcohol-label-verifier-two.vercel.app",
    );
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/rohanthomas1202/Alcohol-Label-Verifier",
    );
    expect(screen.queryByRole("link", { name: /book/i })).toBeNull();
  });

  it("frames the build honestly as a proof of concept", () => {
    render(<LabelVerifierPage />);
    expect(screen.getByText(/proof of concept/i)).toBeInTheDocument();
  });
});
