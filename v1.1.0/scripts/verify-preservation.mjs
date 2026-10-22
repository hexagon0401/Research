import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
const base = "a8f5575884c35233d5da6a8bc55436d36b886d04";
const locked = [
  "src/content",
  "src/app/api",
  "src/lib",
  "supabase",
  "public/report-pdfs",
  "public/report-media",
  "src/components/pdf-reader.tsx",
];
const changed = execFileSync(
  "git",
  ["diff", "--name-only", base, "--", ...locked],
  { encoding: "utf8" },
).trim();
if (changed)
  throw new Error(`Locked source/backend assets changed: ${changed}`);
const catalog = JSON.parse(
  readFileSync("src/content/reports/catalog.json", "utf8"),
);
let hashes = 0;
for (const report of catalog) {
  if (!report.readerUrl?.startsWith("/report-pdfs/")) continue;
  const path = `public${report.readerUrl}`;
  const hash = createHash("sha256").update(readFileSync(path)).digest("hex");
  if (hash !== report.readerSha256)
    throw new Error(`PDF mismatch ${report.id}`);
  hashes++;
}
if (hashes !== 13) throw new Error(`Expected 13 PDFs, got ${hashes}`);
console.log(
  `Baseline ${base.slice(0, 7)}: research, translations, paragraph IDs, APIs, backend and media unchanged; ${hashes} catalog PDF hashes match.`,
);
