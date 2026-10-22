/** Build-time geometry only. No tracking routes or new research observations. */
import { readFile, writeFile } from "node:fs/promises";
import {
  geoPath,
  geoNaturalEarth1,
  geoOrthographic,
  geoAzimuthalEquidistant,
  geoGraticule10,
} from "d3-geo";
import { feature } from "topojson-client";
const root = new URL("../", import.meta.url);
const topo = JSON.parse(
  await readFile(
    new URL("node_modules/world-atlas/countries-110m.json", root),
    "utf8",
  ),
);
const land = feature(topo, topo.objects.land);
const countries = feature(topo, topo.objects.countries).features;
const world = geoNaturalEarth1().fitExtent(
  [
    [24, 64],
    [696, 440],
  ],
  land,
);
const globe = geoOrthographic()
  .rotate([-30, -15])
  .scale(202)
  .translate([360, 258])
  .clipAngle(90);
const polar = geoAzimuthalEquidistant()
  .rotate([0, -90])
  .clipAngle(42)
  .scale(300)
  .translate([360, 250]);
const coords = {
  us: [-99, 38],
  cn: [103, 35],
  kr: [128, 36],
  mm: [96, 20],
  kh: [105, 12],
};
const ids = { us: "840", cn: "156", kr: "410", mm: "104", kh: "116" };
const shape = (projection) => ({
  land: geoPath(projection)(land),
  grid: geoPath(projection)(geoGraticule10()),
});
const data = {
  viewBox: [0, 0, 720, 520],
  world: {
    ...shape(world),
    countries: Object.fromEntries(
      Object.entries(ids).map(([key, id]) => [
        key,
        geoPath(world)(countries.find((c) => c.id === id)),
      ]),
    ),
    pins: Object.fromEntries(
      Object.entries(coords).map(([key, p]) => [key, world(p)]),
    ),
  },
  globe: shape(globe),
  arctic: {
    ...shape(polar),
    pins: Object.fromEntries(
      Object.entries({
        nuuk: [-51.7, 64.18],
        ilulissat: [-51.1, 69.22],
        qaqortoq: [-46.03, 60.72],
      }).map(([key, p]) => [key, polar(p)]),
    ),
  },
  source:
    "Natural Earth 1:110m via world-atlas 2.0.2. Approximate country and place reference locations; no observed events, shipment tracks or causal links.",
};
await writeFile(
  new URL("src/visuals/atlas.json", root),
  JSON.stringify(data) + "\n",
);
console.log(
  "Generated world, globe and Arctic reference geometry (720 × 520).",
);
