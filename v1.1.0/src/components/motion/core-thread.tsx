/** Six stops already present in the reading path. Decorative: navigation supplies the labels. */
export function CoreThread() {
  return (
    <div className="core-thread" aria-hidden="true">
      <svg
        viewBox="0 0 600 18"
        width="600"
        height="18"
        preserveAspectRatio="none"
      >
        <path className="core-thread-track" d="M8 9H592" />
        <path className="core-thread-progress" d="M8 9H592" pathLength="1" />
      </svg>
      {[8, 125, 242, 359, 476, 592].map((x) => (
        <span className="thread-node" key={x} style={{ left: `${x / 6}%` }} />
      ))}
    </div>
  );
}
