# Phase 1 — author context, source states and glossary

## Changes

D-01 supplied author config and visible About; D-06 useful related-source guidance instead of zero passage counts; D-09 identifier explanation; D-10 existing bilingual glossary index and S06-backed Ro40 formula. Original report data, prose, translations, URLs, anchors, PDFs, palette, scroll engine and crawler deadline preserved.

## Evidence

Before/after hero screenshots: screenshots/before/375-en-no-preference.png and screenshots/after/375-en-no-preference.png; corresponding KO and desktop views are in the same folders. Source-panel screenshots cover all three zero-count cases. Audit JSON captures 16 combinations each.

Build and types pass; 31 unit/content checks and source/PDF preservation pass; Playwright 13 passed, 3 conditional exclusions; 16 before/after views without horizontal overflow or missing anchors; all 13 report URLs 200; sampled desktop axe zero violations before/after. Mobile Lighthouse median 89 versus prior release 90; accessibility/best practices 100. Existing absolute 95 performance goal remains unmet. Fresh desktop Lighthouse, exact JS transfer delta and real-device INP are not claimed; keep these open before merge.

No new dependencies, runtime third-party calls, skills or hooks. Required design-skill provenance could not be verified because the OpenDesign entry point returned 403; see SKILLS_INSTALLED.md. Existing local test tooling was reused.

## Author review

See CONTENT_PROPOSALS.md for three draft findings, Tether primary-excerpt alignment and evidence/interpretation labels. PHASE_2_PLAN.md is a reviewable structural wireframe. These proposals and new gimmicks have not been implemented. OPEN_QUESTIONS.md records the archive inventory mismatch rather than inventing a missing-ID explanation.

Do not merge before preview/author review. No production push or release tag is part of this phase. A Vercel preview URL has not yet been verified.
