export const PROJECT_SLUGS = [
  "corporate-resilience",
  "technology-and-advantage",
  "mission-and-responsibility",
  "strategic-capability",
  "state-firm-models",
  "conditional-partnership",
];
export type AssetRow = {
  id: string;
  document_id: string;
  title: string;
  revision: string;
  kind: "reader_pdf" | "original";
  mime_type: string;
  byte_size: number;
  sha256: string;
  bucket_id: string;
  object_path: string;
  publication_state: string;
  rights_approved: boolean;
  privacy_approved: boolean;
  project_slugs: string[];
};
const MIME_TYPES = new Set([
  "application/pdf",
  "application/vnd.hancom.hwp",
  "application/x-hwp",
  "application/vnd.hancom.hwpx",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);
export function isPublicAsset(value: unknown): value is AssetRow {
  if (!value || typeof value !== "object") return false;
  const a = value as AssetRow;
  return (
    typeof a.id === "string" &&
    /^[a-zA-Z0-9_-]{1,80}$/.test(a.id) &&
    typeof a.document_id === "string" &&
    /^[A-Z][A-Z0-9-]{1,63}$/.test(a.document_id) &&
    typeof a.title === "string" &&
    a.title.length > 0 &&
    a.title.length <= 240 &&
    typeof a.revision === "string" &&
    /^rev-\d{3,}$/.test(a.revision) &&
    (a.kind === "reader_pdf" || a.kind === "original") &&
    MIME_TYPES.has(a.mime_type) &&
    (a.kind !== "reader_pdf" || a.mime_type === "application/pdf") &&
    Number.isSafeInteger(a.byte_size) &&
    a.byte_size > 0 &&
    a.byte_size <= 20 * 1024 * 1024 &&
    typeof a.sha256 === "string" &&
    /^[a-f0-9]{64}$/.test(a.sha256) &&
    a.bucket_id === "research-reader" &&
    typeof a.object_path === "string" &&
    new RegExp(
      `^${a.document_id}/${a.revision}/[a-zA-Z0-9][a-zA-Z0-9._-]{0,120}$`,
    ).test(a.object_path) &&
    a.publication_state === "published" &&
    a.rights_approved === true &&
    a.privacy_approved === true &&
    Array.isArray(a.project_slugs) &&
    a.project_slugs.length > 0 &&
    a.project_slugs.every((p) => PROJECT_SLUGS.includes(p))
  );
}
export function publicAsset(a: AssetRow) {
  return {
    id: a.id,
    documentId: a.document_id,
    title: a.title,
    revision: a.revision,
    kind: a.kind,
    mimeType: a.mime_type,
    byteSize: a.byte_size,
    sha256: a.sha256,
  };
}
export function validProjectUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const u = new URL(value);
    return u.protocol === "https:" &&
      /^[a-z0-9]{10,40}\.supabase\.co$/.test(u.hostname) &&
      !u.username &&
      !u.password &&
      !u.port &&
      u.pathname === "/" &&
      !u.search &&
      !u.hash
      ? u.origin
      : null;
  } catch {
    return null;
  }
}
export function isSignedUrl(value: string, origin: string) {
  try {
    const u = new URL(value);
    return (
      u.origin === origin &&
      u.pathname.startsWith("/storage/v1/object/sign/research-reader/") &&
      Boolean(u.searchParams.get("token"))
    );
  } catch {
    return false;
  }
}
