"use client";
let pending:
  | Promise<{
      gsap: typeof import("gsap").gsap;
      ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
    }>
  | undefined;
/** Main-page-only engine. A failed import leaves the readable static storyboard. */
export function loadMotion() {
  return (pending ??= Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("gsap/MotionPathPlugin"),
  ])
    .then(([{ gsap }, { ScrollTrigger }, { MotionPathPlugin }]) => {
      gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
      gsap.config({ autoSleep: 12 });
      ScrollTrigger.config({ ignoreMobileResize: true });
      return { gsap, ScrollTrigger };
    })
    .catch((error) => {
      pending = undefined;
      throw error;
    }));
}
export function nearScene(element: HTMLElement, run: () => void) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        run();
      }
    },
    { rootMargin: "1400px" },
  );
  observer.observe(element);
  return () => observer.disconnect();
}
export const clamp = (n: number) => Math.max(0, Math.min(1, n));

/** Pin only while the complete stage fits, including resize within a media query. */
export function watchViewportFit(
  element: HTMLElement,
  clearance: number,
  apply: (fits: boolean) => void,
) {
  let previous: boolean | undefined;
  let frame = 0;
  const check = () => {
    frame = 0;
    const fits = element.offsetHeight <= innerHeight - clearance;
    if (fits !== previous) {
      previous = fits;
      apply(fits);
    }
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(check);
  };
  const observer = new ResizeObserver(schedule);
  observer.observe(element);
  window.addEventListener("resize", schedule, { passive: true });
  check();
  return () => {
    observer.disconnect();
    window.removeEventListener("resize", schedule);
    cancelAnimationFrame(frame);
    if (previous) apply(false);
  };
}
