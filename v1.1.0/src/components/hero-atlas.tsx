/** Shared local vector geometry; no atlas paths are duplicated into hydration data. */
export function HeroAtlas() {
  return (
    <figure className="hero-atlas" aria-hidden="true">
      <img
        src="/visuals/globe.svg"
        width="720"
        height="520"
        alt=""
        fetchPriority="high"
        decoding="async"
      />
    </figure>
  );
}
