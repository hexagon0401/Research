// Uploads a locally inspected file privately. Publication is always a separate step.
import { readFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
const [file, documentId, revision, kind] = process.argv.slice(2);
if (
  !file ||
  !/^S\d{2}$/.test(documentId ?? "") ||
  !/^rev-\d{3,}$/.test(revision ?? "") ||
  !["preservation", "reader_pdf", "original"].includes(kind)
) {
  throw new Error(
    "Usage: node scripts/upload-original.mjs FILE S06 rev-001 preservation|reader_pdf|original",
  );
}
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key || !/^https:\/\/[a-z0-9]{10,40}\.supabase\.co\/?$/.test(url))
  throw new Error(
    "Set project URL and server secret securely before uploading",
  );
const size = (await stat(file)).size;
if (size === 0 || size > 20 * 1024 * 1024)
  throw new Error("Storage workflow supports nonempty files up to 20 MiB");
const bytes = await readFile(file);
const extension = file.split(".").pop()?.toLowerCase();
const mime = {
  pdf: "application/pdf",
  hwpx: "application/vnd.hancom.hwpx",
  hwp: "application/x-hwp",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}[extension];
if (!mime || (kind === "reader_pdf" && extension !== "pdf"))
  throw new Error("Unsupported report format");
if (extension === "pdf" && bytes.subarray(0, 5).toString() !== "%PDF-")
  throw new Error("Invalid PDF signature");
if (
  ["docx", "hwpx"].includes(extension) &&
  bytes.subarray(0, 2).toString() !== "PK"
)
  throw new Error("Invalid document container");
if (
  extension === "hwp" &&
  bytes.subarray(0, 8).toString("hex") !== "d0cf11e0a1b11ae1"
)
  throw new Error("Invalid HWP signature");
const bucket =
  kind === "preservation" ? "research-originals" : "research-reader";
const path = `${documentId}/${revision}/${kind === "reader_pdf" ? "reader" : "source"}.${extension}`;
const client = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const { error } = await client.storage
  .from(bucket)
  .upload(path, bytes, { contentType: mime, upsert: false });
if (error) {
  console.error("Private upload failed:", error.statusCode ?? "request error");
  process.exitCode = 1;
} else
  console.log(
    JSON.stringify(
      {
        bucket,
        objectPath: path,
        byteSize: size,
        sha256: createHash("sha256").update(bytes).digest("hex"),
        publicationState: "not-registered",
        note: "Private upload only. No publication metadata was created.",
      },
      null,
      2,
    ),
  );
