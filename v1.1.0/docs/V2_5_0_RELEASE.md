# v2.5.0 — Swiss research folio

2026-11-02. Existing deployment root v1.1.0 and free Vercel/Supabase configuration retained.

The author's brief was to preserve Swiss design while restoring visual individuality and reducing errors. This release unifies the S00 cover, real archive count and chapter indices; refines paper/surface hierarchy; quiets large green selection fills; and keeps source text and interactions intact. [Art direction](swiss-folio/DESIGN.md), [web references actually read](swiss-folio/WEB_REFERENCES.md), [verified skill installation](design-improve/SKILLS_INSTALLED.md).

The high-end-visual-design name has moved from taste-skill to its official taste-skill-classics repository. Both high-end-visual-design and minimalist-ui were installed through Skills CLI and used with the existing redesign skill. Incompatible generic effects were not applied to the research interface.

No source report, full translation, PDF, public API or geographic dataset was changed. No new runtime package, remote asset, paid service or scroll engine was introduced. Source anchors, native scroll, keyboard/touch, reduced-motion and no-JS readers remain acceptance requirements.

The temporary crawler window and noindex policy are unchanged; the absolute expiry remains **2026-11-05 16:08:44 KST**. Verification and operating results are appended after execution.

## Verification

- Production build, TypeScript and 31 unit/content tests passed. Preservation audit confirmed unchanged research, translations, paragraph IDs, public APIs, backend and media; all 13 PDF hashes match. The reading audit confirmed 13 studies and 973 bilingual passages.
- Full Chromium browser matrix: **242 passed, 34 conditionally skipped**, zero failures, across desktop, tablet and two touch/mobile sizes. Conditional skips are not reported as passes.
- [Sixteen viewport/language/motion captures](swiss-folio/after/audit.json): widths 375, 768, 1280 and 1536; EN/KO; ordinary/reduced motion. No horizontal overflow or missing beat anchors; all 13 report URLs returned 200. The sampled desktop axe audit reported zero violations. Archive/chapter captures are included separately.
- Mobile Lighthouse 13.5.0, simulated throttling, three serial local production runs: performance **92 / 90 / 84**, median **90**; accessibility **100** and best practices **100** in every run; CLS **0** in every run. The 95 performance target remains unmet. Median TBT 188.5ms, median LCP 3165.9ms. [All three summaries](validation/v2.5.0-lighthouse-mobile.json). These are lab scores, not a field INP or device performance claim.
- Archive and synthesis arrows use the existing SVG icon to avoid font-dependent missing glyphs. The archive-only final correction was rebuilt and checked separately after the full matrix: four viewport checks passed.
- No Safari/Firefox or physical-device run was performed in this environment. No material performance gain is claimed from CSS wrap changes alone.

Production verification follows deployment below.
