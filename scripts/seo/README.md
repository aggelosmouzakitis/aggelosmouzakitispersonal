# SEO generation scripts

These regenerate the static-prerender snapshots and Open Graph images.
They require a headless browser (Playwright) and a local static server.

## When to re-run
- After editing `sidebar.jsx`, `content-pages.jsx`, or `diagnostic.jsx`:
  run `npm run build` (compiles JSX→JS), then re-run the prerender so the
  static HTML snapshot inside each commercial page matches.
- After changing a page title/label: re-run the OG image generation.

## How (one-time setup)
    npm i -D playwright && npx playwright install chromium
    npm i --no-save react@18.3.1 react-dom@18.3.1   # for local UMD builds
    python3 -m http.server 8099 &                    # serve the site

## Run — in this order
    npm run build                   # JSX → JS  (must come first: stamping hashes the built files)
    node scripts/seo/prerender.js   # injects static snapshots + extracts FAQ
    npm run seo:stamp               # rewrites every <script src> ?v= to the file's content hash
    npm run seo:check               # gate: fails on a stale ?v=, among much else

    node scripts/seo/og.js          # only when a page title/label changed

Note: the commercial pages are client-rendered React; the prerender step writes
a static HTML fallback into each `#root` so crawlers and no-JS clients get full
content. React still mounts and takes over on load.

**Never skip `seo:stamp`.** `netlify.toml` serves `/*.js` with
`max-age=31536000, immutable`, so the URL is the only cache key a browser has.
The site's CSS lives inside those bundles, which means a bundle that ships under
a URL a visitor already has produces a page that renders correctly from the
prerendered HTML and then reverts to the old design the moment React mounts.
`seo:check` fails if any page is stamped with anything but the current hash.
