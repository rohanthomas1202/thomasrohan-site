export function cursorAccent(el: Element): string {
  const card = el.closest(".project-card") as HTMLElement | null;
  return card?.style.getPropertyValue("--card-accent") || "var(--ink)";
}
