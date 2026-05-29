/** nx/ny are normalized pointer position in [-0.5, 0.5]. */
export function depthTransform(depth: number, nx: number, ny: number, scrollY: number) {
  return {
    x: (-nx * depth) || 0,
    y: (-ny * depth - scrollY * depth * 0.012) || 0,
  };
}
