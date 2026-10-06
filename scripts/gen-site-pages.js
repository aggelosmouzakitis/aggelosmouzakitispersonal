// gen-site-pages.js — write the HTML shell of every canonical page and article.
//
// One shell per page in site-copy.jsx (the canonical copy) and per article in
// scripts/articles/articles.js: the shared <head> preamble (analytics, fonts,
// icons, base CSS), an empty #root and the page's scripts. A static page (all
// but /contact/, see LIVE) loads only site-header.js; /contact/ loads React
// and the bundles that render it. RECIPES says how React draws each page (an
// article from its own data, article-<slug>.js, instead of the canonical
// copy; /blog/ with the article listing, site-articles.js), for the live page
// and for scripts/seo/prerender.js. Everything else is filled in by the steps
// after it:
//
//   node scripts/gen-site-pages.js       # this: shells
//   node scripts/seo/apply-metadata.js   # <head> metadata from site-meta.js
//   npm run build                        # JSX → JS
//   node scripts/seo/prerender.js        # static HTML snapshot into #root
//   npm run seo:stamp                    # content-hash every ?v=
//   npm run seo:check                    # gate
//
// It replaced gen-core-pages.js (removed; in git history), which generated the
// retired business-advisor shells.

const fs = require('fs');
const path = require('path');
const { FONT_HEAD } = require('./fonts.js');
const { ARTICLES, urlOf, dataBundle, INDEX_BUNDLE } = require('./articles/articles.js');

const ROOT = path.resolve(__dirname, '..');
const GA = 'G-KV83RRF6ZM';

const window = {};
// site-copy.jsx is plain JavaScript that assigns window.SITE_COPY.
// eslint-disable-next-line no-eval
eval(fs.readFileSync(path.join(ROOT, 'site-copy.jsx'), 'utf8'));
const PAGES = Object.values(window.SITE_COPY.pages);

// Base CSS every page carries before any bundle loads (unchanged from the
// previous shells): tokens, reset, grain, focus ring, reduced motion.
const CSS = `
:root{
  --font-body: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-heading: "Inter Tight", "Inter", system-ui, sans-serif;
  --font-display: "Archivo Black", "Inter Tight", "Inter", system-ui, sans-serif;
  --brand-green: #047857;
  /* Editorial Japandi palette (ten tokens) */
  --bone: #F3F0E8; --bone-deep: #EDE8DB; --forest: #16231E; --forest-deep: #101A16;
  --green: #047857; --green-pressed: #03654A; --sage: #8FBFA7;
  --ink: #171919; --heading-ink: #14201C; --ink-2: #3A403A; --on-forest: #C0C9BF; --meta: #6A6F67;
  --rule: rgba(23,25,25,0.18); --rule-on-forest: rgba(243,240,232,0.16);
}
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { background: #F3F0E8; color: #171919; font-family: var(--font-body); font-size: 18px; line-height: 1.55; -webkit-font-smoothing: antialiased; overflow-x: clip; }
#root { display: block; }
a { color: inherit; text-decoration: none; }
::selection { background: #047857; color: #F3F0E8; }
img { max-width: 100%; filter: grayscale(1) contrast(1.12) brightness(0.96) sepia(0.14); }
.site-grain { position: fixed; inset: 0; pointer-events: none; z-index: 90; opacity: 0.06; mix-blend-mode: multiply; background-image: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='160'%20height='160'%3E%3Cfilter%20id='g'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='0.9'%20numOctaves='3'%20stitchTiles='stitch'/%3E%3C/filter%3E%3Crect%20width='100%25'%20height='100%25'%20filter='url(%23g)'/%3E%3C/svg%3E"); background-size: 160px 160px; }
@media print { .site-grain { display: none; } }
a:focus-visible, button:focus-visible, summary:focus-visible { outline: 3px solid #047857; outline-offset: 2px; border-radius: 2px; }
@media (prefers-reduced-motion: reduce){ html { scroll-behavior: auto; } *{transition-duration:.001ms!important;animation-duration:.001ms!important} }
@media print { .site-hdr, .site-ftr, .cta-strip { display: none !important; } }
`;

function fileFor(url) {
  return url === '/' ? 'index.html' : url.replace(/^\//, '') + 'index.html';
}

// Pages whose React stays live in the browser: /contact/, the one canonical
// page that changes once it is drawn (its form). Every other page, and every
// article, is static: the prerendered snapshot in #root is the whole page and
// site-header.js runs its header, so it loads no React, no page bundle and no
// render call. Drawing the page a second time in the browser only delayed it:
// the download and parse of the bundles held up its first paint, and the
// re-render was most of its main-thread work.
const LIVE = new Set(['contact']);

// How React draws a page: the bundles it needs between site-chrome.js and
// site-pages.js, and the call that renders it. A live page runs this in the
// browser; for a static page only scripts/seo/prerender.js does, to take the
// snapshot.
function canonicalRecipe(p) {
  return {
    file: fileFor(p.url),
    live: LIVE.has(p.id),
    emailjs: p.id === 'contact',
    bundles: ['site-copy.js'].concat(p.id === 'contact' ? ['lead-capture.js'] : [], p.id === 'blog' ? [INDEX_BUNDLE] : []),
    render: `renderSitePage(${JSON.stringify(p.id)});`,
  };
}
// An article: its own data instead of the canonical copy.
function articleRecipe(a) {
  return {
    file: fileFor(urlOf(a)),
    live: false,
    emailjs: false,
    bundles: [dataBundle(a)],
    render: `renderArticlePage(${JSON.stringify(a.slug)});`,
  };
}
const RECIPES = PAGES.map(canonicalRecipe).concat(ARTICLES.map(articleRecipe));

// Every script React needs to draw a page, in load order.
const reactScripts = (r) => ['react.production.min.js', 'react-dom.production.min.js', 'site-nav.js', 'site-chrome.js']
  .concat(r.bundles, ['site-pages.js']);

const script = (src) => `\n<script src="/${src}"></script>`;

function bodyScripts(r) {
  if (!r.live) return '\n<script src="/site-header.js" async></script>';
  return `
<script src="/react.production.min.js" crossorigin="anonymous"></script>
<script src="/react-dom.production.min.js" crossorigin="anonymous"></script>` +
    (r.emailjs ? '\n<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>' : '') +
    reactScripts(r).slice(2).map(script).join('') +
    `\n<script>${r.render}</script>`;
}

function shell(r) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '${GA}');
  // gtag.js, the heaviest script the page loads, comes in on the reader's
  // first scroll, tap, click or key press, or 5 seconds after the page has
  // loaded, so it never competes with the page itself; what is queued above
  // is sent when it runs.
  (function () {
    var events = ['scroll', 'wheel', 'pointerdown', 'pointermove', 'touchstart', 'keydown'];
    var done = false;
    function load() {
      if (done) return;
      done = true;
      events.forEach(function (t) { removeEventListener(t, load, true); });
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=${GA}';
      document.head.appendChild(s);
    }
    events.forEach(function (t) { addEventListener(t, load, { capture: true, passive: true }); });
    addEventListener('load', function () { setTimeout(load, 5000); });
  })();
</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${FONT_HEAD}
<!-- Favicon / site icons -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<meta name="theme-color" content="#F3F0E8">
<meta name="author" content="Aggelos Mouzakitis">
<link rel="manifest" href="/manifest.json">
<style>${CSS}</style>
</head>
<body>
<div class="site-grain" aria-hidden="true"></div>
<div id="root"></div>${bodyScripts(r)}
</body>
</html>
`;
}

module.exports = { RECIPES, reactScripts };

if (require.main === module) {
  for (const r of RECIPES) {
    const out = path.join(ROOT, r.file);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, shell(r));
    console.log(`  ${r.file}`);
  }
  console.log(`gen-site-pages: ${RECIPES.length} shells written`);
}
