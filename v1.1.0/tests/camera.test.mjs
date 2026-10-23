import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fitCamera, cameraPoint, pointsBounds } from "../src/visuals/camera.ts";
const { regions } = JSON.parse(
  readFileSync("src/visuals/scene-camera.json", "utf8"),
);
test("every target region fits inside the padded common projection", () => {
  for (const region of Object.values(regions)) {
    const camera = fitCamera(region, 56);
    const a = cameraPoint(region[0], camera),
      b = cameraPoint(region[1], camera);
    assert(a[0] >= 55.99 && a[1] >= 55.99);
    assert(b[0] <= 664.01 && b[1] <= 464.01);
  }
});
test("Cambodia is enlarged from its own extent and point transforms remain aligned", () => {
  const c = fitCamera(regions.kh, 100);
  assert(c.scale > 10);
  const [[x, y], [a, b]] = regions.kh;
  const p = cameraPoint([(x + a) / 2, (y + b) / 2], c);
  assert(Math.abs(p[0] - 360) < 0.0001 && Math.abs(p[1] - 260) < 0.0001);
  assert.deepEqual(
    pointsBounds(
      [
        [2, 3],
        [7, 9],
      ],
      1,
    ),
    [
      [1, 2],
      [8, 10],
    ],
  );
});
