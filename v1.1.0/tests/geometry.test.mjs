import test from "node:test";
import assert from "node:assert/strict";
import { fitCamera, placeLabels } from "../src/visuals/label-layout.ts";
test("camera includes both countries instead of centring on China", () => {
  const points = [
    [565, 180],
    [540, 230],
  ];
  const c = fitCamera(points);
  for (const p of points) {
    assert.ok(p[0] * c.scale + c.x > 80 && p[0] * c.scale + c.x < 640);
    assert.ok(p[1] * c.scale + c.y > 60 && p[1] * c.scale + c.y < 440);
  }
  assert.notEqual(points[0][0] * c.scale + c.x, 360);
});
test("measured labels have no overlapping boxes and stay inside the viewport", () => {
  const points = [
    { id: "a", x: 220, y: 140, text: "China" },
    { id: "b", x: 232, y: 160, text: "Myanmar" },
    { id: "c", x: 225, y: 190, text: "Cambodia" },
  ];
  for (const width of [280, 320, 390, 440, 720]) {
    const labels = placeLabels(
      points.map((p) => ({
        ...p,
        x: (p.x * width) / 440,
        y: (p.y * width) / 440,
      })),
      width,
      (width * 520) / 720,
      (t) => t.length * 9,
    );
    for (const a of labels) {
      assert.ok(a.left >= 0 && a.left + a.width <= width);
      assert.ok(a.top >= 0 && a.top + a.height <= (width * 520) / 720);
      for (const b of labels) {
        if (a.id === b.id) continue;
        assert.ok(
          a.left + a.width <= b.left ||
            b.left + b.width <= a.left ||
            a.top + a.height <= b.top ||
            b.top + b.height <= a.top,
        );
      }
    }
    if (width < 420) assert.ok(labels.every((p) => p.numbered));
  }
});
