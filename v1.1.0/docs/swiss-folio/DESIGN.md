# Swiss research folio — art direction

## Brief

The author asked for a stronger visual identity while retaining Swiss design, reducing errors and preserving research. This revision uses the material already specific to IIR: S00, thirteen source studies, six argument chapters, a documented research period and geographical inquiry.

## One visual system

- **Cover:** large S00 identifier on a restrained geographic plate, paired with the unchanged central question. The globe remains decorative, not an asserted data map. Dates come from the author config and counts from the existing report catalog.
- **Index:** the archive's actual report count and the essay's existing chapter numerals use the same typographic hierarchy. Numbers are identifiers and counts, not fabricated measurements.
- **Paper:** lighter warm paper, Ink typography, muted surface and the original small Signal accents. Selected folders use a paper cover and narrow spine instead of a large bright green field; selection/opening/keyboard behaviors remain.
- **Reading:** stronger chapter hierarchy, clear active-step Ink rule and static heading weights so activation does not change line wrapping. The existing source text, widths and native scrolling remain.
- **Craft:** captions stay on opaque paper strips rather than overlapping decorative coastlines. The synthesis CTA uses the existing SVG arrow rather than relying on a missing font glyph. No new font, icon package or image request.

## Skills actually used

1. **high-end-visual-design**: spatial rhythm, typographic contrast, editorial split and precision of states. The author's Swiss direction takes precedence over the skill's glass, squircle, pill-nav and all-content reveal prescriptions.
2. **minimalist-ui**: restrained surfaces, selective color and editorial hierarchy. Used as a tone/typography reference; no bento grid, faux OS, stock imagery or ambient gradient.
3. **redesign-existing-projects**: inspect existing behavior, use focused upgrades, preserve stack and verify interactions. No dates, names, statistics or source claims were invented to fit a template.

## Source and architecture

Core color values live in tokens.css. folio.css is the explicit art-direction layer; existing functional refinements and the tested scroll/map engine are retained. The new plate is HTML plus the existing local SVG. No new runtime dependency, third-party request, paid service or constant animation was added.

The first browser pass identified decorative map lines behind captions; the caption/metadata strips now have their own opaque surface. Step activation uses a border cue with constant heading weight to avoid height changes. Sixteen viewport/language/motion captures and interaction tests are recorded separately.
