export type Camera = { x: number; y: number; scale: number };
export type Bounds = number[][];
/** Fit actual projected bounds; padding is in the shared 720 x 520 SVG frame. */
export function fitCamera(bounds: Bounds, padding = 56, maximum = 24): Camera {
  const [[x0, y0], [x1, y1]] = bounds;
  const scale = Math.min(
    maximum,
    (720 - padding * 2) / Math.max(1, x1 - x0),
    (520 - padding * 2) / Math.max(1, y1 - y0),
  );
  return {
    x: 360 - ((x0 + x1) * scale) / 2,
    y: 260 - ((y0 + y1) * scale) / 2,
    scale,
  };
}
export function pointsBounds(points: number[][], margin = 0): Bounds {
  return [
    [
      Math.min(...points.map((p) => p[0])) - margin,
      Math.min(...points.map((p) => p[1])) - margin,
    ],
    [
      Math.max(...points.map((p) => p[0])) + margin,
      Math.max(...points.map((p) => p[1])) + margin,
    ],
  ];
}
export function cameraPoint(point: number[], camera: Camera): number[] {
  return [
    point[0] * camera.scale + camera.x,
    point[1] * camera.scale + camera.y,
  ];
}
