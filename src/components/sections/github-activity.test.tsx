import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CommitList } from "./github-activity";
import type { RecentCommit } from "@/lib/github";

const NOW = new Date("2026-07-05T12:00:00Z");
const COMMITS: RecentCommit[] = [
  {
    repo: "truthlayer",
    message: "feat: verify claims",
    url: "https://github.com/rohanthomas1202/truthlayer/commit/ddd444",
    iso: "2026-07-05T11:00:00Z",
  },
  {
    repo: "website",
    message: "feat: hero polish",
    url: "https://github.com/rohanthomas1202/website/commit/bbb222",
    iso: "2026-07-04T12:00:00Z",
  },
];

describe("CommitList", () => {
  it("renders repo names, messages, and relative times", () => {
    render(<CommitList commits={COMMITS} now={NOW} />);
    expect(screen.getByText("truthlayer")).toBeInTheDocument();
    expect(screen.getByText("feat: verify claims")).toBeInTheDocument();
    expect(screen.getByText("1 h ago")).toBeInTheDocument();
    expect(screen.getByText("website")).toBeInTheDocument();
    expect(screen.getByText("1 d ago")).toBeInTheDocument();
  });

  it("links each row to its commit in a new tab", () => {
    render(<CommitList commits={COMMITS} now={NOW} />);
    const row = screen.getByRole("link", { name: /feat: hero polish/ });
    expect(row).toHaveAttribute("href", "https://github.com/rohanthomas1202/website/commit/bbb222");
    expect(row).toHaveAttribute("target", "_blank");
    expect(row).toHaveAttribute("rel", "noreferrer");
  });

  it("renders the label and the profile link", () => {
    render(<CommitList commits={COMMITS} now={NOW} />);
    expect(screen.getByText("Recently shipped")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /@rohanthomas1202/ })).toHaveAttribute(
      "href",
      "https://github.com/rohanthomas1202",
    );
  });

  it("renders nothing with no commits", () => {
    const { container } = render(<CommitList commits={[]} now={NOW} />);
    expect(container).toBeEmptyDOMElement();
  });
});
