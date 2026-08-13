# SEO Risk Register — Domain Consolidation

**Phase 1 of 5 — audit only.** Risks are ranked by expected impact on preserved organic/GEO
equity during the `.gr` → `.com/el/` consolidation. Severity = (likelihood if unmanaged) ×
(SEO impact). Mitigations are recommendations for later phases; **nothing is implemented here.**

Legend — Severity: 🔴 Critical · 🟠 High · 🟡 Medium · ⚪ Low.

| ID | Severity | Risk | Mitigation (later phases) |
|----|----------|------|---------------------------|
| **R1** | 🔴 Critical | **`.gr` is on GitHub Pages, which cannot issue path-level 301 redirects.** The whole consolidation depends on `.gr/*` → `.com/el/*` 301s. Left on Pages, the only options are meta-refresh/JS "redirects" (weak, equity-leaking, treated as soft by Google) — link equity and rankings for all 9 Greek URLs would be lost. | Repoint `aggelosmouzakitis.gr` DNS to a **redirect-capable host** — Netlify domain alias on the same site, or Cloudflare Redirect Rules / Bulk Redirects. Implement true **301** per-path with a `/* → /el/:splat` catch-all. This is a **blocking prerequisite** for the migration. |
| **R2** | 🟠 High | **hreflang conflict / absence.** Neither site references the other; **both declare `x-default` = self.** After merge, competing/ missing hreflang can cause wrong-language ranking, cannibalisation, or Google ignoring the `el` cluster. | Post-merge, emit **reciprocal `en ↔ el`** on genuine equivalents only, **one `x-default`** → English `/`. Validate every pair round-trips (both pages list each other) before submitting sitemaps. |
| **R3** | 🟠 High | **Coaching (el) vs therapy (en) intent mismatch.** The Greek site sells *coaching* ("Σύμβουλος Ψυχικής Υγείας"); the English site sells *psychotherapy/advisory*. Forcing hreflang pairs between non-equivalent pages (e.g. `executive-coaching` ↔ `therapy-for-executives`) can mislead Google and dilute both. | Pair **only** substantially-equivalent intents. Treat uncertain pairs as **manual decisions** (R3a). Where no true equivalent exists, keep the page single-language (self `x-default`), which is legitimate. |
| **R3a** | 🟠 High | **`/executive-coaching/` (el) has two candidate English equivalents** (`therapy-for-executives`, `executive-burnout-therapy`). Wrong choice mis-pairs hreflang. | **Human decision** required before Phase 2 (compare live search intent / GSC queries). The `/el/executive-coaching/` destination URL itself is not in doubt — only the hreflang partner. |
| **R4** | 🟡 Medium | **Cross-language duplicate slugs** (`about`, `confidentiality`, `how-i-work`, `burnout-diagnostic` exist on both). If the `/el/` prefix, canonicals, or redirect trailing slashes are imprecise, duplicate-content or redirect loops can occur. | Enforce exact `/el/<slug>/` paths, **self-canonical** each `el` page to its own `.com/el/…` URL (never cross-canonical to `en`), and preserve **trailing slashes** in every 301. |
| **R5** | 🟡 Medium | **`.gr/404.html` is `index, follow` and canonicalises to the homepage** — a soft-404 signal that can pollute the index and pass wrong canonical hints. | On the consolidated host, serve a proper **404 status** with `noindex`. Do not carry the homepage canonical onto the error page. |
| **R6** | 🟡 Medium | **Client-rendered diagnostic pages** (`/burnout-diagnostic/` on both). H1/content are injected by JS; crawlable static HTML is thin. Under a new host/path, if prerender/snapshot isn't reproduced, indexable content shrinks further. | Ensure the `/el/burnout-diagnostic/` page ships the same static title/description/meta it has today; consider a small prerendered intro block. Low ranking value (tool page) but avoid regressions. |
| **R7** | 🟡 Medium | **`.com/admin/`, `/blog/posts.json`, `/blog/post-template.html` are kept out of the index by Netlify `X-Robots-Tag` headers, not in-HTML meta.** `post-template.html` also contains `POST_TITLE`/`POST_DESCRIPTION` placeholders. If those headers aren't reproduced on the consolidated config, the placeholder/template pages become indexable. | Re-assert these `X-Robots-Tag` rules in the consolidated Netlify config **and** add an in-HTML `<meta name="robots" content="noindex">` to `post-template.html` as belt-and-suspenders. |
| **R8** | 🟡 Medium | **Duplicate entity:** two `Person`/`ProfessionalService` graphs with domain-scoped `@id`s (`.gr/#person` vs `.com/#person`). Post-merge this can present two competing person entities to Google. | Consolidate to **one** entity `@id` on `.com` (e.g. `https://aggelosmouzakitis.com/#person`) referenced by both language clusters; use `inLanguage` per page and `sameAs` for socials. |
| **R9** | 🟡 Medium | **www/non-www & trailing-slash enforcement** must be carried onto the consolidated host **and** the `.gr` redirector, or redirect chains / duplicate hosts appear (`.gr/x` → `.com/el/x` should be a single hop). | Confirm apex-canonical + trailing-slash normalisation on Netlify and on the `.gr` redirector. Target **one hop** for every legacy URL (avoid www→apex→path chains). |
| **R10** | ⚪ Low | **Split GA4 properties** (`G-KV83RRF6ZM` en, `G-H5ZDTS9FC8` el). Not an organic-ranking risk, but measurement continuity breaks if `/el/` loses its tag or both fire on one page. | Decide: keep two properties (segment by `/` vs `/el/`) **or** unify into one with a language dimension. Ensure exactly one correct tag per page. |
| **R11** | ⚪ Low | **Sitemap & robots duplication.** Two sitemaps and two robots.txt currently; after merge, stale `.gr` versions could advertise dead URLs. | Publish **one** sitemap (or sitemap index) + **one** robots.txt on `.com` covering `/` and `/el/`; retire/redirect the `.gr` versions. Carry over the `.gr` **AI-bot allowlist** (GEO) into the consolidated robots.txt. |
| **R12** | ⚪ Low | **Robots-meta string mismatch** between sites (`.com` = `max-image-preview:large`; `.gr` = full `index,follow,max-snippet…`). Cosmetic, but inconsistent directives across one domain. | Harmonise the robots-meta template across all pages on the consolidated site. |
| **R13** | ⚪ Low | **GSC / Bing property + change-of-address hygiene.** Without registering `.com/el/` coverage and monitoring the legacy `.gr` property, redirect errors and coverage drops can go unnoticed. | Keep the `.gr` Search Console property live through the transition to watch redirects; monitor `.com` coverage for `/el/`. (Domain change-of-address tooling is for full domain moves; here `.gr` folds into a sub-path, so rely on 301s + hreflang + monitoring.) |

---

## Highest-risk items (do these first)

1. **R1 — Move `.gr` off GitHub Pages to a 301-capable host.** Blocking prerequisite; without it
   no equity is preserved.
2. **R2 — Design and validate the unified cross-language hreflang** (reciprocal pairs, single
   `x-default`).
3. **R3 / R3a — Resolve the coaching-vs-therapy equivalence questions**, especially the
   `/executive-coaching/` pairing (human sign-off).

## Explicitly *low* risk (reassurance)

- The 9 Greek pages are **plain static HTML with depth-aware relative paths** → relocating them
  under `/el/` is structurally low-risk.
- **English URLs do not change** (`KEEP_COM`) → no risk to the larger, higher-traffic English
  property from URL churn.
- **Trailing-slash and non-www conventions already match** across both sites → a clean 1:1 redirect
  map is achievable.
- **Retired pages are already handled** (`/schedule`, `/faqs` 301 → `/`).

*No production code changed in this phase. Mitigations are for Phases 2–5.*
