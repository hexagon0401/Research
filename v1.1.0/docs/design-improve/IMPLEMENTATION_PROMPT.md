# Applied redesign prompt

Audit and refine IIR — The Architecture of Power, an existing bilingual research portfolio built with Next.js 16 App Router, React 19 and native CSS. It is a long-form research essay with thirteen parallel Korean/English reports, inline source PDFs and scroll-driven SVG diagrams. It is not a dashboard, and Tailwind CSS is not installed.

Use the original redesign-existing-projects skill: scan the actual code and browser, diagnose demonstrated weaknesses, then make focused changes within the existing stack. Report generic patterns only when present. Do not assume a purple gradient, three-column marketing cards or browser-default fonts; the site already uses self-hosted Geist/IBM Plex and Paper/Ink/Signal tokens.

Prioritize:

1. Typography: balanced readable headings, intact highlighted phrases, natural Korean line breaks, tabular metadata, restrained weights, bounded prose width. Preserve the existing local fonts. Keep author identity visible and the tablet title/author/globe arrangement coherent.
2. Palette and hierarchy: use the existing Paper/Ink neutrals and small Signal accents. Replace confusing glow or repeated framing with clear focus outlines and quieter disclosure hierarchy. Keep geometric lines legible; do not recolor or distort maps.
3. Interaction states: distinguish hover, pressed, keyboard focus and selected states; keep 44px controls, native keyboard behavior and visible focus. Respect OS and site reduced-motion settings. No global scroll hijacking or decorative continuous animation.
4. Orientation and recovery: visible About navigation, meaningful related-source states, glossary index and real source anchors, bilingual 404 with working return paths. Keep native disclosure behavior and no-JS access.
5. Preservation: do not rewrite research, classify author claims without approval, fabricate figures/dates, or replace source identities. Preserve 18 argument anchors, thirteen full studies, 973 bilingual paragraphs, PDF hashes, public API fields and existing URLs/from-query restoration. Keep the existing GSAP/sticky/map engine and the fixed crawler expiry/noindex policy.

Inspect before/after screenshots in English/Korean and normal/reduced motion. Verify build/types, source/PDF preservation, accessibility, responsive layout, glossary/source return paths, keyboard controls and existing scroll diagrams. Measure performance honestly; separate lab TBT from real-user INP and report any untested environment. No runtime dependencies, external fonts, map tiles, analytics, stock imagery or paid services are needed.

The author explicitly authorized integrating all prior design-improve/phase-1 work into main and deploying on 2 November 2026. After verification, commit and push main, then inspect the actual production deployment. Keep v1.1.0 as the deployment root. This instruction supersedes the earlier review-only branch restriction; do not ask for the same deployment permission again.
