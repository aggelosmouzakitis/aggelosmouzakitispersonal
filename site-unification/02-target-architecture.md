# 02 — Target Architecture

_The final intended architecture. Reflects the locked brief; does not propose alternative positioning._

## One brand, one site, one offer, two languages, one blog

**Aggelos Mouzakitis — Business Advisor + Therapist**
For people who want to build something of their own, or make what they've already built much bigger.
Central idea: **Build the business. Work on the person building it.**

- One canonical website: `https://aggelosmouzakitis.com`
- English at root `/`; Greek at `/el/` (localised same brand, same offer, same hierarchy).
- One commercial offer: **1:1** (no group offer built; architecture leaves room to add later).
- One mixed-language blog at `/blog/`.
- `aggelosmouzakitis.gr` → redirect-only property (retain ownership).

## Core sitemap (target)

```
/                     Home (positioning, diagnosis, two-track model, evidence, path to 1:1)
├── /1-to-1/          The offer — "what am I actually buying?"
├── /about/           Credible reason to work across business + psychology
├── /reviews/         Genuine testimonials
├── /blog/            One blog, language-filterable (All / English / Ελληνικά)
├── /book/            Fit-call conversion page (Calendly)
├── /confidentiality/ Trust / safeguards
│
└── /el/              Greek home
    ├── /el/1-to-1/
    ├── /el/about/
    ├── /el/reviews/
    ├── /el/book/
    └── /el/confidentiality/
```

Deliberately **no** `/how-i-work/` core page (content distributed to `/` + `/1-to-1/`).
Deliberately **no** persona pages (`/founders/`, `/solopreneurs/`, `/executives/`).
Deliberately **no** service-category IA (`/burnout/`, `/career-coaching/`, `/imposter-syndrome/`).
No `/el/blog/` — Greek "Writing" enters the shared `/blog/` with the Greek filter active.

## Navigation (lean)

**English (desktop sidebar / mobile bottom nav):**
```
Aggelos Mouzakitis  ·  Business Advisor + Therapist
1:1        → /1-to-1/
About      → /about/
Writing    → /blog/
Reviews    → /reviews/
EN / Ελληνικά   (language switcher → equivalent page under /el/)
[Book a fit call] → /book/
```

**Greek:**
```
1:1        → /el/1-to-1/
Σχετικά    → /el/about/
Άρθρα      → /blog/?lang=el
Κριτικές   → /el/reviews/
ΕΛ / English   (→ equivalent English page)
[Κλείσε γνωριμία] → /el/book/
```

No "Services"/"Work with me" mega-menu for a single offer. Legacy persona/service links removed from nav, homepage and internal positioning.

## Rendering / technical approach (keep proven infrastructure)

- Keep **React app-shell + Playwright prerender**. Refactor to a single central mount: `renderApp(pageId, lang)` exported from `content-pages.js`. Each core `index.html` = prerendered `#root` shell + `<script>renderApp('one-to-one','en')</script>`.
- **Bilingual content as data**: a `CONTENT` object keyed by language (`CONTENT.en.home`, `CONTENT.el.home`, …) consumed by shared, language-agnostic render components (`TrackCards`, `PatternList`, `Section`, `SiteFooter`, `Sidebar`). Keeps EN/EL structurally in sync; only strings differ. One content collection, no duplicated component tree.
- `about/` and `reviews/` converted from standalone static → app-shell pages so every core page carries the same sidebar + language switcher + prerendered fallback.
- `/el/*` pages added to the prerender list → same indexable path as English (brief §57).
- Sidebar gains a language switcher and bilingual labels (driven by `lang`).

## Homepage content architecture (order — brief §14–23)
1. **Hero** — role (Business Advisor + Therapist), promise, "Build the business. Work on the person building it.", short intro (psychotherapy + product/growth), CTAs: primary "See how 1:1 works" → `/1-to-1/`, secondary "Book a fit call" → `/book/`.
2. **Recognition / diagnosis** — concrete situations (mined from `/solopreneurs/`).
3. **Cause → effect** — psychological pattern → business outcome (`PatternList`).
4. **Counterpoint** — "But sometimes the problem really is the business." → "That's why we work on both."
5. **Two tracks** — business track / personal track (`TrackCards`) + "Some weeks the problem is mostly the business. Some weeks it's mostly you."
6. **Who this is for** — situations, not personas.
7. **Why me** — the unusual combination (verified facts only).
8. **1:1** — brief teaser → `/1-to-1/`.
9. **Evidence** — one strong, de-identified case (adapted from the solopreneur case).
10. **Writing** — a few recent articles.
11. **Final CTA** — "You want to build something of your own. Or you already have, and you know there's much more left in it." → Book a fit call.

## 1:1 page architecture (brief §25)
Opening ("1:1 Business Advisory + Psychological Work") → Who it's for (situations) → What we work on (Business track / Person track) → How the engagement works (only confirmed mechanics: fit call → paid session → ongoing, online 1:1; price = "on the fit call") → What to expect (credible, no guarantees) → What this is not → Evidence (relevant testimonials) → CTA Book a fit call.

## Retained legacy SEO pages (out of nav; see 03/04 for per-URL rationale)
Conservative retention where the service is still truthfully offered and search intent is compatible; everything else 301s to the closest genuine replacement. No blanket deletions.

## CTA structure
Primary conversion = **Book a fit call** (`/book/` ↔ `/el/book/`). Secondary = **See how 1:1 works** (`/1-to-1/`). Every core page routes toward `/book/`.

## Blog model
One `posts.json` (single collection) with a `lang` field per post (`en`/`el`). `/blog/` index renders All/English/Ελληνικά filter. Each article: self-canonical, correct `<html lang>`, no fabricated alternate-language URL. `hreflang` between posts only when a real translation exists.
