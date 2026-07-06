export const AVAILABILITY = "taking new projects";
export const AVAILABILITY_SENTENCE = AVAILABILITY.charAt(0).toUpperCase() + AVAILABILITY.slice(1);
export const EYEBROW = `Rohan Thomas · Austin, TX · ${AVAILABILITY}`;
/* The now-line keeps its own conversational register ("taking on") on purpose;
   only the eyebrow and meta description share AVAILABILITY verbatim. */
export const NOW_PHRASE = "building AI agents · taking on new projects";

export function formatLastCommit(pushedAtIso: string, now: Date): string | null {
  const pushed = new Date(pushedAtIso).getTime();
  const diffMs = now.getTime() - pushed;
  if (Number.isNaN(pushed) || diffMs < 0) return null;
  const hours = diffMs / 3_600_000;
  if (hours < 1) return "in the last hour";
  const days = hours / 24;
  if (days > 7) return null;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "always" });
  if (hours < 24) return rtf.format(-Math.round(hours), "hour");
  return rtf.format(-Math.round(days), "day");
}
