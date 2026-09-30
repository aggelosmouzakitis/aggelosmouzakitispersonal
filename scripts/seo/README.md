# Build, SEO and QA scripts

The pages are committed as static HTML: each one is a shell (analytics, fonts,
metadata) with a prerendered snapshot of the React page inside `#root`, so
crawlers and no-JS visitors get the full copy and React takes over on load.
Netlify runs no compile step; it only assembles `public/` (see Publish).

## Where the copy comes from
`content/canonical-copy.md` is the approved "Canonical Website Copy & Metadata"
document and the only source of page wording, header and footer labels, SEO
titles and meta descriptions. It is kept in the repository but never published.
`npm run copy` (`scripts/copy/extract-canonical.py`) turns it into
`site-copy.jsx` (the 25 pages) and `site-nav.jsx` (header and footer wording,
loaded on every page including the tools). Both are generated: edit the
document, not them.

## When to re-run
- The canonical document changed: replace `content/canonical-copy.md`, then
  the full pipeline from `npm run copy`.
- A `.jsx` file changed (`site-chrome`, `site-pages`, `lead-capture`,
  `clarity-*`): the full pipeline from `npm run build`.
- A page title or H1 changed: also regenerate the Open Graph images and llms.txt.
- `netlify.toml` or `scripts/seo/routes.js` changed: `npm run qa:routes`.

## One-time setup
    npm ci                                            # babel + react UMD builds
    python3 -m http.server 8099 &                     # prerender reads the repo from here
    # Playwright with Chromium must be available (prerender.js, og.js)

## Run — in this order
    npm run copy                      # content/canonical-copy.md → site-copy.jsx, site-nav.jsx
    npm run pages                     # page shells (only when a page is added or the shell changes)
    npm run seo:meta                  # titles, descriptions, canonicals, OG, JSON-LD
    npm run build                     # JSX → JS (before stamping: stamps hash the built files)
    node scripts/seo/prerender.js     # static snapshot into every page's #root
    npm run seo:stamp                 # every <script src> ?v= → the file's content hash
    npm run seo:sitemap               # sitemap.xml (lastmod from git history)
    npm run seo:check                 # gate: builds public/, then checks it (fails on errors)
    npm run qa:routes                 # every canonical and legacy URL, one hop, 404s, internals
    python3 scripts/copy/check-copy.py   # every sentence of the document is on its page, in order

    npm run seo:og                    # Open Graph images, only when a page title/H1 changed
    npm run seo:llms                  # llms.txt, when a page is added or a description changed

`scripts/gen-site-pages.js` (`npm run pages`) rewrites every shell and empties
its `#root`, so run the whole list after it.

## Fonts
The three typefaces are self-hosted from `fonts/` (the exact WOFF2 subsets
Google Fonts serves, same unicode ranges). `scripts/fonts.js` lists them and
builds the `<head>` block: two preloads and the inline `@font-face` rules. The
page shells get it from `gen-site-pages.js`; the hand-made pages (the two
tools, `/ask-me-anything/el`, `404.html`) from `node scripts/sync-fonts.js`,
which only needs re-running when `scripts/fonts.js` changes. File names carry
the upstream version because `/fonts/*` is cached immutably.

## Publish
`netlify.toml` sets `[build] command = "node scripts/build-public.js"` and
`publish = "public"`. The script copies an allowlist — the pages in
`site-meta.js`, the few extra served pages, the bundles, root files, `img/` and
`archive/` — into `public/` and fails if any published page links to a local
file that is not there. Nothing else in the repository (scripts, docs, JSX
sources, `node_modules`) can be requested. A new page or asset must be added to
`site-meta.js` or to the lists in `build-public.js` before it can ship.

## Stamping
**Never skip `seo:stamp`.** `netlify.toml` serves `/*.js` with
`max-age=31536000, immutable`, so the URL is the only cache key a browser has.
The site's CSS lives inside those bundles, which means a bundle that ships under
a URL a visitor already has produces a page that renders correctly from the
prerendered HTML and then reverts to the old design the moment React mounts.
`seo:check` fails if any page is stamped with anything but the current hash.
