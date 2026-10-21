import "server-only";
import { createClient } from "@supabase/supabase-js";
import {
  isPublicAsset,
  publicAsset,
  validProjectUrl,
  isSignedUrl,
} from "./assets-policy";
const COLUMNS =
  "id,document_id,title,revision,kind,mime_type,byte_size,sha256,bucket_id,object_path,publication_state,rights_approved,privacy_approved,project_slugs";
function connection() {
  const url = validProjectUrl(process.env.SUPABASE_URL);
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return {
    url,
    client: createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            cache: "no-store",
            signal: AbortSignal.timeout(5000),
          }),
      },
    }),
  };
}
export async function listAssets(project: string) {
  const c = connection();
  if (!c) return { status: "not-configured" as const, assets: [] };
  const { data, error } = await c.client
    .from("research_assets")
    .select(COLUMNS)
    .eq("publication_state", "published")
    .eq("rights_approved", true)
    .eq("privacy_approved", true)
    .contains("project_slugs", [project])
    .order("document_id")
    .limit(40);
  if (error) throw new Error("ASSETS_UNAVAILABLE");
  return {
    status: "available" as const,
    assets: (data ?? []).filter(isPublicAsset).map(publicAsset),
  };
}
export async function signedAsset(id: string) {
  const c = connection();
  if (!c) return { status: "not-configured" as const };
  const { data, error } = await c.client
    .from("research_assets")
    .select(COLUMNS)
    .eq("id", id)
    .eq("publication_state", "published")
    .eq("rights_approved", true)
    .eq("privacy_approved", true)
    .maybeSingle();
  if (error) throw new Error("ASSETS_UNAVAILABLE");
  if (!isPublicAsset(data)) return { status: "not-found" as const };
  const { data: link, error: signError } = await c.client.storage
    .from("research-reader")
    .createSignedUrl(data.object_path, 300);
  if (signError || !link?.signedUrl || !isSignedUrl(link.signedUrl, c.url))
    throw new Error("SIGNING_UNAVAILABLE");
  return { status: "available" as const, url: link.signedUrl };
}
