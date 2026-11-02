import test from "node:test";
import assert from "node:assert/strict";
import {
  fitViewport,
  screenPoint,
  relationshipCurve,
} from "../src/visuals/motion-geometry.ts";
import { readFileSync } from "node:fs";
const { pins } = JSON.parse(readFileSync("src/visuals/motion-geography.json"));
test("all scene corners share one isotropic frame including letterbox offsets", () => {
  for (const [w, h] of [
    [662, 728],
    [662, 462],
    [327, 206],
    [720, 520],
    [0, 0],
  ]) {
    const f = fitViewport(w, h),
      a = screenPoint([0, 0], f),
      b = screenPoint([720, 520], f);
    assert(a[0] >= 0 && a[1] >= 0 && b[0] <= w + 0.001 && b[1] <= h + 0.001);
    assert(Math.abs((a[0] + b[0]) / 2 - w / 2) < 0.001);
    assert(Math.abs((a[1] + b[1]) / 2 - h / 2) < 0.001);
    if (f.scale)
      assert(Math.abs((b[0] - a[0]) / 720 - (b[1] - a[1]) / 520) < 1e-9);
  }
});
test("geographic curves progress along their chord without hairpins in either direction", () => {
  for (const destination of [pins.gl, pins.mm, pins.kh])
    for (const sign of [-1, 1]) {
      const a = pins.cn,
        b = destination,
        c = relationshipCurve(a, b, sign),
        dx = b[0] - a[0],
        dy = b[1] - a[1],
        den = dx * dx + dy * dy;
      let previous = 0;
      for (let i = 0; i <= 100; i++) {
        const t = i / 100,
          x =
            (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c.control[0] + t * t * b[0],
          y =
            (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c.control[1] + t * t * b[1],
          u = ((x - a[0]) * dx + (y - a[1]) * dy) / den;
        assert(u >= previous - 1e-9);
        assert(Math.abs(u - t) < 1e-8);
        previous = u;
      }
      assert(
        Math.hypot(
          c.control[0] - (a[0] + b[0]) / 2,
          c.control[1] - (a[1] + b[1]) / 2,
        ) <= 60.001,
      );
    }
});
test("coincident reference points produce no phantom route or invalid coordinates", () => {
  const c = relationshipCurve([4, 5], [4, 5]);
  assert.equal(c.d, "");
  assert(!JSON.stringify(c).includes("NaN"));
});
