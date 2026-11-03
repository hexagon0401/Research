import { ImageResponse } from "next/og";
import { reports } from "@/content/report-catalog";
export const alt = "IIR / S00 — Thirteen connected studies";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function ShareImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        padding: "64px",
        background: "#f0f0ea",
        color: "#0e131f",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 24,
        }}
      >
        <span>INTEGRATED INDEPENDENT RESEARCH</span>
        <span>IIR / S00</span>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 76,
          lineHeight: 1.05,
          letterSpacing: "-3px",
          maxWidth: 960,
        }}
      >
        How does corporate capability become national power?
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderTop: "2px solid #0e131f",
          paddingTop: 24,
          fontSize: 24,
        }}
      >
        <span>Daniel Yu</span>
        <span>{reports.length} studies. One inquiry.</span>
      </div>
    </div>,
    size,
  );
}
