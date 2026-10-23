# v2.4.0 implementation checkpoints

- [x] 1. Seven chronological Chinese scenes, date/evidence metadata, source references, shared lazy GSAP 3.15.0 / ScrollTrigger / MotionPathPlugin engine and geographic relationships. Commit `f0ccc33`.
- [x] 2. Origin, American mechanisms, Korean structures, method lens and research convergence. Commit `29c4f31`.
- [x] 3. Responsive / bilingual / motion reduction / source-return restoration and browser tests. Commit `575ea0f`.
- [x] 4. Browser regression, real wheel/touch, source preservation, performance measurement, release documentation. Final release commit adds resize-fit handling, loading optimizations and the v2.4.0 version.

Deployment root stays `v1.1.0/`. Research data, translations, PDFs and backend contracts remain locked. No new shipping facts or numerical research results are introduced.

2026-10-23: Final production regression: 157 passed / 23 conditional skips / 0 failed, plus a strengthened desktop pin-fit regression passed separately. 22 unit/content tests, build, typecheck, format and preservation audits passed. All thirteen studies / 973 paired passages and 13 PDF hashes remain unchanged.

**Performance target remains open:** the final three mobile Lighthouse runs were 91 / 93 / 93 (median 93), accessibility 100. An earlier build reached median 95, but this is not reported as the final result. The existing >=95 performance gate is preserved and currently fails. See [release evidence and limits](V2_4_RELEASE.md).

Implementation and release are ready; further performance work should focus on initial layout/hydration rather than adding more motion. No paid service or deployment-root migration is needed.
