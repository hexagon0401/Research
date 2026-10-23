/** Native lazy loading keeps off-screen map artwork out of the initial render.
 * The fixed SVG frame preserves projection coordinates and no-JS layout. */
export function MapTerrain({
  src,
  origin = false,
  vector = false,
}: {
  src: string;
  origin?: boolean;
  vector?: boolean;
}) {
  if (vector)
    return (
      <g>
        <use href={`${src}#terrain`} />
      </g>
    );
  return (
    <foreignObject
      width="720"
      height="520"
      className={origin ? "origin-globe" : undefined}
      data-origin-globe={origin ? "" : undefined}
    >
      {/* Local SVG terrain is decorative; interactive labels remain HTML. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        width="720"
        height="520"
        loading="lazy"
        decoding="async"
        alt=""
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </foreignObject>
  );
}
