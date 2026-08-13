# 02 — Phase 2 Implementation Report

**Consolidation:** move the Greek site into the `.com` project as `/el`, preserving SEO.
**Date:** 2026-08-13 · **State:** built & tested on branch; **production NOT cut over.**
Companion: [`02-regression-results.md`](./02-regression-results.md) · [`proposed-gr-redirect-map.csv`](./proposed-gr-redirect-map.csv) · [`gr-redirect-site/`](./gr-redirect-site/) · [`scripts/`](./scripts/)

---

## Architecture chosen

The English site is a React SPA whose per-route `index.html` files carry a **prerendered
static snapshot** inside `#root`; React calls `createRoot().render()` on load and
**replaces** that snapshot. The Greek site was a **Python static-site generator** whose
output already uses **depth-aware relative links/assets** (works unchanged under a
sub-path).

Rather than rewrite 9 Greek pages as React components (high SEO-regression risk, and the
spec forbids refactoring the React app), I **brought the Greek generator into the `.com`
repo** and pointed it at `/el`. This is the lowest-risk path that still yields one repo,
one deploy, shared design system, reliable prerendered HTML, and per-page metadata — and
it keeps the rendered Greek pages **materially identical** to the current `.gr` versions
(proven: titles/descriptions/H1s are byte-for-byte equal — see regression check origin).

Concretely:

- **`el-src/`** — the Greek generator, adapted (see “Files changed”). Run `python3 el-src/build.py`
  to (re)generate `/el`. The Greek copy (`pages_content.py`, `diagnostic_page.py`) is
  **unchanged** — content is frozen; only URL/host/schema/lang/hreflang wiring changed.
- **`/el/`** — the generated, self-contained Greek site (9 pages + its own fonts/img/OG/
  favicons/manifest/llms.txt), served as static files by the same Netlify site.
- **Language switcher** — one shared component (`el-src/lang_switch.py`): emitted into
  Greek pages by the generator and injected into English pages by
  `el-src/inject_en_switcher.py`. It is a `position:fixed` block placed **outside `#root`**,
  so React’s client render can’t remove it (crawlable, real anchors, no JS-only routing).
- **Sitemap** — `el-src/build_sitemap.py` rewrites the single root `sitemap.xml` = 48
  English (untouched) + 9 `/el`, zero `.gr`.

Deployment model matches the existing English one (committed static artifacts): the `/el`
HTML and the updated `sitemap.xml` are committed, exactly as the English prerender
snapshots already are. Regeneration is a documented two-command step
(`build.py` → `build_sitemap.py`), optionally wireable into the Netlify build command later.

## Files changed

**New — Greek build tooling (`el-src/`):**
- `build.py` (adapted generator), `pages_content.py` & `diagnostic_page.py` (**verbatim** Greek copy),
  `lang_switch.py` (shared switcher), `inject_en_switcher.py` (English switcher/hreflang injector),
  `build_sitemap.py` (root sitemap merge), `assets/` (20 self-hosted Greek assets).

**New — generated Greek site (`el/`):** 9 `index.html` pages + 21 asset files (`fonts/`,
`img/`, `img/og/`, favicons, `apple-touch-icon.png`, `manifest.json`, `llms.txt`).

**Modified — tracked:**
- `sitemap.xml` — **+9** `/el` URLs appended (48 English entries byte-identical; 0 `.gr`).
- **48 English `*.html`** — **purely additive** (`git diff --numstat` → **0 deletions**):
  - all 48: one language-switcher block before `</body>`;
  - the **6 paired** pages only: one extra `<link rel="alternate" hreflang="el" …>` in `<head>`.

**New — Phase-2 docs (`seo-migration/`):** this report, `02-regression-results.md`,
`proposed-gr-redirect-map.csv`, `scripts/regression_check.py`, `gr-redirect-site/` (staged).

**Adapted-generator changes vs the original `.gr` `build.py` (the only edits):**
`OUT`→`/el`; `BASE_URL`→`https://aggelosmouzakitis.com/el`; `PERSON_ID`→`…com/#person`;
Person `url`/`image`→root; `<html lang>`→`el`; per-page conservative hreflang; language
switcher injection; root-level `404`/`sitemap.xml`/`robots.txt`/`.nojekyll` writes removed
(they are single files on the `.com` host); `llms.txt` kept at `/el/llms.txt`.

## English regression

**No English URL, metadata, or page semantics changed.** Verified by `git diff --numstat`
across all 48 English HTML files: **zero deletions** (nothing modified or removed). The
only additions are:
1. a **language switcher** (all 48 pages) — the explicitly-required §9 element; and
2. a reciprocal **`hreflang="el"`** link (the 6 paired pages only) — the explicitly-required §8 element.

Titles, descriptions, canonicals, robots, Open Graph, existing JSON-LD, copy, slugs, and
`<html lang="en-IE">` are all **untouched**. No `/en/`, no consolidation, no redesign, no
metadata rewrites. Regression checks 5, 6, 14 assert this.

## Greek routes — the 9 final `/el` URLs

| # | `/el` URL | hreflang partner |
|---|-----------|------------------|
| 1 | `https://aggelosmouzakitis.com/el/` | `…/` (EN home) |
| 2 | `https://aggelosmouzakitis.com/el/how-i-work/` | `…/how-i-work/` |
| 3 | `https://aggelosmouzakitis.com/el/about/` | `…/about/` |
| 4 | `https://aggelosmouzakitis.com/el/confidentiality/` | `…/confidentiality/` |
| 5 | `https://aggelosmouzakitis.com/el/burnout-diagnostic/` | `…/burnout-diagnostic/` |
| 6 | `https://aggelosmouzakitis.com/el/imposter-syndrome/` | `…/imposter-syndrome-therapy/` |
| 7 | `https://aggelosmouzakitis.com/el/executive-coaching/` | **none (intentional)** |
| 8 | `https://aggelosmouzakitis.com/el/burnout/` | **none (intentional)** |
| 9 | `https://aggelosmouzakitis.com/el/career-coaching/` | **none (intentional)** |

Greek slugs preserved 1:1 from `.gr` (no renaming).

## Canonicals

Every `/el` page **self-canonicalizes** to its own `.com/el/…` URL; none reference `.gr`
(check 4). English pages keep their existing self-canonicals unchanged (check 5). No Greek
page is canonicalized to an English version.

## Hreflang — exactly what was paired

**Paired (reciprocal `en` ↔ `el`, symmetric cluster incl. `x-default`→EN, 6 clusters):**
`/`↔`/el/`, `/about/`↔`/el/about/`, `/how-i-work/`↔`/el/how-i-work/`,
`/confidentiality/`↔`/el/confidentiality/`, `/burnout-diagnostic/`↔`/el/burnout-diagnostic/`,
`/imposter-syndrome-therapy/`↔`/el/imposter-syndrome/`.

**Deliberately NOT paired (no hreflang at all on the Greek page; no `hreflang=el` added to
the English candidates):** `/el/executive-coaching/`, `/el/burnout/`, `/el/career-coaching/`
— the coaching-vs-therapy intent does not match closely enough (decision #2). Their
switcher simply points `ΕΛ`/`EN` at the other language’s **home**.

**All other English pages** (founders, solopreneurs, blog, city pages, etc.) keep their
pre-existing self-referential `en`/`x-default` and get **no** `el` alternate — no
equivalents were manufactured.

**x-default:** not a site-wide homepage fallback. For the 6 real clusters it is a valid
member (the English URL of that same page), symmetric on both sides. No language-selection
splash page exists or was created.

## Schema — Person entity consolidation

One identity across the site: **`@id = https://aggelosmouzakitis.com/#person`** on every
Greek page (check 12); the old `aggelosmouzakitis.gr/#person` is **gone**. The Person node’s
`url`/`image` point to the root `.com`, matching the English Person node, so both languages
describe **one** entity. Market-specific descriptive fields are preserved (Greek `jobTitle`
“Σύμβουλος Ψυχικής Υγείας”, Greek `description`/`knowsAbout`) — one entity, market-specific
wording, as instructed. The Greek `WebSite`/`ProfessionalService` nodes are scoped under
`…/el/#website` and `…/el/#practice` so they don’t collide with the English root nodes;
their URLs are `.com/el/…`, `inLanguage: el-GR`. All JSON-LD parses (check 11).

## Internal links — remaining `.gr` references

`/el` internal navigation (sidebar, footer, CTAs, breadcrumbs, buttons, inline links) uses
**relative, depth-aware paths**, so it resolves within `/el` with **no `.gr` links** (check 9).
Canonical/OG/schema/breadcrumb/`@id` URLs are all `.com/el`.

**One `.gr` string remains, by design:** in `el/burnout-diagnostic/index.html`,
`var SOURCE="GR — aggelosmouzakitis.gr"` and `site:'gr'` — **backend analytics labels** for
the diagnostic’s form submissions, not URLs/links/schema. Kept verbatim for measurement
continuity (decision #4) and allow-listed in check 13. This is the **only** `.gr` occurrence
anywhere in `/el`.

## Sitemap / robots

- **Sitemap:** one root `/sitemap.xml`, **57 URLs** = 48 English (unchanged) + 9 `/el`
  (self-canonical, indexable), **zero `.gr`**, no `/404`, no `/el/llms.txt`, no dupes
  (check 10). Regenerate with `python3 el-src/build_sitemap.py` (idempotent).
- **Robots:** the single root `/robots.txt` is **left unchanged** — it already `Allow: /`
  (so `/el` is fully crawlable) and references the sitemap. No second robots.txt is
  introduced; `/el` is **not** blocked. (The `.gr` AI-bot allow-list is redundant under the
  existing blanket `Allow: /` and was intentionally not copied to avoid an unnecessary
  English-side edit; it can be added later if desired.)
- **Preview exposure:** the `/el` pages and the updated sitemap live only on this branch
  until cutover, and the sitemap lists **production** `.com` URLs only (never
  deploy-preview hostnames) — so no preview URLs are advertised for indexing.

## Analytics (documented, not modified)

- **English routes** fire GA4 **`G-KV83RRF6ZM`** (gtag in `<head>`) — unchanged.
- **`/el` routes** fire GA4 **`G-H5ZDTS9FC8`** (the Greek property), deferred via
  `requestIdleCallback` — carried over from `.gr` unchanged.
- **No page fires both**, so no duplicate pageviews or property conflicts after integration.
- **Technical complication from the host change:** the Greek property now receives
  pageviews under the **`aggelosmouzakitis.com` host with `/el/…` paths** (previously
  `aggelosmouzakitis.gr`). If that GA4 property has hostname-based filters, stream URL
  settings, or reports keyed on `aggelosmouzakitis.gr`, those config items should be updated
  in the GA UI (no code change). The diagnostic’s `site:'gr'` submission label is unchanged,
  so Greek form submissions still categorise correctly. A same-domain EN↔EL switcher means
  **no cross-domain tracking / referral-exclusion setup is needed** (simpler than before).
- **Consolidation deferred** (decision #4). If unified later: one property with a
  language/content-group dimension (or GA4 data-stream config), out of scope here.

## Redirect readiness (prepared, not activated)

`.gr` will move to Netlify as a **dedicated redirect-only site** — the correct pattern
because Netlify redirect `conditions` don’t include request **host**, so hostname-specific
rules can’t live on the main `.com` site without also affecting `.com`. A tiny separate
site bound to `aggelosmouzakitis.gr` with an explicit `_redirects` map is fully supported.
**Netlify can do this correctly — no blocker.**

Staged and ready in [`gr-redirect-site/`](./gr-redirect-site/):
- `_redirects` — the **9 explicit 301s** (slug-preserving, `.gr/x/` → `.com/el/x/`) + a
  genuine-404 catch-all (**no** homepage fallback; unknown paths 404).
- `404.html` — real not-found page (noindex).
- `README.md` — activation steps.

Machine-readable map: [`proposed-gr-redirect-map.csv`](./proposed-gr-redirect-map.csv)
(`old_url,new_url,status,reason`).

**Phase-3 activation (do NOT do now):** create the redirect site from that folder → add
`aggelosmouzakitis.gr` (+`www`) as its custom domain → repoint `.gr` DNS → verify
`curl -sI .gr/burnout/` = 301 → `.com/el/burnout/`, unknown = 404.

## Risks remaining (concrete)

1. **Duplicate-content window at cutover (main risk).** Once `/el` is live in production
   *and before* `.gr` redirects are active, the same Greek content exists at both `.gr/*`
   and `.com/el/*`, each self-canonical — no cross-canonical. **Mitigation:** in Phase 3,
   deploy `/el` to production and activate the `.gr`→`/el` redirects **in the same change
   window**; keep the gap minimal. (No duplication exists now — `/el` is branch-only.)
2. **`.gr` is still on GitHub Pages** (Phase-1 R1). The redirect site must be created and
   DNS repointed at cutover; until then `.gr` serves the old pages. Tracked; staged config ready.
3. **English switcher is an injected overlay, not a React component.** If English pages are
   ever re-prerendered from source, re-run `python3 el-src/inject_en_switcher.py` (idempotent)
   to reapply it. Minor maintenance note.
4. **Minor, documented:** `/el` pages keep `og:locale`/`inLanguage` = `el-GR` while
   `<html lang>` = `el` (both valid Greek); `/el/img` & `/el/fonts` don’t match the existing
   `netlify.toml` 1-year cache rules (optional: add `/el/img/*`, `/el/fonts/*` headers — perf
   only, no SEO impact); the `/el/burnout-diagnostic/` tool is client-rendered (thin static
   HTML — same as the English diagnostic, pre-existing, not caused by this migration).

## QA result

All destination requirements are implemented and verified: 9 Greek `/el` pages with frozen
content and correct canonicals/lang/OG/schema; English preserved (additive-only); a
conservative, symmetric hreflang design with the 3 ambiguous pages left unpaired; a unified
Person entity; GA behaviour preserved; a single valid 57-URL sitemap with zero `.gr`; a
crawlable language switcher on both languages; and a staged, explicit `.gr` redirect map.
Automated regression: **15/15 pass.** No blockers.

**PHASE 2 READY FOR MIGRATION QA: YES**
