# Baseline and scope

Base: `0aeb4ed` / v2.4.3, repository `hexagon0401/Research`, production `main`, app root `v1.1.0/`. Existing authenticated Git transport is reused. No repository URL, identity or source claim was guessed.

- Next.js 16.4.2 App Router, React 19, Node 24.19.0, npm 11.9.0; package-lock.json. Baseline production build passed before edits. No lint script is configured; typecheck and Prettier are used.
- Global CSS: tokens.css, globals.css, story.css, motion.css. Paper #e6e8e6, Ink #0e131f, Signal #0efb2e. Existing Geist / IBM Plex fonts and local Korean fonts retained; no rebrand.
- Editorial data: essay.ts / visuals; preserved originals/readings/translations in src/content, public/report-pdfs. Language uses React preferences + localStorage, shared URLs. Existing hash and from-query restoration retained.
- Existing GSAP + ScrollTrigger, sticky CSS diagrams, China scrubber, map data and parallel report reader already implement G-02/G-04/G-05/G-08 in substantial part. Do not rebuild them or replace scalable drawing masks with dashed visible paths.
- Robots: explicit dynamic robots.txt route; noindex intentional. Fixed crawler expiry remains 2026-11-05 16:08:44 KST. No indexability changes.

## Measured browser baseline

`screenshots/before/audit.json`: 375×812, 768×1024, 1280×800, 1536×864; EN/KO × normal/reduced motion = 16 views. Hero screenshots and three affected source panels captured. No full-page tall-image capture or claim of an exhaustive manual diagram audit.

Baseline: zero horizontal overflow, missing in-page anchors or axe WCAG A/AA violations in the sampled desktop audit. All 13 report URLs returned 200. Empty passage labels occur at china-governance, china-cambodia and korea-platforms. Computed tokens are saved per view.

Prior v2.4.3 three-run mobile release baseline: performance 90, accessibility 100, best practices 100; see ../validation/v2.4.3-after-lighthouse.json. This is a prior release measurement, not a fresh desktop audit. INP/real-device field data were not collected; lab TBT is not INP.

## Manual audit

- Preserve body sizes, line height, reading width, monochrome line graphics and reduced motion.
- Empty excerpt counts and hidden About navigation obscure orientation; corrected in this phase.
- Author context was absent; now supplied by the author and stored in config.
- Existing five term definitions can be reused without author-text edits. S06 provides an explicit Rule of 40 formula.
- Long page repetition, evidence labels and chart information density need the proposal/review phase before structural changes.

## Current scope

P0: D-01 supplied author identity + visible About, D-06 meaningful related-source state, D-09 identifier explanation without inventing gap reasons, D-10 shared existing definitions + source-backed Rule of 40 index. D-02/D-05 and new claim labels are review proposals. No new runtime dependency, external fetch, tracking, effect or paid service.

## After checks

Final production build and 16 after-captures passed. The 3 zero-count panels no longer display zero-passage copy; anchors and 13 report responses remain intact. axe: zero sampled A/AA violations before and after. Playwright: 13 passed / 3 environment-conditional skips, including author visibility in the first viewport, Korean navigation, glossary-to-exact-source navigation, existing source disclosures and diagram regression.

Fresh mobile Lighthouse runs after the changes: see lighthouse-mobile-after.json. Median performance 89 (prior release 90, a 1.1% score reduction); accessibility/best practices 100. The existing 95 target remains unmet, so audit:performance exits nonzero; no threshold was lowered. Desktop Lighthouse, real-device INP and a byte-exact baseline-versus-after JS transfer comparison were not measured in this phase and remain pre-merge checks. No new dependencies or third-party runtime requests were introduced; new author/glossary presentation uses server components and existing localization.

This is a review branch, not a declaration that every backlog item or engineering gate is complete. Research wording proposals and P1/P2 structural changes await review under the attached request.

Metric-level gate: prior release median LCP 3315.4ms → 3184.4ms; CLS 0 → 0; total transfer 458515 → 459493 bytes (+0.21%). Median TBT 152.1ms → 176.5ms (+16.1%) exceeds the document's 5% metric tolerance. The runs vary (after 140/176.5/216ms), so this needs a controlled fresh baseline and performance investigation before merge. Do not treat the small overall score difference as proof that all performance gates passed. This is an unfinished performance gate on the review branch.
