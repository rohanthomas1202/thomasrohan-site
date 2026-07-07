import { describe, it, expect } from "vitest";
import { cursorAccent } from "./cursor";

describe("cursorAccent", () => {
  it("returns the inline card accent for elements inside a project card", () => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.style.setProperty("--card-accent", "var(--pink)");
    const link = document.createElement("a");
    card.appendChild(link);
    document.body.appendChild(card);
    expect(cursorAccent(link)).toBe("var(--pink)");
    card.remove();
  });

  it("falls back to ink outside a card", () => {
    const btn = document.createElement("button");
    document.body.appendChild(btn);
    expect(cursorAccent(btn)).toBe("var(--ink)");
    btn.remove();
  });

  it("falls back to ink when a card has no inline accent", () => {
    const card = document.createElement("article");
    card.className = "project-card";
    const link = document.createElement("a");
    card.appendChild(link);
    document.body.appendChild(card);
    expect(cursorAccent(link)).toBe("var(--ink)");
    card.remove();
  });
});
