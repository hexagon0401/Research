/** Reuse the local SVG as vector geometry without copying paths into page or client data. */
export function HeroAtlas() {
  return (
    <figure className="hero-atlas" aria-hidden="true">
      <svg viewBox="0 0 720 520" width="720" height="520">
        <use href="/visuals/globe.svg#terrain" />
      </svg>
    </figure>
  );
}
