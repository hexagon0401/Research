import {
  fitViewport,
  screenPoint,
  type Frame,
} from "@/visuals/motion-geometry";
import { cameraPoint, type Camera } from "@/visuals/camera";
export const identityCamera: Camera = { x: 0, y: 0, scale: 1 };
export function positionOverlay(
  label: HTMLElement,
  point: readonly number[],
  frame: Frame,
) {
  label.dataset.canvasX = String(point[0]);
  label.dataset.canvasY = String(point[1]);
  const [x, y] = screenPoint(point, frame);
  label.style.left = `${x}px`;
  label.style.top = `${y}px`;
  label.hidden = x < 8 || x > frame.width - 8 || y < 8 || y > frame.height - 8;
}
export function frameMarkers(root: HTMLElement, frame: Frame) {
  root
    .querySelectorAll<SVGCircleElement>("[data-radius-px]")
    .forEach((circle) => {
      const camera = Number(
        circle.closest<SVGGElement>("[data-camera-scale]")?.dataset
          .cameraScale ?? 1,
      );
      circle.setAttribute(
        "r",
        String(
          Number(circle.dataset.radiusPx) /
            Math.max(0.0001, frame.scale * camera),
        ),
      );
    });
}
/** Resize-only work, also used on frozen dialog copies. */
export function alignFrozenFrame(root: HTMLElement) {
  const frame = fitViewport(root.clientWidth, root.clientHeight);
  root
    .querySelectorAll<HTMLElement>("[data-canvas-x]")
    .forEach((label) =>
      positionOverlay(
        label,
        [Number(label.dataset.canvasX), Number(label.dataset.canvasY)],
        frame,
      ),
    );
  frameMarkers(root, frame);
  return frame;
}
export function bindDiagramFrame(root: HTMLElement) {
  let frame = fitViewport(root.clientWidth, root.clientHeight),
    camera = { ...identityCamera },
    previous = "";
  const labels = Array.from(
    root.querySelectorAll<HTMLElement>("[data-anchor-x]"),
  ).map((el) => ({
    el,
    point: [Number(el.dataset.anchorX), Number(el.dataset.anchorY)],
  }));
  const circles = Array.from(
    root.querySelectorAll<SVGCircleElement>("[data-radius-px]"),
  );
  const group = root.querySelector<SVGGElement>("[data-chip-camera]");
  const draw = (next: Camera = camera) => {
    camera = next;
    const key = [
      camera.x,
      camera.y,
      camera.scale,
      frame.scale,
      frame.x,
      frame.y,
    ].join("|");
    if (key === previous) return;
    previous = key;
    if (group) group.dataset.cameraScale = String(camera.scale);
    labels.forEach(({ el, point }) =>
      positionOverlay(el, cameraPoint(point, camera), frame),
    );
    circles.forEach((circle) =>
      circle.setAttribute(
        "r",
        String(
          Number(circle.dataset.radiusPx) /
            Math.max(0.0001, frame.scale * camera.scale),
        ),
      ),
    );
    if (root.dataset.frameReady !== "true") root.dataset.frameReady = "true";
  };
  const measure = () => {
    frame = fitViewport(root.clientWidth, root.clientHeight);
    previous = "";
    draw();
  };
  const observer = new ResizeObserver(measure);
  observer.observe(root);
  measure();
  return { draw, dispose: () => observer.disconnect() };
}
/** The same scalable drawing mask is used for routes and analytical connections. */
export function bindDrawPath(path: SVGPathElement) {
  const mask =
    path.parentElement!.querySelector<SVGPathElement>("[data-draw-mask]");
  let previous = -1;
  return (value: number) => {
    const u = Math.max(0, Math.min(1, value));
    if (u === previous) return;
    previous = u;
    if (mask) mask.style.strokeDashoffset = String(1 - u);
    path.dataset.drawProgress = String(u);
  };
}
/** Arc length and node references are cached once. Moving dots stay in path-local coordinates. */
export function bindTraveler(path: SVGPathElement, dot: SVGCircleElement) {
  const length = path.getTotalLength();
  const draw = bindDrawPath(path);
  let previous = -1;
  dot.setAttribute("vector-effect", "non-scaling-stroke");
  dot.removeAttribute("transform");
  dot.style.removeProperty("transform");
  return (value: number) => {
    const u = Math.max(0, Math.min(1, value));
    if (u === previous) return;
    previous = u;
    draw(u);
    const p = path.getPointAtLength(length * u);
    dot.setAttribute("cx", String(p.x));
    dot.setAttribute("cy", String(p.y));
    dot.style.visibility =
      length > 1e-6 && u > 0 && u < 1 ? "visible" : "hidden";
  };
}
