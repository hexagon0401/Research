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
