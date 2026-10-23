/** Approximate reference geography for explanation, never observed transport tracks. */
import { readFile, writeFile } from "node:fs/promises";
import { geoNaturalEarth1 } from "d3-geo";
import { feature } from "topojson-client";
const topo = JSON.parse(
  await readFile("node_modules/world-atlas/countries-110m.json", "utf8"),
);
const projection = geoNaturalEarth1().fitExtent(
  [
    [24, 64],
    [696, 440],
  ],
  feature(topo, topo.objects.land),
);
const coordinates = {
  cn: [103, 35],
  mm: [96, 20],
  kh: [105, 12],
  gl: [-44, 71],
  us: [-99, 38],
  kr: [128, 36],
};
const pins = Object.fromEntries(
  Object.entries(coordinates).map(([id, p]) => [id, projection(p)]),
);
await writeFile(
  "src/visuals/motion-geography.json",
  JSON.stringify(
    {
      pins,
      source:
        "Approximate reference points, Natural Earth 1:110m / world-atlas; connecting curves are explanatory relationships, not transport tracks.",
    },
    null,
    2,
  ) + "\n",
);
