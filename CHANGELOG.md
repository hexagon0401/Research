# Releases

## 2.1.0 — 2026-10-22

- Replaced the seven-part homepage presentation with a bilingual S00-led long-form essay, 18 connected arguments, concrete US/China/Korea cases and specific links to supporting source passages.
- Added one continuous concept/world/Arctic/integration visual stage, mobile inline diagrams, native scrolling, bounded pointer response and reduced-motion alternatives.
- Completed 13 Korean reading editions and 973 corresponding editorial English passages. Restored PDF punctuation, reading order and selected tables while preserving raw transcripts and existing PDF/original hashes. English remains pending author review.
- Added paired HTML reading, contextual sentence highlights, legacy anchors, main-return links and a lazy self-hosted PDF viewer with page, zoom, fullscreen and download controls.
- Changed the archive default to all 13 actual reports, retained legacy topics and extended the public report API additively.
- Fixed double scroll compensation during reading-language changes and stopped whole-report prefetching from the homepage.
- Validation and remaining source/platform limitations: v1.1.0/docs/V2_1_RELEASE.md.

## 1.1.1 — 2026-10-21

- Bound the synthesis arrow to its grid column with explicit SVG dimensions and a 144px maximum. Its intrinsic size can no longer expand across the policy text.
- Added a browser regression check for the arrow bounds, text separation, document overflow and proposal link.
- The deployed application's directory remains `v1.1.0`; release versions are recorded in its package and Git tags so Vercel's configured Root Directory stays valid.
- Validation: optimized production build and TypeScript passed; 9 unit checks passed; the new regression passed at 1440, 768, 375 and 390px. A separate 1760px screenshot confirms a 144×144px arrow separated from the text. Safari hardware was not available for direct verification.

## 1.1.2 — 2026-10-22

- Added 13 de-identified source transcripts, stable page/paragraph locators, figure previews and reviewed PDF reading copies. Original binaries and private intake records remain outside Git.
- Kept two different Golden Dome PDFs distinct; newly supplied subjects use S13–S17 without overwriting absent S04/S07/S09/S10/S12.
- Added reusable document preparation, privacy checks, XML memo/footnote parsing and a private Supabase uploader with checksum and signed-download verification.
- Added the continuous-scroll and interaction specification for the next implementation.
- Validation: optimized build and TypeScript; 12 unit checks; 7 Python checks; browser suite 73 passed / 3 intentionally skipped. Reading PDFs are available without a Supabase connection.

## 2.0.0 — 2026-10-22

- Rebuilt the homepage as one continuous reading flow with full-width chapter backgrounds, an accent thread and shared chapter progress.
- Added scroll-driven orbit/line/row motion and bounded pointer response; no scroll-hijacking engine or large animation dependency.
- Added map point exploration and keyboard previews, and separated temporary framework preview from pinned user selection.
- Removed global horizontal-wheel interception, preserved native scrolling, deep links, motion reduction and reading position.
- Completed private cloud preservation of 13 originals and 13 reviewed PDFs; verified remote checksums and every signed download. Large PDFs use resumable uploads.
- See v1.1.0/docs/V2_RELEASE.md for measured validation and platform limits.
