# redesign-existing-projects — applied audit

Baseline: feature-branch code `d38e297` (documentation-only follow-up `3825884`). Existing phase-1 after screenshots are copied to before/. New screenshots are in after/.

## Scan

Next.js App Router / React / native CSS / Geist and IBM Plex. Existing stable report readers, CSS sticky + GSAP drawings, native details and a local-font brand. These are retained. No dependencies or runtime network requests added.

## Diagnose → fix

| Observed weakness                                                               | Targeted change                                                                               | Preserved                                                 |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Mobile hero uses six short lines, pushing context downward                      | Smaller fluid mobile display type, wider title measure, balanced wrapping and a bounded globe | Exact headline, author data and globe artwork             |
| Source disclosure has borders above and below nested inside bordered steps      | A single inset rule, quiet closed state and stronger open-state rule                          | All detail IDs, native details, excerpts and source links |
| Several hover/focus states rely on the global Signal glow                       | Thin Ink focus outline, subtle pointer hover and active surface                               | Keyboard visibility and 44px controls                     |
| Reading metadata can move with proportional numerals                            | Tabular numeric figures                                                                       | Same dates and values                                     |
| Body/heading line endings are uneven                                            | Progressive text-wrap balance/pretty                                                          | Prose wording and reading width                           |
| Glossary requires scanning all entries to locate a term                         | Native linked term index using existing stable term anchors                                   | Existing definitions and exact source destination         |
| More does not indicate the currently open secondary page                        | Current-page state on its summary                                                             | Escape, keyboard and navigation behavior                  |
| 404 says a missing document is 'still unwritten' and mentions planning excerpts | Clear bilingual missing-page message with archive and main-essay recovery                     | Actual HTTP 404 status                                    |
| New LinkedIn label carries an unnecessary arrow glyph                           | Plain underlined LinkedIn label                                                               | Supplied URL and external-link protection                 |

## Skill interpretation

Applied the original standalone MIT skill (e04409a), not the current broader taste skill. Existing Geist already meets its typography recommendations. Signal is an established brand accent and remains limited to small highlights. No new palette, photography, glass effects, noise, scroll hijacking or invented facts were introduced.

A restart or skill-discovery UI was not claimed. The instructions were read directly and the resulting implementation is tested below.

## Acceptance checks

Before/after captures: four viewports × two languages × normal/reduced motion. Inspect title readability, author visibility, source-panel hierarchy, missing anchors, horizontal overflow and sampled axe violations. Browser regressions cover all twelve sticky diagrams at measured progress positions, narrow/low/zoomed screens, keyboard, no-JS and existing report paths. Fresh results are appended to RESULTS.md after the checks finish.
