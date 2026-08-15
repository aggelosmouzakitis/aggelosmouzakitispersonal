# 01 — Current State

_Audit of the two live properties before any destructive migration. Source of truth = the repositories, not assumptions._

## Repositories

| Property | Repo | Hosting | Build |
|---|---|---|---|
| `aggelosmouzakitis.com` (English) | `aggelosmouzakitis/aggelosmouzakitispersonal` | **Netlify** (`netlify.toml` present) | Babel compiles `*.jsx → *.js` (GitHub Action `build.yml` on push to `main`) |
| `aggelosmouzakitis.gr` (Greek) | `aggelosmouzakitis/aggelosmouzakitis-gr` | **GitHub Pages** (`.nojekyll`, `.github/workflows/pages.yml`) | Python generator `src/build.py` + `src/pages_content.py` → static HTML at repo root |

Both currently carry the branch `claude/aggelosmouzakitis-reposition-gy4a8l` (this work).

---

## `.com` architecture (the canonical site)

### Rendering model — hybrid React + prerender
- Each page is a directory with its own `index.html` (directory-per-route: `/about/` → `about/index.html`).
- Pages load checked-in React 18 UMD (`react.production.min.js`, `react-dom.production.min.js`), then `sidebar.js` + `content-pages.js` (compiled from `.jsx`).
- The homepage and "commercial" pages render a React `App` into `#root` (`<div id="sidebar">` + `<div id="main-scroll">`).
- **SEO prerender** (`scripts/seo/prerender.js`, Playwright): loads each page in headless Chromium and bakes the rendered `#root` innerHTML back into the file as a static fallback. React re-mounts on load. This is how the client-rendered pages are indexable. **Any new page must be added to this prerender list or it will not be crawlable.**
- `scripts/seo/og.js` regenerates `img/og/*.png` (1200×630 social cards).

### Two page-construction patterns (inconsistent today)
1. **App-shell React pages** (have the sidebar): `/`, `/founders/`, `/solopreneurs/`, `/how-i-work/`, `/book/`, `/confidentiality/`, the 5 `therapy-*`/specialty pages, 4 `greek-speaking-therapist-*`, `/burnout-diagnostic/`, `/blog/`. Components live in `content-pages.jsx`; each `index.html` sets an initial `page` id + a local `SPECIALTY_IDS`/`URL_MAP` and mounts via `SpecialtyPage`.
2. **Standalone static pages** (NO sidebar, footer only): `/about/`, `/reviews/`. Self-contained inline CSS + HTML.
   - _Inconsistency to fix: about/reviews lack the primary navigation and language switcher._

### Blog
- `blog/index.html`: inline React component `BlogIndex` fetching `/blog/posts.json`, rendering a `.post-list`. Sidebar mounted from `sidebar.js`. No language field, no filter.
- `blog/posts.json`: array of `{title, slug, date, description}` — **27 posts, all English**, no `lang` key.
- `blog/post-template.html`: template for new posts (noindex header via netlify.toml).
- Each post: `blog/<slug>/index.html` — static article + `#sidebar-mount` (sidebar-only prerender). ~27 posts.

### Shared components (`content-pages.jsx`, 1387 lines)
`Section`, `P`, `Strong`, `A`/`IA` (links), `FaqItem`, `Testimonial`/`Testimonials`, `SiteFooter`, `StartHere`, `LatestWriting`, `PatternList` (cause→effect rows — **directly reusable for the homepage cause/effect section**), `TrackCards` (two-track cards — **reusable for the two-track section**), `StepCards`, `Kicker`. Page components: `HomePage`, `SpecialtyPage`, `ForFoundersPage`, `SolopreneursPage`, `HowIWorkPage`, `BookPage`, `ExecTherapyPage`, `FoundersTherapyPage`, `ImposterPage`, `BurnoutPage`, `CareerTransitionPage`, London/Manchester/NewYork/Dublin, `ConfidentialityPage`.

### Design system (preserve)
- Font: **Libre Franklin** (Google Fonts). Palette: text `#282726`, accent green `#1a7f37` (hover `#146b2e`), muted `#666`/`#6e6e6e`, page bg `#F5F5F5`, content bg `#FFFFFF`.
- Sidebar 300px (collapsible to 68px rail) desktop; fixed bottom nav on mobile (`<768px`).
- `strong` = underline emphasis (not bold). Green CTA button, ghost CTA.

### SEO / metadata system (per-page, hand-authored in each `index.html` head)
- `<title>`, meta description, canonical, Open Graph + Twitter, JSON-LD (`Person`, `WebSite`, `Organization`, `FAQPage`, `AboutPage`, `BreadcrumbList`, service schema), `hreflang` (currently only `en` + `x-default` self-referential — **no Greek alternates yet**).
- `<html lang="en-IE">` sitewide. GA4: **`G-KV83RRF6ZM`** (gtag, in every head).
- `llms.txt` present (AI-crawler summary) — positions around "founders & solopreneurs", "two tracks".

### Forms / booking / analytics
- **Booking**: Calendly inline widget `calendly.com/aggelosmouzakitis/one-to-one` on `/book/` (script injected in `BookPage`). Also `mailto:aggelos.mouzakitis@gmail.com`.
- **Diagnostic**: `diagnostic.jsx` (self-assessment quiz) at `/burnout-diagnostic/`.
- **Analytics**: single GA4 property, no explicit event tracking on CTAs (page-view only via gtag config).
- `admin/` — Netlify-CMS-style admin (noindex via header).

### Redirects (current, `netlify.toml`)
- `/schedule`, `/schedule/*`, `/faqs`, `/faqs/*` → `/` (301, force). Long-cache headers for static assets. `X-Robots-Tag: noindex` for `/admin/*`, `blog/posts.json`, `blog/post-template.html`.

### Full live URL inventory (`.com`) — from sitemap.xml + filesystem
Core: `/`, `/about/`, `/reviews/`, `/book/`, `/confidentiality/`, `/how-i-work/`
Persona: `/founders/`, `/solopreneurs/`
Service/specialty: `/therapy-for-executives/`, `/therapy-for-founders/`, `/imposter-syndrome-therapy/`, `/executive-burnout-therapy/`, `/career-transition-therapy/`
Location SEO: `/greek-speaking-therapist-london/`, `/greek-speaking-therapist-manchester/`, `/greek-speaking-therapist-new-york/`, `/greek-speaking-therapist-dublin/`
Tools/other: `/burnout-diagnostic/`, `/ask-me-anything/`, `/getinterviewed/`
Blog: `/blog/` + 27 post URLs (see `blog/posts.json` / sitemap).
Not in sitemap but present: `/admin/`, `404.html`, `/schedule`+`/faqs` (redirected).

---

## `.gr` architecture (to be retired)

### Rendering / hosting
- Plain static HTML generated by `src/build.py` from `src/pages_content.py` (copy) + `src/diagnostic_page.py`. Same design system as `.com` (sidebar layout, Libre Franklin, same palette) but hand-built HTML, not React.
- Served by **GitHub Pages**. `<html lang="el-GR">`. GA4: **`G-H5ZDTS9FC8`** (separate Greek property). `hreflang` self-referential only (`el-gr`, `el`, `x-default`).
- `BASE_URL = https://aggelosmouzakitis.gr` (placeholder in build.py). Instagram present (`_aggelosmouzakitis_`).

### Positioning (OLD — do not preserve architecture)
- Job title: **"Σύμβουλος Ψυχικής Υγείας"** (mental-health advisor/counsellor). Nav: Αρχική · Μέθοδος · Υπηρεσίες (dropdown: Executive Coaching / Burnout / Career Coaching). CTA = Burnout Diagnostic + mailto.
- Around: Executive Coaching, Burnout, Career Coaching, Imposter Syndrome.

### URL inventory (`.gr`) — from sitemap.xml + filesystem
`/`, `/how-i-work/`, `/about/`, `/executive-coaching/`, `/burnout/`, `/career-coaching/`, `/imposter-syndrome/`, `/burnout-diagnostic/`, `/confidentiality/`.

### What to extract before retirement
- Natural Greek copy for: two-track model ("το πρακτικό επίπεδο / το ψυχολογικό επίπεδο"), the counterpoint ("Δεν ψυχολογικοποιούμε κάθε επαγγελματική δυσκολία"), confidentiality (full page), about (background/credentials), how-we-start steps.
- **Verified Greek credential wording (LOCKED — see §48 of brief)**: "Σύμβουλος Ψυχικής Υγείας"; "MSc in Integrative Counselling & Psychotherapy, University of Derby"; "εγγεγραμμένος στο BACP"; "Πρώην founder & στέλεχος τεχνολογίας". **Do NOT upgrade to "Ψυχοθεραπευτής"/"Ψυχολόγος"** (regulated terms in Greece).

---

## Verified facts (reconcile across both sites — use these; do not invent/strengthen)
- 18+ years in tech, in product & growth; built own companies; worked in startups **and** large orgs (IBM enterprise portfolio named on `/therapy-for-executives/`).
- Advised **500+** companies.
- **MSc Integrative Counselling & Psychotherapy, University of Derby**; **registered member, BACP**.
- Based in **Ireland**; works globally; sessions **online, 1:1, confidential**.
- Booking = Calendly (`/one-to-one`); email `aggelos.mouzakitis@gmail.com`.
- Socials: LinkedIn `in/growth-product-manager`, YouTube channel `UCfeHgYhNWwIRgWyRW9J0YCA`, Instagram `_aggelosmouzakitis_` (Greek site only).

## Notable implementation risks
1. **Prerender dependency**: client-rendered pages need the Playwright prerender to be indexable. `/el/` must go through the identical path (brief §57). Playwright/Chromium is available in this environment.
2. **`.gr` on GitHub Pages cannot do server-side 301s** → path-level permanent redirects require moving `.gr` to Netlify (brief §41). Operational/DNS step, flagged in `06`.
3. **about/reviews are static (no nav)** — converting them to the app-shell is required for a consistent nav + language switcher.
4. **Blog has no language model** — `posts.json` needs a `lang` field; `BlogIndex` needs a filter.
5. **Unverified commercial mechanics**: no published price/duration/frequency (kept deliberately vague on `/how-i-work/` — "priced as a monthly engagement"; `TODO(confirm)` markers already exist in `confidentiality`). Do not invent (brief §25).
6. Two GA4 properties exist; the unified site standardises on the `.com` property for `/` and `/el/` (documented in `06`).
