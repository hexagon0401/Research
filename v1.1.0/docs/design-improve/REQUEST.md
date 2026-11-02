# Design improve.md

## Improvement spec for the website "IIR — The Architecture of Power"

> 한국어 요약: 이 파일은 AI 에이전트에게 전달하는 영문 지시서입니다. 에이전트가 아무것도 모른다는 가정으로, GitHub repo 확보 → 환경 구축 → 기준선 측정 → 개선 백로그 → 기믹 → 추가 콘텐츠 → PR 절차 순서로 적었습니다. 사용자가 직접 채워야 하는 정보는 `[[NEEDS_USER_INPUT: ...]]`로 표시했습니다.

Document date: 2026-11-02. Site observed: https://research-hxgn.vercel.app/ (home page text only).

---

## 0. Read this first

### 0.1 Who this is for

You are an AI coding agent. You know nothing about this project. This document tells you what the site is, what is known and unknown, how to get the source code, and what to improve. Follow the phases in order. Do not skip Phase 0 and Phase 1.

### 0.2 Golden rules (violating any of these is a failure)

1. **Never invent facts.** No made-up numbers, names, dates, quotes, citations, coordinates, file paths, or repo URLs. If a fact is missing, write the placeholder `[[NEEDS_USER_INPUT: what is needed]]` and add it to `docs/design-improve/OPEN_QUESTIONS.md`.
2. **Do not rewrite the author's research text.** The site's body text, excerpts and claims belong to the author. You may change layout, structure, styling, UI microcopy (button labels, tooltips, aria-labels) and add new components. Any change to research wording goes into a proposal file (`docs/design-improve/CONTENT_PROPOSALS.md`) for the author to approve. Do not edit it in place.
3. **Preserve every URL, anchor and query parameter.** Examples: `#survival`, `#us-mission`, `/reports/S00?from=survival#S00-R002-P003`. Other pages link to them. Never rename or delete them. If you must add a new one, do not reuse an old name.
4. **Never push to the production branch (usually `main`).** Work on a feature branch. Open a pull request. No force-push.
5. **Never commit secrets** (`.env*`, tokens, keys). Never print a token in logs or messages.
6. **Do not regress accessibility.** The site already has a skip link, a "Reduce motion" toggle, keyboard navigation and an Accessibility page. Keep and improve them.
7. **No new runtime network requests to third parties** (analytics, CDNs, remote fonts, map tiles) without explicit approval. Self-host fonts and data.
8. **Before adding any npm package**, verify it exists and is maintained: `npm view <pkg> version time.modified`. Prefer small, well-known packages. Report every added dependency and why.
9. **If blocked, ask. Do not guess.** In particular, do not guess the GitHub repo URL.
10. **Work in small steps.** One phase = one branch = one PR. After each phase, write a short change report with before/after screenshots.
11. **Codex installs and uses the design skills in section 2B, and only those.** Follow every safety rule in 2B.1. Record what you installed in `docs/design-improve/SKILLS_INSTALLED.md`.
12. **Skills advise; this document decides.** If a skill conflicts with these rules or the backlog, ignore the skill's instruction and report the conflict.

### 0.3 Priority of information

If this document conflicts with the code you see, the code is right about what exists, and this document is right about intent. Report conflicts in `OPEN_QUESTIONS.md`.

### 0.4 How the user starts you (Codex)

The user runs Codex in a working folder that contains this file and gives you a short prompt such as:

> "Read `Design improve.md` completely. Follow it from Phase 0 in order. Ask me for the GitHub repo URL first. Install and use the skills in section 2B yourself, following its safety rules. Report after each phase."

If you cannot run shell commands, cannot reach the network, or are blocked by the sandbox, say so immediately and ask the user to approve or adjust. Do not work around restrictions.

---

## 1. What is known about the site

### 1.1 Observed facts (from fetching the home page on 2026-11-02)

| Item             | Observed                                                                                                                                                 |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title            | IIR — The Architecture of Power                                                                                                                          |
| Brand line       | "Integrated Independent Research", tagline "Technology. Identity. National power."                                                                       |
| Description meta | An integrated inquiry into technology, corporate identity and national power; an S00 essay and thirteen Korean–English research reports with source PDFs |
| Robots meta      | `noindex, follow` (the site is deliberately or accidentally hidden from search engines)                                                                  |
| Framework hint   | A meta tag named `next-size-adjust` is present. This suggests **Next.js**, but it is only a hint. Confirm in `package.json`.                             |
| Hosting          | The domain suggests Vercel.                                                                                                                              |
| Footer           | "IIR 2.4.3 · RESEARCH IN PROGRESS · 2026", "A working framework, open to scrutiny." Ends with a John F. Kennedy quote.                                   |
| Languages        | EN / KO toggle. Source reports are Korean with "Editorial English" and PDF versions.                                                                     |
| Reading time     | "24 min read · including expandable source passages"                                                                                                     |
| Top nav          | Archive, Library, More (About the research, Methods & limitations, Accessibility)                                                                        |
| Routes seen      | `/`, `/archive`, `/library`, `/about`, `/methods`, `/accessibility`, `/reports/S00` … (see 1.3)                                                          |

### 1.2 Home page structure, in order

| #                               | Section                                                                                                                                                        | Anchor ids                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Hero                            | "How does corporate capability become national power?" + 6-step path (Survival → Identity → America → China → Korea → Integration) + "Read the full synthesis" | `#question`, `#main`                                                                          |
| 01 The starting question        | What allows a company to endure? / What is technological advantage for? / How does corporate technology become national power?                                 | `#survival`, `#identity`, `#capability`                                                       |
| 02 The American connection      | Palantir & Anduril / Golden Dome / Tether / Shipbuilding                                                                                                       | `#us-mission`, `#us-dome`, `#us-finance`, `#us-ships`                                         |
| 03 China, across scales         | Ownership / Authority / Greenland / Myanmar / Cambodia (one scrolly timeline)                                                                                  | `#china-ownership`, `#china-governance`, `#china-arctic`, `#china-myanmar`, `#china-cambodia` |
| 04 The Korean question          | Chips & export controls / LINE platform / Regulation (Tada, Coupang, Kakao) / Defense (Hanwha, LIG)                                                            | `#korea-chips`, `#korea-platforms`, `#korea-regulation`, `#korea-defense`                     |
| 05 Observation & interpretation | Spatial analysis and PCA method                                                                                                                                | `#spatial-method`                                                                             |
| 06 One connected inquiry        | Synthesis, comparison table (America / China / Korea), S00 proposal, archive carousel of 13 studies                                                            | `#synthesis`, `#integration`                                                                  |

Repeating template inside each section: heading → one summary paragraph → 3 bold bullets → "FOLLOW THE MECHANISM" diagram (with an "Enlarge diagram" control) → 3–4 numbered steps (each repeats the bullets) → "Argument & source excerpts · N passages" accordion → a bridging sentence to the next section. Some sections use "VISUAL READING" diagrams with "Select a point, node or connection" and the label "Evidence scope · editorial diagram / not independent verification".

### 1.3 Reports (13 items, IDs are not consecutive)

S00 Synthesis 2026 ("Redefining State–Firm Relations: The Emergence of Corporate Hegemony"), S01 Data warfare 2025, S02 Economic power 2025, S03 Golden Dome I 2025, S05 Financial trust 2025, S06 Resilience 2026, S08 Spatial inquiry 2026, S11 Security order 2026, S13 Golden Dome II 2025, S14 Identity 2026, S15 Spatial data 2026, S16 Semiconductors 2026, S17 Defense 2026.
Passage anchors have the form `S00-R002-P003` (report, region, paragraph). Treat them as a stable public API.

### 1.4 Already good: keep and polish, do not remove

Skip link; Reduce-motion toggle; keyboard arrows in the archive carousel; "Term" definition boxes (e.g., "Public procurement · Term"); evidence-scope disclaimers; source excerpts linked back with `?from=` context; Methods & limitations page; bilingual toggle.

### 1.5 Not observed (do not assume)

The GitHub repo URL; the real framework and version; the styling system (Tailwind, CSS modules, etc.); where the content lives (MDX, JSON, CMS); the actual colors, fonts and animations; the subpages; how EN/KO switching works (route vs. state); whether analytics exist.
You will find these out in Phase 0 and Phase 1 by reading the code. Record them in `docs/design-improve/BASELINE.md`.

---

## 2. Phase 0 — Get the code and run it (assume zero prior knowledge)

### 2.1 Ask the user for the repository. Do not guess.

Send this message to the user and wait:

> "I need the GitHub repository for https://research-hxgn.vercel.app/. Please give me the repo URL (e.g. https://github.com/<owner>/<repo>) and tell me whether it is public or private, and whether I may push a feature branch to it. If you only have the project on your computer (no GitHub), please give me the folder or a zip."

How the user can find the URL (tell them if they don't know): Vercel dashboard → the project → Settings → Git → "Connected Git Repository". Or search their GitHub account for the repo.
If the site was deployed without Git (CLI upload), ask the user for the local project folder. Do not try to reconstruct the source from the deployed site.

### 2.2 Check your tools

```bash
git --version
node -v        # Next.js needs a recent LTS Node; check package.json "engines" and .nvmrc
npm -v
```

If something is missing, ask the user before installing. If you have no shell access at all, tell the user and stop. Produce only the plan and wait.

### 2.3 Authenticate with GitHub (private repos or pushing)

Preferred: the user runs `gh auth login` for you, or adds you as a collaborator. Alternative: the user forks the repo and gives you the fork URL. Never ask the user to paste a token into a public chat. Never write tokens into files.

### 2.4 Clone and inspect

```bash
git clone <REPO_URL> iir-site
cd iir-site
git status
git branch -a
git log --oneline -n 20
ls -la
```

Identify the production branch: `git remote show origin` → "HEAD branch".

### 2.5 Identify the stack

```bash
cat package.json                      # framework, scripts, dependencies
ls                                    # lockfile tells the package manager
ls app pages src content data public 2>/dev/null
```

| Lockfile                 | Package manager | Install command                  |
| ------------------------ | --------------- | -------------------------------- |
| `package-lock.json`      | npm             | `npm ci`                         |
| `pnpm-lock.yaml`         | pnpm            | `pnpm install --frozen-lockfile` |
| `yarn.lock`              | yarn            | `yarn install --frozen-lockfile` |
| `bun.lockb` / `bun.lock` | bun             | `bun install`                    |

Find where the research text lives. Search for distinctive strings from the live site:

```bash
grep -RIn "How does corporate capability become national power" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git | head
grep -RIn "S00-R002-P003" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git | head
grep -RIn "next-size-adjust\|robots" app src pages 2>/dev/null | head
```

Write down: framework + version, router type (App Router `app/` vs Pages Router `pages/`), styling approach, content source format, how i18n is done, where diagrams are defined, where the robots/metadata are set.

### 2.6 Install, run, build

```bash
<install command from the table>
npm run dev        # open http://localhost:3000
npm run build      # must succeed BEFORE you change anything
npm run lint       # if the script exists
npx tsc --noEmit   # if TypeScript is used
```

If the baseline build or lint already fails, record the exact errors in `BASELINE.md` and tell the user. Do not "fix" unrelated failures silently.

### 2.7 Branch and working folder

```bash
git switch -c design-improve/phase-1
mkdir -p docs/design-improve/screenshots/before docs/design-improve/screenshots/after scripts
```

Create these files: `BASELINE.md`, `OPEN_QUESTIONS.md`, `CONTENT_PROPOSALS.md`, `CHANGELOG.md`.
Vercel usually builds a Preview Deployment for every pushed branch or PR if the Git integration is connected. The URL appears in the PR checks. Verify this; do not assume.

---

## 2B. Phase 0.5 — Install and verify the design skills (Codex)

The user has authorized you (Codex) to **install the skills listed in this section yourself and use them**. This authorization covers only the skills named here, only the install commands documented by their own upstream sources, and nothing else. It does not cover source edits outside this task, pushes, deployments, logins, or deleting anything.

### 2B.1 Safety rules for installing (all mandatory)

1. **Only install what Tier A/B lists below allow.** Tier C is never installed.
2. **Prefer project-local installs** (inside the cloned site repo) over user-wide installs, so everything is reversible and other projects are unaffected. Use a user-wide install only if the user says so.
3. **Do not commit skill files to the site repository.** After installing, check `git status`. If the installer created folders such as `.agents/`, `.codex/`, `.claude/`, `.cursor/`, add them to the local-only ignore file `.git/info/exclude` (this does not change the repo), unless the user asks to commit them. Never overwrite existing files in those folders. If a folder already exists, list its contents first and keep everything that is already there.
4. **Before installing each skill**, do all of these and record the result:
   a. Open the skill's page on OpenDesign and read its "how to install" section (see 2B.2).
   b. Open the upstream repository named on that page. Read the skill's `SKILL.md` completely, the install section of the README, and the license. Note: any shell commands, network calls, hooks, or files it writes.
   c. Stop and ask the user if the skill (or its installer) runs a hook, downloads and executes a script, asks for credentials, requires `sudo`, or edits global configuration.
5. **Never** run `curl ... | sh`, an unverified installer, or an install script you have not read. Never use `sudo`.
6. **Do not install the "Open Design for Codex" plugin** (`open-design@open-design`), the OpenDesign desktop app, or any MCP server. They are a different, heavier product that needs the desktop app and a separate login. This task does not need them. Do not log in to anything.
7. If the sandbox or approval mode blocks network access or commands, **ask the user to approve**. Do not look for ways around the sandbox.
8. **If a skill's instructions conflict with section 0.2 (golden rules) or with the backlog in this document, this document wins.** Examples of conflicts: "rewrite from scratch", "replace the stack", "add dramatic effects", "ignore existing content", forced animations. Skill output is advice. Every change still has to pass section 7.
9. Skills may improve layout, spacing, typography, color, states, motion and structure. They must **never** change the author's research text. Wording proposals go only in `CONTENT_PROPOSALS.md`.
10. After installation, **a new Codex session or task may be needed** before the skills load. Check, and tell the user if a restart is needed.

### 2B.2 Where to find each skill's real install instructions

1. Open the collection index: `https://open-design.ai/plugins/codex-design/` (Korean: `https://open-design.ai/ko/plugins/codex-design/`). Each card links to the plugin page.
2. A plugin page URL has one of these forms (use the link from the index; if you must guess, try both): `https://open-design.ai/plugins/<slug>/` or `https://open-design.ai/skills/<slug>/` (locale prefixes such as `/ko/` or `/zh/` also exist).
3. The page names the **upstream source repository**. The upstream README and `SKILL.md` are the final authority. If a command on a third-party aggregator site differs from the upstream README, follow the upstream README.
4. OpenDesign pages state that they checked source files, paths and license text, and that they did **not** record actual runs. So treat "verified by OpenDesign" as "source checked", not "tested". Test it yourself (2B.5).

### 2B.3 What to install, in tiers

**Tier A — install now (after the 2B.1 checks):**

| Slug                          | Use                                                                                                   | Install route (status)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `redesign-existing-projects`  | Audit an existing site and apply targeted upgrades without breaking function (Phase 1 audit, Phase 2) | **Documented:** `npx skills add https://github.com/Leonxlnx/taste-skill --skill redesign-existing-projects` (the installer asks which agent to add it to; choose Codex). Manual alternative shown on OpenDesign's page: clone `https://github.com/Leonxlnx/taste-skill` and point Codex at `skills/redesign-skill/SKILL.md`.                                                                                                                                                                                                                                                                                                                    |
| `impeccable`                  | Design critique, audit, polish commands                                                               | **Documented in the upstream README (`pbakaus/impeccable`):** from the project root run `npx impeccable install` and then `/impeccable init` inside the AI tool, **or** `npx skills add pbakaus/impeccable`. Sources differ slightly on the exact subcommand, so run `npx impeccable --help` first and use what it prints. Codex notes from the README: skills (not custom prompts) are used; open `/skills` or type `$impeccable`; project-local skills live in `.agents/skills/`, user-wide in `~/.agents/skills/`; restart if the skill does not appear; open `/hooks` after install and **ask the user before approving any project hook**. |
| `design-system-tokens`        | Three-layer design tokens and component specs (D-11)                                                  | **Not verified. Look it up** via 2B.2 (OpenDesign lists it under `nextlevelbuilder`, "UI-UX Pro Max · Design System").                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `make-interfaces-feel-better` | 16 polish rules plus a review checklist (pre-PR review)                                               | **Not verified. Look it up** via 2B.2 (OpenDesign lists author `jakubkrehel`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `animation-review`            | Review and improve all motion (D-14, G-02)                                                            | **Not verified. Look it up** via 2B.2 (author `emilkowalski`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `hallmark-design-skill`       | Anti-sameness gates, forced structural variety (D-12)                                                 | **Not verified. Look it up** via 2B.2 (author `Nutlope`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `visual-plan`                 | Turn plans into wireframes/prototype review documents for the user's approval                         | **Not verified. Look it up** via 2B.2 (author `BuilderIO`).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

**Tier B — install only when the related backlog item or gimmick is approved by the user:**

| Slug                                                                  | Install when                                                                                                    |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `kami`                                                                | D-15 print brief or D-16 reviewer one-pager is started                                                          |
| `design-dna`                                                          | D-11 begins and you want structured token extraction of the current site                                        |
| `pick-ui-library`                                                     | G-04 map or G-09 search is approved (to choose one library)                                                     |
| `gsap-skills`                                                         | G-05 timeline is approved. Check license and bundle size first (section 7)                                      |
| `framed-grid-layout`, `container-lines`, `agency-grid-layout-minimal` | D-12 layout variation begins (CSS-only layout references)                                                       |
| `editorial-ui-style`, `terracotta-ui-style`                           | Only if the user approves a typographic or palette change. Their fonts are Latin; a Korean fallback is required |
| `minimalist-ui`                                                       | Only as a tone reference for typography and color, never for the bento grid                                     |
| `emil-design-eng`, `animation-vocabulary`                             | Together with `animation-review`                                                                                |
| `ui-ux-pro-max-ui-styling`, `beautiful-shadows`                       | Only if `package.json` proves Tailwind (and shadcn for the first)                                               |
| `masked-reveal`, `css-border-gradient`                                | Optional hero or card polish, only with motion-reduce support                                                   |

**Tier C — never install for this task:** `gpt-taste`, `high-end-visual-design`, `design-taste-frontend`, `stitch-design-taste` (they turn a research site into a landing page); `cinematic-scroll-storytelling` (smooth-scroll hijacking conflicts with anchors, keyboard and reduced motion); `webgl-laser`, `webgl-3d-object`, `mesh-gradient-dark-blue-clean`, `dither-background`, `dithered-ui-style`, `brutalism-ui-style`, `industrial-brutalist-ui`, `neumorphism-ui-style`, `claymorphism-ui-style`, `skeuomorphic-ui`, `glass-dark-mode-clock`, `apple-design`, `material-3`; `image-to-code`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, `brandkit`, `ui-ux-pro-max-design`, `ui-ux-pro-max-banner-design`, `ui-ux-pro-max-brand`, `ui-ux-pro-max-slides`, `bento-ui-style`.

### 2B.4 How to install (procedure)

1. Make sure you are inside the cloned site repo on the working branch, with a clean `git status`.
2. Check `node -v` and `npx --version` (step 2.2). Check `codex --version` and note it in `SKILLS_INSTALLED.md`.
3. For each skill: do 2B.1 step 4, then run the documented command from the table (or the one on the skill's page). Run `npx skills add --help` (or the installer's help) to see **non-interactive flags**. Do not assume flag names. If the installer asks questions, choose: agent = Codex, scope = project-local, and answer the rest conservatively.
4. If the documented route fails, use the **manual fallback**: clone the upstream repo into a temporary folder **outside** the site repo, copy only that skill's folder (the one containing `SKILL.md`) into `.agents/skills/<skill-name>/` of the project, and record the upstream commit hash. Do not copy anything else.
5. Run `git status` and apply 2B.1 step 3.

### 2B.5 Verify that each skill really works (do not skip)

1. Start a new Codex task if needed. Open `/skills` (or the equivalent list) and confirm the skill appears.
2. Run a harmless read-only test, for example: "Using `<skill>`, list the rules you will apply to this repo. Do not edit any file." Check that the answer refers to the skill's real content.
3. Record in `docs/design-improve/SKILLS_INSTALLED.md`, one row per skill: name, upstream repo URL, upstream commit or version, install command used, scope (project/user), date, license, what the skill writes to disk (hooks, folders), verification evidence (the `/skills` listing and the test answer), and any problem.
4. If a skill fails verification, report it and continue **without** it. Do not fake that it ran.

### 2B.6 How to use the skills in each phase

| Phase                 | Skill                                                | How                                                                                                                                                                                    |
| --------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 (Baseline)          | `redesign-existing-projects`                         | **Audit-only run.** Ask it to list weak patterns and missing states (hover, focus, loading, empty, error). Save the output to `docs/design-improve/SKILL_AUDIT_redesign.md`. No edits. |
| 1                     | `impeccable`                                         | Read-only commands such as `audit` and `critique` on the home page. Save to `SKILL_AUDIT_impeccable.md`.                                                                               |
| Before building P1/P2 | `visual-plan`                                        | Produce wireframes of the planned changes (author strip, key findings, quick/full toggle, sticky progress rail). Show them to the user and wait for approval.                          |
| D-11                  | `design-system-tokens` (+ `design-dna` if installed) | Extract the existing tokens first, then organize them in layers (base, semantic, component). Do not change the look.                                                                   |
| D-12                  | `hallmark-design-skill`                              | Use its gates to check that sections no longer share one identical template.                                                                                                           |
| D-13, D-14, G-02      | `animation-review`                                   | Review every animation (timing, easing, purpose, reduced motion) and write findings into the PR.                                                                                       |
| Pre-PR                | `make-interfaces-feel-better`, `impeccable` `polish` | Run the checklist on the changed screens. Put results in the PR description.                                                                                                           |
| D-15, D-16            | `kami`                                               | Build the print brief and reviewer one-pager.                                                                                                                                          |

**Do not use** `impeccable` commands that add effects (for example `overdrive`, `delight`) unless the user has approved the related gimmick.

### 2B.7 Rollback

Remove only the files the installer created, as listed in `SKILLS_INSTALLED.md`. Ask the user before deleting anything. Never delete broad paths (`~/.agents`, `.codex`, home folders).

---

## 3. Phase 1 — Baseline (measure before changing)

### 3.1 Install test tooling (dev dependencies only; tell the user)

```bash
npm i -D playwright @axe-core/playwright
npx playwright install chromium
```

### 3.2 Screenshots (`scripts/capture.mjs`)

```js
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = process.env.OUT_DIR ?? "docs/design-improve/screenshots/before";
const viewports = [
  { name: "mobile-375", width: 375, height: 812 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 800 },
  { name: "wide-1536", width: 1536, height: 864 },
];
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
for (const vp of viewports) {
  for (const reduced of ["no-preference", "reduce"]) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: reduced,
    });
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      // trigger lazy content and scroll animations
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.screenshot({
      path: `${OUT}/${vp.name}-${reduced}.png`,
      fullPage: true,
    });
    await ctx.close();
  }
}
await browser.close();
```

Chromium may fail on a very tall page (a size limit around 16,000 px). If so, screenshot each section by element instead: `page.locator('#us-mission').screenshot(...)` for every anchor in section 1.2.
Capture both languages (EN and KO). Find out how the toggle works first (route, query string, or state).

### 3.3 Automated checks to record in `BASELINE.md`

1. **Lighthouse** on a production build (`npm run build && npm start`), mobile and desktop: `npx lighthouse http://localhost:3000 --preset=desktop --output=json --output-path=docs/design-improve/lh-desktop-before.json` (repeat for mobile). Record LCP, CLS, INP/TBT, total JS size.
2. **axe accessibility**:

```js
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(process.env.BASE_URL ?? "http://localhost:3000", {
  waitUntil: "networkidle",
});
const r = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
  .analyze();
console.log(
  JSON.stringify(
    r.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.length,
    })),
    null,
    2,
  ),
);
await browser.close();
```

3. **Anchor integrity** (`scripts/check-anchors.mjs`). This must pass before and after every phase:

```js
import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(process.env.BASE_URL ?? "http://localhost:3000", {
  waitUntil: "networkidle",
});
const missing = await page.evaluate(() => [
  ...new Set(
    [...document.querySelectorAll('a[href^="#"]')]
      .map((a) => decodeURIComponent(a.getAttribute("href").slice(1)))
      .filter((id) => id && !document.getElementById(id)),
  ),
]);
console.log(
  missing.length
    ? "MISSING ANCHORS:\n" + missing.join("\n")
    : "All in-page anchors resolve.",
);
await browser.close();
process.exit(missing.length ? 1 : 0);
```

4. **Report links**: collect every `href` matching `/reports/S\d+` and confirm HTTP 200 using Node's built-in `fetch`.
5. **Design-token extraction**: using `page.evaluate` with `getComputedStyle`, list the distinct `font-family`, font sizes, text colors and background colors in use. Write them to `BASELINE.md`. Do not invent a new brand. Build on what exists.

### 3.4 Manual design audit checklist (fill it in with screenshots)

- Type: body size (target 17–19 px desktop), line height (1.6–1.7; Korean up to 1.7–1.8), prose width 60–75 characters (Korean about 35–45 characters per line), consistent heading scale.
- Contrast: body text ≥ 4.5:1; large text and UI components ≥ 3:1 (WCAG 2.1 AA). Check both light and dark themes if present.
- Touch targets ≥ 44×44 CSS px on mobile.
- Is anything conveyed by color alone? (diagram nodes, status chips).
- Hierarchy: can a first-time visitor name the 3 most important things on the first screen within 5 seconds?
- Mobile: horizontal scroll, text overflow in diagrams, tap area of "Examine connection".
- Korean text: `word-break: keep-all` set? Font actually loaded for Hangul?
  Record findings, then continue to Phase 2.

---

## 4. Phase 2 — Improvement backlog

Priority: **P0** credibility and clarity (low risk, do first), **P1** structure and UX, **P2** visual design, **P3** extras (need approval). Each item has Problem, Change, Acceptance criteria (AC).

### P0

**D-01. No author or context on the home page**
Problem: The text says "I" but the home page never says who wrote it. "About the research" is hidden under "More".
Change: Add a compact author strip under the hero title: `[[NEEDS_USER_INPUT: name]] · [[NEEDS_USER_INPUT: role/school/year]] · Research period [[NEEDS_USER_INPUT: dates]] · Contact [[NEEDS_USER_INPUT: email or link]]`. Put the values in one config file (e.g. `site.config.ts`), not hard-coded in components. Add a visible "About" link in the main nav, not only under "More".
AC: Visible without scrolling at 375 px and 1280 px; all values come from config; no placeholder text ships to production (CI check: `grep -R "NEEDS_USER_INPUT" app src content` must return nothing before merging to main).

**D-02. No "key findings" at the top**
Problem: A visitor must read 24 minutes to learn the results. Strong claims appear only inside collapsed excerpts.
Change: Add a "Key findings" block right after the hero: 3–5 cards. Each card has one sentence, a type badge (Finding / Interpretation / Proposal), and a link to the exact passage anchor.
Rules: Every sentence and number must be copied or closely paraphrased from a passage the site already shows, and carry that passage's anchor. The author must approve the final wording.
Data shape (`content/key-findings.json`):

```json
{
  "findings": [
    {
      "id": "KF-1",
      "type": "finding",
      "statement": "[[NEEDS_USER_INPUT: one sentence]]",
      "sources": [{ "report": "S16", "anchor": "S16-R002-P003" }],
      "numbers": [
        {
          "label": "[[...]]",
          "value": "[[...]]",
          "sourceAnchor": "S16-R002-P003"
        }
      ]
    }
  ]
}
```

Candidate material that appears on the home page (**verify against the full reports and the original sources before using; do not publish unverified**):

- Technology-monopoly vs ESG comparison using ROIC, Ro40, FCF, with Spearman, counterfactual and SHAP analyses (S00-R002-P003, S00-R002-P004).
- Korea semiconductor ICT exports of USD 173.48 billion in 2025, with the author's own caution that export controls are not shown to be the cause (S16-R002-P003).
- CCCC's USD 550 million Greenland airport proposal in 2018 and its withdrawal in June 2019 (S08-R001-P010).
- About USD 260 million of Chinese arms deliveries to Myanmar's junta in 2021–2022 (S08-R003-P001).
- Defense Viability Index from six indicators via PCA and k-means (S17-R003-P001).
  AC: Each card's link scrolls to or opens a real anchor; the block is above the fold on desktop or immediately below the hero on mobile.

**D-05. Section/excerpt mismatch in "Tether"**
Problem: The "Tether: from token reserves to dollar influence" section says S00 focuses on U.S. Treasuries in Tether's reserves, but its only visible excerpt (S05-R004-P013) is about trust and monetary inequality in Korea. The excerpt does not support the heading.
Change: Do **not** invent text. (1) Open the S00 passage `S00-R005-P017` (the section's own link) and, if it supports the Treasuries point, show that passage as the excerpt. (2) Otherwise move the S05 excerpt to a clearly labeled "Related context" slot and flag the gap in `CONTENT_PROPOSALS.md` for the author.
AC: Every section's primary excerpt directly supports the section's headline claim (author sign-off recorded in `CONTENT_PROPOSALS.md`).

**D-06. Empty "0 passages" accordions**
Problem: `#china-governance`, `#korea-platforms` and `#china-cambodia` show "Argument & source excerpts · 0 passages". An empty expandable feels unfinished.
Change: Never render an accordion with zero items. Show either the linked report passages the section already cites (`S00-R005-P001`, `S08-R003-P001`, `S00-R002-P014`, `S08-R002-P002`) if the author approves, or a neutral state: "Excerpts for this section are in the full report →" with the report links.
AC: No UI element in the DOM says "0 passages".

**D-09. Unexplained gaps in study IDs**
Problem: IDs run S00, S01, S02, S03, S05, S06, S08, S11, S13–S17. A first-time visitor wonders what S04, S07, S09, S10, S12 are.
Change: Add one line near "S00 + 12 CONNECTED STUDIES" and in the Archive: "Study IDs follow the author's archive numbering; [[NEEDS_USER_INPUT: why some numbers are absent]]." Do not guess the reason.
AC: A tooltip or sentence exists and is present in both languages.

**D-10. Jargon without definitions**
Problem: ROIC, Ro40, FCF, SHAP, Spearman, PCA, VAR, FEVD, NDS, VEU, HBM, CCCC appear without explanation in places.
Change: Build a `Glossary` component (hover and tap on `<abbr>`-style terms; also a `/glossary` page) that reuses the site's existing "· Term" visual pattern. Standard definitions to start from (the author must confirm that these match their usage):

| Term                                                                                                                                   | Standard meaning                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| ROIC                                                                                                                                   | Return on invested capital                                                                                  |
| FCF                                                                                                                                    | Free cash flow                                                                                              |
| Ro40                                                                                                                                   | "Rule of 40": revenue growth rate plus profit margin, with 40% as a benchmark. **Confirm with the author.** |
| Spearman                                                                                                                               | Spearman rank correlation                                                                                   |
| SHAP                                                                                                                                   | SHapley Additive exPlanations (a model-explanation method)                                                  |
| PCA                                                                                                                                    | Principal component analysis                                                                                |
| VAR / VARX                                                                                                                             | Vector autoregression / with exogenous variables                                                            |
| FEVD                                                                                                                                   | Forecast error variance decomposition                                                                       |
| NDS                                                                                                                                    | National Defense Strategy (U.S.)                                                                            |
| VEU                                                                                                                                    | Validated End User (U.S. export-control status)                                                             |
| HBM                                                                                                                                    | High-bandwidth memory                                                                                       |
| CCCC                                                                                                                                   | China Communications Construction Company                                                                   |
| AC: Terms are keyboard-focusable and screen-reader friendly (use `aria-describedby`); defined once, reused everywhere; both languages. |

### P1

**D-03. 24-minute page has no short path**
Change: Add a "Quick read (2 min) / Full read (24 min)" switch near the hero.
Quick mode shows: hero, key findings, the 6 section headlines with their one summary paragraph, the diagram of the section, and the final proposal. Everything else is collapsed in native `<details>` elements with a "Show reasoning" summary.
Implementation: store the mode in the URL (`?mode=quick`) and read it on load so it is shareable. Default to Full for now unless the author decides otherwise. Without JavaScript, everything should be visible.
AC: Quick mode is under about 3,000 words visible by default (count it); switching does not change scroll anchors; works with keyboard only.

**D-04. Repetition inside each section**
Problem: The 3 bold bullets under each heading are repeated again inside the numbered steps (e.g. "Sensing · satellites and radar" appears several times).
Change: Show the bullets once, as a compact "key terms" row. Inside the steps, show only the step explanation. If a step needs a bullet, show only bullets not already shown in that section. Do not delete text from the data. Hide duplicates at render time with a documented dedupe function and a unit test.
AC: In any one section no identical bullet string is rendered twice.

**D-07. No distinction between evidence, interpretation and proposal**
Problem: Neutral summaries sit next to strongly normative excerpts (e.g., "anti-business policies", firms' "voluntary loyalty"). A critical reader cannot tell which statements are data and which are the author's argument.
Change: Add a small badge to each excerpt and each key claim: **Finding** (measured or documented), **Interpretation**, **Proposal** (normative). Add an optional "Limits and counterpoint" slot under proposals (UI only, content from the author). Add a legend near the hero.
Content note: Do not decide labels yourself. Propose labels in `CONTENT_PROPOSALS.md` with the anchor and your reasoning; the author approves. Where the author's own text already contains a caution (see S16, "These figures alone do not establish that export controls caused the decline"), make that caution visually prominent.
Badges must not rely on color alone (use text and icon). Colors in 5.1.
AC: Every excerpt has exactly one badge; the legend is reachable by keyboard; contrast passes AA.

**D-08. Causal wording in S00 excerpts (content review, not a code task)**
In `CONTENT_PROPOSALS.md`, list passages where the wording is stronger than the evidence described. Example for the author to consider: S00-R002-P003 states "I also found almost no correlation between ESG scores and those measures, obtaining a result that ESG has no substantive influence." A correlation result on selected measures does not by itself show absence of influence. Suggest softer or more precise wording as a **proposal only**. Do not change the live text.

**D-14. Navigation and orientation on a long page**
Change: (a) A sticky progress rail with the six hero steps and scroll-spy highlighting; (b) a "time left" estimate; (c) the existing Contents panel gets scroll-spy; (d) "Back to top" and "Next section" keyboard shortcuts (`j`/`k`) with a visible help overlay (`?`).
Scroll-spy sketch:

```ts
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) setActive(e.target.id);
    });
  },
  { rootMargin: "-40% 0px -55% 0px" },
);
document.querySelectorAll("section[id]").forEach((s) => io.observe(s));
```

Performance: lazy-mount each diagram when it nears the viewport (`IntersectionObserver` or dynamic `import()`); do not run animations off-screen; honor both the OS setting `prefers-reduced-motion` and the site's own "Reduce motion" toggle.
Targets (record before/after): LCP < 2.5 s, CLS < 0.1, INP < 200 ms on a mid-range phone profile (Core Web Vitals "good" thresholds).
AC: Rail never covers content on 375 px; no layout shift when it appears; focus order stays logical.

**D-16. A recruiter/reviewer layer**
Change: Add a "For reviewers" panel or page (linked from nav and footer) with a 60-second summary: the question, the 3 key findings, methods list (only those documented in the reports, e.g. Spearman, SHAP, PCA, k-means, VAR/FEVD, spatial analysis), tools built by the author (NV, NV Alpha, as described in S15), scope and limits, how to read it in 2 minutes, links to PDFs, and contact.
Rules: No claims that are not already in the reports. No credentials or awards the user has not given you.
AC: A stranger can state the question, the method and the main limitation after reading only this panel.

### P2

**D-11. Visual system consistency** (use the audit from 3.4)
Do not rebrand. Consolidate what exists into design tokens (CSS custom properties). If tokens already exist, reuse and name them.
If no coherent palette exists, use this as a starting point and ask the user before applying it:

- Neutrals: one 8–10 step gray scale; accent: one color used for links and primary actions.
- **Region colors**, applied consistently to nav chips, diagrams, the map and the comparison table: United States `#0072B2`, China `#D55E00`, Korea `#009E73` (from the Okabe–Ito color-blind-safe palette). Always add a text label or icon so color is never the only signal.
- **Claim-type colors** for the D-07 badges: use neutral shapes plus text (Finding = filled, Interpretation = outlined, Proposal = dashed) so they stay distinct for color-blind readers.
- Type: one serif or sans for prose, one for UI. Self-host. For Korean, a self-hosted Pretendard or Noto Sans KR (check each license) and `word-break: keep-all`. Use `next/font` if the site is Next.js.
- Spacing: an 8-px scale. Max prose width `~68ch`.
  AC: Token file exists; no hard-coded hex in components (grep check); contrast report attached.

**D-12. Sameness of sections**
Problem: All 18 sections use the same template, so late sections feel monotonous.
Change (layout only, text unchanged):

- America sections: card layout with the institution's role highlighted.
- China (Greenland, Myanmar, Cambodia): map-first layout (see G-04).
- Korea: a side-by-side comparison table for chips/platforms/regulation/defense.
- Method section: a "from record to interpretation" horizontal flow with the PCA chart as the visual anchor.
  AC: At least 4 distinct layouts; every section's anchor and heading text unchanged.

**D-13. Do the diagrams add information?**
Problem: Several "Follow the mechanism" diagrams are word chains (e.g. "Firm Technology Identity Data Contracts Production State capability"). If a click on "Examine connection" only repeats the paragraph, interaction is decoration.
Change: Audit all ~12 diagrams in a table (`DIAGRAM_AUDIT.md`): what new information does it add beyond the text? For each diagram do one of: (a) add information the author already has (direction of influence, evidence level, source anchor per edge, time); (b) simplify to a static graphic; (c) remove interaction but keep the figure. Add a short alt text and a text equivalent for each diagram. Add visible edge labels (verbs) and a per-edge "source" link.
AC: Each diagram has alt text, a keyboard-operable interaction (if interactive), and an audit entry.

**D-15. Metadata and sharing**

- `noindex, follow` is currently set. **Ask the user** whether this is intentional. Do not change it without an answer. If the user wants discoverability: remove `noindex` (in Next.js App Router: `export const metadata = { robots: { index: true, follow: true } }`), add `sitemap.xml` and `robots.txt`.
- Regardless, add Open Graph and Twitter-card tags and a share image (Next.js App Router supports `opengraph-image.tsx`). Add `lang` attributes and `hreflang` alternates for EN/KO if language has separate URLs.
- Add a print stylesheet that yields a clean 2–3 page brief (hide nav and interactive controls, expand `<details>`).
  AC: Link previews render correctly (test with the platform's own debugger); print preview is readable.

---

## 5. Gimmick catalog (P3, **each needs user approval before building**)

Rank by value-for-effort. Effort: S (<0.5 day), M (1–2 days), L (>2 days). Never build a gimmick that harms accessibility or load time. Every animation must respect reduced motion.

| ID   | Gimmick                                              | Why                                                                                            | Effort | How                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G-01 | **Claim → Evidence → Limit** cards                   | Makes the research method visible, supports D-07                                               | M      | A 3-tab card per key claim; data from `key-findings.json`                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| G-02 | **Scroll-drawn diagram edges**                       | Guides the eye through the mechanism; subtle polish                                            | S      | SVG `stroke-dashoffset` animation triggered by `IntersectionObserver`; disabled under reduced motion                                                                                                                                                                                                                                                                                                                                                                                         |
| G-03 | **Evidence-link network with real edges**            | The final S00–S17 graph becomes meaningful                                                     | M      | Build the edges from actual cross-references already in the data (the `from=` links and "Read with its context" links). Add theme filters (technology / identity / strategy, already present) and hover highlight. No invented edges.                                                                                                                                                                                                                                                        |
| G-04 | **Offline SVG map for Greenland, Myanmar, Cambodia** | Spatial research deserves a real map                                                           | M–L    | `npm i d3-geo topojson-client world-atlas` and draw with SVG; no tile server. Places named on the site: Nuuk, Ilulissat, Qaqortoq (Greenland); Anshun, Yunnan, Namsang (Myanmar route); Ream (Cambodia). **Look up coordinates from GeoNames or Wikipedia and record the source in a comment. Do not type coordinates from memory.** Respect what the evidence shows: the site's own term says spatial proximity does not prove transactions or control, so keep that disclaimer on the map. |
| G-05 | **Timeline scrubber 2018–2025**                      | The three-case section already has dated steps (2018, 2019-06, 2021–2022, 2024-08, 2025-04-05) | M      | A range input bound to the existing steps; keyboard operable                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| G-06 | **Source drawer with page jump**                     | Gives readers verification in one click                                                        | M      | Side panel with passage text and a link to the PDF at a page (`file.pdf#page=N`). Use the data that exist; do not embed pdf.js unless needed (heavy).                                                                                                                                                                                                                                                                                                                                        |
| G-07 | **Hypothesis tracker**                               | The S06 passage states two hypotheses explicitly                                               | S      | A small table: hypothesis / method / result as the author states / limit. Statuses (supported, partly, untested) are set **by the author only**.                                                                                                                                                                                                                                                                                                                                             |
| G-08 | **Side-by-side EN/KO reading mode**                  | Strong for a bilingual research site                                                           | M      | Two-column view per section on desktop; falls back to the toggle on mobile                                                                                                                                                                                                                                                                                                                                                                                                                   |
| G-09 | **Command palette (Ctrl/Cmd+K)**                     | Fast jump across 18 sections and 13 reports                                                    | M      | Client-side search with Fuse.js over section titles, summaries and report titles. If the site is a pure static export, Pagefind is an alternative.                                                                                                                                                                                                                                                                                                                                           |
| G-10 | **"What would change my mind" box**                  | Matches the footer line "open to scrutiny"                                                     | S      | Slot under each proposal; text from the author only                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| G-11 | **Copy citation button**                             | Helps readers cite each report                                                                 | S      | Generates APA/BibTeX from `[[NEEDS_USER_INPUT: author name, year, title, URL]]`                                                                                                                                                                                                                                                                                                                                                                                                              |
| G-12 | **Dark/light theme + print brief**                   | Reading comfort; offline sharing                                                               | S–M    | CSS variables; `prefers-color-scheme` plus a manual toggle                                                                                                                                                                                                                                                                                                                                                                                                                                   |

**Do not build:** autoplay audio or video, heavy WebGL globes, parallax that moves text, cursor-follow effects, tracking pixels, chat widgets, popups, or any gimmick that hides the research behind interaction.

---

## 6. Content to add (the author writes or approves; you build the containers)

| ID   | Content                                                                                         | Notes                                                                                                                                                            |
| ---- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C-01 | Executive summary, about 150 words                                                              | `[[NEEDS_USER_INPUT]]`; must be built only from the reports                                                                                                      |
| C-02 | Key findings (3–5)                                                                              | See D-02                                                                                                                                                         |
| C-03 | "How to read this site" box (3 lines: question, structure, quick vs full)                       | UI microcopy; you may draft, the author approves                                                                                                                 |
| C-04 | Methods at a glance table                                                                       | Only methods named in the reports (Spearman, counterfactual, SHAP, PCA, k-means, VAR(2)/VARX(2), impulse-response, FEVD, spatial alignment, NV/NV Alpha tooling) |
| C-05 | Limitations and next steps page section                                                         | Pull from the existing "Methods & limitations" page; do not duplicate with different claims                                                                      |
| C-06 | Changelog (the footer shows "IIR 2.4.3")                                                        | `[[NEEDS_USER_INPUT: version history]]`; link the footer version to it                                                                                           |
| C-07 | Glossary page                                                                                   | See D-10                                                                                                                                                         |
| C-08 | FAQ for first-time readers (What is this? Who wrote it? How long? What is the S-number system?) | Answers about the author come from the user                                                                                                                      |
| C-09 | Cite this / Contact                                                                             | See G-11                                                                                                                                                         |

---

## 7. Engineering quality gates (apply to every PR)

- `npm run build`, `npm run lint`, `npx tsc --noEmit` pass.
- `scripts/check-anchors.mjs` passes; all `/reports/S..` links return 200.
- axe: **zero new** violations compared with baseline; ideally fewer.
- Lighthouse: no metric worse than baseline by more than 5%.
- Keyboard test: Tab through the page; every control reachable and visible focus ring; no keyboard trap in diagrams or the carousel.
- Screen-reader smoke test: landmarks (`header`, `nav`, `main`, `footer`), one `h1`, logical heading order, alt text on figures.
- Reduced motion: with OS setting on, and with the site toggle on, no non-essential motion.
- Both languages checked, including Korean line breaks.
- Bundle: report the JS size difference. Avoid adding more than about 50 KB gzipped for any single feature without approval.
- No `NEEDS_USER_INPUT` placeholders in anything merged to the production branch.

---

## 8. Git and PR workflow

Branches: `design-improve/phase-1` (P0), `phase-2` (P1), `phase-3` (P2), `gimmick/<id>` (each approved gimmick).
Commits: small and imperative, e.g. `Add author strip to hero (D-01)`. Never commit `node_modules`, `.next`, `.env*`.
Push and open a PR:

```bash
git add -A && git commit -m "Add author strip to hero (D-01)"
git push -u origin design-improve/phase-1
gh pr create --fill     # if gh is installed and authenticated; otherwise give the user the compare URL
```

PR description template:

```
## What changed (item IDs)
## Why
## Before / after screenshots (mobile + desktop, EN + KO)
## Checks: build / lint / types / anchors / axe / Lighthouse (numbers before → after)
## Placeholders still open (NEEDS_USER_INPUT list)
## Content proposals needing the author's approval
## Dependencies added (name, version, reason)
```

Wait for the user to review the Vercel preview before merging. Rollback: revert the merge commit (`git revert -m 1 <merge-sha>`). Do not rewrite history.

---

## 9. Questions to ask the user (put in `OPEN_QUESTIONS.md` and ask in one message)

1. GitHub repo URL, public or private, may I push branches?
2. Is `noindex` intentional? Should the site be discoverable by search engines?
3. Author strip values: name, role/school/year, research period, contact.
4. Approve or edit the key findings (D-02) and the claim-type labels (D-07).
5. Why are some S-numbers absent (D-09)? Is "Ro40" the "Rule of 40" (D-10)?
6. Which gimmicks (G-01 to G-12) are approved? Any deadline for the first review?
7. Should Full or Quick be the default reading mode (D-03)?
8. Any brand constraints (colors, fonts) that must stay?
9. Is any analytics allowed? (Default: none.)
10. Skill install scope: project-local (default) or user-wide? May skill files stay uncommitted (default) or be committed?
11. If a skill installer wants to register a hook (for example Impeccable's project hook), may I approve it?

---

## 10. Definition of done

- All P0 items merged; P1 and P2 merged or explicitly deferred with a reason.
- Every approved gimmick passes section 7.
- Before/after screenshots and metrics stored in `docs/design-improve/`.
- `CONTENT_PROPOSALS.md` and `OPEN_QUESTIONS.md` are current.
- No invented facts anywhere; every number on the site traces to a passage anchor.
- `docs/design-improve/SKILLS_INSTALLED.md` lists every installed skill with source, version, scope and verification evidence; no Tier C skill was installed.
- A final summary message to the user lists what changed, what is pending their input, and what was deliberately not done.
