# 06 — Implementation Notes

_Technical decisions, and every place the repository forced a deviation from the ideal. Nothing significant changed silently._

## Key technical decisions
1. **Kept the React app-shell + Playwright prerender** rather than migrating to a static-site generator. Rationale: it is the working, indexable infrastructure (brief §75 "migrate working infrastructure"). Refactored the per-page inline `App()` duplication into one exported `renderApp(pageId, lang)` in `content-pages.jsx`; each core `index.html` now just calls it.
2. **Bilingual as data, not duplicated components.** A `CONTENT` object (`CONTENT.en.*`, `CONTENT.el.*`) feeds shared render components. One component tree, two string sets. Avoids a divergent Greek codebase (brief §9, §71).
3. **Converted `/about/` and `/reviews/` from standalone static pages to app-shell pages.** They previously had no sidebar/nav. This gives every core page the same navigation + language switcher + prerendered fallback, resolving a pre-existing inconsistency.
4. **`/el/` lives in the `.com` repo** (`aggelosmouzakitispersonal/el/...`), not the `.gr` repo. The `.gr` repo becomes redirect-only. Greek copy was mined from `.gr/src/pages_content.py` and re-authored to the new positioning — not literally translated from English (brief §47).
5. **Legacy pages: redirect at the edge, keep some files.** Persona/specialty pages are removed from nav/sitemap/internal links and 301'd in `netlify.toml`. Their `index.html` files may remain in the repo (harmless; the redirect wins) or be deleted; the redirect is the source of truth. Retained SEO pages keep their files and stay 200.
6. **Blog stays one collection.** Added `lang` to `posts.json` and a client-side filter to `BlogIndex`. No second blog, no auto-translation (brief §31–34).

## Deviations / operational items requiring owner or DNS action
- **`.gr` hosting must move to Netlify (DNS).** GitHub Pages cannot issue path-level 301s; the brief (§41) requires true HTTP redirects, so JS/meta was rejected. The `.gr` repo now contains a Netlify redirect config (`netlify.toml` + `_redirects`) ready to deploy, but **pointing the `aggelosmouzakitis.gr` domain at Netlify is a manual DNS/hosting step I cannot perform.** Until DNS moves, the redirects are staged, not live. Documented here rather than compromising with client-side redirects.
- **www/apex + Force-HTTPS** are Netlify domain-settings toggles (not in repo). Set apex `aggelosmouzakitis.com` as primary, `www` → apex 301, Force HTTPS on. Same for the `.gr` site once on Netlify.
- **Two GA4 properties** (`G-KV83RRF6ZM` .com, `G-H5ZDTS9FC8` .gr). Decision: the unified site (incl. `/el/`) uses the `.com` property so one property covers the whole domain. The Greek property can be retired or kept for reference; kept for now, not wired into `/el/` to avoid double-counting. Flagged for owner confirmation.

## Unresolved commercial details (NOT invented — brief §25, §37)
The current site deliberately does not publish these; I did not fabricate them:
- **Price** — `/how-i-work/` says only "premium, ongoing, priced as a monthly engagement… specifics on the fit call." `/1-to-1/` repeats "I'll give you the number on the fit call." No figure invented.
- **Session duration / frequency / programme length** — cadence described qualitatively ("first few months weekly, then flexible"). No fixed numbers invented beyond what the source states.
- **Between-session access** — source says "reach me when something real comes up… not a 24/7 line." Kept as-is; no WhatsApp/guarantee invented.
- **Confidentiality specifics** — `TODO(confirm)` markers preserved from source (exact tools, data-retention, jurisdictional limits). Not fabricated.

## Professional-title handling (brief §48 — LOCKED)
- English positioning line: **"Business Advisor + Therapist"**; credentials remain "Licensed Psychotherapist (BACP)" / "MSc Integrative Counselling & Psychotherapy, University of Derby" (from source).
- Greek job title stays **"Σύμβουλος Ψυχικής Υγείας"** as on the current `.gr`. Business side rendered as "Σύμβουλος επιχειρήσεων". **Did NOT** auto-translate "Therapist"→"Ψυχοθεραπευτής" or "Ψυχολόγος" (regulated designations in Greece). Where English says "therapist", Greek uses the approved counselling wording. Any ambiguity preserved + flagged, never strengthened.

## Content provenance (no fabrication — brief §71)
- Testimonials: the 15 on `/reviews/` and the persona-page quotes are reused **verbatim**; none invented, none materially rewritten.
- Case study: adapted from the existing de-identified solopreneur/founder cases already on the site; no new outcomes fabricated; no confidential details added.
- Numeric/credential claims (18+ yrs, 500+ advised, BACP, MSc/Derby, IBM) taken only from existing source; none strengthened.

## Files added / changed (high level)
- Added: `1-to-1/`, `el/` (+ subpages), refactored `content-pages.jsx` (+ Greek content), refactored `sidebar.jsx` (nav + switcher + bilingual), `site-unification/*`.
- Changed: `index.html` (home), `about/index.html`, `reviews/index.html`, `book/*`, `confidentiality/*`, `blog/index.html` + `posts.json`, `netlify.toml` (redirects), `sitemap.xml`, `robots` (unchanged), head metadata/schema across core pages.
- `.gr` repo: replaced site with redirect-only config; retained domain.

## Rebuild commands (must run after JSX edits)
```
npm run build                 # babel: sidebar.jsx/content-pages.jsx/diagnostic.jsx -> .js
node scripts/seo/prerender.js # bake static #root snapshots (incl. /el/ + /1-to-1/)
node scripts/seo/og.js        # regenerate OG images (reads /tmp/og_pages.json)
```
Order matters: build → prerender → og. The `build.yml` Action auto-recompiles JSX on push to `main`, but prerender/og are run manually (see `scripts/seo/README.md`).
