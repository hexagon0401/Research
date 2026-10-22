import atlas from "@/visuals/atlas.json";
// Decorative first-fold geometry is server-rendered; detailed atlas paths never enter client JS.
const concise = (path: string) =>
  path.replace(/-?\d+\.\d+/g, (value) =>
    String(Math.round(Number(value) * 10) / 10),
  );
export function HeroAtlas() {
  return (
    <figure className="hero-atlas" aria-hidden="true">
      <svg viewBox="0 0 720 520" width="720" height="520" fill="none">
        <circle cx="360" cy="258" r="202" className="geo-sphere" />
        <path d={concise(atlas.globe.grid)} className="geo-grid" />
        <path d={concise(atlas.globe.land)} className="geo-land" />
      </svg>
    </figure>
  );
}
