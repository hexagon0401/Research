# Redesign refinement results

## Applied

The original `redesign-existing-projects` skill was read at upstream revision e04409a and applied manually. Its full provenance and license checks are in ../SKILLS_INSTALLED.md. The OpenDesign page itself could not be fetched; the upstream standalone instructions were recovered from its own Git history. No broader/Tier C skill or installer was used.

Targeted changes: balanced, compact mobile title; intact highlighted key phrase; correct tablet author/globe order; quieter source disclosure hierarchy; visible Ink focus and hover/active states; tabular metadata; glossary jump index; current-page secondary navigation; bilingual 404 recovery. No research wording, original translation, report identifier, PDF, public API, scroll engine, brand palette or font was replaced.

## Functional and visual checks

- Production build, typecheck, 31 unit/content checks and formatting passed.
- Preservation against a8f5575: original research/translation/backend/media unchanged and all 13 published PDF hashes match; 973 bilingual paragraphs retained.
- Related browser matrix: 56 passed, 8 conditional exclusions. After final tablet/key-phrase correction: 20 targeted browser checks passed.
- Four widths (375/768/1280/1536), both languages, normal/reduced motion: 16 after captures. No horizontal overflow or missing in-page anchors. All 13 report URLs returned 200. Sampled desktop axe A/AA violations: zero before/after.
- Existing diagram regression covers all twelve sticky stages at measured progress positions, narrow and low screens, 200% CSS zoom, frozen enlargement and preserved document paths. No new animation engine was introduced.
- Actual screenshots were viewed: mobile headline changes from six to four lines; author context becomes visible earlier. The initial tablet capture exposed author placement in the wrong grid cell; fixed and covered by a dedicated geometry check. Highlighted headline text stays together instead of drawing an underline across a word break.
- New keyboard checks cover glossary index/source anchors, focus visibility, reduced transitions and 404 recovery. Native details and no-JS content are preserved.

## Performance

Linux Chromium, production builds, Lighthouse mobile simulated throttling, three cold runs per recorded checkpoint. Browser regressions had finished before the new runs. The before record is the previous phase's recorded audit, not a simultaneously rebuilt control.

| Metric (median)         | Phase 1 before refinement | After refinement  |
| ----------------------- | ------------------------- | ----------------- |
| Performance score       | 89                        | 91 (91 / 91 / 91) |
| Accessibility           | 100                       | 100               |
| Best practices          | 100                       | 100               |
| LCP                     | 3184.4ms                  | 3321.6ms (+4.3%)  |
| TBT                     | 176.5ms                   | 116.5ms (−34.0%)  |
| CLS                     | 0                         | 0                 |
| Total transferred bytes | 459493                    | 460219 (+0.16%)   |

The prior release v2.4.3 recorded performance 90 and TBT 152.1ms; the new sample is also better on these two measures. These samples do not establish a causal speedup on every device. The previous phase's relative TBT failure is resolved in this sample; the absolute 95-point goal remains unmet, so the existing audit command still exits nonzero. No threshold was weakened.

No runtime dependency or new client-side component was added by this refinement. Total transfer is not JS-only transfer; an exact independent JS baseline delta was not collected. Fresh desktop Lighthouse, actual-device Safari/screen-reader testing and real-user INP were not performed. No automatic skill-list discovery/restart validation is claimed.

## Review

Before/after images and audit JSON are in before/ and after/. See ../CONTENT_PROPOSALS.md for the separate, still-unpublished wording proposals. Changes stay on design-improve/phase-1 under the source document's review workflow; no production merge, release tag or crawler-period extension is part of this refinement.
