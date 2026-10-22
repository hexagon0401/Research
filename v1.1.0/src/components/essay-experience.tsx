"use client";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import type { EssayBeat } from "@/content/essay";
import points from "@/content/essay-map-points.json";
import { researchConnections } from "@/content/research-connections";
import { usePreferences } from "./preferences";
export type SceneMeta = Pick<EssayBeat, "id" | "title" | "mode" | "country" | "tint" | "related"> & { targets?: Record<string,string> };
const Context = createContext<{ scene: SceneMeta | null }>({ scene: null });
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const countries = [{ id: "us", target: "us-mission", name: "United States", ko: "미국" }, { id: "cn", target: "china-ownership", name: "China", ko: "중국" }, { id: "kr", target: "korea-chips", name: "South Korea", ko: "한국" }];

export function EssayExperience({ scenes, children }: { scenes: SceneMeta[]; children: React.ReactNode }) {
 const root = useRef<HTMLElement>(null);
 const [active, setActive] = useState(0);
 const { lang, reduced } = usePreferences();
 const lastLang = useRef(lang);
 const read = useRef<{ id: string; fraction: number; started: boolean }>({ id: scenes[0].id, fraction: 0, started: false });
 useLayoutEffect(() => {
  if (lastLang.current !== lang && read.current.started) {
   const element = document.getElementById(read.current.id);
   if (element) { const rect = element.getBoundingClientRect(); window.scrollTo({ top: rect.top + scrollY + rect.height * read.current.fraction - innerHeight * .35, behavior: "instant" }); }
  }
  lastLang.current = lang;
 }, [lang]);
 useEffect(() => {
  const element = root.current; if (!element) return;
  const beats = [...element.querySelectorAll<HTMLElement>("[data-essay-beat]")];
  let frame = 0, alive = true, dirty = true, previous = -1;
  let positions: { top: number; height: number }[] = [];
  let maximum = 1, viewport = innerHeight;
  let pointer: { x: number; y: number } | null = null;
  const stage = element.querySelector<HTMLElement>(".essay-visual");
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  element.dataset.enhanced = "true";
  function paint() {
   frame = 0; if (!alive || document.hidden) return;
   const y = scrollY;
   if (dirty) {
    viewport = innerHeight;
    positions = beats.map((beat) => { const rect = beat.getBoundingClientRect(); return { top: rect.top + y, height: rect.height }; });
    maximum = Math.max(1, element!.offsetTop + element!.offsetHeight - viewport);
    dirty = false;
   }
   const axis = y + viewport * .35;
   let index = 0;
   positions.forEach((p,i) => { if (p.top <= axis) index = i; });
   const pos = positions[index]; if (!pos) return;
   const fraction = clamp((axis - pos.top) / Math.max(1,pos.height));
   const progress = clamp(y / maximum);
   const blend = clamp((axis - pos.top) / Math.max(1,Math.min(pos.height,viewport * .8)));
   const current = scenes[index], preceding = scenes[Math.max(0,index-1)];
   const rgb = reduced ? [230,232,230] : current.tint.map((value,i) => Math.round(preceding.tint[i] + (value-preceding.tint[i])*blend));
   const box = pointer && stage ? stage.getBoundingClientRect() : null;
   read.current = { id: current.id, fraction, started: axis >= positions[0].top };
   // All layout reads precede style writes. No idle requestAnimationFrame loop.
   element!.style.setProperty("--essay-rgb",rgb.join(" "));
   element!.style.setProperty("--reading-progress",String(progress));
   element!.style.setProperty("--beat-progress",String(reduced ? 1 : fraction));
   for (const mode of ["concept", "world", "arctic", "integration"]) {
    const weight = current.mode === preceding.mode ? Number(mode === current.mode) : (mode === current.mode ? (reduced ? 1 : blend) : mode === preceding.mode ? (reduced ? 0 : 1-blend) : 0);
    element!.style.setProperty(`--mode-${mode}`,String(weight));
   }
   element!.dataset.scene = current.id;
   element!.dataset.motion = reduced ? "reduced" : "full";
   if (box && pointer && stage && !reduced && fine.matches) {
    stage.style.setProperty("--pointer-x",`${(clamp((pointer.x-box.left)/box.width)-.5)*10}px`);
    stage.style.setProperty("--pointer-y",`${(clamp((pointer.y-box.top)/box.height)-.5)*10}px`);
   }
   if (previous !== index) { previous = index; setActive(index); }
  }
  function schedule() { if (!frame && alive && !document.hidden) frame=requestAnimationFrame(paint); }
  function invalidate() { dirty=true; schedule(); }
  function move(event: PointerEvent) { pointer={x:event.clientX,y:event.clientY}; schedule(); }
  function leave() { pointer=null; stage?.style.setProperty("--pointer-x","0px"); stage?.style.setProperty("--pointer-y","0px"); }
  const observer = new ResizeObserver(invalidate); observer.observe(element); beats.forEach((beat)=>observer.observe(beat));
  window.addEventListener("scroll",schedule,{passive:true});window.addEventListener("resize",invalidate,{passive:true});window.addEventListener("pageshow",invalidate);document.addEventListener("visibilitychange",schedule);
  stage?.addEventListener("pointermove",move,{passive:true});stage?.addEventListener("pointerleave",leave);
  document.fonts.ready.then(()=>{if(alive)invalidate();});schedule();
  return ()=>{alive=false;cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener("scroll",schedule);window.removeEventListener("resize",invalidate);window.removeEventListener("pageshow",invalidate);document.removeEventListener("visibilitychange",schedule);stage?.removeEventListener("pointermove",move);stage?.removeEventListener("pointerleave",leave);leave();};
 },[scenes,lang,reduced]);
 useEffect(()=>{const scene=new URLSearchParams(location.search).get("scene");if(scene && !location.hash)document.getElementById(scene)?.scrollIntoView({behavior:"instant"});},[]);
 return <Context.Provider value={{scene:scenes[active]}}><main id="main" className="research-essay" ref={root}><div className="essay-progress" aria-hidden="true"/>{children}</main></Context.Provider>;
}
function Concept({ integration=false }: { integration?:boolean }) {
 const ids=Object.keys(researchConnections).filter(id=>id!=="S00");
 return <g className="essay-concept" fill="none" stroke="currentColor" strokeWidth="1.4">
  <path className="essay-drawn-line" pathLength="1" d="M50 200H145C210 200 210 95 280 95S350 200 415 200H550"/>
  <circle cx="145" cy="200" r="35"/><circle cx="280" cy="95" r="35"/><circle cx="415" cy="200" r="35"/>
  <path d="M145 235V285H415V235M280 130V285" strokeDasharray="3 6"/>
  <g stroke="none" fill="#e6e8e6" fontSize="12" textAnchor="middle"><text x="145" y="204">FIRM</text><text x="280" y="99">IDENTITY</text><text x="415" y="204">STATE</text><text x="280" y="315">TECHNOLOGY → CAPABILITY</text></g>
  {integration && <g className="essay-tree">{ids.map((id,i)=><g key={id}><path d={`M145 200C250 200 260 ${28+i*28} 430 ${28+i*28}`} strokeWidth=".8"/><circle cx="430" cy={28+i*28} r="3"/><text x="445" y={32+i*28} fill="#e6e8e6" stroke="none" fontSize="11">{id}</text></g>)}<circle cx="145" cy="200" r="45" fill="#0e131f"/><text x="145" y="205" textAnchor="middle" fill="#0efb2e" stroke="none" fontSize="20">S00</text></g>}
 </g>;
}
export function SceneDiagram({ scene, compact=false, preview }: { scene: SceneMeta; compact?:boolean; preview?:string|null }) {
 const { lang }=usePreferences();
 const country=preview??scene.country;
 const isArctic=scene.mode==="arctic";
 const labels:Record<string,string>={"us-mission":"PALANTIR / ANDURIL · MISSION & PROCUREMENT","us-dome":"GOLDEN DOME · SENSING / DATA / INTERCEPTION","us-finance":"TETHER / USDT · DOLLAR RESERVES","us-ships":"JONES ACT · COASTWISE TRADE & CAPACITY","china-ownership":"GEELY / MERCEDES-BENZ / TENCENT","china-governance":"OWNERSHIP / ORGANIZATION / DECISIONS","china-myanmar":"AVIC / NORINCO · REPORTED SUPPLY RELATIONSHIP","china-cambodia":"CANOPY SANDS / REAM · SPATIAL RELATIONSHIP","korea-chips":"SAMSUNG / SK HYNIX · EXPORT CONTROLS","korea-platforms":"NAVER / LINE · OWNERSHIP & JURISDICTION","korea-regulation":"TADA / COUPANG / KAKAO · REGULATORY EFFECTS","korea-defense":"HANWHA / LIG NEX1 · STRATEGY & PERFORMANCE","spatial-method":"SATELLITE / AIS / ONTOLOGY · OBSERVATION & INFERENCE"};
 return <svg className={`essay-scene-diagram ${compact?"compact":""}`} viewBox={isArctic?"0 0 600 600":"0 0 600 400"} width="600" height={isArctic?600:400} role="img" aria-label={lang==="ko"?scene.title.ko:scene.title.en}>
  {scene.mode==="concept"||scene.mode==="integration"?<Concept integration={scene.mode==="integration"}/>:isArctic?<>
   <image href="/essay-maps/arctic.svg" width="600" height="600"/>
   {Object.entries(points.arcticPins).filter(([id])=>id!=="kvanefjeld").map(([id,p],i)=><g key={id} transform={`translate(${p[0]} ${p[1]})`}><circle r="5" stroke="currentColor" fill="#0e131f"/><path d={`M-7 0H${-45-i*20}`} stroke="currentColor"/><text x={-50-i*20} y="4" textAnchor="end" fill="#e6e8e6" fontSize="12">{id.toUpperCase()}</text></g>)}
   <text x="300" y="285" textAnchor="middle" fill="#e6e8e6" fontSize="11">NORTH POLE</text>
   <text x="375" y="90" fill="#aebdae" fontSize="10">ILLUSTRATIVE SEA ROUTE</text>
  </>:<>
   <image href="/essay-maps/world.svg" y="15" width="600" height="340"/>
   {Object.entries(points.pins).map(([id,p])=><g key={id} transform={`translate(${p[0]} ${p[1]+15})`} className={country===id?"essay-map-pin active":"essay-map-pin"}><circle r={country===id?12:5}/><path d="M-19 0h8m22 0h8M0-19v8m0 22v8"/><text x={id==="kr"?18:-18} y="-16" textAnchor={id==="kr"?"start":"end"}>{id.toUpperCase()}</text></g>)}
   {(scene.id==="china-myanmar"||scene.id==="china-cambodia")&&<path d={`M${points.pins.cn[0]} ${points.pins.cn[1]+15}L${points.pins[scene.id==="china-myanmar"?"mm":"kh"][0]} ${points.pins[scene.id==="china-myanmar"?"mm":"kh"][1]+15}`} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6"/>}
   {labels[scene.id]&&<text x="30" y="352" fill="#0efb2e" fontSize="10">{labels[scene.id]}</text>}
   <text x="30" y="382" fill="#aebdae" fontSize="10">COUNTRY REFERENCES · NOT OBSERVED SHIPMENT TRACKS</text>
  </>}
 </svg>;
}
export function EssayVisual(){
 const {scene}=useContext(Context);const {lang}=usePreferences();const [preview,setPreview]=useState<string|null>(null);const [focused,setFocused]=useState<string|null>(null);
 if(!scene)return null;
 const displayed=focused?researchConnections[focused]:null;
 return <aside className="essay-visual" aria-label={lang==="ko"?"연결된 연구 지도":"Connected research diagram"}>
  <div className="essay-visual-kicker"><span className="signal-square"/> ONE CONNECTED INQUIRY</div>
  <div className="essay-visual-geometry" role="img" aria-label={lang==="ko"?scene.title.ko:scene.title.en}>{(["concept","world","arctic","integration"] as const).map(mode=><div key={mode} className={`essay-visual-layer mode-${mode}`} aria-hidden="true"><SceneDiagram scene={{...scene,mode}} preview={preview}/></div>)}</div>
  <p className="essay-visual-title">{lang==="ko"?scene.title.ko:scene.title.en}</p>
  <nav className="essay-country-nav" aria-label="Country comparisons">{countries.map(c=><a key={c.id} href={`#${c.target}`} aria-current={scene.country===c.id?"location":undefined} onPointerEnter={()=>setPreview(c.id)} onPointerLeave={()=>setPreview(null)} onFocus={()=>setPreview(c.id)} onBlur={()=>setPreview(null)}>{lang==="ko"?c.ko:c.name}</a>)}</nav>
  <div className="essay-visual-sources"><span>{lang==="ko"?"연결되는 원문":"READ THE CONNECTION"}</span><div>{scene.related.map(id=><Link key={id} href={scene.targets?.[id]??`/reports/${id}`} onFocus={()=>setFocused(id)} onBlur={()=>setFocused(null)} onPointerEnter={()=>setFocused(id)} onPointerLeave={()=>setFocused(null)}>{id} ↗</Link>)}</div><p>{displayed?(lang==="ko"?displayed.ko:displayed.en):(lang==="ko"?"연구를 선택하면 사이트 안에서 한·영 전문과 PDF를 읽을 수 있습니다.":"Open a study to read its Korean and English full text and PDF here.")}</p></div>
 </aside>;
}
