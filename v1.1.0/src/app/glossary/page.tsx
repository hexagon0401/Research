import type { Metadata } from "next";
import Link from "next/link";
import { Localized as L } from "@/components/preferences";
import { glossaries } from "@/visuals/story";
export const metadata: Metadata = { title: "Glossary" };
export default function Glossary() {
  return (
    <main id="main" className="editorial">
      <header className="page-intro">
        <span className="eyebrow">IIR / GLOSSARY</span>
        <h1>
          <L ko="용어 찾아보기" en="Glossary" />
        </h1>
        <p>
          <L
            ko="메인 연구의 용어 설명을 한곳에서 찾아보고, 해당 사례로 돌아가 읽을 수 있습니다."
            en="Find the main essay’s existing term definitions here, then return to each case to read them in context."
          />
        </p>
      </header>
      <div className="page-content glossary-index">
        {Object.entries(glossaries).flatMap(([beat, terms]) =>
          terms.map((entry, i) => (
            <section key={beat + i} aria-labelledby={`term-${beat}-${i}`}>
              <h2 id={`term-${beat}-${i}`}>
                <L ko={entry.term.ko} en={entry.term.en} />
              </h2>
              <p>
                <L ko={entry.definition.ko} en={entry.definition.en} />
              </p>
              <Link className="inline-link" href={`/#${beat}`}>
                <L ko="사례에서 읽기 →" en="Read in context →" />
              </Link>
            </section>
          )),
        )}
      </div>
      <section
        className="glossary-index page-content"
        aria-labelledby="term-rule-of-40"
      >
        <h2 id="term-rule-of-40">Ro40 / Rule of 40</h2>
        <p>
          <L
            ko="S06에서 사용한 정의: 매출 성장률 + 영업이익률."
            en="As defined in S06: revenue growth rate + operating margin."
          />
        </p>
        <Link
          className="inline-link"
          href="/reports/S06?from=glossary#S06-R001-P004"
        >
          <L
            ko="지표 정의를 원문에서 읽기 →"
            en="Read the source definition →"
          />
        </Link>
      </section>
    </main>
  );
}
