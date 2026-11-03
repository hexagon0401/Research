"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Localized as L } from "./preferences";
const allowed = new Set([
  "survival",
  "identity",
  "capability",
  "us-mission",
  "us-dome",
  "us-finance",
  "us-ships",
  "china-ownership",
  "china-governance",
  "china-arctic",
  "china-myanmar",
  "china-cambodia",
  "korea-chips",
  "korea-platforms",
  "korea-regulation",
  "korea-defense",
  "spatial-method",
  "synthesis",
  "integration",
]);
export function ReadingReturn({ fallback }: { fallback: string }) {
  const [target, setTarget] = useState(fallback);
  const [quick, setQuick] = useState(false);
  useEffect(() => {
    const from = new URLSearchParams(location.search).get("from");
    if (from && allowed.has(from)) setTarget(from);
    try {
      const saved = JSON.parse(
        sessionStorage.getItem("iir-essay-return") ?? "null",
      );
      setQuick(
        sessionStorage.getItem("iir-essay-resume") === "true" &&
          saved?.mode === "quick",
      );
    } catch {}
  }, []);
  return (
    <Link
      className="inline-link"
      data-return-to-essay
      href={`/${quick ? "?mode=quick" : ""}#${target}`}
    >
      <L en="Continue the main argument ↗" ko="메인의 해당 논지로 돌아가기 ↗" />
    </Link>
  );
}
