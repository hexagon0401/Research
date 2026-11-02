# v2.4.2 checkpoints

Base: v2.4.1 (`4dea481`). App root remains `v1.1.0/`.

- [x] Measurement: 100 geometry samples at four viewports, three native wheel runs per viewport, idle mutations, screenshots; reproducible geometry regressions added. Baseline Lighthouse runs are captured separately before changing runtime code.
- [x] Geometry: isotropic frames, shared overlays, monotonic geographic curves, local travelers and route-before-camera sequencing. Production build, 29 unit checks and all six dedicated desktop/mobile geometry regressions pass.
- [x] Scroll runtime: one animation driver, cached measurements and active-scene updates; localized hero styling and cached visible passage positions replace inherited page-wide scroll variables. Added scale-independent reveal masks after visual inspection exposed fragmented strokes; frozen dialog copies remap mask IDs. Production type/build and 30 targeted browser checks passed before the final full matrix.
- [ ] Full matrix passed: 197 checks, 31 conditional exclusions, zero failures; off-screen rendering refinement passed 34 additional checks. Final validation, before/after measurements, v2.4.2 release and live verification.

The first checkpoint deliberately retains failing geometry regressions. Source studies, translations, PDFs and API/backend contracts are unchanged.
