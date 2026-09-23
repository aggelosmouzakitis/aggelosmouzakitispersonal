# SEO / AEO audit — aggelosmouzakitis.com

Audited and fixed 2026-09-23, against the repository and the built output served
over HTTP. Everything below was verified on the built site, not inferred from
source templates. No estimates of search volume, rankings, traffic or authority
are included — only what the repo and HTTP responses show.

Run the checks yourself:

```bash
npm run build          # JSX → JS
npm run seo:meta       # write scripts/seo/site-meta.js into every page <head>
npm run seo:sitemap    # rebuild sitemap.xml from the same table
node scripts/seo/prerender.js   # refresh the static HTML snapshots (needs a local server on :8099)
npm run seo:check      # crawl the build and fail on any SEO error   ← the gate
npm run seo:check -- --warn     # include non-blocking warnings
```

`npm test` is wired to `seo:check`, so it can gate a deploy.

---

## 1. Critical issues found

| # | Issue | Where |
|---|---|---|
| 1 | The consolidation to `/work-with-me/` had not been implemented at all. The three service pages and `/start-here/` were still live, linked and in the sitemap. | site-wide |
| 2 | Retiring those URLs would have created **12 redirect chains**: `/startingdiagnostic` → `/start-here/`, eight `/greek-speaking-therapist-*` rules → `/psychotherapy-decision-coaching/`, and `/how-i-work` → `/1-to-1/`. | `netlify.toml` |
| 3 | Homepage title claimed **"Licensed Psychotherapist"**. The visible credential is BACP registration; "licensed" appeared in 9 places across metadata, body copy, footer copy line and schema. | `index.html`, `content-pages.jsx`, `sidebar.jsx`, `llms.txt` |
| 4 | Aggelos was defined as **a separate, duplicated `Person` node on every page**, with conflicting claims (one said "advised more than 500", the visible proof strip says 100+ technology companies). No shared `@id`. | every page's JSON-LD |
| 5 | `/career-transition-therapy/` was `noindex` but **linked from four live indexed pages**, and was serving a stale prerendered snapshot showing the *old* site navigation (it was missing from the prerender list). | 5 pages |
| 6 | `llms.txt` — the file AI crawlers read first — described a site that no longer exists: Greek `/el/` pages, `/blog/`, `/book/`, `/1-to-1/`, `/start-here/`, and "Licensed Psychotherapist". | `llms.txt` |
| 7 | Sitemap listed 4 URLs that were about to become redirects, and omitted `/career-transition-therapy/`. `lastmod` was a single hard-coded date for every URL. | `sitemap.xml` |

---

## 2. Important fixes implemented

**Architecture and routing**

- Built `/work-with-me/` (`work-with-me.jsx` + `work-with-me/index.html`) from the approved design: hero, proof band, "What we can work on", the Jobs to be Done forces map, fit / not-fit, six FAQs, closing CTA.
- Retired the three service pages and `/start-here/`: directories and sources deleted, **10 new 301 rules** added (bare + splat for each), all landing directly on `/work-with-me/`.
- **Repointed 12 existing rules** so no chain forms, and deleted 6 dead `/el/` rules that sat below the `/el/*` catch-all and could never fire. Verified: **50 rules, 0 chains**.
- Header: service dropdown removed (desktop mega + mobile accordion + 27 lines of now-dead CSS). Nav is now `Work with me` · `About me` · `FREE TOOLS →`, with Free Tools kept as the single dominant CTA.
- Footer: `WORK WITH ME` → Work with me, WTF Friday. `NAVIGATE` → Home, About me, Reviews, Free tools. "Not sure where to start?" removed.
- Homepage: "Three ways to work with me" and the three service cards replaced by the merged before/after ledger; Free Tools section rebuilt on dark green with all five tools. Hero CTAs are `FREE TOOLS →` → `/free-tools/` and `SEE HOW I WORK →` → `/work-with-me/`.
- About: added the Jobs to be Done / consumer-psychology section; replaced the "Not sure which conversation you need?" routing block with a single `Work with me →` CTA.
- **Copy diffed string-by-string against the ZIP.** 106 approved strings across the three views; two were genuinely wrong and are now fixed: the homepage logo row said `WORK WITH 100+ TECHNOLOGY COMPANIES` where the design says `Worked with…`, and the About hero still carried the pre-refinement, longer deck sentence. **106 / 106 approved strings now render** (the rest of the apparent diffs were CSS uppercasing and curly vs straight apostrophes).
- Contact form: the three audit options are gone. Options are now **Free orientation call (1:1 work)**, **WTF Friday**, **Something else**. `?interest=orientation` preselects correctly — verified by driving a real submission in a browser (payload carried `interest: "Free orientation call (1:1 work)"`, confirmation rendered, no JS errors).

**Metadata — written per page, not templated**

- Added `scripts/seo/site-meta.js`: one hand-written entry per indexable URL (title, description, canonical, OG, Twitter, JSON-LD, sitemap priority). `scripts/seo/apply-metadata.js` strips the tags it owns and re-emits exactly one of each, so duplicate canonicals or leftover metadata cannot survive a run.
- All 19 titles unique; all 19 descriptions unique and page-specific. Free tools use their real questions ("What's Limiting Your Business? | Free Clarity Tool"), not a shared "Free Tools |" prefix.
- Health-adjacent wording preserved: the burnout and quit-your-job tools carry "Directional, not a clinical diagnosis" / "not a clinical assessment" in their descriptions.
- WTF Friday's title derived from the visible page and made explicit that it is a group format: **"WTF Friday | Free Weekly Group Office Hours"**.
- Every page: `index, follow, max-image-preview:large`, self-referencing canonical, `og:url` === canonical, absolute `https` OG image, `twitter:card=summary_large_image`, `hreflang` en + x-default (the site is English-only since `/el/` was retired).
- Generated `/img/og/work-with-me.png` with the site's existing OG generator. All 19 OG images verified to return 200.
- "Licensed psychotherapist" eliminated everywhere (9 occurrences) in favour of **BACP-registered psychotherapist**.

**Crawlability**

- Every page is prerendered: real copy, H1, headings and internal links are in the initial HTML before any JavaScript runs. `/work-with-me/` serves **4,206 characters of text, 1 H1, 4 H2s, 10 H3s and 16 internal links** with JS disabled.
- The FAQ uses `<details>/<summary>` rather than a JS accordion, so all six answers are in the crawlable HTML whether or not they are visually open. `seo-check` asserts every FAQ question in the schema appears in the page text.
- The Jobs to be Done forces map is entirely HTML text — the four forces, their questions, the two endpoints and the six intervention types — so its meaning does not depend on reading a diagram. Added a prose paragraph above it that states the model in sentences for AI/answer engines.
- Added `/career-transition-therapy/` to the prerender list so it stops serving the old navigation, and made it indexable like its four siblings.

**Sitemap, robots, structured data**

- `scripts/gen-sitemap.js` now builds from `site-meta.js`, so a URL cannot be in the sitemap without a canonical, title and description. `lastmod` comes from **real git history** for the page and the sources that render it, not a build date.
- **19 URLs**, all 200, all self-canonicalising, no query strings, no redirected URLs, valid XML.
- `robots.txt` verified: no `Disallow: /`, no accidental `noindex` anywhere in production, sitemap line present, AI crawlers explicitly allowed.
- One coherent entity graph: **a single `Person` `@id` (`https://aggelosmouzakitis.com/#person`) across all 19 pages**, fully defined on the homepage and `/about/` and referenced by `@id` elsewhere. 129 typed nodes, 47 `@id`s, **0 unresolved references, 0 unknown types, exactly one `ld+json` block per page**.

---

## 3. Lower-priority improvements implemented

- Rewrote `llms.txt` against the current site, including the JTBD method, the verified numbers, and an explicit note that "licensed psychotherapist" is not the right wording.
- Heading structure reviewed after the redesign: every indexable page has exactly one H1; section eyebrows are `h2` where they are the section's only heading, and plain text where a display `h2` follows.
- Images: all have `alt` (or are decorative), all have explicit `width`/`height` — measured **CLS 0.00** on home, work-with-me and free-tools at 390px. Homepage hero is `loading="eager"`, `fetchpriority="high"` and preloaded; every below-fold image is lazy.
- Removed dead code: `offer-pages.{jsx,js}`, `start-here.{jsx,js}`, the `/1-to-1/` shell and its generator entry, and stale route lists in `scripts/qa-crawl.js`.
- Fixed a real layout bug found during responsive QA: the forces-map connector lines inherited `flex:1` from the row layout and collapsed to zero height when the map reflowed to a vertical run below 560px.
- Homepage free-tools grid: five cards wrapped 4+1, leaving one card stranded. Now 5 across on desktop, 3+2 on tablet, reflowing below.

---

## 4. Remaining items requiring external access

These cannot be done from the repository.

- **Google Search Console**: submit `https://aggelosmouzakitis.com/sitemap.xml`; use *Removals* only if the retired URLs linger; watch Pages → "Page with redirect" for the four retired URLs; re-inspect `/work-with-me/` with *Live Test*.
- **Bing Webmaster Tools**: submit the sitemap and confirm the IndexNow key is accepted (see §9).
- **Rich Results Test / Schema Markup Validator**: JSON-LD was validated structurally here (parses, known types, all `@id`s resolve). Running it against the live URLs confirms Google's own view.
- **PageSpeed Insights / CrUX**: local numbers are excellent but TTFB (4–8 ms) is a local artefact. Real TTFB must be measured against Netlify.
- **Host-level checks**: `http → https`, `www → apex`, and the real 404 status code are Netlify/DNS behaviour. Commands are in `SEO_POST_DEPLOY_CHECKLIST.md`.

---

## 5. Redirect map

All permanent (301), `force = true`, one hop, destination returns 200.

| Old URL | New URL |
|---|---|
| `/psychotherapy-decision-coaching/` (+ `/*`) | `/work-with-me/` |
| `/career-strategy-consulting/` (+ `/*`) | `/work-with-me/` |
| `/solopreneur-growth-consulting/` (+ `/*`) | `/work-with-me/` |
| `/start-here/` (+ `/*`) | `/work-with-me/` |
| `/1-to-1/` (+ `/*`) | `/work-with-me/` |
| `/startingdiagnostic` (+ `/*`) | `/work-with-me/` *(was → `/start-here/`)* |
| `/how-i-work` (+ `/*`) | `/work-with-me/` *(was → `/1-to-1/`)* |
| `/greek-speaking-therapist-{london,manchester,dublin,new-york}` (+ `/*`) | `/work-with-me/` *(was → `/psychotherapy-decision-coaching/`)* |

Untouched and still correct: `/clarity-tools/*` → `/free-tools/*`, `/burnout-diagnostic` → `/free-tools/burned-out/`, `/el` and `/el/*` → `/`, `/blog*` → `/`, `/book*` → `/contact?interest=orientation`, `/faqs*` and `/schedule*` → `/`.

**50 rules total, 0 chains, 0 loops.**

---

## 6. Final sitemap URL count

**19 URLs.** `/`, `/work-with-me/`, `/about/`, `/reviews/`, `/free-tools/` + its 5 tools, `/wtf-friday/`, `/ask-me-anything/`, `/contact/`, `/confidentiality/`, and the 5 specialty pages (`/therapy-for-founders/`, `/therapy-for-executives/`, `/imposter-syndrome-therapy/`, `/executive-burnout-therapy/`, `/career-transition-therapy/`).

Deliberately excluded and `noindex`: `/founders/`, `/solopreneurs/`, `/getinterviewed/`, `/admin/`, `/404.html`. Nothing indexed links to them.

---

## 7. Final validation results

`npm run seo:check` → **✓ no errors** across 19 pages and 16 internal link targets.

| Check | Result |
|---|---|
| Indexable pages returning 200 | 19 / 19 |
| Indexable pages that redirect | 0 |
| Unique titles / unique descriptions | 19 / 19 · 19 / 19 |
| Exactly one self-referencing canonical | 19 / 19 |
| `og:url` === canonical | 19 / 19 |
| OG images returning 200 | 19 / 19 |
| Exactly one H1 in the raw HTML | 19 / 19 |
| Raw HTML text ≥ 500 chars (pre-JS) | 19 / 19 |
| Accidental `noindex` on an indexable page | 0 |
| Broken internal links | 0 |
| Internal links passing through a redirect | 0 |
| Internal links to a retired URL | 0 |
| Retired wording in copy or metadata | 0 |
| Retired URLs in the sitemap | 0 |
| Sitemap URLs that 200 and self-canonicalise | 19 / 19 |
| Nonexistent URL returns 404 (not 200) | pass |
| JSON-LD parses · unknown types · unresolved `@id`s | pass · 0 · 0 |
| FAQ schema questions present in page text | 6 / 6 |
| Core Web Vitals at 390px (home / work-with-me / free-tools) | LCP 136 / 80 / 64 ms · CLS 0.00 · DOM 281 / 304 / 332 |

---

## 8. Structured-data decisions

- **One `Person`, one `@id`.** `https://aggelosmouzakitis.com/#person` is defined in full on `/` and `/about/` (image, jobTitle, description, knowsAbout, sameAs, address, hasCredential) and referenced by `@id` on every other page. This replaces the previous pattern of a full, sometimes contradictory Person node per page.
- **Claims match visible copy.** `jobTitle` is `Business & Career Advisor` + `BACP-registered Psychotherapist`. The old "advised more than 500" claim is gone from schema; the description now says 100+ technology companies, matching the proof strip.
- **`/work-with-me/` uses `Service`**, not `ProfessionalService` or `MedicalBusiness`. It is one advisory service with a `provider` reference, an `areaServed` list and an online `availableChannel`. No medical typing, because the page does not describe a clinical service.
- **`FAQPage` only on `/work-with-me/`**, where six questions and answers are genuinely visible and present in the HTML. `seo-check` fails if a schema question is not found in the page text, so the markup cannot drift from the page.
- **Free tools use `WebApplication`**, which is what the visitor can actually do: answer questions in the browser and get a result. Not `Quiz`, not `MedicalTest`, not `Course` — none of those describe a directional self-assessment, and two of the tools explicitly say they are not a clinical diagnosis.
- **`/free-tools/` is a `CollectionPage` + `ItemList`** of the five live tools, each of which points back at the collection via `isPartOf`.
- `/about/` is a `ProfilePage` with the Person as `mainEntity`; `/contact/` is a `ContactPage`; everything else is a `WebPage`, all with `BreadcrumbList` and all `isPartOf` the single `WebSite` node.

**Claims removed in a second pass**, because nothing a visitor can read supports them:

| Removed | Why |
|---|---|
| `address: { addressCountry: "IE" }` on Person | "Ireland" appears nowhere in the site's visible copy. |
| `areaServed` (19 countries) on the Service | `/work-with-me/` names no country or region. |
| `availableChannel` → `"Online (video sessions)"`, `availableLanguage: ["English","Greek"]` | The page never says online, remote, or Greek. |
| `offers: { price: "0", priceCurrency: "EUR" }` on each tool | `isAccessibleForFree: true` already says it, without inventing a currency. |
| `numberOfItems` on `WebApplication` | Not a property of that type — it belongs to `ItemList`. |
| `applicationCategory: "BusinessApplication"` | Does not describe a burnout or career self-assessment. |
| `knowsAbout` — 12 loose topics | Replaced with 11 terms, each of which is a heading or labelled item on `/work-with-me/` or `/about/`. |

`seo-check` now **fails** if any page's JSON-LD reintroduces `aggregateRating`, `review`, `award`, `address`, `areaServed`, `priceRange`, `telephone`, `openingHours`, or any medical type (`MedicalBusiness`, `Physician`, `MedicalClinic`, …). None of those are supported by this site, so the rule is encoded rather than remembered.

---

## 9. IndexNow

IndexNow was **not** implemented before; it is now.

- Key file: **`f4a06bec48967c20f68efb4d562c6b71.txt`** at the repo root, containing only that key. IndexNow keys are public by design — Bing fetches `https://aggelosmouzakitis.com/f4a06bec48967c20f68efb4d562c6b71.txt` to confirm domain control, so **this file must stay deployed for as long as the key is in use**.
- Submitter: `scripts/seo/indexnow.js`, which reads the key file and posts to `api.indexnow.org`.

```bash
npm run seo:indexnow                          # submit all 19 sitemap URLs
node scripts/seo/indexnow.js /work-with-me/   # submit specific URLs
node scripts/seo/indexnow.js --dry-run        # print the payload, send nothing
```

Run it after a deploy for created, changed **or deleted** URLs — submitting a retired URL is how it gets re-crawled and dropped. Worth submitting the four retired URLs once after this goes live.

---

## 10. The automated SEO test

`scripts/seo/seo-check.js` serves the repo over HTTP **with Netlify's redirect rules applied**, then crawls it. It has no dependencies beyond Node.

```bash
npm run seo:check              # exits 1 on any error — use this as the deploy gate
npm run seo:check -- --warn    # also lists non-blocking warnings
npm test                       # same thing
```

It fails on: a non-200 indexable page, a missing or duplicate title, a missing or duplicate description, a missing/duplicate/mismatched canonical, an accidental `noindex`, a missing or multiple H1, thin pre-JS HTML, missing Open Graph or Twitter tags, `og:url` ≠ canonical, an OG image that does not resolve, JSON-LD that does not parse, an FAQ schema entry missing from the page text, a broken internal link, an internal link that goes through a redirect, a link to a retired URL, retired wording in copy or metadata, a retired URL in the sitemap, a sitemap URL that is non-200 or canonicalises elsewhere, a missing `/work-with-me/`, a redirect chain, a non-301 retirement redirect, a nonexistent URL that does not 404, and a broken `robots.txt`.

Add it to CI by running `npm ci && npm run build && npm test`.

---

## Decisions worth a second opinion

Three judgement calls that went beyond the brief's explicit list:

1. **`/1-to-1/` and `/how-i-work` now 301 to `/work-with-me/`.** `/1-to-1/` was a `noindex` orphan describing the same 1:1 service, and `/how-i-work` redirected *into* it — a live URL pointing at a dead end. Both now land on the real page. Say the word and either can be reverted.
2. **`/career-transition-therapy/` was made indexable** rather than de-linked. It is a real 1,194-word page with a distinct search intent, its four siblings are all indexed, and all four link to it. The alternative was stripping those links.
3. **Body copy on the specialty pages still says "advised 500+ companies"** while the proof strips say "100+ technology companies advised". These are different metrics rather than a contradiction, so I aligned the *schema* to the visible proof strip and left the body copy alone — changing a claimed track record is yours to make, not mine.
