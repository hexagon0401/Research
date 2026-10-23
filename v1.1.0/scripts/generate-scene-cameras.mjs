import { readFile, writeFile } from "node:fs/promises";
import { geoNaturalEarth1, geoPath } from "d3-geo";
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
const countries = feature(topo, topo.objects.countries).features;
const ids = {
  cn: "156",
  gl: "304",
  mm: "104",
  kh: "116",
  us: "840",
  kr: "410",
};
const regions = Object.fromEntries(
  Object.entries(ids).map(([id, iso]) => [
    id,
    geoPath(projection).bounds(countries.find((c) => String(c.id) === iso)),
  ]),
);
await writeFile(
  "src/visuals/scene-camera.json",
  JSON.stringify(
    {
      source:
        "Natural Earth 1:110m / world-atlas, projected with the existing world map",
      regions,
      outlines: Object.fromEntries(
        Object.entries(ids).map(([id, iso]) => [
          id,
          geoPath(projection)(countries.find((c) => String(c.id) === iso)),
        ]),
      ),
    },
    null,
    2,
  ) + "\n",
);
