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

## Run
    node scripts/seo/prerender.js   # injects static snapshots + extracts FAQ
    node scripts/seo/og.js          # regenerates img/og/*.png (reads /tmp/og_pages.json)

Note: the commercial pages are client-rendered React; the prerender step writes
a static HTML fallback into each `#root` so crawlers and no-JS clients get full
content. React still mounts and takes over on load.
