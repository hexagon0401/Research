import Link from "next/link";
import { Arrow } from "./icons";
import { Localized as L } from "./preferences";
import { figureCallouts } from "@/config/figure-callouts";
import { getReadingEdition } from "@/content/reading-repository";
/** Source-attributed figures. Rendering fails if an edited edition no longer matches. */
export async function FigureCallout({ scene }: { scene: string }) {
  const item = figureCallouts.find((candidate) => candidate.scene === scene);
  if (!item) return null;
  const edition = await getReadingEdition(item.report);
  const paragraph = edition.paragraphs.find((p) => p.id === item.anchor)!;
  for (const lang of ["ko", "en"] as const)
    for (const field of ["figure", "caption", "context"] as const)
      if (!paragraph[lang]?.includes(item[field][lang]))
        throw new Error(
          `Callout does not match ${item.anchor}/${lang}/${field}`,
        );
  return (
    <aside
      className="source-figure"
      data-figure-source={item.anchor}
      data-reading-entry
      data-return-beat={scene}
      id={`figure-${item.anchor}`}
    >
      <span className="source-caption">
        <L ko="저자 원문에 제시된 수치" en="Figure reported in the source" />
      </span>
      <p className="source-figure-value">
        <L ko={item.figure.ko} en={item.figure.en} />
      </p>
      <p>
        <L ko={item.caption.ko} en={item.caption.en} />
      </p>
      <blockquote className="source-figure-context">
        <span className="source-caption">
          <L
            ko={item.report === "S16" ? "해석의 범위" : "원문 맥락"}
            en={item.report === "S16" ? "Limit" : "Source context"}
          />
        </span>
        <p>
          <L ko={item.context.ko} en={item.context.en} />
        </p>
      </blockquote>
      <Link
        prefetch={false}
        className="essay-citation"
        href={`/reports/${item.report}?from=${scene}#${item.anchor}`}
      >
        {item.report} · <L ko="앞뒤 문맥 읽기" en="Read in context" />{" "}
        <Arrow diagonal />
      </Link>
    </aside>
  );
}
