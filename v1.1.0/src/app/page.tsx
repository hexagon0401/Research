import Link from "next/link";
import { Localized as L } from "@/components/preferences";
import {
  EssayExperience,
  StoryNavigation,
} from "@/components/essay-experience";
import { essay } from "@/content/essay";
import {
  storyChapters,
  emphasisScenes,
  glossaries,
  contributionLabels,
  studySpines,
} from "@/visuals/story";
import { HeroAtlas } from "@/components/hero-atlas";
import { NarrativeVisual } from "@/components/narrative-visual";
import { ChinaStory } from "@/components/motion/china-story";
import "./motion.css";
import { ResearchShelf } from "@/components/material-shelf";
import { reports } from "@/content/report-catalog";
import { getReadingEdition } from "@/content/reading-repository";
const legacy: Record<string, string[]> = {
  survival: ["corporations"],
  capability: ["world"],
  identity: ["framework"],
  "spatial-method": ["evidence"],
};
export default async function Home() {
  const ids = reports.map((report) => report.id);
  const editions = Object.fromEntries(
    await Promise.all(
      ids.map(async (id) => [id, await getReadingEdition(id)] as const),
    ),
  );
  const keywords: Record<string, string[]> = {
    survival: ["기술독점", "기술 독점"],
    identity: ["정체성", "판단"],
    capability: ["데이터", "기업"],
    "us-mission": ["팔란티어", "기업"],
    "us-dome": ["골든돔", "골든 돔"],
    "us-finance": ["테더", "스테이블"],
    "us-ships": ["존스법", "조선"],
    "china-ownership": ["지리", "텐센트"],
    "china-governance": ["국유", "중국"],
    "china-arctic": ["그린란드"],
    "china-myanmar": ["미얀마"],
    "china-cambodia": ["캄보디아"],
    "korea-chips": ["수출통제", "반도체"],
    "korea-platforms": ["라인", "LINE"],
    "korea-regulation": ["타다"],
    "korea-defense": ["방산", "PCA"],
    "spatial-method": ["위성", "스케일"],
    synthesis: ["대의", "국가"],
  };
  function target(beat: (typeof essay)[number], id: string) {
    const paragraphs = editions[id].paragraphs.filter(
      (p) => p.ko.length > 85 && !p.suppressedBy,
    );
    const term = keywords[beat.id]?.find((k) =>
      paragraphs.some((p) => p.ko.includes(k)),
    );
    const paragraph = term
      ? paragraphs.find((p) => p.ko.includes(term))
      : paragraphs[0];
    return `/reports/${id}?from=${beat.id}${paragraph ? `#${paragraph.id}` : ""}`;
  }
  const composed = essay.map((beat) => ({
    ...beat,
    targets: Object.fromEntries(
      beat.related.map((id) => [id, target(beat, id)]),
    ),
    selected: beat.passages.flatMap((spec) => {
      const matching = editions[spec.report].paragraphs.filter(
        (p) =>
          (p.sourceBlockIds.some((id) => spec.blocks.includes(id)) ||
            spec.readingIds?.includes(p.id)) &&
          p.ko.length > 85,
      );
      return (
        spec.take === undefined ? matching : matching.slice(0, spec.take)
      ).map((p) => ({ ...p, report: spec.report }));
    }),
  }));
  const koChars = composed.reduce(
    (n, b) =>
      n +
      b.intro.ko.length +
      b.bridge.ko.length +
      (b.note?.ko.length ?? 0) +
      b.selected.reduce((k, p) => k + p.ko.length, 0),
    0,
  );
  const enWords = composed.reduce(
    (n, b) =>
      n +
      [
        b.intro.en,
        b.bridge.en,
        b.note?.en ?? "",
        ...b.selected.map((p) => p.en ?? ""),
      ]
        .join(" ")
        .split(/\s+/).length,
    0,
  );
  const scenes = composed.map(
    ({ id, title, mode, country, tint, related, targets }) => ({
      id,
      title,
      mode,
      country,
      tint,
      related,
      targets,
    }),
  );
  return (
    <EssayExperience scenes={scenes}>
      <noscript>
        <style>{`.essay-beat{display:block}.beat-reading{max-width:72ch}.is-emphasis .beat-reading{max-width:none}`}</style>
      </noscript>
      <header id="question" className="essay-hero section-shell">
        <span className="eyebrow">
          <span className="signal-square" /> INTEGRATED INDEPENDENT RESEARCH /
          S00
        </span>
        <div className="essay-hero-composition">
          <h1>
            <L
              ko={
                <>
                  기업은 어떻게
                  <br />
                  <span>국가의 힘</span>이 되는가.
                </>
              }
              en={
                <>
                  When a company
                  <br />
                  becomes <span>national power.</span>
                </>
              }
            />
          </h1>
          <HeroAtlas />
        </div>
        <div className="essay-hero-bottom">
          <p>
            <L
              ko="기술과 기업의 생존에서 시작해, 정체성과 국가 전략을 거쳐, 국가–기업 관계의 재정의로 이어지는 하나의 탐구."
              en="One inquiry, from technological advantage and corporate survival through identity and national strategy to a redefinition of state–firm relations."
            />
          </p>
          <div className="essay-reading-meta">
            <span className="mono">S00 + 12 CONNECTED STUDIES</span>
            <span>
              <L
                ko={`약 ${Math.ceil(koChars / 600)}분 · 장문 연구 에세이`}
                en={`${Math.ceil(enWords / 200)} min read · long-form research essay`}
              />
            </span>
            <Link className="inline-link" href="/reports/S00" prefetch={false}>
              <L ko="통합 연구 전문 읽기 ↗" en="Read the full synthesis ↗" />
            </Link>
          </div>
        </div>
        <nav className="essay-outline" aria-label="Follow the argument">
          <a href="#survival">
            <L ko="기업의 생존" en="Survival" />
          </a>
          <span aria-hidden="true">→</span>
          <a href="#identity">
            <L ko="기술과 정체성" en="Identity" />
          </a>
          <span aria-hidden="true">→</span>
          <a href="#us-mission">
            <L ko="미국" en="America" />
          </a>
          <span aria-hidden="true">→</span>
          <a href="#china-ownership">
            <L ko="중국" en="China" />
          </a>
          <span aria-hidden="true">→</span>
          <a href="#korea-chips">
            <L ko="한국의 선택" en="Korea" />
          </a>
          <span aria-hidden="true">→</span>
          <a href="#integration">
            <L ko="하나의 연구" en="Integration" />
          </a>
        </nav>
        <p className="essay-editorial-note">
          <L
            ko="S00의 논지를 중심으로 구성한 편집 에세이입니다. 원문 발췌, 저자의 해석과 정책 제안, 확인이 필요한 사례를 구분해 읽을 수 있습니다."
            en="An editorial essay organized around S00. Source excerpts, the author's interpretations and proposals, and questions requiring verification are distinguished throughout."
          />
        </p>
      </header>
      <section className="essay-starting-question section-shell">
        <span className="eyebrow">
          S00 / <L ko="비교의 질문" en="THE COMPARATIVE QUESTION" />
        </span>
        <p>
          <L
            ko="기업의 역량은 어떤 제도를 거쳐 국가의 힘이 되고, 그 결속에는 어떤 책임이 따르는가? 미국의 조달·금융, 중국의 소유·공간 전략, 한국의 생산·규제 문제를 같은 질문으로 읽습니다."
            en="Through which institutions does corporate capability become national power, and what accountability follows? Read American procurement and finance, Chinese ownership and spatial strategy, and Korean production and regulation against that shared question."
          />
        </p>
      </section>
      <StoryNavigation />
      <div className="essay-layout section-shell">
        <article className="essay-body" aria-label="Main research narrative">
          {storyChapters.map((chapter) => (
            <section
              className="story-chapter"
              key={chapter.id}
              aria-label={chapter.title.en}
            >
              <header className="chapter-opening">
                <span className="chapter-opening-number">{chapter.number}</span>
                <span className="chapter-opening-label">
                  <L ko={chapter.title.ko} en={chapter.title.en} />
                </span>
              </header>
              {composed
                .filter((beat) => chapter.beats.includes(beat.id))
                .map((beat) => (
                  <section
                    id={beat.id}
                    key={beat.id}
                    className={`essay-beat ${emphasisScenes.has(beat.id) ? "is-emphasis" : ""}`}
                    data-essay-beat
                  >
                    <div className="beat-reading">
                      {legacy[beat.id]?.map((id) => (
                        <span
                          key={id}
                          id={id}
                          className="essay-legacy-anchor"
                        />
                      ))}
                      {beat.country && (
                        <span className="eyebrow essay-country-label">
                          {beat.country === "us"
                            ? "UNITED STATES"
                            : beat.country === "cn"
                              ? "CHINA"
                              : "SOUTH KOREA"}{" "}
                          / <L ko="사례와 메커니즘" en="CASE & MECHANISM" />
                        </span>
                      )}
                      <h2>
                        <L ko={beat.title.ko} en={beat.title.en} />
                      </h2>
                      <span className="eyebrow editorial-label">
                        <L
                          ko="사건과 쟁점 · 편집 개요"
                          en="CASE & QUESTION · EDITORIAL OVERVIEW"
                        />
                      </span>
                      <p className="essay-intro">
                        <L ko={beat.intro.ko} en={beat.intro.en} />
                      </p>
                      {beat.id === "china-arctic" && (
                        <p className="map-scope-note">
                          <L
                            ko="이 버전의 지도는 공항 제안의 참고 위치만 표시합니다. 본문에서 논의한 북극 항로와 광물 지분은 공항을 잇는 선으로 표시하지 않습니다."
                            en="This map locates the airport proposals only. Arctic routes and mining equity discussed in the text are not drawn as lines joining airports."
                          />
                        </p>
                      )}
                      {glossaries[beat.id]?.map((item) => (
                        <details className="essay-glossary" key={item.term.en}>
                          <summary>
                            <L ko={item.term.ko} en={item.term.en} /> ·{" "}
                            <L ko="뜻 살펴보기" en="Term explained" />
                          </summary>
                          <p>
                            <L
                              ko={item.definition.ko}
                              en={item.definition.en}
                            />
                          </p>
                        </details>
                      ))}
                      {beat.id === "china-arctic" ? (
                        <ChinaStory />
                      ) : (
                        emphasisScenes.has(beat.id) && (
                          <NarrativeVisual
                            scene={scenes.find(
                              (scene) => scene.id === beat.id,
                            )!}
                          />
                        )
                      )}
                      {beat.selected.length > 0 && (
                        <div className="essay-source-excerpts">
                          <span className="eyebrow">
                            <L
                              ko="원문 발췌 · 저자의 서술"
                              en="SOURCE EXCERPT · AUTHOR’S ACCOUNT"
                            />
                          </span>
                          {beat.selected.map((p, passageIndex) => (
                            <div
                              className="essay-source-passage"
                              id={`essay-${beat.id}-${p.id}`}
                              key={p.id}
                              data-reading-passage
                            >
                              <p>
                                <L
                                  ko={
                                    passageIndex < 2
                                      ? markSentence(p.ko, beat.id)
                                      : p.ko
                                  }
                                  en={
                                    p.en
                                      ? passageIndex < 2
                                        ? markSentence(p.en, beat.id)
                                        : p.en
                                      : "Editorial translation in progress."
                                  }
                                />
                              </p>
                              <Link
                                prefetch={false}
                                href={`/reports/${p.report}?from=${beat.id}#${p.id}`}
                                className="essay-citation"
                              >
                                {p.report} ·{" "}
                                <L
                                  ko="앞뒤 문맥과 함께 읽기 ↗"
                                  en="Read with its context ↗"
                                />
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                      {beat.note && (
                        <details className="essay-evidence-note">
                          <summary>
                            <L
                              ko="확인 범위 · 해석과 검증을 구분해 읽기"
                              en="Evidence scope · distinguish interpretation from verification"
                            />
                          </summary>
                          <span className="eyebrow">
                            <L
                              ko="해석과 근거의 경계"
                              en="INTERPRETATION & EVIDENCE"
                            />
                          </span>
                          <p>
                            <L ko={beat.note.ko} en={beat.note.en} />
                          </p>
                        </details>
                      )}
                      {beat.references && (
                        <details className="essay-references">
                          <summary>
                            <L
                              ko="함께 대조할 법령·기관 자료"
                              en="Legislation and institutional references"
                            />
                          </summary>
                          <p>
                            <L
                              ko="원문과 별도로 대조할 자료입니다. 아래 링크의 최신 내용과 사례별 적용은 검증 대기입니다."
                              en="References for comparison with the source. Their latest contents and application to these cases await verification."
                            />
                          </p>
                          <ul>
                            {beat.references.map((ref) => (
                              <li key={ref.url}>
                                <a
                                  href={ref.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {ref.title} ↗
                                </a>
                              </li>
                            ))}
                          </ul>
                        </details>
                      )}
                      <nav
                        className="essay-related"
                        aria-label="Read related full studies"
                      >
                        {beat.related.map((id) => (
                          <Link
                            key={id}
                            href={beat.targets[id]}
                            prefetch={false}
                          >
                            <span className="mono">{id}</span>
                            <span className="od-field">
                              <strong>
                                <L
                                  ko={studySpines[id].ko}
                                  en={studySpines[id].en}
                                />
                              </strong>
                              <span>
                                <L
                                  ko={contributionLabels[id].ko}
                                  en={contributionLabels[id].en}
                                />
                              </span>
                            </span>{" "}
                            ↗
                          </Link>
                        ))}
                      </nav>
                      <span className="eyebrow editorial-label">
                        <L
                          ko={
                            beat.id === "synthesis"
                              ? "정책 제안으로 이어지는 편집 연결"
                              : "편집 설명 · 다음 질문"
                          }
                          en={
                            beat.id === "synthesis"
                              ? "EDITORIAL CONNECTION TO POLICY PROPOSALS"
                              : "EDITORIAL CONNECTION · THE NEXT QUESTION"
                          }
                        />
                      </span>
                      <p className="essay-bridge">
                        <L ko={beat.bridge.ko} en={beat.bridge.en} />
                        <span aria-hidden="true">↓</span>
                      </p>
                    </div>
                    {!emphasisScenes.has(beat.id) && (
                      <NarrativeVisual
                        scene={scenes.find((scene) => scene.id === beat.id)!}
                      />
                    )}
                  </section>
                ))}
            </section>
          ))}
        </article>
      </div>
      <section id="integration" className="essay-integration section-shell">
        <span id="index" className="essay-legacy-anchor" />
        <span className="eyebrow">THE STUDIES / ONE CONNECTED INQUIRY</span>
        <h2>
          <L
            ko={
              <>
                여러 갈래의 탐구가,
                <br />
                하나의 줄기로.
              </>
            }
            en={
              <>
                Many lines of inquiry.
                <br />
                One connected argument.
              </>
            }
          />
        </h2>
        <p className="essay-integration-deck">
          <L
            ko="아래 연결은 연구가 공유하는 질문과 분석의 역할을 나타냅니다. 서로 다른 보고서를 같은 결과물로 합치거나, 연결 자체를 통계적 인과의 증거로 표시하지 않습니다. 각 연구는 전문과 원문을 독립적으로 확인할 수 있습니다."
            en="These connections describe shared questions and analytical roles. They do not merge distinct reports into one artifact or treat connections as proof of statistical causation. Each study retains its own full text and source document."
          />
        </p>
        <ComparativeReading />
        <ResearchShelf kind="archive" compact from="integration" />
        <Link id="archive-entry" className="essay-archive-link" href="/archive">
          <L ko="연구 아카이브 열기" en="Open the research archive" />
          <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </EssayExperience>
  );
}

function markSentence(text: string, scene: string) {
  const end = text.search(/[.!?。](?:\s|$)/);
  if (end < 0) return text;
  return (
    <>
      <a className="source-key-link" href={`#visual-${scene}`}>
        <mark className="source-key-sentence">{text.slice(0, end + 1)}</mark>
      </a>
      {text.slice(end + 1)}
    </>
  );
}
function ComparativeReading() {
  const rows = [
    {
      ko: [
        "미국",
        "조달·금융·국가 프로젝트",
        "계약과 준비자산의 경로",
        "계약 상한·집행, 보유·면책을 구분",
      ],
      en: [
        "America",
        "Procurement, finance, national projects",
        "Contracts and reserve assets",
        "Separate ceilings from spending; holdings from immunity",
      ],
      href: "#us-mission",
    },
    {
      ko: [
        "중국",
        "소유·조직·공간 전략",
        "지분과 사업 접근의 경로",
        "지분·인접성만으로 지시를 단정하지 않음",
      ],
      en: [
        "China",
        "Ownership, organizations, spatial strategy",
        "Equity and project access",
        "Equity and proximity do not establish state direction",
      ],
      href: "#china-ownership",
    },
    {
      ko: [
        "한국",
        "생산·플랫폼·규제",
        "기술과 제도 사이의 선택",
        "정책 효과와 시장·기업 요인을 분리",
      ],
      en: [
        "Korea",
        "Production, platforms, regulation",
        "Choices between technology and institutions",
        "Distinguish policy effects from market and firm factors",
      ],
      href: "#korea-chips",
    },
  ];
  return (
    <section className="comparative-reading">
      <h3>
        <L
          ko="같은 질문으로 다시 비교하기"
          en="Compare through the same question"
        />
      </h3>
      <div className="comparison-grid">
        {rows.map((row) => (
          <article key={row.href}>
            <h4>
              <a href={row.href}>
                <L ko={row.ko[0]} en={row.en[0]} /> ↑
              </a>
            </h4>
            {[1, 2, 3].map((i) => (
              <div className="od-field" key={i}>
                <span className="eyebrow">
                  <L
                    ko={["", "결속 방식", "작동 수단", "확인할 문제"][i]}
                    en={
                      ["", "CONNECTION", "INSTRUMENT", "EVIDENCE QUESTION"][i]
                    }
                  />
                </span>
                <p>
                  <L ko={row.ko[i]} en={row.en[i]} />
                </p>
              </div>
            ))}
          </article>
        ))}
      </div>
      <p className="comparison-proposal">
        <strong>
          S00 · <L ko="저자의 정책 제안" en="THE AUTHOR’S POLICY PROPOSAL" />
        </strong>
        <L
          ko="기술과 기업을 단순 보호 대상으로 보기보다, 국가와 기업의 목적·책임·협력 조건을 함께 재정의하자는 질문으로 이어집니다. 구체적 문맥과 제안의 범위는 S00 전문에서 확인합니다."
          en="The comparison leads to S00's proposal to reconsider the purposes, responsibilities and terms of cooperation between states and firms. Read S00 for the scope and context of that proposal."
        />{" "}
        <Link href="/reports/S00?from=integration" prefetch={false}>
          <L ko="S00 전문 ↗" en="Full S00 ↗" />
        </Link>
      </p>
    </section>
  );
}
