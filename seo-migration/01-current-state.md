# 01 — Current State Audit & Inventory

**Project:** Consolidation of two production sites into one multilingual site
**Target architecture:** `.com/` = English · `.com/el/` = Greek · `.gr/` = legacy → 301 → `.com/el/…`
**Phase:** 1 of 5 — Audit only. **No production code changed.** Nothing implemented.
**Audit date:** 2026-08-13
**Method:** Static source inspection of both repositories (no live crawl). HTTP statuses are
inferred from source/host config and marked "assumed live"; they should be confirmed with a
live crawl before Phase 2.

Companion files: [`url-migration-map.csv`](./url-migration-map.csv) · [`seo-risk-register.md`](./seo-risk-register.md)

---

## 0. Executive summary

Two **separate** production sites share one brand (Aggelos Mouzakitis) and one design system,
but are built and hosted on different stacks and target different markets:

| | `.com` (English) | `.gr` (Greek) |
|---|---|---|
| Repo | `aggelosmouzakitispersonal` | `aggelosmouzakitis-gr` |
| Domain | `https://aggelosmouzakitis.com` | `https://aggelosmouzakitis.gr` |
| Stack | React 18 SPA (JSX→Babel) + prerender snapshots | Plain static HTML from a Python generator |
| Host | **Netlify** (supports 301s, headers, `/el/`) | **GitHub Pages** (cannot do path-level 301s) |
| Positioning | Licensed **psychotherapist + advisor** | **Σύμβουλος Ψυχικής Υγείας** (coaching framing) |
| Indexable URLs | **48** | **9** |
| GA4 property | `G-KV83RRF6ZM` | `G-H5ZDTS9FC8` (separate) |

The English site is the larger, canonical property and the natural consolidation hub. The Greek
site is a smaller, self-contained static site whose 9 pages can move under `/el/` with low
structural risk (its generator already emits **depth-aware relative links/assets**, so it works
under a sub-path unchanged — only absolute `BASE_URL` references need rewriting).

**The single most important finding:** the `.gr` domain is on **GitHub Pages, which cannot issue
path-level 301 redirects.** The entire consolidation strategy depends on `.gr/*` 301-ing to
`.com/el/*`, so `.gr` must be repointed to a redirect-capable host (Netlify domain alias or
Cloudflare Redirect Rules) before any redirect map can be honoured. See risk **R1**.

---

## 1–2. Production domains

| Role | Domain | Canonical form | www/non-www | Trailing slash |
|---|---|---|---|---|
| English / international | `https://aggelosmouzakitis.com` | non-www, https | non-www (apex) in all canonicals | directory-style, **trailing slash** (`/page/`) |
| Greek (legacy) | `https://aggelosmouzakitis.gr` | non-www, https | non-www (apex) in all canonicals | directory-style, **trailing slash** (`/page/`) |

Both sites are internally consistent: **non-www apex** + **trailing-slash directory URLs**
everywhere. This consistency is an asset for the migration — the redirect map can be a clean 1:1
with slugs and trailing slashes preserved. (www→apex and trailing-slash enforcement on the
consolidated host and the `.gr` redirector still needs to be verified — see R9.)

---

## 3. Framework / CMS / build system

### `.com` — React SPA + static prerender (Netlify)
- **Runtime:** React 18 via UMD (`react.production.min.js`, `react-dom.production.min.js` committed at root).
- **Source:** JSX (`sidebar.jsx`, `content-pages.jsx`, `diagnostic.jsx`) compiled to `.js` by Babel
  (`@babel/preset-react`, `.babelrc`). CI (`.github/workflows/build.yml`) recompiles JSX→JS on push
  to `main` and commits the result.
- **SEO prerender:** `scripts/seo/prerender.js` (Playwright) bakes a static HTML snapshot into each
  page's `#root` (and the sidebar into blog posts) so crawlers/no-JS clients get full content;
  React re-mounts on load. `scripts/seo/og.js` generates `img/og/*.png`.
- **CMS:** Decap/Netlify CMS at `/admin/` (`admin/config.yml`, `backend: git-gateway`, branch `main`).
  Blog collection = frontmatter markdown in `blog/posts/`; `blog/posts.json` is the index feed;
  `blog/post-template.html` is the render template.
- **Hosting:** **Netlify** (`netlify.toml`): 301 redirects, cache headers, `X-Robots-Tag` headers.

### `.gr` — Python static-site generator (GitHub Pages)
- **Generator:** `src/build.py` (+ `src/pages_content.py`, `src/diagnostic_page.py`) renders plain
  static HTML into `src/site`, copied to the repo root. **No serve-time build.**
- **Key generator traits:** depth-aware **relative** links and assets (works under a sub-path or at
  root unchanged); a single `BASE_URL` constant drives canonical / OG / sitemap / hreflang.
  `BASE_URL = "https://aggelosmouzakitis.gr"` (README flags it as a pre-launch placeholder).
- **Hosting:** **GitHub Pages** via `.github/workflows/pages.yml` (deploy on push to `main`).
  No `CNAME` file committed in the repo. GitHub Pages has **no path-level 301 capability.**

---

## 4. Routing architecture

- **Both:** clean, directory-style URLs with trailing slash, served from `…/index.html`.
- **`.com`:** each route is a prerendered `index.html`; the React app takes over client-side after
  load. Blog posts are fully static articles that mount only the sidebar component.
- **`.gr`:** every page is a fully static `index.html`; no client router. The diagnostic tool
  (`/burnout-diagnostic/`) is a **client-rendered JS widget** — its `<h1>`/content are injected at
  runtime, so the crawlable static HTML for that page is thin (title/description/meta are present).
  The `.com` diagnostic behaves the same way (static H1 shows "Starting diagnostic").

---

## 5. Existing SEO implementation (per page)

Both sites implement a solid, modern on-page SEO baseline:

| Element | `.com` | `.gr` |
|---|---|---|
| `<html lang>` | `en-IE` | `el-GR` |
| `<title>` / meta description | ✅ per page | ✅ per page |
| Canonical | ✅ self-referencing, absolute | ✅ self-referencing, absolute |
| Robots meta | `max-image-preview:large` (implicit index,follow) | `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` |
| Open Graph / Twitter | ✅ full, per-page OG image | ✅ full, per-page OG image |
| JSON-LD structured data | ✅ (see §10) | ✅ (see §10) |
| `manifest.json` | ✅ `lang:en` | ✅ `lang:el` |
| `llms.txt` (GEO) | ✅ detailed | ✅ detailed |
| Favicons / apple-touch | ✅ | ✅ |
| Fonts | Google Fonts (external CDN) | Self-hosted woff2 (preloaded) |

Minor inconsistency: the two sites use **different robots-meta strings** (see table). Both resolve
to indexable, but this should be harmonised on the consolidated host.

---

## 6. Sitemap generation

- **`.com`** `/sitemap.xml` — **48 `<url>` entries** (all indexable pages; matches the on-disk
  indexable set exactly). `lastmod` values in 2026-07; `changefreq`/`priority` set per type
  (home 1.0, blog index 0.9, blog posts 0.7, services 0.8).
- **`.gr`** `/sitemap.xml` — **9 `<url>` entries**, generated by `build.py`, `lastmod 2026-07-20`.
- Neither sitemap references the other domain. Post-consolidation there must be **one sitemap**
  (or sitemap index) on `.com` covering both `/` and `/el/` URLs; the `.gr` sitemap is retired.

## 7. robots.txt

- **`.com`** — minimal: `User-agent: * / Allow: /` + `Sitemap: https://aggelosmouzakitis.com/sitemap.xml`.
- **`.gr`** — `Allow: /` plus an explicit **AI/answer-engine allowlist** (GPTBot, OAI-SearchBot,
  ChatGPT-User, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended, Applebot-Extended) — a GEO
  choice worth carrying over to the consolidated robots.txt. `Sitemap: https://aggelosmouzakitis.gr/sitemap.xml`.
- Post-consolidation: **one** robots.txt on `.com`; the `.gr` robots.txt should be redirected or
  retired with the domain.

## 8. Canonical implementation

- Both sites emit an **absolute, self-referencing** `<link rel="canonical">` per page (non-www,
  trailing slash). Clean and correct within each site.
- **Defect:** `.gr/404.html` canonicalises to the **homepage** (`https://aggelosmouzakitis.gr/`)
  and is marked `index, follow` — a soft-404 signal (see R5).
- On consolidation, each `/el/` page must **self-canonical to its `.com/el/…` URL** — never
  cross-canonical `el → en` (they are separate language versions, both indexable).

## 9. hreflang implementation

| Site | Tags present | Targets |
|---|---|---|
| `.com` | `en`, `x-default` | both → the page's **own** `.com` URL |
| `.gr` | `el-gr`, `el`, `x-default` | all three → the page's **own** `.gr` URL |

- **There is no cross-domain hreflang today.** Each site only references itself.
- **Both sites declare `x-default` pointing at themselves** — a direct conflict once they share one
  domain. Post-consolidation there must be exactly **one `x-default`** (recommended: English `/`),
  and genuine equivalents must be paired reciprocally `en ↔ el`. See §12 and R2.

## 10. Structured data / schema

Both use a JSON-LD `@graph`. Types observed:

- **`.com`:** `Person` (+`PostalAddress`, `EducationalOccupationalCredential`), `Organization`,
  `WebSite`, `ImageObject`, `ContactPoint`; **service pages** add `ProfessionalService`,
  `ServiceChannel`, `Offer`, `PriceSpecification`, `AggregateRating`/`Review`/`Rating`, `FAQPage`;
  **blog posts** use `Article` + `SpeakableSpecification` (+`VideoObject` on interview/episode
  posts); `BreadcrumbList` throughout. Person `@id` = `https://aggelosmouzakitis.com/#person`.
- **`.gr`:** `Person` (+`alumniOf`, `hasCredential`, `memberOf` → BACP), `WebSite`,
  `ProfessionalService` (`@id …/#practice`), `WebPage`, `BreadcrumbList`; **service pages** add
  `Service`, `Audience`, `FAQPage`; `/about/` is a `ProfilePage`. Person `@id` =
  `https://aggelosmouzakitis.gr/#person`.

**Conflict:** two `Person` / practice entities exist on two domains with domain-scoped `@id`s. On
consolidation they must resolve to **one entity** (single `@id` on `.com`, with `sameAs`/language
handling), or Google may see two competing person entities. See R8.

## 11. Existing redirects

- **`.com` (Netlify `netlify.toml`):** `/schedule` → `/`, `/schedule/*` → `/`, `/faqs` → `/`,
  `/faqs/*` → `/` — all **301, force**. (Comment: these "replace the old meta-refresh stubs.")
  Retired pages already handled; keep these redirects.
- **Header rules (`.com`):** 1-year immutable cache for `*.js`, `/img/*`, `/fonts/*`, favicons;
  `X-Robots-Tag: noindex[,nofollow]` for `/admin/*`, `/blog/posts.json`, `/blog/post-template.html`.
- **`.gr`:** **none, and none possible** on GitHub Pages at path level. No `CNAME`, no `_redirects`.
  No meta-refresh stubs remain in either repo (verified).

## 12. Analytics / tagging

- **`.com`:** GA4 `G-KV83RRF6ZM` via `gtag.js` (async, in `<head>`). `emailjs` used for forms
  (stubbed during prerender).
- **`.gr`:** GA4 **`G-H5ZDTS9FC8`** — a **separate Greek property** (the README's note that it
  "reuses the `.com` GA id" is stale; a dedicated property is now wired in `build.py`).
- **Decision needed:** after consolidation onto one domain, either keep two properties (English `/`
  vs Greek `/el/`) or unify into one with a language dimension. Measurement continuity, not organic
  ranking — but decide before launch (R10).

## 13. Shared vs different templates/components

**Shared (design system 1:1 — the `.gr` README states it "reuses the original site's design
system 1:1"):** sidebar layout, colour tokens (accent `#1a7f37`), Libre Franklin typography, CTA
box, mobile bottom-nav/bottom-sheet, favicon/OG-image style, the `Person`/`ProfessionalService`
schema pattern, and the `llms.txt` GEO pattern.

**Different:**
- **Tech:** React/JSX + Playwright prerender (`.com`) vs Python static generator (`.gr`).
- **Fonts:** Google Fonts CDN (`.com`) vs self-hosted woff2 (`.gr`).
- **Information architecture / positioning:** therapy + founder/solopreneur advisory + blog +
  city pages (`.com`) vs a coaching-services dropdown + footer links (`.gr`).
- **Hosting & analytics:** Netlify + `G-KV83RRF6ZM` vs GitHub Pages + `G-H5ZDTS9FC8`.

**Implication:** the design system is unified, but the **build pipelines are not**. The lowest-risk
path is to treat the 9 Greek pages as **static HTML artifacts** and place them under `.com/el/`
(they are already plain static HTML with relative paths), rather than porting the Greek content
into the React pipeline in this migration.

---

## URL inventory

Full per-URL inventory (current URL, status, language, page type, title, canonical, robots,
hreflang, structured-data types, sitemap membership, proposed final URL, action, equivalent
language URL, redirect target, risk, notes) is in **[`url-migration-map.csv`](./url-migration-map.csv)**.
Summary below.

### `.com` — 51 HTML pages (48 indexable + 3 non-indexable) + 2 legacy 301s

- **Indexable (48):** `/`, `/about/`, `/ask-me-anything/`, `/blog/` + **27 blog posts**, `/book/`,
  `/burnout-diagnostic/`, `/career-transition-therapy/`, `/confidentiality/`,
  `/executive-burnout-therapy/`, `/founders/`, `/getinterviewed/`,
  `/greek-speaking-therapist-{dublin,london,manchester,new-york}/`, `/how-i-work/`,
  `/imposter-syndrome-therapy/`, `/reviews/`, `/solopreneurs/`, `/therapy-for-executives/`,
  `/therapy-for-founders/`.
- **Non-indexable (3):** `/404.html` (`noindex,follow`), `/admin/` (`noindex,nofollow` + header),
  `/blog/post-template.html` (placeholder; noindex via Netlify header only — see R7).
- **Existing 301s (2):** `/schedule` → `/`, `/faqs` → `/`.
- **All 48 indexable `.com` URLs → `KEEP_COM` (unchanged).** English stays at `domain.com/page`.
  No `/en/` introduced.

### `.gr` — 10 HTML pages (9 indexable + 404)

| `.gr` URL | Type | → Proposed `.com` URL | Action | EN equivalent (hreflang) |
|---|---|---|---|---|
| `/` | homepage | `/el/` | MOVE_GR_TO_COM_EL | `/` |
| `/how-i-work/` | method | `/el/how-i-work/` | MOVE_GR_TO_COM_EL | `/how-i-work/` |
| `/about/` | about | `/el/about/` | MOVE_GR_TO_COM_EL | `/about/` |
| `/confidentiality/` | trust/legal | `/el/confidentiality/` | MOVE_GR_TO_COM_EL | `/confidentiality/` |
| `/burnout-diagnostic/` | tool | `/el/burnout-diagnostic/` | MOVE_GR_TO_COM_EL | `/burnout-diagnostic/` |
| `/imposter-syndrome/` | service | `/el/imposter-syndrome/` | MOVE_GR_TO_COM_EL | `/imposter-syndrome-therapy/` |
| `/burnout/` | topic | `/el/burnout/` | MOVE_GR_TO_COM_EL | `/executive-burnout-therapy/` *(partial — confirm)* |
| `/career-coaching/` | service | `/el/career-coaching/` | MOVE_GR_TO_COM_EL | `/career-transition-therapy/` *(partial — confirm)* |
| `/executive-coaching/` | service | `/el/executive-coaching/` | MOVE_GR_TO_COM_EL | **MANUAL:** `/therapy-for-executives/` *or* `/executive-burnout-therapy/` |
| `/404.html` | error | — | RETIRE | — |

**Slug policy applied:** Greek slugs are **preserved** under `/el/` (e.g. `.gr/burnout/` →
`.com/el/burnout/`), never renamed to match the English therapy slugs. Changing domain + language
folder + slug at once is avoided.

---

## Conflicts & edge cases identified

| Category | Finding |
|---|---|
| **Duplicate slugs across sites** | `/about/`, `/confidentiality/`, `/how-i-work/`, `/burnout-diagnostic/` exist on **both** domains. Resolved cleanly by the `/el/` prefix — no collision after migration. |
| **Overlapping search intent** | `burnout` (el topic) vs `executive-burnout-therapy` (en service); `career-coaching` (el) vs `career-transition-therapy` (en); `imposter-syndrome` (el) vs `imposter-syndrome-therapy` (en). Coaching (el) vs therapy (en) framing differs — pairing needs confirmation, not assumption. |
| **Multiple possible destinations** | `.gr/executive-coaching/` has **two** candidate English equivalents (`therapy-for-executives`, `executive-burnout-therapy`). → **manual decision** for hreflang pairing (URL destination `/el/executive-coaching/` is not in doubt). |
| **Pages with no cross-language equivalent** | **EN-only (keep, no `el` alt):** `founders`, `solopreneurs`, `therapy-for-founders`, `book`, `reviews`, `ask-me-anything`, `getinterviewed`, `blog` + 27 posts, and the 4 `greek-speaking-therapist-*` city pages (these are **English** diaspora pages — do **not** move to `/el/`). No Greek page lacks a `/el/` home; all 9 migrate. |
| **Orphan pages** | None found; every on-disk indexable page is in its sitemap and reachable via nav/footer/sidebar. |
| **Redirects already present** | `.com`: `/schedule`,`/faqs` → `/` (301). `.gr`: none. |
| **Canonical conflicts** | `.gr/404.html` → homepage canonical (soft-404). Otherwise clean. |
| **hreflang conflicts** | Both sites declare `x-default` = self; no cross-domain pairing. Must be unified post-merge. |
| **Indexable utility pages** | `.com/admin/` and `.com/blog/post-template.html` kept out of the index via Netlify `X-Robots-Tag` headers (not in-HTML meta) — host-dependent (R7). `.gr/404.html` is wrongly indexable (R5). |
| **Query-parameter URLs** | None generated by either site (no faceted/paginated params). |
| **Trailing-slash consistency** | Consistent trailing-slash directory URLs on both sites. Redirects must preserve the trailing slash to avoid an extra hop. |
| **www / non-www** | All canonicals non-www apex. Host-level www→apex enforcement must be confirmed on the consolidated site and the `.gr` redirector (R9). |

---

## Recommended migration architecture (detail in the final summary of this phase)

1. **One host = Netlify (`.com`).** Serves `/` (English, unchanged) and `/el/` (Greek).
2. **English unchanged** — every `.com` URL is `KEEP_COM`; no `/en/`.
3. **Port the 9 Greek static pages under `/el/<same-slug>/`** (they are static HTML with relative
   paths; rewrite only `BASE_URL`/canonical/OG/hreflang and prefix slugs with `/el/`).
4. **Repoint `.gr` to a redirect-capable host** (Netlify domain alias or Cloudflare Redirect Rules)
   and 301 each old path to its `/el/` twin (preserve slug + trailing slash), with a `/* → /el/`
   catch-all. **This is the blocking prerequisite (R1).**
5. **Unify hreflang** — reciprocal `en ↔ el` on genuine equivalents only; a single `x-default` → `/`.
6. **One sitemap + one robots.txt** on `.com`; retire the `.gr` versions.
7. **Unify the `Person`/practice schema entity**; decide the GA property strategy.

> Implementation belongs to Phases 2–5. Nothing in this phase modifies production code.
