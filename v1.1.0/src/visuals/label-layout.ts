/** Screen-pixel label geometry: terrain never owns label or marker scaling. */
export type Point = { id: string; x: number; y: number; text: string };
export type PlacedLabel = Point & {
  left: number;
  top: number;
  width: number;
  height: number;
  numbered: boolean;
  number: number;
};
export function fitCamera(
  points: readonly (readonly number[])[],
  maxScale = 3.4,
) {
  const xs = points.map((p) => p[0]),
    ys = points.map((p) => p[1]);
  const left = Math.min(...xs),
    right = Math.max(...xs),
    top = Math.min(...ys),
    bottom = Math.max(...ys);
  const scale = Math.min(
    maxScale,
    440 / Math.max(100, right - left),
    280 / Math.max(80, bottom - top),
  );
  return {
    scale,
    x: 360 - ((left + right) / 2) * scale,
    y: 250 - ((top + bottom) / 2) * scale,
  };
}
export function placeLabels(
  points: Point[],
  width: number,
  height: number,
  measure: (text: string) => number,
): PlacedLabel[] {
  const placed: PlacedLabel[] = [];
  const gap = 8,
    h = 44,
    edge = 8;
  for (const [index, point] of points.entries()) {
    const w = Math.ceil(measure(point.text)) + 24;
    const candidates = [
      [point.x + 20, point.y - h - 12],
      [point.x - w - 20, point.y - h - 12],
      [point.x + 20, point.y + 12],
      [point.x - w - 20, point.y + 12],
      [edge, 16 + index * 60],
      [width - w - edge, 16 + index * 60],
    ];
    const fits = (x: number, y: number, bw: number) =>
      x >= edge &&
      y >= edge &&
      x + bw <= width - edge &&
      y + h <= height - edge &&
      placed.every(
        (p) =>
          x + bw + gap <= p.left ||
          p.left + p.width + gap <= x ||
          y + h + gap <= p.top ||
          p.top + p.height + gap <= y,
      ) &&
      points.every(
        (p) =>
          p.x < x - 8 || p.x > x + bw + 8 || p.y < y - 8 || p.y > y + h + 8,
      );
    let position =
      width >= 420 ? candidates.find(([x, y]) => fits(x, y, w)) : undefined;
    const numbered = !position;
    const boxWidth = numbered ? 44 : w;
    if (!position) {
      // Compact view: numbered labels on a reserved rail, full names in the HTML legend.
      const y = Math.min(height - h - edge, 16 + index * 56);
      position = [edge, y];
    }
    placed.push({
      ...point,
      left: position[0],
      top: position[1],
      width: boxWidth,
      height: h,
      numbered,
      number: index + 1,
    });
  }
  return placed;
}
