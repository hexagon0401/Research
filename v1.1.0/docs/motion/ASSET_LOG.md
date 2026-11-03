# Asset log — 2026-11-03

**No external asset imported for v2.7.0.** New core-thread/inequality SVGs, signal points and all CSS decoration are authored in source. Existing fonts and terrain stay unchanged. No external icon or raster asset.

| Item                          | Origin / license                                                                                                                                                         | Use and repository path                                 | Change in this release                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | ---------------------------------------------------------- |
| Core thread / inequality icon | Project-authored, no download                                                                                                                                            | src/components/motion/core-thread.tsx, unequal-mark.tsx | New inline geometric primitives                            |
| PCA flow points               | Project-authored; existing graph coordinates                                                                                                                             | src/components/motion/mechanism-story.tsx               | Signals follow existing paths; no empirical data added     |
| Existing terrain              | Natural Earth via world-atlas 2.0.2; existing ISC redistribution notice in node_modules/world-atlas/LICENSE; https://github.com/topojson/world-atlas/blob/master/LICENSE | public/visuals/world.svg, arctic.svg, globe.svg         | Unchanged; lazy delivery and original projection preserved |

Natural Earth terms URL: https://www.naturalearthdata.com/about/terms-of-use/. No new download or fresh terms verification is claimed. A future replacement map pipeline must verify that page and exact coordinate-source licenses before adding assets. Existing country/place reference coordinates are not newly asserted or resourced here.
