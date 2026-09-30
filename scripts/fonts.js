// fonts.js — the site's three typefaces, self-hosted from /fonts/.
//
// The files are the exact WOFF2 subsets Google Fonts serves for
//   Archivo Black · Inter Tight 600–900 · Inter 400–700 (display=swap)
// with the same unicode ranges, so a browser downloads only the subsets a
// page uses (latin for almost every page; greek on /ask-me-anything/el) and
// rendering is identical. Self-hosting keeps the render-critical font CSS
// inline and on the site's own origin (no third-party request before first
// paint, no visitor IP sent to Google). File names carry the upstream
// version, so /fonts/* can be cached immutably (netlify.toml).
//
// Used by scripts/gen-site-pages.js (the 25 page shells) and
// scripts/sync-fonts.js (the hand-made pages: the two tools,
// /ask-me-anything/el and 404.html).

// [family, weight range, file, unicode-range]
const FACES = [
  ['Inter', '400 700', 'inter-v20-latin.woff2', 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'],
  ['Inter', '400 700', 'inter-v20-latin-ext.woff2', 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF'],
  ['Inter', '400 700', 'inter-v20-greek.woff2', 'U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF'],
  ['Inter', '400 700', 'inter-v20-greek-ext.woff2', 'U+1F00-1FFF'],
  ['Inter', '400 700', 'inter-v20-cyrillic.woff2', 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116'],
  ['Inter', '400 700', 'inter-v20-cyrillic-ext.woff2', 'U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F'],
  ['Inter', '400 700', 'inter-v20-vietnamese.woff2', 'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB'],
  ['Inter Tight', '600 900', 'inter-tight-v9-latin.woff2', 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'],
  ['Inter Tight', '600 900', 'inter-tight-v9-latin-ext.woff2', 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF'],
  ['Inter Tight', '600 900', 'inter-tight-v9-greek.woff2', 'U+0370-0377, U+037A-037F, U+0384-038A, U+038C, U+038E-03A1, U+03A3-03FF'],
  ['Inter Tight', '600 900', 'inter-tight-v9-greek-ext.woff2', 'U+1F00-1FFF'],
  ['Inter Tight', '600 900', 'inter-tight-v9-cyrillic.woff2', 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116'],
  ['Inter Tight', '600 900', 'inter-tight-v9-cyrillic-ext.woff2', 'U+0460-052F, U+1C80-1C8A, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F'],
  ['Inter Tight', '600 900', 'inter-tight-v9-vietnamese.woff2', 'U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB'],
  ['Archivo Black', '400', 'archivo-black-v23-latin.woff2', 'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'],
  ['Archivo Black', '400', 'archivo-black-v23-latin-ext.woff2', 'U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF'],
];

const FONT_CSS = FACES.map(([family, weight, file, range]) =>
  `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;` +
  `src:url(/fonts/${file}) format('woff2');unicode-range:${range}}`).join('\n');

const preload = (files) => files
  .map((f) => `<link rel="preload" href="/fonts/${f}" as="font" type="font/woff2" crossorigin>`).join('\n');

// Preloaded: body text and the H1 face, latin only (every page's first screen).
const PRELOAD = preload(['inter-v20-latin.woff2', 'archivo-black-v23-latin.woff2']);

// The block a page's <head> carries (between markers, so it can be re-synced).
// A page whose first screen is not latin passes its own preload files.
const fontHead = (files) => `<!-- fonts -->\n${files ? preload(files) : PRELOAD}\n<style>\n${FONT_CSS}\n</style>\n<!-- /fonts -->`;
const FONT_HEAD = fontHead();

module.exports = { FACES, FONT_CSS, PRELOAD, FONT_HEAD, fontHead };
