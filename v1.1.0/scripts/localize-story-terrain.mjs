// Local vector artwork from the existing Natural Earth atlas; no new geographic claims.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const atlas = JSON.parse(readFileSync("src/visuals/atlas.json", "utf8"));
mkdirSync("public/visuals", { recursive: true });
const style =
  "<style>path,circle{vector-effect:non-scaling-stroke}.grid{fill:none;stroke:#0e131f;stroke-opacity:.08;stroke-width:.8}.land{fill:#0e131f;fill-opacity:.03;stroke:#0e131f;stroke-opacity:.65;stroke-width:1}.sphere{fill:none;stroke:#0e131f;stroke-opacity:.3;stroke-width:1}</style>";
for (const kind of ["world", "globe", "arctic"]) {
  const a = atlas[kind];
  const sphere =
    kind === "globe"
      ? '<circle class="sphere" cx="360" cy="258" r="202"/>'
      : kind === "arctic"
        ? '<circle class="sphere" cx="360" cy="250" r="220"/>'
        : "";
  writeFileSync(
    `public/visuals/${kind}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 520" width="720" height="520">${style}<title>Natural Earth · ${kind}</title>${sphere}<path class="grid" d="${a.grid}"/><path class="land" d="${a.land}"/></svg>`,
  );
}
writeFileSync(
  "src/visuals/atlas-points.json",
  JSON.stringify(
    { world: { pins: atlas.world.pins }, arctic: { pins: atlas.arctic.pins } },
    null,
    2,
  ) + "\n",
);
console.log(
  "Three local SVG terrains: 720 × 520; original atlas coordinates preserved.",
);
