/** The text label stays unchanged; this icon is entirely decorative. */
export function UnequalMark() {
  return (
    <svg
      className="unequal-mark"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
    >
      <path d="M5 9H19M5 15H19" />
      <path className="unequal-slash" d="M8 20L16 4" pathLength="1" />
    </svg>
  );
}
