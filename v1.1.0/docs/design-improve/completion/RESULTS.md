# v2.6.0 — completing the design brief

3 November 2026 KST. Baseline main 4c496a7 / v2.5.0. App/deploy root v1.1.0; free Vercel/Supabase configuration retained. [Item-by-item status](STATUS.md) · [Implementation plan](PLAN.md).

## What changed

- Existing v2.5.0 work already supplied the author strip, About, source empty states, glossary, fixed maps/PCA/timeline and Swiss tokens/folio. Those are not presented as newly implemented.
- Three compact source rows resolve exact Korean/English sentences from preserved S06, S16 and S17 passages. S16's existing causal caution appears beside the statistics. Source links preserve full context; no independent-verification badge is invented.
- Six-chapter Quick/Full reading uses ?mode=quick and native details. Full remains default and no-JS remains open. Chapter/topic hashes, browser history and report-return mode survive. Actual visible English main content measured 1,006–1,022 words at the captured widths; Korean 912–928 Intl.Segmenter word units. The smaller UI count explicitly covers only overview/source-guide text. No fictional two-minute promise.
- Tether now quotes S00-R005-P017 as its primary source; S05 remains related context. Exact repeated bilingual facts are removed at render time without editing arrays or research.
- Desktop chapter rail, j/k chapter navigation, ? help and focus restoration reuse the native scroll/spy. No extra scroll engine or global search dependency.
- /reviewers supplies source rows, four source-backed method rows, scope link, FAQ, all thirteen PDFs/full texts and the supplied contact. Citation copy in reports has a selectable fallback. /changelog links actual version tags and the footer.
- A self-hosted PNG and Open Graph/Twitter metadata support sharing. The reviewer brief prints as **two A4 pages in both languages**, verified with Chromium PDF output and pdfinfo; [English sample](print-brief-en.pdf), [Korean sample](print-brief-ko.pdf). This is a compact brief, not a claim that the entire long essay fits two pages.

## Preservation and boundaries

Original Korean text, 973 full translations/paragraph pairings, PDF hashes, public API/backend, geography and original 18 argument IDs are preserved. The sole essay-data change is excerpt selection, not research wording. No new runtime dependencies, fonts, analytics, map server or paid services. noindex and the original absolute crawler expiry are unchanged. Language remains preference state, so no fabricated hreflang routes are emitted.

Final epistemic classifications, research-wording corrections, a new abstract and hypothesis support statuses remain author decisions. Extra drawers/search/dark theme are explicitly deferred with reasons in STATUS.md. They are not silently marked complete or treated as deployment blockers.

## Measurements and validation

Source/PDF preservation, TypeScript/build, unit/browser results, performance and live deployment are recorded below after execution. Screenshots compare the retained [v2.5.0 visual baseline](../../swiss-folio/after/audit.json) with the new Quick/source/reviewer paths in this folder. [Capture measurements](captures.json) distinguish viewport/language and actual overflow checks. [JS before](bundle-before.json) and [JS after](bundle-after.json) measure the fresh English home script responses, gzip-compressed individually; they are not a route-exclusive bundle or on-wire transfer measurement.

Validation found and corrected two regressions: the new rail needed wrapping at 200% zoom; exact text returns needed to retain the pinned reading offset when automatic focus scrolling moved a long citation into view on tablet browser Back. Text passages also clear unrelated diagram-return state. Generic motion changes were not used as a workaround.

External social-platform preview debuggers, physical-device INP and actual assistive-technology sessions are not claimed tested. Browser/axe, PDF layout and lab Lighthouse measurements are reported separately.

### Executed checks

- Production build and TypeScript passed; **32 unit/content tests passed**. Preservation audit confirms the a8f5575 protected baseline unchanged and all thirteen PDF hashes matching. Reading-edition audit confirms 13 reports / 973 bilingual passages; the anchor checker passes.
- Complete Chromium regression: **266 passed / 34 conditional skips / zero failures** (300 checks, three workers). After final accessible-dialog naming and prefetch changes, the reading-path suite passed **24 focused checks**. After deferring unnecessary Full-mode counting and initial control activation, **12 mode/source-return checks** passed. Counts are separate runs, not summed as unique coverage.
- English and Korean rendered bullet audits show **zero identical repeated facts** within argument sections. The pure dedupe unit test also checks non-mutation and language-specific differences.
- Reviewer route and open keyboard-help dialog axe checks reported zero WCAG-tagged violations. Quick/Full, direct/shared anchors, Back, all three source-entry returns, touch/keyboard, no-JS full text, reduced motion, PDF controls and existing maps/PCA are covered by the browser suites. Physical devices and actual screen-reader sessions remain untested.
- Print samples are two A4 pages each. New path screenshots show no horizontal overflow at captured 375/1280 EN/KO views; the retained home matrix covers 320–1920 and 200% zoom.

### Initial-load performance

Final Lighthouse 13.5.0 mobile/simulated throttling, three serial production-build runs: **91 / 82 / 88**, median performance **88**; accessibility **100**, best practices **100**, CLS **0** in every run. Median FCP 1679.3ms, LCP 3194.0ms, TBT 226.0ms. The 95-point goal remains unmet. [Final raw summaries](lighthouse-final.json).

For comparison, the historical v2.5.0 median was 90 / accessibility 100, FCP 1545.4ms, LCP 3165.9ms and TBT 188.5ms. Scores and individual timing metrics vary: the final TBT range is 158–256ms; historical 149.5–201ms. A controlled same-session A/B was not performed, so no causal performance gain is claimed, and the original no-metric-worse-than-5% gate is **not claimed passed**. Initial pre-optimization groups are retained in lighthouse-before-count-deferral.json and lighthouse-after-count-deferral.json rather than discarded.

The default Full path now skips Quick-only word measurement and activates controls after the layout-critical initial phase; Quick resolves before paint to preserve bookmark positions. Report links disable speculative full-report prefetching. These remove demonstrated unnecessary work, without representing a lab target miss as completion. Remaining initial-load profiling is explicitly tracked in STATUS.md and REMAINING_REVIEW.md.

### Production deployment

Application commit **b68ba11** was pushed to main and visible on https://research-hxgn.vercel.app. Direct production verification completed on **3 November 2026, 10:13 KST**.

- Existing scene/PCA/airport/source behavior passed at 1440×1000, 390×844 touch, 1440×500 and 320×568. Touch moved the comparison control to 85%; all eight PCA snapshot masks resolve, labels remain separate, and language/manual state survives. Glossary source navigation, bilingual 404 recovery, noindex and no-store robots behavior also passed. [Core results](production-core.json).
- New live routes passed: Quick source-entry return with mode/position preservation, touch Full switching, keyboard-help naming/focus restoration, 13 PDF entries/four method rows, native clipboard write/read of the known report citation, Korean reviewer page, PNG sharing image, version-history route and no-JS full text. No speculative report fetch occurred while reading/scrolling the reviewer page. No page errors were collected. [New feature results](production-new.json), [live mobile capture](production-reviewer-mobile.png).
- The crawler expiry, source/API locks and free deployment root remain unchanged. The production app was checked directly; no external social preview debugger or physical-device result is inferred from it.

The final release documentation commit/tag retains the same application code. GitHub main and the annotated v2.6.0 tag are pushed after recording these results.

Measured fresh-home JS gzip sum: 207,404 → 210,222 bytes (**+2,818 bytes**). This is the independent gzip sum of decoded script responses, not network transfer bytes or a route-exclusive bundle. No runtime package was added.
