import { signedAsset } from "@/lib/assets-server";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 10;
const headers = {
  "Cache-Control": "private, no-store",
  "Referrer-Policy": "no-referrer",
};
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(id))
    return Response.json({ error: "File not found" }, { status: 404, headers });
  try {
    const result = await signedAsset(id);
    if (result.status === "not-found")
      return Response.json(
        { error: "File not found" },
        { status: 404, headers },
      );
    return new Response(null, {
      status: 302,
      headers: { ...headers, Location: result.url },
    });
  } catch {
    return Response.json(
      {
        error:
          "The file cannot be opened right now. Please try again from the reader.",
      },
      { status: 503, headers },
    );
  }
}
