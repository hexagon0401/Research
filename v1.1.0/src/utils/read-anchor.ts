/** Invalid percent encoding must not replace the readable site with a client error. */
export function readAnchor(hash: string): string {
  try {
    return decodeURIComponent(hash.replace(/^#/, ""));
  } catch {
    return "";
  }
}
