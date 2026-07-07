import type { Project } from "@/content/projects";

/* Mirrors the md 6-column packing (featured/wide span 3, others 2) so entrance
   delays can cascade left-to-right within each row. */
export function columnPosition(index: number, projects: Project[]): number {
  let fill = 0;
  let position = 0;
  for (let i = 0; i <= index; i++) {
    const span = projects[i].featured || projects[i].wide ? 3 : 2;
    if (fill + span > 6) {
      fill = 0;
      position = 0;
    }
    if (i === index) break;
    fill += span;
    position += 1;
    if (fill === 6) {
      fill = 0;
      position = 0;
    }
  }
  return position;
}
