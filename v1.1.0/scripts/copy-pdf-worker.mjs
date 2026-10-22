import { mkdir, copyFile, readFile } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const pkg = JSON.parse(await readFile(new URL("node_modules/pdfjs-dist/package.json", root), "utf8"));
const output = new URL(`public/vendor/pdfjs/${pkg.version}/`, root);
await mkdir(output, { recursive: true });
for (const [from, to] of [["build/pdf.worker.min.mjs", "pdf.worker.min.mjs"], ["LICENSE", "LICENSE"]]) {
  await copyFile(new URL(`node_modules/pdfjs-dist/${from}`, root), new URL(to, output));
}
