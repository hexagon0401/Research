import Link from "next/link";
import { Localized as L } from "@/components/preferences";
import { EssayExperience, EssayVisual, SceneDiagram } from "@/components/essay-experience";
import { essay } from "@/content/essay";
import { reports } from "@/content/report-catalog";
import { getReadingEdition } from "@/content/reading-repository";
import { researchConnections } from "@/content/research-connections";
const legacy: Record<string,string[]> = { survival:["corporations"],capability:["world"],identity:["framework"],"spatial-method":["evidence"] };
export default async function Home(){
 const ids=[...new Set(essay.flatMap(beat=>beat.passages.map(p=>p.report)))];
 const editions=Object.fromEntries(await Promise.all(ids.map(async id=>[id,await getReadingEdition(id)] as const)));
 const composed=essay.map(beat=>({...beat,selected:beat.passages.flatMap(spec=>{
  const matching=editions[spec.report].paragraphs.filter(p=>p.sourceBlockIds.some(id=>spec.blocks.includes(id))&&p.ko.length>85);
  return (spec.take===undefined?matching:matching.slice(0,spec.take)).map(p=>({...p,report:spec.report}));
 })}));
 const koChars=composed.reduce((n,b)=>n+b.intro.ko.length+b.bridge.ko.length+(b.note?.ko.length??0)+b.selected.reduce((k,p)=>k+p.ko.length,0),0);
 const enWords=composed.reduce((n,b)=>n+[b.intro.en,b.bridge.en,b.note?.en??"",...b.selected.map(p=>p.en??"")].join(" ").split(/\s+/).length,0);
 const scenes=essay.map(({id,title,mode,country,tint,related})=>({id,title,mode,country,tint,related}));
 return <EssayExperience scenes={scenes}>
  <header id="question" className="essay-hero section-shell">
   <span className="eyebrow"><span className="signal-square"/> INTEGRATED INDEPENDENT RESEARCH / S00</span>
   <h1><L ko={<>기업은 어떻게<br /><span>국가의 힘</span>이 되는가.</>} en={<>When a company<br />becomes <span>national power.</span></>}/></h1>
   <div className="essay-hero-bottom"><p><L ko="기술과 기업의 생존에서 시작해, 정체성과 국가 전략을 거쳐, 국가–기업 관계의 재정의로 이어지는 하나의 탐구." en="One inquiry, from technological advantage and corporate survival through identity and national strategy to a redefinition of state–firm relations."/></p><div className="essay-reading-meta"><span className="mono">S00 + 12 CONNECTED STUDIES</span><span><L ko={`약 ${Math.ceil(koChars/600)}분 · 장문 연구 에세이`} en={`${Math.ceil(enWords/200)} min read · long-form research essay`}/></span><Link className="inline-link" href="/reports/S00"><L ko="통합 연구 전문 읽기 ↗" en="Read the full synthesis ↗"/></Link></div></div>
   <nav className="essay-outline" aria-label="Follow the argument"><a href="#survival"><L ko="기업의 생존" en="Survival"/></a><span aria-hidden="true">→</span><a href="#identity"><L ko="기술과 정체성" en="Identity"/></a><span aria-hidden="true">→</span><a href="#us-mission"><L ko="미국·중국" en="America & China"/></a><span aria-hidden="true">→</span><a href="#korea-chips"><L ko="한국의 선택" en="Korea"/></a><span aria-hidden="true">→</span><a href="#integration"><L ko="하나의 연구" en="Integration"/></a></nav>
   <p className="essay-editorial-note"><L ko="S00의 논지를 중심으로 구성한 편집 에세이입니다. 원문 발췌, 저자의 해석과 정책 제안, 확인이 필요한 사례를 구분해 읽을 수 있습니다." en="An editorial essay organized around S00. Source excerpts, the author's interpretations and proposals, and questions requiring verification are distinguished throughout."/></p>
  </header>
  <div className="essay-layout section-shell">
   <article className="essay-body" aria-label="Main research narrative">
    {composed.map(beat=><section id={beat.id} key={beat.id} className="essay-beat" data-essay-beat>
     {legacy[beat.id]?.map(id=><span key={id} id={id} className="essay-legacy-anchor"/>)}
     {beat.country&&<span className="eyebrow essay-country-label">{beat.country==="us"?"UNITED STATES":beat.country==="cn"?"CHINA":"SOUTH KOREA"} / <L ko="사례와 메커니즘" en="CASE & MECHANISM"/></span>}
     <h2><L ko={beat.title.ko} en={beat.title.en}/></h2>
     <p className="essay-intro"><L ko={beat.intro.ko} en={beat.intro.en}/></p>
     <figure className="essay-mobile-diagram"><SceneDiagram scene={beat} compact/><figcaption><L ko="연구의 개략 관계도 · 실제 거래·운항 항적과 구분" en="Schematic research relationships, distinct from observed transactions or vessel tracks"/></figcaption></figure>
     {beat.selected.length>0&&<div className="essay-source-excerpts"><span className="eyebrow"><L ko="논지를 따라 원문에서 읽기" en="FOLLOW THE ARGUMENT IN THE SOURCE"/></span>{beat.selected.map(p=><div className="essay-source-passage" key={p.id}><p><L ko={p.ko} en={p.en??"Editorial translation in progress."}/></p><Link href={`/reports/${p.report}#${p.id}`} className="essay-citation">{p.report} · <L ko="앞뒤 문맥과 함께 읽기 ↗" en="Read with its context ↗"/></Link></div>)}</div>}
     {beat.note&&<aside className="essay-evidence-note"><span className="eyebrow"><L ko="해석과 근거의 경계" en="INTERPRETATION & EVIDENCE"/></span><p><L ko={beat.note.ko} en={beat.note.en}/></p></aside>}
     {beat.references&&<details className="essay-references"><summary><L ko="함께 대조할 법령·기관 자료" en="Legislation and institutional references"/></summary><p><L ko="원문과 별도로 대조할 자료입니다. 아래 링크의 최신 내용과 사례별 적용은 검증 대기입니다." en="References for comparison with the source. Their latest contents and application to these cases await verification."/></p><ul>{beat.references.map(ref=><li key={ref.url}><a href={ref.url} target="_blank" rel="noopener noreferrer">{ref.title} ↗</a></li>)}</ul></details>}
     <nav className="essay-related" aria-label="Read related full studies">{beat.related.map(id=><Link key={id} href={`/reports/${id}`}><span>{id}</span><L ko="연구 전문" en="Full study"/> ↗</Link>)}</nav>
     <p className="essay-bridge"><L ko={beat.bridge.ko} en={beat.bridge.en}/><span aria-hidden="true">↓</span></p>
    </section>)}
   </article>
   <EssayVisual/>
  </div>
  <section id="integration" className="essay-integration section-shell"><span id="index" className="essay-legacy-anchor"/>
   <span className="eyebrow">THE STUDIES / ONE CONNECTED INQUIRY</span>
   <h2><L ko={<>여러 갈래의 탐구가,<br />하나의 줄기로.</>} en={<>Many lines of inquiry.<br />One connected argument.</>}/></h2>
   <p className="essay-integration-deck"><L ko="아래 연결은 연구가 공유하는 질문과 분석의 역할을 나타냅니다. 서로 다른 보고서를 같은 결과물로 합치거나, 연결 자체를 통계적 인과의 증거로 표시하지 않습니다. 각 연구는 전문과 원문을 독립적으로 확인할 수 있습니다." en="These connections describe shared questions and analytical roles. They do not merge distinct reports into one artifact or treat connections as proof of statistical causation. Each study retains its own full text and source document."/></p>
   <ol className="essay-research-network">{reports.map(report=><li key={report.id} data-research-node={report.id}><Link href={`/reports/${report.id}`}><span className="mono">{report.id}{report.id==="S00"?" / SYNTHESIS":""}</span><h3 lang="ko">{report.title}</h3><p><L ko={researchConnections[report.id].ko} en={researchConnections[report.id].en}/></p><span className="essay-network-action"><L ko="한국어·영어 전문과 PDF ↗" en="Korean / English full text & PDF ↗"/></span></Link></li>)}</ol>
   <Link id="archive-entry" className="essay-archive-link" href="/archive"><L ko="연구 아카이브 열기" en="Open the research archive"/><span aria-hidden="true">↗</span></Link>
  </section>
 </EssayExperience>;
}
