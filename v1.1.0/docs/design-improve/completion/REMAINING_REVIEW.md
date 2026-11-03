# Remaining decisions — ready for editorial review

These are proposals, not production changes or requests for deployment permission. The reading interfaces are implemented. REQUEST.md §0.2.2 and D-07/D-08 reserve research wording and epistemic labels to the author.

## 1. Claim labels and source cautions (D-02 / D-07 / D-08)

- **S06-R006-P002:** proposed _Interpretation_. The excerpt defines the financial scope of the author's ESG argument; it is not an independent test of all social/environmental effects. Retain the current exact quote and full-context link.
- **S16-R002-P003:** proposed _Finding, as reported by the author_. Keep the source's statistical observation and causal caution together. Do not label it a causal effect of export controls.
- **S17-R003-P001:** keep _method passage_ in the reading guide rather than forcing a method description into a substantive Finding badge. Any final research-result card should be selected separately by the author.
- **S00-R002-P003:** proposed wording for review only: “선택한 표본과 지표에서 ESG 점수와 재무적 지속가능성 지표 사이의 뚜렷한 상관관계가 관찰되지 않았다.” / “Within the selected sample and measures, the analysis did not show a clear correlation between ESG scores and the financial sustainability measures.” This narrows the inferential claim; it is not a reproduced analysis. The published original is unchanged.
- **S00-R005-P017:** its description of Tether's financial role is now the primary excerpt, but its legal privilege/monopoly assertions still require independent legal support before being presented as verified facts. Preserve quotation attribution.

Next implementation after author review: store approved labels by exact paragraph ID; display text/shape badges and a concise legend; pair approved existing cautions. Never derive labels from keywords at runtime or apply one badge indiscriminately to a mixed paragraph.

## 2. Proposed abstract (C-01; not published)

This portfolio asks how corporate capability becomes national power. It begins with corporate survival and technological purpose, then compares the institutions that connect firms with national strategy. American cases consider procurement, missile defense, stablecoin finance and shipbuilding. Chinese cases examine ownership and overseas business across Greenland, Myanmar and Cambodia. Korean cases address semiconductors, platforms, regulation and defense. Three source passages offer an initial route through the argument: S06 clarifies the financial scope of the sustainability inquiry, S16 places export changes beside a causal caution, and S17 explains its use of PCA and clustering. The synthesis connects these different questions with the conditions and responsibilities of state–firm cooperation. The site provides Korean originals, editorial English translations and source PDFs so readers can examine the argument in context. The reports' stated analyses, the author's interpretations and independent verification remain distinct; the site does not claim to reproduce their empirical results.

Sources: existing essay leads and chapter order; S06-R006-P002, S16-R002-P003, S17-R003-P001; existing /methods. This is an editorial draft requiring the author's approval, not a newly attributed author statement.

## 3. Glossary and inventory (D-09 / D-10)

[Term usage review](TERM_REVIEW.md) records the requested standard meanings alongside actual occurrence anchors. Existing definitions and source-confirmed Rule of 40 stay published. Expand only after confirming each term's intended usage; reuse a single shared definition and keyboard/tap disclosure. Do not infer why S-number gaps exist from a thirteen-record manifest.

## 4. Diagram evidence (D-13)

The twelve-scene inventory remains in DIAGRAM_AUDIT.md. For each edge: record the actual source locator, relation verb, whether it is a reported event or conceptual interpretation, and any missing support. Publish exact per-edge links only after that mapping. A thematic contribution to S00 does not establish an independently verified empirical citation. Existing labelled mechanisms and original-source links remain readable in the meantime.

## 5. Deferred enhancements and measurement

- A remaining-time model needs word weights and a policy for expanded sources; raw scroll distance is distorted by long illustration stages. The current measured overview word count is supplied instead.
- Physical-device INP, Safari/Firefox and social-platform preview debuggers were not available. Do not call them passed from a Chromium/axe/Lighthouse result.
- New hypothesis verdicts and “what would change my mind” text must come from the author. No empty or invented boxes were published.
- Source drawers, command search and dark theme remain optional. Existing source passages/PDF reader, Contents/chapter shortcuts and the light Swiss palette cover the immediate needs. Implement them only if a demonstrated reader need justifies additional UI and contrast testing.

## 6. Initial-load performance follow-up

The final mobile lab median is 88 / accessibility 100; the 95 goal and the original relative-timing gate are not claimed complete. Next: build v2.5.0 and v2.6.0 with the same dependencies in an isolated, matched environment; collect three serial cold runs per build without concurrent test runners; inspect the actual LCP element, font/resource timing and hydration long tasks; change critical font/CSS or hydration scheduling only where that trace demonstrates a bottleneck. Keep every run, recheck the same URLs and retain no-JS/reduced-motion/source locks. Word measurement and initial control activation have already been deferred where unnecessary, and speculative report prefetch is disabled. Lab TBT must not be reported as physical-device INP.
