import Link from "next/link";
import { Arrow } from "@/components/icons";
import { Localized as L } from "@/components/preferences";
import { Orbit } from "@/components/orbit";
import { Atlas } from "@/components/atlas";
import { Framework } from "@/components/framework";
import { Shelf } from "@/components/shelf";
import { ArchiveGesture } from "@/components/archive-gesture";
import { Progress } from "@/components/progress";
import { evidenceNeeds } from "@/content/repository";
function Chapter({ n, label }: { n: string; label: string }) {
  return (
    <div className="chapter-label">
      <span className="mono">{n} / 07</span>
      <span className="eyebrow">{label}</span>
      <span className="chapter-rule" />
    </div>
  );
}
export default function Home() {
  return (
    <main id="main">
      <Progress />
      <ArchiveGesture />
      <section id="question" className="hero section-shell">
        <div className="hero-eyebrow eyebrow">
          <span className="signal-square" />
          <L
            en="AN INDEPENDENT INQUIRY INTO TECHNOLOGY & THE STATE"
            ko="기술과 국가에 대한 독립적 탐구"
          />
        </div>
        <div className="hero-composition">
          <h1>
            <L
              en={
                <>
                  The architecture
                  <br />
                  of{" "}
                  <span className="power-word">
                    power<span className="title-dot">.</span>
                  </span>
                </>
              }
              ko={
                <>
                  기술과 기업,
                  <br />
                  <span className="power-word">
                    국가의 힘<span className="title-dot">.</span>
                  </span>
                </>
              }
            />
          </h1>
          <div className="hero-visual">
            <Orbit />
            <span className="hero-edition mono">
              WORKING ATLAS
              <br />
              EDITION 002 — 2026
            </span>
          </div>
        </div>
        <div className="hero-bottom">
          <div className="hero-index mono">
            RESEARCH QUESTION<span>01 — 06</span>
            <a className="archive-entry" href="#index">
              <L en="EXPLORE THE ARCHIVE →" ko="아카이브 탐색 →" />
            </a>
          </div>
          <div className="hero-summary">
            <p>
              <L
                en="How does a company's technological advantage become a nation's strategic capability?"
                ko="기업의 기술적 경쟁우위는 어떻게 국가의 전략적 역량으로 전환되는가?"
              />
            </p>
            <span>
              <L
                en="Corporate resilience. Philosophical identity. State–firm relations."
                ko="기업의 복원력. 철학적 정체성. 국가–기업 관계."
              />
            </span>
          </div>
          <a id="archive-entry" className="hero-start" href="#world">
            <span>
              <L en="Follow the inquiry" ko="탐구 따라가기" />
            </span>
            <span className="circle-arrow">↓</span>
          </a>
        </div>
        <div className="hero-footnote mono">
          <span>
            <L
              en="PLANNING PROTOTYPE · FINDINGS NOT YET VERIFIED"
              ko="기획 기반 초안 · 연구 결과 검증 전"
            />
          </span>
          <Link href="/methods">
            <L
              en="READ THE SCOPE & LIMITATIONS ↗"
              ko="연구 범위와 한계 읽기 ↗"
            />
          </Link>
        </div>
      </section>
      <section id="world" className="world-section dark-section section-shell">
        <Chapter n="02" label="THE WORLD / COMPARATIVE SCOPE" />
        <div className="section-title-row">
          <h2>
            <L
              en={
                <>
                  Power has
                  <br />a geography.
                </>
              }
              ko={
                <>
                  힘은 어디에서
                  <br />
                  만들어지는가.
                </>
              }
            />
          </h2>
          <p className="section-deck">
            <L
              en="One question, across different systems. The United States and China provide comparative lenses; South Korea frames the policy question."
              ko="하나의 질문을 서로 다른 제도에서 살핍니다. 미국과 중국은 비교 대상이며, 한국은 정책적 질문의 출발점입니다."
            />
          </p>
        </div>
        <Atlas />
        <div className="section-source">
          <span className="status-dot" />
          <L
            en="Comparative scope, not observed connections. Country markers do not represent verified events."
            ko="관측된 연결이 아닌 비교 범위입니다. 국가 표시는 검증된 사건을 의미하지 않습니다."
          />
          <Link href="/library/integration-handoff">HANDOFF-01 · §3 ↗</Link>
        </div>
      </section>
      <section id="corporations" className="section-shell corporations-section">
        <Chapter n="03" label="THE FIRM / A CHANGING ROLE" />
        <div className="two-column-intro">
          <h2>
            <L
              en={
                <>
                  Beyond
                  <br />
                  the balance sheet.
                </>
              }
              ko={
                <>
                  재무 지표
                  <br />그 너머의 질문.
                </>
              }
            />
          </h2>
          <div>
            <p className="large-copy">
              <L
                en="The inquiry begins with survival. It opens into a question of purpose—and then, of public responsibility."
                ko="기업의 생존에서 시작한 탐구는 목적에 대한 질문으로, 다시 공적 책임에 대한 질문으로 이어집니다."
              />
            </p>
            <Link className="inline-link" href="/research/corporate-resilience">
              <L
                en="Trace the research framework"
                ko="연구 프레임워크 살펴보기"
              />
              <Arrow diagonal />
            </Link>
          </div>
        </div>
        <div className="lens-list">
          {[
            {
              n: "01",
              title: "The capacity to endure",
              ko: "오래 살아남는 능력",
              tag: "TECHNOLOGY → RESILIENCE",
              body: "Can distinctive capabilities sustain reinvestment and resilience? A mechanism to test, not a causal conclusion.",
              bodyKo:
                "독자적 역량은 재투자와 복원력을 뒷받침하는가? 인과적 결론이 아닌 검증할 메커니즘입니다.",
              slug: "technology-and-advantage",
            },
            {
              n: "02",
              title: "The purpose to act",
              ko: "행동의 목적과 정체성",
              tag: "MISSION → RESPONSIBILITY",
              body: "A firm’s public mission is considered alongside contractual, legal and ethical obligations.",
              bodyKo:
                "기업의 공적 사명을 계약상·법적·윤리적 의무와 함께 검토합니다.",
              slug: "mission-and-responsibility",
            },
            {
              n: "03",
              title: "The conditions to cooperate",
              ko: "협력에 필요한 조건",
              tag: "PARTNERSHIP → ACCOUNTABILITY",
              body: "Public support is a policy question: contribution, competition safeguards and democratic oversight belong together.",
              bodyKo:
                "공적 지원은 정책적 질문입니다. 기여, 경쟁 보호, 민주적 감독을 함께 고려합니다.",
              slug: "conditional-partnership",
            },
          ].map((item) => (
            <Link
              href={`/research/${item.slug}`}
              className="lens-row"
              key={item.n}
            >
              <span className="mono">{item.n}</span>
              <div>
                <span className="eyebrow">{item.tag}</span>
                <h3>
                  <L en={item.title} ko={item.ko} />
                </h3>
              </div>
              <p>
                <L en={item.body} ko={item.bodyKo} />
              </p>
              <Arrow diagonal />
            </Link>
          ))}
        </div>
      </section>
      <section id="evidence" className="section-shell evidence-section">
        <Chapter n="04" label="THE EVIDENCE / KNOWING WHAT WE KNOW" />
        <div className="section-title-row">
          <h2>
            <L
              en={
                <>
                  Every claim.
                  <br />
                  An open question.
                </>
              }
              ko={
                <>
                  주장마다,
                  <br />
                  근거를 묻습니다.
                </>
              }
            />
          </h2>
          <div className="section-deck">
            <p>
              <L
                en="A compelling story is not a verified result. Follow the evidence, the missing materials and the limits of each proposed analysis."
                ko="설득력 있는 이야기가 검증된 결과를 뜻하지는 않습니다. 근거와 필요한 자료, 분석의 한계를 함께 살펴보세요."
              />
            </p>
            <Link className="inline-link" href="/methods">
              <L en="Evidence & methods" ko="근거와 방법론" />
              <Arrow diagonal />
            </Link>
          </div>
        </div>
        <div className="evidence-notice">
          <span className="cross-mark">＋</span>
          <div>
            <strong>
              <L
                en="No verified numeric dataset is available."
                ko="현재 검증된 수치 데이터셋은 없습니다."
              />
            </strong>
            <p>
              <L
                en="The supplied files are plans. Original reports, source tables and execution records are still required."
                ko="제공된 파일은 계획 문서입니다. 연구 원문, 원자료 표, 분석 실행 기록이 추가로 필요합니다."
              />
            </p>
          </div>
          <span className="status-badge">
            <L en="Evidence pending" ko="근거 확보 대기" />
          </span>
        </div>
        <div className="evidence-table">
          <div className="evidence-table-head mono">
            <span>REFERENCE</span>
            <span>PROPOSED ANALYSIS</span>
            <span>MATERIAL REQUIRED</span>
            <span>STATUS</span>
          </div>
          {evidenceNeeds.slice(0, 4).map((e) => (
            <Link
              href={`/methods#${e.id}`}
              className="evidence-table-row"
              key={e.id}
            >
              <span className="mono">{e.id}</span>
              <span>{e.title}</span>
              <span>{e.type}</span>
              <span>
                <span className="hollow-dot" />
                <L en="Not supplied" ko="미제공" />
                <Arrow diagonal />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section id="framework" className="section-shell framework-section">
        <Chapter
          n="05"
          label="THE FRAMEWORK / RELATIONSHIPS, NOT CERTAINTIES"
        />
        <div className="section-title-row">
          <h2>
            <L
              en={
                <>
                  From private advantage
                  <br />
                  to public capability.
                </>
              }
              ko={
                <>
                  기업의 경쟁우위에서
                  <br />
                  국가의 역량으로.
                </>
              }
            />
          </h2>
          <p className="section-deck">
            <L
              en="A proposed mechanism, with conditions. Select a node to examine its role and return to the planning source."
              ko="조건을 함께 고려하는 메커니즘 가설입니다. 노드를 선택해 역할을 살펴보고 작업계획의 원문을 확인하세요."
            />
          </p>
        </div>
        <Framework />
      </section>
      <section id="synthesis" className="section-shell synthesis-section">
        <Chapter n="06" label="THE SYNTHESIS / A CONDITIONAL PROPOSITION" />
        <div className="synthesis-layout">
          <svg
            className="synthesis-mark"
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M25 10v65h70M68 48l27 27-27 27" />
          </svg>
          <div>
            <span className="eyebrow">
              <L
                en="POLICY PROPOSAL · NOT AN ESTABLISHED FINDING"
                ko="정책 제안 · 입증된 결과 아님"
              />
            </span>
            <h2>
              <L
                en={
                  <>
                    Public purpose.
                    <br />
                    Private capability.
                    <br />
                    <span className="underlined">Shared responsibility.</span>
                  </>
                }
                ko={
                  <>
                    공적 목적.
                    <br />
                    민간의 역량.
                    <br />
                    <span className="underlined">함께 지는 책임.</span>
                  </>
                }
              />
            </h2>
            <p>
              <L
                en="What if strategic partnerships were judged not by loyalty alone, but by technological contribution, competition, human rights and accountable institutions?"
                ko="전략적 협력을 충성만이 아니라 기술적 기여, 경쟁, 인권, 책임 있는 제도로 평가한다면 어떨까요?"
              />
            </p>
            <div className="synthesis-notes">
              <div>
                <h3>
                  <L en="The proposition" ko="제안" />
                </h3>
                <p>
                  <L
                    en="Make public support conditional on measurable contribution and enforceable safeguards."
                    ko="측정 가능한 기여와 집행 가능한 보호 장치를 공적 지원의 조건으로 둡니다."
                  />
                </p>
              </div>
              <div>
                <h3>
                  <L en="The open question" ko="남은 질문" />
                </h3>
                <p>
                  <L
                    en="How can support avoid regulatory capture, market concentration and unchecked surveillance?"
                    ko="지원이 규제포획, 시장 집중, 통제되지 않는 감시로 이어지는 것을 어떻게 막을 수 있을까요?"
                  />
                </p>
              </div>
            </div>
            <Link
              className="inline-link"
              href="/research/conditional-partnership"
            >
              <L en="Read the proposal & its limits" ko="제안과 한계 읽기" />
              <Arrow diagonal />
            </Link>
          </div>
        </div>
      </section>
      <section
        id="index"
        className="section-shell dark-section archive-section"
      >
        <Chapter n="07" label="THE ARCHIVE / FOLLOW THE THREAD" />
        <div className="archive-intro">
          <h2>
            <L en="The inquiry, unfolded." ko="탐구를 펼쳐보세요." />
          </h2>
          <Link href="/archive">
            <L en="Browse the full index" ko="전체 목차 보기" />
            <Arrow diagonal />
          </Link>
        </div>
        <Shelf compact />
        <div className="archive-text-links">
          <Link href="/archive">
            <L en="Research archive ↗" ko="연구 아카이브 ↗" />
          </Link>
          <Link href="/library">
            <L en="Reference library ↗" ko="참고문헌 서가 ↗" />
          </Link>
          <Link href="/about">
            <L en="About this inquiry ↗" ko="이 탐구에 대하여 ↗" />
          </Link>
        </div>
      </section>
    </main>
  );
}
