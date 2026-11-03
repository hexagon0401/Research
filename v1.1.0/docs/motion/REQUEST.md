# Motion Addendum.md

## Emphasis inventory, tool decisions, and non-text visual elements for "IIR — The Architecture of Power"

> 한국어 요약: `Motion Plan.md`의 보충 문서입니다. (A) 강조할 단어·문구·수치 목록(사이트에 실제로 있는 문장만), (B) 어떤 도구를 쓸지(기본은 라이브러리 없이 CSS와 브라우저 기본 기능), 쓴다면 어떤 오픈소스인지와 확인한 라이선스, (C) 글자가 아닌 시각 요소 아이디어와 "적당한 선", 그리고 자산을 어디서 어떻게 구하고 쓰는지를 적었습니다. AI 에이전트(Codex)용 영문 지시서입니다. 사용자가 정해야 하는 곳은 `[[NEEDS_USER_INPUT: ...]]`, 에이전트가 직접 찾아야 하는 곳은 `[[FIND: ...]]`로 표시했습니다.

Document date: 2026-11-03. **Read `Motion Plan.md` and `Design improve.md` section 0.2 first. Every rule in them still applies.** This file adds detail. If the two conflict, `Motion Plan.md` section 0.3 wins.

---

## 0. Ground rules added here

1. **Only text that exists on the site may be emphasized.** Copy phrases exactly from the live page. The site may have changed since this list was written (the user says the layout and UI were updated). Before using any entry, find it in the real DOM (`grep` the repo or search the rendered page). If the text changed, update the entry and tell the user. Do not paraphrase.
2. **Emphasis never changes text.** Emphasis is applied by wrapping existing words in a styled element at render time, driven by a data file (section 2.4). A test must prove the page's `textContent` is identical with and without emphasis.
3. **Foreground the question, the structure, the evidence and the limits. Do not foreground the author's most contested claims by themselves.** A strong normative claim (for example "anti-business policies") may be emphasized only when it carries its "Interpretation" or "Proposal" badge (`Design improve.md` D-07). Never drop a hedge from a number: keep "approximately", "nearly", "record", "reported" exactly as the passage states.
4. **Emphasis budget.** At most 1 animated emphasis per section. At most 2 static highlights per excerpt. At most about 40 emphasized phrases on the whole page. If everything is emphasized, nothing is.
5. **Default to no new runtime dependencies.** The default stack in section 4 uses only CSS, `IntersectionObserver`, the Web Animations API and build-time SVG generation.
6. **No stock imagery, no 3D, no particles, no video.** Visuals are abstract, diagrammatic and derived from the content (lines, nodes, dots, outlines, bars).
7. **Ask, do not guess.** In particular, never type map coordinates, statistics or citations from memory.

---

## 1. Summary of recommendations (read this first)

| Topic                   | Recommendation                                                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scroll-linked animation | Native CSS scroll-driven animations (`animation-timeline`) with `@supports`, plus `IntersectionObserver` fallback. No library.                                       |
| Reveal and step sync    | `IntersectionObserver` + CSS classes. No library.                                                                                                                    |
| Number emphasis         | Static big-number callouts with source chip and limit chip. Count-up optional (needs approval).                                                                      |
| Phrase emphasis         | CSS underline draw and highlight band applied by a data file. No library.                                                                                            |
| Maps                    | Generate SVG at build time from `world-atlas` (ISC) with `d3-geo` and `topojson-client` as dev dependencies. Zero runtime libraries.                                 |
| Charts (PCA etc.)       | Hand-authored SVG from data already on the site. No chart library.                                                                                                   |
| Optional library 1      | `motion` (MIT) only if a spring effect, a JS-driven fallback or React integration is truly needed.                                                                   |
| Optional library 2      | `gsap` (free under GSAP's own "no charge" license, not open source) only for pinned multi-step timelines or SVG morphing that CSS cannot do. Needs written approval. |
| Not recommended         | Smooth-scroll libraries, Lottie/Rive, Three.js, sketchy hand-drawn annotation libraries, particle systems. Reasons in section 4.4.                                   |
| Assets                  | Almost nothing to download. Most visuals are generated or hand-built. Every external asset goes into `docs/motion/ASSET_LOG.md`.                                     |

---

## 2. Part A: Emphasis inventory

### 2.1 Emphasis devices (a small, reusable vocabulary)

| ID  | Device         | Used for                                            | Spec                                                                                                                                             |
| --- | -------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| E1  | Underline draw | Key phrases in headings and key terms               | A 2 px underline grows left to right, 480 ms, ease-out, once. Static underline when motion is off.                                               |
| E2  | Highlight band | Terms inside the lead paragraphs (not excerpts)     | A low-opacity band sweeps behind the phrase, 520 ms. Static band when motion is off. Contrast of the text on the band at least 4.5:1.            |
| E3  | Number callout | Key figures                                         | Large figure, one-line caption from the passage, source chip linking to the passage anchor, and a limit chip if the passage states a limit.      |
| E4  | Contrast pair  | Two ideas that the argument sets against each other | Two phrases styled with two tokens and joined by a thin line that draws in 400 ms.                                                               |
| E5  | "≠" slash draw | "OWNERSHIP ≠ AUTHORITY"                             | A decorative SVG icon beside the existing label: an "=" whose slash draws in 400 ms. The text label stays as it is.                              |
| E6  | Limit chip     | Any figure whose passage states a caveat            | A small label "Limit" beside the figure with the passage's own caveat sentence. Same visual weight as the figure, not smaller text hidden below. |
| E7  | Node pulse     | A diagram node when its step becomes active         | One 600 ms ring pulse, once. No loops.                                                                                                           |

E1 snippet (works for phrases that wrap onto several lines):

```css
.em-u {
  background-image: linear-gradient(currentColor, currentColor);
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 100% 2px; /* default: static underline (no JS, motion off) */
  padding-bottom: 0.08em;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
}
html.motion-ok .em-u {
  background-size: 0% 2px;
}
html.motion-ok .em-u.is-in {
  background-size: 100% 2px;
  transition: background-size 480ms var(--ease-out) var(--em-delay, 0ms);
}
```

### 2.2 The inventory

Priority: **P0** build first; **P1** next; **P2** only if the user asks. IDs are used in `content/emphasis.json`. "Where" gives the section id or passage anchor seen on the site; verify each in the live DOM.

**Hero and structure**

| ID    | Exact text                                                         | Where                                                                                                                                  | Device and timing                                                                                     | Why                                                                               | P   |
| ----- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --- |
| EM-01 | "corporate capability" and "national power"                        | H1 "How does corporate capability become national power?" (`#question`)                                                                | E4 contrast pair: first underline draws on load (0 ms), second 240 ms later, then the connecting line | The whole project is the link between these two poles; people remember a question | P0  |
| EM-02 | "corporate survival", "technological purpose", "national strategy" | Hero subtitle                                                                                                                          | E1, staggered 120 ms                                                                                  | Three terms mirror the three-term pattern used in each section                    | P1  |
| EM-03 | "Survival → Identity → America → China → Korea → Integration"      | Hero path                                                                                                                              | The path line draw (see `Motion Plan.md` item 1)                                                      | The six-step path is the memory anchor                                            | P0  |
| EM-04 | "connects" and "responsibility"                                    | "I ask what connects corporate capability with national strategy... raises the question of responsibility." (S00 comparative question) | E2                                                                                                    | The verb of the question and the word the proposal ends on                        | P2  |

**01 The starting question**

| ID    | Exact text                                | Where                    | Device                                                         | Why                                 | P   |
| ----- | ----------------------------------------- | ------------------------ | -------------------------------------------------------------- | ----------------------------------- | --- |
| EM-05 | "Technological monopoly" vs "ESG and CSR" | key terms in `#survival` | E4 pair                                                        | The first contrast the reader meets | P1  |
| EM-06 | "ROIC, Ro40 and FCF"                      | S00-R002-P003            | Static glossary hover only (no animation, excerpt stays still) | Explains the measures used          | P1  |
| EM-07 | "good monopoly"                           | S06-R004-P001            | Static highlight (E2 without motion) after author approval     | A named concept                     | P2  |

**02 America**

| ID    | Exact text                                                | Where                         | Device                                                                                  | Why                                                    | P   |
| ----- | --------------------------------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------ | --- |
| EM-08 | "great cause" and "privilege"                             | S00-R005-P009 (the two axes)  | E4 in the section's lead area (the excerpt itself stays static)                         | The core of the American model as the author states it | P0  |
| EM-09 | "A contract ceiling is distinct from actual expenditure." | Term box "Public procurement" | E1 on "contract ceiling" and "actual expenditure"                                       | A precise limit that adds credibility                  | P1  |
| EM-10 | "Sense, integrate, decide, respond"                       | Golden Dome diagram title     | The four words light up in order, synced to the four diagram nodes (scene preset VE-08) | The mechanism in four words                            | P1  |
| EM-11 | "Jones Act"                                               | `#us-ships` key term          | E1                                                                                      | Named institution                                      | P2  |

**03 China**

| ID    | Exact text                                                               | Where                                                        | Device                            | Why                                              | P   |
| ----- | ------------------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------------- | ------------------------------------------------ | --- |
| EM-12 | "OWNERSHIP ≠ AUTHORITY"                                                  | label on `#china-ownership` and `#china-governance` diagrams | E5                                | The most compact statement of the section's idea | P0  |
| EM-13 | "Equity alone does not settle actual decision rights."                   | Term "Corporate governance"                                  | E1 on "actual decision rights"    | The limit that explains the symbol               | P1  |
| EM-14 | "USD 550 million" with "approximately USD 3 billion GDP" and "June 2019" | S08-R001-P010                                                | E3 callout (see 2.3)              | Concrete scale                                   | P0  |
| EM-15 | "approximately USD 260 million", "2021 and 2022"                         | S08-R003-P001                                                | E3 callout                        | Concrete scale                                   | P0  |
| EM-16 | "Anshun → Yunnan → Namsang"                                              | Supply sequence label                                        | Route draw on the map (VE-04)     | The only route the site states                   | P1  |
| EM-17 | "Six FTC-2000G aircraft"                                                 | S08-R003-P001                                                | Static highlight (after approval) | A specific, checkable detail                     | P2  |

**04 Korea**

| ID    | Exact text                                                                              | Where                  | Device                              | Why                                               | P   |
| ----- | --------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------- | ------------------------------------------------- | --- |
| EM-18 | "USD 173.48 billion" (record, 2025)                                                     | S16-R002-P003          | E3 callout **with E6 limit chip**   | The headline figure                               | P0  |
| EM-19 | "These figures alone do not establish that export controls caused the decline to China" | S16-R002-P003          | E6 limit chip, same weight as EM-18 | The best-calibrated sentence on the site; show it | P0  |
| EM-20 | "A historical authorization does not establish today's status."                         | Term "Export controls" | E1 on "today's status"              | Limit                                             | P1  |
| EM-21 | "Technology and operations", "Ownership and authority", "Jurisdiction"                  | LINE section key terms | Exploded three-layer stack (VE-07)  | "Examined separately" is the point                | P1  |
| EM-22 | "Defense Viability Index"                                                               | S17-R003-P001          | E1                                  | Named output of the method                        | P2  |

**05 Method**

| ID    | Exact text                                                       | Where                    | Device                            | Why                       | P   |
| ----- | ---------------------------------------------------------------- | ------------------------ | --------------------------------- | ------------------------- | --- |
| EM-23 | "Transactions, control and causation require separate evidence." | Term "Spatial proximity" | E1 on "require separate evidence" | Shows methodological care | P0  |
| EM-24 | "PC1, innovation/margin, and PC2, size/leverage"                 | S17-R003-P001            | PCA chips collapse (VE-06)        | Explains the two axes     | P1  |

**06 Synthesis and closing**

| ID    | Exact text                                           | Where                                                                           | Device                                                           | Why                                    | P   |
| ----- | ---------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------- | --- |
| EM-25 | "Many lines of inquiry. One connected argument."     | `#integration` H2                                                               | E1 on "One connected argument" and the convergence scene (VE-12) | The thesis of the structure            | P0  |
| EM-26 | "What public purposes should corporate power serve?" | `#synthesis` H2                                                                 | Chapter-opener reveal only                                       | The last question                      | P1  |
| EM-27 | "the conditions of support more than its scale"      | "My remaining question concerns the conditions of support more than its scale." | E1 (animated once)                                               | The author's stated remaining question | P0  |
| EM-28 | "A working framework, open to scrutiny."             | Footer                                                                          | Standard reveal only                                             | Tone of the whole site                 | P2  |

**Do not emphasize on their own (until labeled and approved):** statements such as "anti-business", "hegemony", "highest-level national-security assets", "ESG has no substantive influence". They are the author's interpretations or proposals. If the user wants them emphasized, they must carry the Interpretation or Proposal badge and the "Limits and counterpoint" slot from `Design improve.md` D-07.

### 2.3 Key-figure callouts (E3 + E6): content and rules

Candidate figures (verify every number against the live page and the full report before shipping; the user picks the final set: `[[NEEDS_USER_INPUT: final figures and captions]]`):

| Callout              | Figure as the passage states it                                                                                                                                                  | Caption source  | Limit chip text                                                       | Anchor          |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------- | --------------- |
| Greenland            | "USD 550 million" proposed for airport expansion in Nuuk, Ilulissat and Qaqortoq in 2018; "Nearly one-fifth of Greenland's approximately USD 3 billion GDP"; withdrawn June 2019 | Passage wording | `[[NEEDS_USER_INPUT]]` (the passage states a limit? if none, no chip) | `S08-R001-P010` |
| Myanmar              | "approximately USD 260 million" of aircraft, tanks and ammunition, 2021–2022                                                                                                     | Passage wording | "approximately" stays in the figure                                   | `S08-R003-P001` |
| Korea semiconductors | "record USD 173.48 billion in 2025"; to China and Hong Kong "USD 72.3 billion, down 0.5%"                                                                                        | Passage wording | The passage's own caveat sentence (EM-19)                             | `S16-R002-P003` |

Rules:

1. Show the figure exactly as written, including qualifiers. Do not round, convert currency, compute shares, or combine figures.
2. The caption uses the passage's words. Do not add interpretation.
3. Each callout has the source chip ("S08 · Spatial inquiry") linking to the passage anchor.
4. **Basis check for any chart that mixes the Korea percentages.** In S16-R002-P003, "semiconductor ICT exports to China and Hong Kong ... down 0.5%" is a semiconductor figure, while "ICT exports to Taiwan rose 64.8%, Vietnam 14.5% and America 9.8%" may be overall ICT exports. Do **not** put them in one bar chart until the author confirms they are on the same basis: `[[NEEDS_USER_INPUT: are the Taiwan, Vietnam and America figures semiconductor ICT or overall ICT?]]`. Until then, show only the two callouts.
5. Count-up animation is optional and needs approval (see `Motion Plan.md` item 4). Default: fade and rise.

### 2.4 How to apply emphasis without touching the text

Data file `content/emphasis.json`:

```json
[
  {
    "id": "EM-01",
    "target": "#question h1",
    "text": "corporate capability",
    "device": "E1",
    "order": 1,
    "approved": false
  },
  {
    "id": "EM-01b",
    "target": "#question h1",
    "text": "national power",
    "device": "E1",
    "order": 2,
    "approved": false
  }
]
```

Render-time function (do it in the rendering layer, for example an MDX/rehype step or a React component, not in a client script after hydration, to avoid hydration mismatches):

```js
// pseudo: wrap the first occurrence of `text` inside `target`'s text nodes
function wrapPhrase(root, text, className, attrs = {}) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode());) {
    const i = n.nodeValue.indexOf(text);
    if (i === -1) continue;
    const mid = n.splitText(i);
    mid.splitText(text.length);
    const span = document.createElement("span");
    span.className = className;
    Object.entries(attrs).forEach(([k, v]) => span.setAttribute(k, v));
    mid.parentNode.replaceChild(span, mid);
    span.appendChild(mid);
    return true;
  }
  return false; // phrase not found: log it, do not fail silently
}
```

Constraints: phrases that span several elements are not supported (choose a shorter phrase or ask the user). Only `approved: true` entries are applied. Add a test that compares `document.body.innerText` before and after emphasis: it must be identical, and that every `approved` entry was found exactly once.

---

## 3. Part B: Tool decisions

### 3.1 Decision rule

Use the smallest tool that does the job. Prefer the web platform. Add a library only for a capability the platform lacks. Every added package needs the checks in 3.5 and the user's written approval.

### 3.2 Default stack (no installs)

| Need                              | Use                                                              | Notes                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reveal on entry                   | `IntersectionObserver` + CSS classes                             | `Motion Plan.md` 3.3                                                                                                                                                                                                                                                                                                                                                                    |
| Scroll-linked (scrubbed) progress | CSS `animation-timeline: view()` / `scroll()` inside `@supports` | Support as reported on 2026-11-03 by scroll-driven-animations.style (https://scroll-driven-animations.style/demos/baseline-newly-available/css/): Chrome and Edge 115+, Safari 26+ (September 2025), Firefox 159+ (October 2026). Older articles say Firefox was behind a flag, so users on older Firefox versions still need the fallback. Re-check on caniuse.com when you implement. |
| Fallback when unsupported         | The reveal from 3.3 plus the final state (no scrubbing)          | Degrade to a simple one-shot reveal. Do not add a polyfill unless the user asks.                                                                                                                                                                                                                                                                                                        |
| Step sync (sticky diagram)        | `IntersectionObserver` setting `data-active`                     | `Motion Plan.md` item 3                                                                                                                                                                                                                                                                                                                                                                 |
| Imperative one-off animations     | Web Animations API: `el.animate(keyframes, options)`             | Built in; respects the motion gate                                                                                                                                                                                                                                                                                                                                                      |
| SVG line drawing                  | `pathLength="1"`, `stroke-dasharray: 1`, `stroke-dashoffset`     | No library                                                                                                                                                                                                                                                                                                                                                                              |
| Maps and shapes                   | Build-time SVG generation (section 5.3)                          | Dev dependencies only                                                                                                                                                                                                                                                                                                                                                                   |

Reference (read, do not depend on): https://scroll-driven-animations.style/ is a demo and tool site for scroll-driven animations. Check the license of any demo before copying code. Write your own implementation.

### 3.3 Optional libraries (approval required; ranked)

**1) `motion` (npm package `motion`, formerly Framer Motion)**

- License: MIT (stated in the package's README, seen at https://classic.yarnpkg.com/en/package/motion).
- What it offers: `animate`, `scroll`, `inView`, `stagger`, spring physics, gestures, layout animations; JavaScript, React and Vue flavours; a "hybrid engine" that uses native browser animation APIs where possible.
- Size: depends on what you import. Third-party summaries report about 2.3 KB for a minimal `animate`, about 34 KB for the full React `motion` component, and one package-health site reports 41.6 KB gzipped for the whole v12.38.0 package (https://mcp.depscope.dev/pkg/npm/motion). Measure with your bundler before deciding.
- Use only if: (a) a spring or gesture effect is truly required, (b) you need scrubbing in browsers without `animation-timeline`, or (c) the site is React and a component API simplifies the code.
- Install (only after approval): `npm i motion --save-exact`. Import only the functions you use. Subpaths such as `motion/react` apply only to React.

**2) `gsap` with ScrollTrigger (and optional plugins)**

- License: **not open source.** GSAP is free for commercial use, including the plugins that used to be members-only (for example SplitText, MorphSVG), under GreenSock/Webflow's "Standard No Charge License", effective April 30, 2025 (read it: https://gsap.com/standard-license; text seen at https://gsap.com/community/standard-license/). The license forbids use in tools that let users build visual animations without code and compete with Webflow's animation builder. The license may be revised by its owner. Version seen in the package README: 3.15.0 (https://cdn.jsdelivr.net/npm/gsap@3.15.0/README.md).
- Use only if: you need multi-step pinned timelines, `MorphSVG` shape morphing, `MotionPath`, or `Flip` (FLIP transitions for the theme-filter in the synthesis network), and CSS cannot do it.
- Cost: bundle size and a non-OSS license. The user prefers fewer third-party dependencies, so keep GSAP as a last resort.
- Do not use ScrollSmoother (it takes over scrolling; breaks `Motion Plan.md` rule 6).

**3) `d3-geo` and `topojson-client` at runtime (only for the optional runtime globe, section 5.4 option B)**

- Prefer build time (dev dependencies). Use at runtime only with approval and only these two modules, not the whole `d3` bundle.

### 3.4 Considered and not recommended

| Tool or approach                                                               | Reason                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Smooth-scroll libraries (for example Lenis, Locomotive Scroll), ScrollSmoother | Take over scroll; break anchors, keyboard and reduced-motion. Violates `Motion Plan.md` rule 6.                                                                                                                                                                                                                                                                                                  |
| Rough Notation (`rough-notation`)                                              | Verified: a small library (about 3.8 KB gzipped) that draws hand-drawn style underline, box, circle, highlight and bracket annotations using RoughJS (https://github.com/AnimatJS/rough-notation). The sketchy look conflicts with the restrained editorial style of this site, and E1/E2 reach the same goal with CSS. Do not use unless the user asks for a hand-drawn "reviewer notes" layer. |
| Lottie / Rive                                                                  | Need an authoring tool and external animation assets whose licenses vary per asset; the animations would be generic, not tied to the research.                                                                                                                                                                                                                                                   |
| Three.js / WebGL globes                                                        | Heavy, hard to make accessible, easy to overdo. A pre-rendered or canvas 2D globe is enough.                                                                                                                                                                                                                                                                                                     |
| Particle backgrounds, floating network backgrounds, cursor effects             | Unrelated to the content; distracting; cost performance.                                                                                                                                                                                                                                                                                                                                         |
| Single-purpose tiny packages (for example SVG scroll-draw wrappers)            | Reproduce a 15-line CSS technique and add supply-chain risk.                                                                                                                                                                                                                                                                                                                                     |
| Per-letter text splitting libraries                                            | Break screen readers, find-in-page, and the EN/KO toggle (`Motion Plan.md` rule 7).                                                                                                                                                                                                                                                                                                              |

### 3.5 Verification procedure for any package before installing

1. `npm view <pkg> version license time.modified repository.url dist.unpackedSize scripts` (look for `postinstall` or other install scripts; refuse if present unless the user approves).
2. Open the repository: last commit date, open issues, maintainers, the LICENSE file. Report licenses in `docs/motion/TOOLS_DECISION.md`.
3. Choose a release that is at least 14 days old. Pin the exact version (`npm i <pkg> --save-exact`). Commit the lockfile.
4. `npm audit` and a bundle-size comparison before and after (`next build` with `@next/bundle-analyzer` for Next.js, or the bundler's analyzer for others). Report the gzip delta.
5. If the license is not OSI-approved (for example GSAP), say so plainly and wait for explicit approval.
6. Remove the package if the feature is later dropped.

---

## 4. Part C: Non-text visual elements

### 4.1 The "right line" (intensity ladder and limits)

| Level | What                                             | Limit                                                                                                                                              |
| ----- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| L0    | Static graphic                                   | Unlimited                                                                                                                                          |
| L1    | Micro-interaction (hover, focus, 160 ms or less) | Unlimited                                                                                                                                          |
| L2    | One-shot reveal (400 to 700 ms)                  | One in view at a time                                                                                                                              |
| L3    | Scrubbed or step-synced diagram scene            | Only inside the sticky mechanism component                                                                                                         |
| L4    | Set-piece                                        | **At most 3 on the whole page**: (1) the three-places map (VE-04), (2) PCA collapse (VE-06), (3) closing convergence (VE-12 with the closing path) |

Further limits:

1. Visuals must be abstract and derived from content: lines, nodes, dots, rings, outlines, bars, plates. They must carry information the page already states, or act as chapter-level orientation.
2. Nothing loops. Nothing moves while the reader is on a paragraph. No motion longer than 1 s unless scrubbed.
3. Payload budgets: each SVG at most 20 KB, the map set at most 60 KB total, all new visual assets at most 150 KB. No raster images unless approved.
4. Scene presets VE-03 to VE-11 are **variants of moment 3** (the sticky mechanism diagram) in `Motion Plan.md`. They run only while their diagram's step is active, so the 8-moment budget does not grow.
5. Each visual needs a text alternative (`<title>` / `aria-label` or a caption) and a static final state for reduced motion.

### 4.2 Idea catalog

| ID    | Element                                  | Where                                                | What moves                                                                                                             | Level | Asset source                                                                                 |
| ----- | ---------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----- | -------------------------------------------------------------------------------------------- |
| VE-01 | Core thread: six dots on a line          | Hero, chapter rail, closing                          | Line draws; dots light in order; one ring pulse per dot                                                                | L2/L3 | Hand-authored SVG, no download                                                               |
| VE-02 | "=" to "≠" slash                         | `#china-ownership`, `#china-governance` labels       | Slash draws across                                                                                                     | L2    | Hand-authored SVG                                                                            |
| VE-03 | Mechanism diagram sync                   | All "Follow the mechanism" diagrams                  | Nodes and edges light as steps become active                                                                           | L3    | Existing SVGs + `DIAGRAM_STEP_MAP.md`                                                        |
| VE-04 | Offline map: three places                | `#china-arctic`, `#china-myanmar`, `#china-cambodia` | Views change per timeline step; dots appear; the route draws                                                           | L4    | Build-time SVG from `world-atlas` (section 5.3)                                              |
| VE-05 | Region markers                           | Headings of 02, 03, 04, nav chips, comparison table  | Color/label only; 160 ms hover                                                                                         | L1    | Needs D-11 approval for region colors                                                        |
| VE-06 | PCA collapse                             | `#spatial-method`                                    | Six indicator chips slide into two axis labels, scrubbed                                                               | L4    | Hand-authored SVG; data only from the site                                                   |
| VE-07 | Exploded three-layer stack               | `#korea-platforms`                                   | Three plates (Technology and operations / Ownership and authority / Jurisdiction) separate vertically as steps advance | L3    | Hand-authored SVG or HTML plates                                                             |
| VE-08 | Signal along the chain                   | `#us-dome`                                           | One pulse travels Satellite, Radar, Data integration, Decision, Response, once                                         | L3    | Hand-authored SVG                                                                            |
| VE-09 | Rules, orders, shipyard, capacity blocks | `#us-ships`                                          | Four blocks stack one after another as steps advance                                                                   | L3    | Hand-authored SVG                                                                            |
| VE-10 | Reserve loop                             | `#us-finance`                                        | Issuance and redemption arrows draw once (Holder, Tether, Reserves, USDT)                                              | L3    | Hand-authored SVG                                                                            |
| VE-11 | Export bars                              | `#korea-chips`                                       | Bars grow from zero                                                                                                    | L3    | **Blocked until the basis check in 2.3 rule 4 is answered**                                  |
| VE-12 | Convergence                              | `#integration`                                       | 13 study dots move to S00 along their existing links, once; the six-step path completes                                | L4    | Hand-authored SVG + the site's own link data                                                 |
| VE-13 | Outline chapter numerals "01" to "06"    | Chapter openers                                      | Fill sweeps in once                                                                                                    | L2    | Site font; no asset                                                                          |
| VE-14 | Reading-progress hairline                | Top of the page                                      | Scales with scroll (CSS scroll timeline)                                                                               | L1    | CSS only                                                                                     |
| VE-15 | Archive carousel depth                   | Archive                                              | Neighbors at scale 0.96; centered at 1.0; 160 ms                                                                       | L1    | CSS only                                                                                     |
| VE-16 | Chapter tint (optional)                  | Backgrounds between chapters                         | A tint of at most 6% in the region color, scrubbed                                                                     | L2    | Needs D-11; verify text contrast at both ends and mid-transition; drop if any contrast fails |

**Ideas rejected (do not build):** floating particles; a spinning 3D object; stock photographs of satellites or ships; looping radar sweeps; typing-text effects; glitch or noise effects; confetti; sound; cursor trails; parallax that moves text.

### 4.3 How to build the main elements

**VE-01 Core thread (SVG, no assets)**

1. One `<svg>` with a single `<path pathLength="1">` and six `<circle>` nodes; labels are HTML text next to the SVG so they stay real text.
2. Hero: play the line draw once on load (900 ms) with the nodes lighting at 60 ms intervals. Rail: reuse the same SVG, with CSS `animation-timeline: scroll(root)` mapping the fill to page scroll, inside `@supports`.
3. Closing: render the same SVG fully drawn and re-light the dots in sequence when it enters the viewport.
4. Reduced motion: static SVG with all nodes visible.

**VE-02 "≠" icon**

```html
<svg class="neq" viewBox="0 0 24 24" aria-hidden="true">
  <path d="M5 9h14M5 15h14" />
  <!-- the two bars -->
  <path class="neq__slash" d="M8 20L16 4" pathLength="1" />
  <!-- the slash -->
</svg>
```

```css
.neq path {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
}
html.motion-ok .neq__slash {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}
html.motion-ok .is-in .neq__slash {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 400ms var(--ease-out) 150ms;
}
```

Keep the existing text "OWNERSHIP ≠ AUTHORITY" in the DOM; the icon is decorative (`aria-hidden`).

**VE-07 Exploded stack**
Three stacked plates in CSS 3D-free transforms: `translateY(-Npx)`, `0`, `+Npx` tied to `data-active` of the figure (spacing token, not a hard-coded value). Each plate has a label that is real text. Step 1 highlights plate 1, step 2 plate 2, step 3 plate 3, and the final state shows all three separated. Do not add perspective or shadows that change the site's flat style.

**VE-08, VE-09, VE-10 (scene presets)**
Same technique each time: author the SVG nodes and edges once; use `data-active` (`Motion Plan.md` item 3) to switch classes; edges use `stroke-dashoffset`; pulses use a single WAAPI `animate()` call on a `<circle>` along an SVG `<path>` via `offset-path` (CSS Motion Path; check support first) or, if unsupported, by animating the circle's `cx`/`cy` between node positions. Check the node positions from the existing diagram; do not redraw the diagram unless D-13 (`Design improve.md`) says to.

**VE-06 PCA collapse**
Six chips (Revenue growth, Gross margin, Op. margin, R&D / revenue, Asset turnover, Debt / equity) start in a column; as the section scrolls they translate toward two axis labels (PC1 innovation/margin, PC2 size/leverage). Do not place points by invented loadings. If the user wants a real scatter, the exact PC scores must come from the S17 report: `[[NEEDS_USER_INPUT: PC scores or file]]`.

**VE-12 Convergence**
Positions of the 13 dots come from the existing network layout. Lines use only links that already exist in the data. Dots animate to S00 once, 600 ms with a 40 ms stagger. Hover and focus on a dot behave as today.

### 4.4 Reduced-motion and accessibility for every visual

Static final state; text alternative; keyboard behavior unchanged; no flashing over 3 times per second; the sticky figure never covers text; contrast of muted states at least 4.5:1 for text and 3:1 for graphics.

---

## 5. Part D: Assets, sources and how to use them

### 5.1 Principle

Most visuals are **generated or hand-authored**, not downloaded. Anything that comes from outside the repository must be logged and license-checked.

### 5.2 `docs/motion/ASSET_LOG.md` (required)

One row per external item: name, what it is used for, source URL, license (with the URL of the license text), version or retrieval date, attribution text if required, file paths in the repo. No row, no asset. Do not scrape or copy from other websites. Do not use assets with "non-commercial", "no derivatives" or unclear licenses.

### 5.3 Map data and the build-time pipeline (VE-04)

Verified sources:

- `world-atlas` (npm): "Pre-built TopoJSON from Natural Earth", ISC license (shown on https://classic.yarnpkg.com/en/package/world-atlas, version 2.0.2), repository https://github.com/topojson/world-atlas. Files: `countries-110m.json`, `countries-50m.json`, `countries-10m.json`, `land-110m.json`, `land-50m.json`, `land-10m.json`. The README says the data is a redistribution of Natural Earth version 4.1.0. Natural Earth publishes its own terms on naturalearthdata.com; **before shipping, read its terms page and record in `ASSET_LOG.md` what it says** (this session did not verify the terms text).
- `d3-geo` and `topojson-client` (npm): used by the world-atlas README examples (https://observablehq.com/@d3/world-map-svg). Verify their licenses with the procedure in 3.5 before installing.
- Place coordinates: `[[FIND: cited source for each place]]`. Acceptable sources are GeoNames, Wikidata or Wikipedia. Verify each source's license at use time, record the exact URL and retrieval date, and write a code comment citing it. **Never type coordinates from memory.** Places named on the site: Nuuk, Ilulissat, Qaqortoq (Greenland); Anshun, Yunnan, Namsang (Myanmar route); Ream (Cambodia). Prince Group and Canopy Sands' sites are not stated as coordinates on the page; do not place them unless a cited source is supplied.
- Label every map "schematic" where positions or routes are approximate, and keep the site's own statement that spatial proximity does not establish transactions or control.

Build script (dev dependencies only; output is static SVG committed to the repo):

```bash
npm i -D d3-geo topojson-client world-atlas --save-exact     # after the 3.5 checks and approval
```

```js
// scripts/build-maps.mjs  (Node ESM)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";

const topo = JSON.parse(
  readFileSync("node_modules/world-atlas/land-50m.json", "utf8"),
);
const land = feature(topo, topo.objects.land);

// [[FIND: coordinates from cited sources; record sources in a comment and in ASSET_LOG.md]]
const VIEWS = {
  greenland: {
    center: [
      ,/* lon */
      /* lat */
    ],
    scale: 0 /* [[FIND: tune visually]] */,
  },
  myanmar: {
    center: [
      ,/* lon */
      /* lat */
    ],
    scale: 0,
  },
  cambodia: {
    center: [
      ,/* lon */
      /* lat */
    ],
    scale: 0,
  },
};
mkdirSync("public/maps", { recursive: true });
for (const [name, v] of Object.entries(VIEWS)) {
  const projection = geoOrthographic()
    .rotate([-v.center[0], -v.center[1]])
    .scale(v.scale)
    .translate([400, 300]);
  const d = geoPath(projection)(land);
  writeFileSync(
    `public/maps/${name}.svg`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="${name} locator map"><path d="${d}" fill="none" stroke="currentColor" stroke-width="0.8"/></svg>`,
  );
}
```

Notes: `geoPath` draws a line between two points as a great-circle arc, which is suitable for schematic routes: `geoPath(projection)({ type: 'LineString', coordinates: [A, B] })`. Use `land-10m.json` for the Cambodia and Myanmar views if the 50 m coastline is too coarse (build time only). Run SVGO or an equivalent minifier (verify the tool and its license first) to keep each file under the size budget.

### 5.4 Two ways to run the map (pick with the user)

- **Option A (recommended): pre-rendered views.** Three static SVGs (one per place) in the timeline stage. The step change crossfades views (240 ms); the route and markers draw with `stroke-dashoffset`. Zero runtime libraries, tiny payload, reliable on phones.
- **Option B (approval needed): runtime globe.** `d3-geo` (orthographic) and `topojson-client` shipped to the browser; a canvas 2D globe whose rotation is scrubbed by scroll between the three views. More "Apple-like", but it adds JS, and an orthographic globe distorts distances, so keep it a locator and not an analytical map. Honor the motion gate and give a static fallback.

### 5.5 Other assets

| Need                         | Where from                                                                                                                      | How                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Diagram shapes, plates, dots | Draw them yourself in the repository (SVG in code) or export from a design tool (Figma, Inkscape)                               | Export as plain SVG, remove metadata, keep text as live text, optimize |
| Fonts                        | The site's existing fonts                                                                                                       | No new fonts. Self-host if any new one is approved                     |
| Icons                        | Avoid. Use geometric shapes. If an icon set is unavoidable, choose an OSI-licensed one, verify the license with 3.5, and log it | Inline SVG only                                                        |
| Photos, video, textures      | None                                                                                                                            | Not used                                                               |
| Statistics                   | Only the numbers already on the site (section 2.3)                                                                              | Anchor each to its passage                                             |

### 5.6 Optimization and delivery

Inline small SVGs in the markup; load map SVGs lazily when their section nears the viewport (`loading="lazy"` for `<img>` or an `IntersectionObserver` fetch). Serve with long cache headers (static asset hashing). Ensure each decorative SVG has `aria-hidden="true"` and each informative one has `role="img"` and a label.

---

## 6. Phases for this addendum

| Phase | Work                                                                                                                                                 | Acceptance criteria                                                               |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| A0    | Re-inventory the current page; confirm each `EM-` text exists; write `TOOLS_DECISION.md` and `ASSET_LOG.md`; ask the user the questions in section 7 | Every P0 entry found in the live DOM (or flagged)                                 |
| A1    | Emphasis system: devices E1 to E7, `emphasis.json`, renderer, the text-unchanged test                                                                | `innerText` identical before and after; unapproved entries not applied            |
| A2    | Key-figure callouts with source and limit chips                                                                                                      | Each figure matches its passage character for character; each links to its anchor |
| A3    | Build-time SVG pipeline and `public/maps/*`                                                                                                          | Files under budget; coordinates cited; `ASSET_LOG.md` complete                    |
| A4    | Scene presets VE-03, VE-07, VE-08, VE-09, VE-10 inside the sticky mechanism component                                                                | Reduced-motion static states; no layout shift                                     |
| A5    | Set-pieces: VE-04 map, VE-06 PCA, VE-12 closing                                                                                                      | At most 3 L4 on the page; each has a meaning sentence in `CHANGELOG.md`           |
| A6    | QA with the gates in `Motion Plan.md` section 5; recall test in section 6 there                                                                      | All gates pass; payload within budgets                                            |

Global acceptance: no text changed; no new runtime dependency unless approved; no scroll hijacking; every external asset logged; the `NEEDS_USER_INPUT` list is empty before anything merges to the production branch.

---

## 7. Questions to ask the user (put them in `OPEN_QUESTIONS.md`)

1. Approve the P0 emphasis entries (EM-01, 03, 08, 12, 14, 15, 18, 19, 23, 25, 27)? Any to add or remove?
2. Which key figures become callouts, and what are the captions and limit chips?
3. Are the Taiwan, Vietnam and America percentages on the same basis as the China/Hong Kong semiconductor figure (blocks VE-11)?
4. Tooling: stay with the zero-library default, or approve `motion` or `gsap` for a named need?
5. Map: Option A (pre-rendered) or Option B (runtime globe)?
6. May region colors (America, China, Korea) be used (`Design improve.md` D-11), and is the optional chapter tint (VE-16) wanted?
7. Who confirms the place coordinates and their sources? (Agent proposes cited sources; the author approves.)
8. Should emphasis inside excerpts (EM-06, EM-07, EM-17) be allowed as static highlights, or kept out of the excerpts entirely?

---

## 8. Sources checked while writing this file (re-verify before relying on them)

- GSAP license and free status: https://cdn.jsdelivr.net/npm/gsap@3.15.0/README.md and https://gsap.com/community/standard-license/ (effective April 30, 2025).
- Motion: MIT license and flavours: https://classic.yarnpkg.com/en/package/motion; size report: https://mcp.depscope.dev/pkg/npm/motion.
- CSS scroll-driven animations support: https://scroll-driven-animations.style/demos/baseline-newly-available/css/ (reports Chrome and Edge 115, Safari 26, Firefox 159 in October 2026); a June 2026 article reporting Firefox stable without support at that time: https://www.buildmvpfast.com/blog/css-scroll-driven-animations-replace-js-2026.
- `world-atlas` (ISC, 2.0.2, Natural Earth 4.1.0 as TopoJSON): https://github.com/topojson/world-atlas and https://classic.yarnpkg.com/en/package/world-atlas.
- Rough Notation: https://github.com/AnimatJS/rough-notation (README on size and annotation types; license not confirmed in this session).
