"use client";
import { usePreferences } from "../preferences";
import type { Copy } from "@/visuals/motion-stories";
export type SceneTextData = {
  lead: Copy;
  facts: Copy[];
  connection: Copy;
  detail?: Copy;
};
export function SceneText({
  text,
  connection = true,
}: {
  text: SceneTextData;
  connection?: boolean;
}) {
  const { lang } = usePreferences();
  return (
    <>
      <p className="scene-lead">{text.lead[lang]}</p>
      <ul className="scene-facts">
        {text.facts.map((fact, i) => (
          <li key={i}>{fact[lang]}</li>
        ))}
      </ul>
      {connection && (
        <p className="scene-connection">{text.connection[lang]}</p>
      )}
      {text.detail && (
        <details className="scene-detail">
          <summary>{lang === "ko" ? "자세히 읽기" : "Read more"}</summary>
          <p>{text.detail[lang]}</p>
        </details>
      )}
    </>
  );
}
