export const NOW_PHRASE = "building AI agents and this site";

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
