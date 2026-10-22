# v2.1.0 implementation checkpoint

The user approved the S00-led long-form narrative, one connected visual stage,
layout-only Korean editing, thirteen complete editorial English translations,
parallel reading and an expandable self-hosted PDF viewer.

## Completion gates

- [x] Coordinate-based PDF reading editions; S06 page 5 compared to PDF.
- [ ] All 13 Korean reading editions reviewed for layout and source coverage.
- [ ] All 13 English editions complete and cross-checked; author review pending.
- [ ] Parallel reader, stable legacy anchors, contextual highlights and PDF viewer.
- [ ] Archive defaults to 13 actual reports, with existing topic routes preserved.
- [ ] Long-form bilingual S00 narrative and specific country cases.
- [ ] Connected visual stage, Arctic inset, native scroll and reduced motion.
- [ ] Production build, relevant unit/browser/coverage checks and measured performance.
- [ ] Version/tag v2.1.0 pushed and public deployment checked.

## Preservation and external dependencies

Existing raw transcript JSON, original files, reviewed PDFs and their fingerprints
remain unchanged. Reading editions and translations are separate derived content.
No paid translation API, server or subscription is authorized or needed.

Official-source requests currently receive a proxy 403. Additional source and
free model download domains were saved to the environment draft on 2026-10-22;
the running environment must be updated through environment settings before
those destinations can be verified. Do not describe inaccessible references as
independently verified. Keep author interpretations separate from checked facts.

Translations must be checkpointed by document, with text fingerprints so later
Korean corrections cannot silently leave stale English translations. Do not mark
this release complete while a document is missing its full English edition.

## Checkpoint: S00 and S06

S00: 192/192 passages; S06: 30/30 passages have full editorial English
translations, including source notes and references. Translation status is
author-review-pending. Source fingerprints match the current Korean edition.
The parallel reader, source-location aliases and lazy PDF canvas are implemented;
functional browser verification is still outstanding. Other reports remain in progress.

## Checkpoint: complete translations 9/13

S00, S01, S02, S03, S05, S06, S08, S13 and S16 are complete editorial
translations (author review pending). The remaining reports are S11, S14, S15
and S17. S03/S13 share checked translations where content matches, while the
documents retain distinct source identities and paragraph maps.

The long-form homepage, actual-report archive, shared polar/world/concept stage
and contextual evidence notes are implemented. An initial production build
passed, and Chromium rendered an inline S06 PDF without page errors. Initial
paired-reader inspection found an inherited width limit; it was removed. Final
regression, coverage, accessibility and performance checks remain outstanding.
