type Rect = { left: number; top: number; width: number; height: number };
export function magneticOffset(px: number, py: number, rect: Rect, strength = 0.4) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return { x: (px - cx) * strength, y: (py - cy) * strength };
}
