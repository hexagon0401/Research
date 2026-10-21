import { test } from "node:test";
import assert from "node:assert/strict";
import {
  isPublicAsset,
  publicAsset,
  isSignedUrl,
  validProjectUrl,
} from "../src/lib/assets-policy.ts";
const asset = {
  id: "S06-reader-001",
  document_id: "S06",
  title: "Reviewed report",
  revision: "rev-001",
  kind: "reader_pdf",
  mime_type: "application/pdf",
  byte_size: 100,
  sha256: "a".repeat(64),
  bucket_id: "research-reader",
  object_path: "S06/rev-001/reader.pdf",
  publication_state: "published",
  rights_approved: true,
  privacy_approved: true,
  project_slugs: ["corporate-resilience"],
};
test("only explicitly approved published reader assets are deliverable", () => {
  assert(isPublicAsset(asset));
  for (const change of [
    { publication_state: "draft" },
    { publication_state: "withdrawn" },
    { rights_approved: false },
    { privacy_approved: false },
    { bucket_id: "research-originals" },
    { kind: "unknown" },
    { byte_size: 21 * 1024 * 1024 },
    { mime_type: "text/html" },
    { kind: "reader_pdf", mime_type: "application/x-hwp" },
  ])
    assert(!isPublicAsset({ ...asset, ...change }), JSON.stringify(change));
  assert(!isPublicAsset(null));
  assert(!isPublicAsset({}));
});
test("file paths cannot escape their document and revision or refer to arbitrary objects", () => {
  for (const path of [
    "../reader.pdf",
    "S06/rev-001/../../secret.pdf",
    "S00/rev-001/reader.pdf",
    "S06/rev-002/reader.pdf",
    "https://evil.example/file",
    "S06/rev-001/.env",
  ])
    assert(!isPublicAsset({ ...asset, object_path: path }), path);
  assert(!isPublicAsset({ ...asset, document_id: "S06.*" }));
  assert(!isPublicAsset({ ...asset, project_slugs: ["unknown"] }));
  assert(!isPublicAsset({ ...asset, sha256: "invalid" }));
});
test("public metadata omits storage paths and approval internals", () => {
  const result = publicAsset(asset);
  assert.equal(result.id, asset.id);
  for (const field of [
    "bucket_id",
    "object_path",
    "rights_approved",
    "privacy_approved",
    "publication_state",
  ])
    assert(!(field in result));
});
test("project URL and signed link must stay on the configured Supabase project", () => {
  const origin = "https://lchnlpnlfsgzisctefon.supabase.co";
  assert.equal(validProjectUrl(origin), origin);
  for (const url of [
    undefined,
    "http://lchnlpnlfsgzisctefon.supabase.co",
    "https://evil.example",
    "https://a@lchnlpnlfsgzisctefon.supabase.co",
    "https://lchnlpnlfsgzisctefon.supabase.co/other",
    "https://lchnlpnlfsgzisctefon.supabase.co.evil.example",
  ])
    assert.equal(validProjectUrl(url), null);
  assert(
    isSignedUrl(
      origin +
        "/storage/v1/object/sign/research-reader/S06/rev-001/reader.pdf?token=test",
      origin,
    ),
  );
  assert(
    !isSignedUrl(
      "https://evil.example/storage/v1/object/sign/research-reader/file?token=test",
      origin,
    ),
  );
  assert(
    !isSignedUrl(
      origin + "/storage/v1/object/sign/research-originals/file?token=test",
      origin,
    ),
  );
  assert(
    !isSignedUrl(
      origin + "/storage/v1/object/sign/research-reader/file",
      origin,
    ),
  );
});
