import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/report-pdfs/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=604800, immutable" },
          { key: "Content-Disposition", value: "inline" },
        ],
      },
      {
        source: "/report-media/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};
export default config;
