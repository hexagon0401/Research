/** The single 720×520 coordinate space shared by maps, labels and paths. */
export const SCENE_WIDTH = 720;
export const SCENE_HEIGHT = 520;
export type Point = readonly number[];
export type Frame = {
  scale: number;
  x: number;
  y: number;
  width: number;
  height: number;
};
export function fitViewport(width: number, height: number): Frame {
  const scale = Math.max(
    0,
    Math.min(width / SCENE_WIDTH, height / SCENE_HEIGHT),
  );
  return {
    scale,
    x: (width - SCENE_WIDTH * scale) / 2,
    y: (height - SCENE_HEIGHT * scale) / 2,
    width,
    height,
  };
}
export function screenPoint(point: Point, frame: Frame) {
  return [frame.x + point[0] * frame.scale, frame.y + point[1] * frame.scale];
}
export function relationshipCurve(a: Point, b: Point, side = 1) {
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    length = Math.hypot(dx, dy);
  if (length < 1e-6) return { d: "", points: [a, b], control: [...a] };
  // A quadratic's midpoint bows by half its control offset. Short country
  // relationships need a minimum bow, while tiny/coincident edges stay bounded.
  const bend =
    Math.min(60, length * 0.8, Math.max(24, length * 0.36)) *
    Math.sign(side || 1);
  const control = [
    (a[0] + b[0]) / 2 - (dy / length) * bend,
    (a[1] + b[1]) / 2 + (dx / length) * bend,
  ];
  return {
    d: `M${a[0]} ${a[1]}Q${control[0]} ${control[1]} ${b[0]} ${b[1]}`,
    points: [a, control, b],
    control,
  };
}
