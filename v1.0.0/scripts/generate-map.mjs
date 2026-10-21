import { readFileSync, writeFileSync } from "node:fs";
import { feature, mesh } from "topojson-client";
import { geoNaturalEarth1, geoPath, geoGraticule10 } from "d3-geo";
const world = JSON.parse(
  readFileSync("node_modules/world-atlas/countries-110m.json", "utf8"),
);
const projection = geoNaturalEarth1().fitExtent(
  [
    [12, 12],
    [948, 478],
  ],
  { type: "Sphere" },
);
const path = geoPath(projection).digits(1);
const land = feature(world, world.objects.land);
const countries = feature(world, world.objects.countries);
const pins = [
  { id: "us", coords: [-99, 38] },
  { id: "cn", coords: [103, 35] },
  { id: "kr", coords: [128, 36] },
].map((p) => ({ ...p, point: projection(p.coords) }));
writeFileSync(
  "src/content/map.json",
  JSON.stringify({
    land: path(land),
    borders: path(mesh(world, world.objects.countries, (a, b) => a !== b)),
    graticule: path(geoGraticule10()),
    countries: countries.features
      .filter((f) => ["840", "156", "410"].includes(f.id))
      .map((f) => ({ id: f.id, path: path(f) })),
    pins,
    source:
      "Natural Earth, via world-atlas 2.0.2 / countries-110m. Public domain. Country markers are approximate geographic label positions, not events or facilities.",
  }),
);
console.log("Generated simplified vector atlas; no runtime map dependency.");
