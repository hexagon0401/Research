# v2.1.0 implementation checkpoint — 2026-10-22

## Saved implementation

- All 13 reports have Korean reading editions and complete editorial English translations: 973 paired passages, with matching source fingerprints. English remains author-review-pending.
- Coordinate-based PDF reading order restores S06 punctuation and S15 worksheet cells; the character-inventory audit accounts for documented running headers and the visually checked alpha glyph. Raw report JSON and original/PDF bytes are unchanged.
- Parallel HTML reading, legacy paragraph anchors, contextual highlights, return-to-essay links, restored S14 tables, and an expandable self-hosted PDF.js canvas are implemented.
- The archive defaults to 13 actual reports. Existing topic routes remain available.
- The bilingual S00 essay has 18 connected narrative beats and specific US/China/Korea cases. One concept/world/Arctic/integration visual stage follows native scrolling, with mobile and reduced-motion alternatives.
- Source claims, editorial interpretation and pending external verification are distinguished. Official-source requests were blocked by the environment proxy; inaccessible references are not independently verified.

## Verification at checkpoint

- Reading audit: all 13 documents / 973 translations pass source-fingerprint, coverage and character-inventory checks.
- Unit tests: 18 passing in the preceding session.
- Initial production build and an inline S06 PDF browser smoke check passed before the latest content/layout changes.
- Final production build, browser regression suite, formatting and performance measurements must be rerun against the current tree. Do not infer their completion from the package version.

## Resume and release gates

1. Run formatting, type checking, unit tests and a production build from `v1.1.0/`.
2. Start the fresh production build on port 3001 and run Playwright with `CHROME_PATH=/usr/bin/chromium E2E_BASE_URL=http://127.0.0.1:3001 npm run test:e2e`. Resolve real regressions; retain meaningful assertions.
3. Measure mobile Lighthouse performance and accessibility; record actual results and any remaining limitations.
4. Update release documentation, commit and push, then tag v2.1.0 only once the final checks are complete. Check the public Vercel deployment.

The current checkpoint is intentionally saved before final release verification so work can resume after quota interruption. Do not regenerate reading paragraph IDs blindly: translations and old paragraph links depend on their current fingerprints and maps. No paid translation API, server, subscription or new infrastructure is required.
