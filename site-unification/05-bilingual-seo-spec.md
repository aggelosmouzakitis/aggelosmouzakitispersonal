# 05 — Bilingual & Technical SEO Spec

_Implementable without having read the strategy conversation._

## 1. URL model
- English core at root; Greek core under `/el/`. Paired pages:
  `/ ↔ /el/`, `/1-to-1/ ↔ /el/1-to-1/`, `/about/ ↔ /el/about/`, `/reviews/ ↔ /el/reviews/`, `/book/ ↔ /el/book/`, `/confidentiality/ ↔ /el/confidentiality/`.
- One blog at `/blog/` (both languages). No `/en/blog/`, no `/el/blog/`.

## 2. Canonical rules
- **Every page self-canonicals** to its own absolute URL with trailing slash: e.g. `/el/1-to-1/` → `<link rel="canonical" href="https://aggelosmouzakitis.com/el/1-to-1/">`.
- **Never** canonicalise a Greek page to its English counterpart. They are language alternatives, not duplicates (brief §44).
- Blog posts self-canonical. No canonical pointing across languages.

## 3. `<html lang>` attribute
- English pages: `lang="en"` (root uses `en`; existing `en-IE` acceptable but standardise to `en` on new/rebuilt pages).
- Greek pages: `lang="el"`.
- Blog posts: `lang` matches the post's own language (`posts.json.lang`).

## 4. hreflang (reciprocal, paired core pages only)
For each paired page, emit **all three** on **both** members:
```html
<link rel="alternate" hreflang="en" href="https://aggelosmouzakitis.com/{path}/">
<link rel="alternate" hreflang="el" href="https://aggelosmouzakitis.com/el/{path}/">
<link rel="alternate" hreflang="x-default" href="https://aggelosmouzakitis.com/{path}/">
```
- Home pair: `en` → `/`, `el` → `/el/`, `x-default` → `/`.
- Reciprocity is mandatory: the `en` page lists the `el` alternate and vice-versa.
- **Unpaired pages get NO cross-language hreflang.** Retained English-only SEO pages (`/greek-speaking-therapist-*`, `/burnout-diagnostic/`, `/getinterviewed/`, etc.) emit self `hreflang="en"` + `x-default` only (or nothing) — **no invented Greek alternate**.

## 5. Blog language model & SEO
- `posts.json`: each entry gains `"lang": "en" | "el"`. Existing 27 posts = `en`.
- `/blog/` index: filter control **All / English / Ελληνικά**. Default All. Filter is client-side (query param `?lang=el` supported for deep-linking from Greek nav). Index itself self-canonicals to `/blog/` (filter params are not separate canonicals).
- **English-only article**: self-canonical, `lang="en"`, no `el` alternate, no machine translation.
- **Greek-only article**: self-canonical, `lang="el"`, no `en` alternate.
- Only when a real translated counterpart is intentionally authored do the two posts reference each other via reciprocal `hreflang` (brief §33).
- Do not fabricate alternate-language blog URLs for symmetry.

## 6. Language switcher behaviour
- Sitewide switcher in the sidebar (desktop) and mobile nav. Sends the visitor to the **equivalent page**, not always home:
  `/about/ ↔ /el/about/`, `/1-to-1/ ↔ /el/1-to-1/`, etc. Implemented via a static path map in `sidebar` (`EN_PATH ↔ EL_PATH`).
- On the blog: English "Writing" → `/blog/`; Greek "Άρθρα" → `/blog/?lang=el` (same canonical blog, Greek filter pre-applied). Do not create a second blog.
- For a blog article with no translation, the switcher does **not** invent one: it returns to `/blog/` filtered to the other language (documented fallback). Never imply a translation exists.

## 7. Sitemap design
- Single `sitemap.xml` at `.com` root listing **canonical, 200-only** URLs:
  - English core: `/`, `/1-to-1/`, `/about/`, `/reviews/`, `/book/`, `/confidentiality/`, `/blog/`.
  - Greek core: `/el/`, `/el/1-to-1/`, `/el/about/`, `/el/reviews/`, `/el/book/`, `/el/confidentiality/`.
  - Retained SEO pages (200): `/greek-speaking-therapist-*`, `/burnout-diagnostic/`, `/getinterviewed/`, `/ask-me-anything/` (if kept).
  - All blog posts.
  - Optionally add `xhtml:link` hreflang annotations per paired URL (nice-to-have).
- **Exclude**: any redirected URL (`/founders/`, `/solopreneurs/`, `/how-i-work/`, `/therapy-*`, all `.gr` URLs), removed URLs, `/admin/`, `blog/posts.json`, dev/noncanonical.
- `.gr/sitemap.xml` is removed/retired (domain becomes redirect-only). `.gr/robots.txt` should stop advertising a `.gr` sitemap.

## 8. robots.txt
- `.com/robots.txt`: `Allow: /`, `Sitemap: https://aggelosmouzakitis.com/sitemap.xml` (unchanged). `/el/` is crawlable (no disallow).
- `.gr/robots.txt`: once redirect-only, robots is largely moot (all paths 301). Keep minimal; do not point to a dead `.gr` sitemap.

## 9. Structured data (JSON-LD)
- **Person** (`#person`): keep verified facts. Update `jobTitle` to `["Business Advisor","Psychotherapist"]` (English) reflecting the new positioning; keep BACP credential + `knowsAbout` refreshed (business building, positioning, pricing, sales, founder/solopreneur psychology, decision-making). `url` = canonical.
- **WebSite** (`#website`): update `description` to new positioning; `inLanguage` may list `en`,`el`.
- **BreadcrumbList**: per page, pointing to final canonical URLs (incl. `/el/...`).
- **Article**: per blog post, `inLanguage` = post lang, `url` = canonical.
- Greek pages' schema: mirror in Greek but **keep the approved credential wording** — `jobTitle` Greek side = "Σύμβουλος Ψυχικής Υγείας" (+ business-advisor equivalent); do NOT emit "Ψυχοθεραπευτής"/"Ψυχολόγος" (brief §48, §55). No service schema for offers not provided.
- All schema URLs must be final canonical URLs (no redirected/legacy URLs).

## 10. Metadata (titles/descriptions/OG)
- Remove "Therapy for Executives"-style titles from core brand pages. Titles reflect Business Advisor + Therapist / "build something of your own". No keyword stuffing.
- OG/Twitter per page; regenerate OG images for new core pages (`home`, `1-to-1`, `about`, `reviews`, `book`, `confidentiality`, and `/el/` equivalents) via `scripts/seo/og.js`.
- `og:locale` = `en_IE` (or `en`) for English, `el_GR` for Greek; add `og:locale:alternate` for the paired language.

## 11. Redirects
- Permanent (301), server/edge-level only — Netlify `netlify.toml`/`_redirects`. **No JS/meta-refresh/SPA redirects** (brief §41).
- `.com` legacy + `.gr` → `.com/el/` per `04-redirect-map.csv`. One hop to final canonical; no chains/loops.

## 12. `.gr` migration
- `.gr` becomes redirect-only. Because GitHub Pages cannot serve 301s, **move `aggelosmouzakitis.gr` DNS to Netlify** and deploy the redirect config (`_redirects` + `netlify.toml`) prepared in the `.gr` repo. Retain domain ownership; do not let it expire. Do not take the old site down until redirects are verified live.

## 13. Rendering parity (critical)
- `/el/` pages must be prerendered through the same Playwright path as English so they are indexable without JS (brief §57). Add every `/el/*` core page to `scripts/seo/prerender.js`. No Greek route may be JS-only.
