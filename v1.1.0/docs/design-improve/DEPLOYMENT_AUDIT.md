# Deployment audit — applied prompt

The applied prompt is IMPLEMENTATION_PROMPT.md. The author explicitly authorized main integration and deployment, overriding the earlier review-only workflow. This audit includes all completed phase-1 and redesign-refinement work.

| Requested area     | Actual code finding                                                                                       | Applied treatment                                                                                                      |
| ------------------ | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Framework          | Next.js 16 / React 19, native CSS; no Tailwind dependency                                                 | Retain stack; do not install Tailwind or migrate components                                                            |
| Typography         | Existing self-hosted Geist / IBM Plex; mobile headline wrapping and tablet composition needed improvement | Balanced headings, intact highlighted phrase, compact mobile scale, corrected author/globe grid, tabular metadata      |
| Palette            | Paper/Ink/Signal already established; no purple marketing gradient                                        | Preserve palette; use Ink focus and restrained neutral hover surfaces, keep Signal on meaningful graphics              |
| Generic layouts    | Three-country research comparison is a real data comparison, not a generic feature-card row               | Preserve its meaning and order rather than replacing it for novelty                                                    |
| States             | Legacy focus glow persisted on reading/source links                                                       | Consistent 2px Ink focus, visible hover underline and reduced-motion parity                                            |
| Empty/error states | Zero-passage captions and an unhelpful 'still unwritten' 404                                              | Useful related-source guidance, bilingual 404 and working recovery links                                               |
| Orientation        | About was hidden; glossary terms were distributed                                                         | Visible About, supplied author config, bilingual glossary and native jump list                                         |
| Content            | Thirteen full studies and existing source anchors                                                         | Keep original research/translation/PDF/API unchanged; do not publish proposed claim labels or revised research wording |
| Motion             | Existing tested GSAP/ScrollTrigger + sticky diagrams                                                      | Keep native scroll, map alignment, stop/reverse behavior and static fallbacks                                          |

Skill installation: the requested current upstream alias was removed. The exact original was installed via Skills CLI 1.7.4 from the verified e04409a source, then confirmed by `skills list --agent codex --json`; see SKILLS_INSTALLED.md. The installed source hash matches the already-read original. No unrelated skill, hook, new runtime dependency, external font or paid service was added.

Final release checks and production observations are recorded in ../V2_4_4_RELEASE.md. A passing HTTP status alone is not treated as UI verification.
