import Link from "next/link";
import { Localized as L } from "./preferences";
import { readingGuide } from "@/config/reading-guide";
import { getReadingEdition } from "@/content/reading-repository";
import { studySpines } from "@/visuals/story";
function sentences(text: string, lang: string, start: number, end?: number) {
  return [
    ...new Intl.Segmenter(lang, { granularity: "sentence" }).segment(text),
  ]
    .slice(start, end)
    .map((s) => s.segment)
    .join("")
    .trim();
}
export async function SourceGuide() {
  const items = await Promise.all(
    readingGuide.map(async (spec) => {
      const edition = await getReadingEdition(spec.report);
      const p = edition.paragraphs.find((p) => p.id === spec.anchor);
      if (!p || !p.en)
        throw new Error(`Missing reading-guide source ${spec.anchor}`);
      return { ...spec, paragraph: p };
    }),
  );
  return (
    <section className="source-guide" aria-labelledby="source-guide-title">
      <span className="eyebrow">READ THE ARGUMENT / CHECK THE SOURCE</span>
      <h2 id="source-guide-title">
        <L ko="먼저 읽을 세 대목" en="Three passages to begin with" />
      </h2>
      <p>
        <L
          ko="기업의 생존, 산업의 변화, 분석 방법을 원문에서 먼저 읽는다. 각 대목은 본문의 질문과 이어진다."
          en="Begin with the source passages on corporate survival, changing industry and analytical method. Each opens a question developed in the essay."
        />
      </p>
      <ol>
        {items.map((item) => (
          <li
            key={item.anchor}
            data-guide-source={item.anchor}
            data-reading-entry
            data-return-beat={item.scene}
            id={`guide-${item.anchor}`}
          >
            <div>
              <span className="mono">{item.report}</span>
              <h3>
                <L
                  ko={studySpines[item.report].ko}
                  en={studySpines[item.report].en}
                />
              </h3>
              <span className="source-caption">
                <L ko="저자 원문 발췌" en="Excerpt from the author" />
              </span>
            </div>
            <div>
              <blockquote>
                <L
                  ko={sentences(
                    item.paragraph.ko,
                    "ko",
                    item.sentences[0],
                    item.sentences[1],
                  )}
                  en={sentences(
                    item.paragraph.en!,
                    "en",
                    item.sentences[0],
                    item.sentences[1],
                  )}
                />
              </blockquote>
              {"caution" in item && (
                <blockquote className="source-caution">
                  <L
                    ko={sentences(item.paragraph.ko, "ko", item.caution)}
                    en={sentences(item.paragraph.en!, "en", item.caution)}
                  />
                </blockquote>
              )}
              <nav aria-label="Passage and argument">
                <Link
                  prefetch={false}
                  href={`/reports/${item.report}?from=${item.scene}#${item.anchor}`}
                >
                  <L ko="앞뒤 문맥 읽기" en="Read in context" />
                </Link>
                <a href={`/#${item.scene}`}>
                  <L ko="본문의 질문으로" en="Follow the argument" />
                </a>
              </nav>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
