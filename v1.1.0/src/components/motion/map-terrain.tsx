"use client";
import { useEffect, useRef, useState } from "react";
/** Server/no-JS uses a native-lazy image; near figures upgrade to vector strokes. */
export function MapTerrain({
  src,
  vector = false,
}: {
  src: string;
  vector?: boolean;
}) {
  const group = useRef<SVGGElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (!vector || near) return;
    // Observe the fixed SVG frame; an unloaded <use> has no measurable bounds.
    const frame = group.current?.closest("svg");
    if (!frame) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        setNear(true);
      },
      { rootMargin: "1000px" },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [vector, near]);
  const image = (
    <foreignObject width="720" height="520">
      {/* Local decorative terrain shares the existing projection and fixed frame. */}
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
  return vector ? (
    <g ref={group} data-terrain={near ? "vector" : "lazy-image"}>
      {near ? <use href={`${src}#terrain`} /> : image}
    </g>
  ) : (
    image
  );
}
