"use client";
import { useEffect, useRef, useState } from "react";
import { prepare, measureNaturalWidth, setLocale } from "@chenglou/pretext";
import atlas from "@/visuals/atlas-points.json";
import { storyVisuals } from "@/visuals/story";
import {
  fitCamera,
  placeLabels,
  type PlacedLabel,
} from "@/visuals/label-layout";
import type { SceneMeta } from "./essay-experience";
import { usePreferences } from "./preferences";
const names: Record<string, { ko: string; en: string }> = {
  us: { ko: "미국", en: "United States" },
  cn: { ko: "중국", en: "China" },
  kr: { ko: "한국", en: "Korea" },
  mm: { ko: "미얀마", en: "Myanmar" },
  kh: { ko: "캄보디아", en: "Cambodia" },
  nuuk: { ko: "누크", en: "Nuuk" },
  ilulissat: { ko: "일루리사트", en: "Ilulissat" },
  qaqortoq: { ko: "카코르톡", en: "Qaqortoq" },
};
export function worldPins(scene: SceneMeta) {
  if (scene.id === "china-myanmar") return ["cn", "mm"];
  if (scene.id === "china-cambodia") return ["cn", "kh"];
  if (scene.id === "korea-chips") return ["us", "cn", "kr"];
  return scene.country ? [scene.country] : ["us", "cn", "kr"];
}
export function SceneDiagram({
  scene,
  compact = false,
  detail = false,
  onSelect,
}: {
  scene: SceneMeta;
  compact?: boolean;
  detail?: boolean;
  onSelect?: (id: string) => void;
}) {
  const { lang } = usePreferences();
  const visual = storyVisuals[scene.id];
  const stage = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<{
    width: number;
    height: number;
    labels: PlacedLabel[];
  } | null>(null);
  const geographic = visual.type === "world" || visual.type === "arctic";
  const raw =
    visual.type === "arctic"
      ? Object.entries(atlas.arctic.pins)
      : worldPins(scene).map(
          (id) =>
            [
              id,
              atlas.world.pins[id as keyof typeof atlas.world.pins],
            ] as const,
        );
  const cam =
    visual.type === "world"
      ? fitCamera(
          raw.map(([, p]) => p),
          scene.id === "korea-chips" ? 1 : 3.4,
        )
      : detail
        ? fitCamera(
            raw.map(([, p]) => p),
            4.8,
          )
        : { scale: 1, x: 0, y: 0 };
  useEffect(() => {
    const el = stage.current;
    if (!el || !geographic) return;
    let alive = true;
    const measure = () => {
      if (!alive) return;
      const width = el.clientWidth,
        height = (width * 520) / 720;
      if (!width) return;
      const style = getComputedStyle(el),
        font = `500 14px ${style.fontFamily}`;
      setLocale(lang);
      const points = raw.map(([id, p]) => ({
        id,
        x: ((p[0] * cam.scale + cam.x) * width) / 720,
        y: ((p[1] * cam.scale + cam.y) * width) / 720,
        text: names[id]?.[lang] ?? id,
      }));
      setGeometry({
        width,
        height,
        labels: placeLabels(points, width, height, (text) =>
          measureNaturalWidth(prepare(text, font)),
        ),
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();
    document.fonts.ready.then(measure);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      alive = false;
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", measure);
    };
    // Reprepare on locale, font completion and size changes; never during scroll.
  }, [scene.id, lang, detail, geographic]);
  return (
    <div
      className={`scene-stage ${compact ? "compact" : ""}`}
      data-scene-diagram={scene.id}
      ref={stage}
    >
      <div className="terrain-viewport">
        {/* The complete frame remains local and lazy; only the geographic viewport zooms. */}
        <img
          className={`essay-scene-diagram scene-terrain terrain-${visual.type}`}
          key={`${scene.id}-${detail}`}
          src={`/visuals/${visual.type}.svg`}
          width="720"
          height="520"
          loading="lazy"
          decoding="async"
          alt={visual.heading[lang]}
          style={
            geographic
              ? {
                  transform: `translate(${(cam.x / 720) * 100}%, ${(cam.y / 520) * 100}%) scale(${cam.scale})`,
                  transformOrigin: "0 0",
                }
              : undefined
          }
        />
      </div>
      {geographic && geometry && (
        <>
          <svg
            className="map-annotation-lines"
            viewBox={`0 0 ${geometry.width} ${geometry.height}`}
            width={geometry.width}
            height={geometry.height}
            aria-hidden="true"
          >
            {geometry.labels.map((p) => (
              <g key={p.id}>
                <path
                  className="map-leader"
                  fill="none"
                  d={`M${p.x} ${p.y}L${p.left + p.width / 2} ${p.top + p.height / 2}`}
                />
                <circle className="map-point" cx={p.x} cy={p.y} r="4" />
              </g>
            ))}
          </svg>
          <div className="map-label-layer">
            {geometry.labels.map((p) => (
              <button
                key={p.id}
                className="map-label"
                style={{ left: p.left, top: p.top, width: p.width }}
                onClick={() => onSelect?.(p.id)}
                aria-label={p.numbered ? `${p.number} · ${p.text}` : p.text}
                disabled={!onSelect}
              >
                {p.numbered ? p.number : p.text}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
export function GeographicLegend({ scene }: { scene: SceneMeta }) {
  const { lang } = usePreferences();
  const visual = storyVisuals[scene.id];
  const ids =
    visual.type === "arctic"
      ? Object.keys(atlas.arctic.pins)
      : visual.type === "world"
        ? worldPins(scene)
        : [];
  if (!ids.length) return null;
  return (
    <ol className="map-html-legend">
      {ids.map((id, i) => (
        <li key={id}>
          <span className="mono">{i + 1}</span> {names[id]?.[lang] ?? id}
        </li>
      ))}
    </ol>
  );
}
