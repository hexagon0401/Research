# Releases

## 1.1.1 — 2026-10-21

- Bound the synthesis arrow to its grid column with explicit SVG dimensions and a 144px maximum. Its intrinsic size can no longer expand across the policy text.
- Added a browser regression check for the arrow bounds, text separation, document overflow and proposal link.
- The deployed application's directory remains `v1.1.0`; release versions are recorded in its package and Git tags so Vercel's configured Root Directory stays valid.
- Validation: optimized production build and TypeScript passed; 9 unit checks passed; the new regression passed at 1440, 768, 375 and 390px. A separate 1760px screenshot confirms a 144×144px arrow separated from the text. Safari hardware was not available for direct verification.
