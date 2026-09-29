# Build, SEO and QA scripts

The pages are committed as static HTML: each one is a shell (analytics, fonts,
metadata) with a prerendered snapshot of the React page inside `#root`, so
crawlers and no-JS visitors get the full copy and React takes over on load.
Netlify runs no compile step; it only assembles `public/` (see Publish).

## When to re-run
- The editorial document changed: re-extract the copy, then the full pipeline.
- A `.jsx` file changed (`site-chrome`, `site-pages`, `lead-capture`,
  `clarity-*`): the full pipeline from `npm run build`.
- A page title or H1 changed: also regenerate the Open Graph images.
- `netlify.toml` or `scripts/seo/routes.js` changed: `npm run qa:routes`.

## One-time setup
    npm ci                                            # babel + react UMD builds
    pip install python-docx                           # copy extraction only
    python3 -m http.server 8099 &                     # prerender reads the repo from here
    # Playwright with Chromium must be available (prerender.js, og.js)

## Run — in this order
    npm run copy -- path/to/Final_Editorial.docx     # document → site-copy.jsx
    npm run seo:meta                  # titles, descriptions, canonicals, OG, JSON-LD
    npm run build                     # JSX → JS (before stamping: stamps hash the built files)
    node scripts/seo/prerender.js     # static snapshot into every page's #root
    npm run seo:stamp                 # every <script src> ?v= → the file's content hash
    npm run seo:sitemap               # sitemap.xml (lastmod from git history)
    npm run seo:check                 # gate: builds public/, then checks it (fails on errors)
    npm run qa:routes                 # every canonical and legacy URL, one hop, 404s, internals
    python3 scripts/copy/check-copy.py path/to/Final_Editorial.docx   # copy is verbatim

    node scripts/seo/og.js            # only when a page title/H1 changed

`scripts/gen-site-pages.js` writes the page shells; run it only when a page is
added or the shell itself changes, then run the whole list above.

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
