# 07 — QA Checklist

_Status legend: [ ] pending · [x] done · [~] partial/needs-live-env · [!] blocked (owner/DNS)_

## Build & prerender
- [ ] `npm run build` compiles JSX→JS with no errors
- [ ] `node scripts/seo/prerender.js` bakes snapshots for every core EN + EL page and `/1-to-1/`
- [ ] Prerendered `#root` contains real content (>200 chars) for each page (no empty shells)
- [ ] `node scripts/seo/og.js` regenerates OG images for new/changed pages

## Core English pages (200 + correct render, desktop + mobile)
- [ ] `/` home — hero, recognition, cause→effect, counterpoint, two tracks, who-for, why-me, 1:1 teaser, case, writing, final CTA
- [ ] `/1-to-1/` — opening, who-for, what-we-work-on, how-it-works, expectations, what-it's-not, evidence, CTA
- [ ] `/about/` — background, credentials, convergence story, ambition-not-pathology, has sidebar+switcher
- [ ] `/reviews/` — 15 testimonials verbatim, has sidebar+switcher
- [ ] `/book/` — Calendly widget loads, 3-step, email fallback
- [ ] `/confidentiality/` — full content, safeguards intact

## Core Greek pages (200 + correct render, desktop + mobile)
- [ ] `/el/` · `/el/1-to-1/` · `/el/about/` · `/el/reviews/` · `/el/book/` · `/el/confidentiality/`
- [ ] Natural Greek (not literal translation); positioning matches EN
- [ ] Job title = "Σύμβουλος Ψυχικής Υγείας" (NOT Ψυχοθεραπευτής/Ψυχολόγος)
- [ ] `/el/book/` Calendly loads

## Navigation
- [ ] Sidebar shows: 1:1, About, Writing, Reviews, language switcher, Book CTA (EN) / Greek equivalents
- [ ] No persona/service/mega-menu links remain
- [ ] Mobile bottom nav usable; language switcher reachable on mobile
- [ ] All nav links resolve (no links to redirected legacy pages)

## Language switching
- [ ] EN↔EL switch lands on the **equivalent** page (about↔about, 1-to-1↔1-to-1), not always home
- [ ] Greek "Άρθρα" enters `/blog/?lang=el` (Greek filter active), not a second blog
- [ ] Article with no translation: switcher falls back to filtered blog, does not fake a translation

## Blog
- [ ] `posts.json` has `lang` on every entry (existing 27 = en)
- [ ] `/blog/` filter All/English/Ελληνικά works; default All
- [ ] Post pages render; sidebar present; self-canonical; `<html lang>` matches post
- [ ] No `/en/blog/` or `/el/blog/`; single collection

## Redirects (one hop, 301, no chains/loops)
- [ ] `/how-i-work/`→`/1-to-1/`, `/founders/`→`/1-to-1/`, `/solopreneurs/`→`/`
- [ ] `/therapy-for-founders/`,`/therapy-for-executives/`,`/imposter-syndrome-therapy/`,`/executive-burnout-therapy/`,`/career-transition-therapy/`→`/1-to-1/`
- [ ] Pre-existing `/schedule`,`/faqs`→`/` still work
- [!] `.gr/*`→`.com/el/...` semantic map (requires `.gr` on Netlify — DNS step)
- [~] http→https, www→apex single-hop (Netlify domain settings)
- [ ] No redirect targets a redirected URL (no chains)

## Canonical / hreflang / lang
- [ ] Every page self-canonicals (incl. `/el/*`); no Greek page canonicals to English
- [ ] Paired core pages have reciprocal `hreflang` en/el + x-default
- [ ] Unpaired/retained pages have NO fake Greek alternate
- [ ] `<html lang>` correct per page

## Sitemap / robots
- [ ] `sitemap.xml` lists only canonical 200 URLs (EN core + EL core + retained SEO + blog)
- [ ] No redirected/removed URLs in sitemap; no `.gr` URLs
- [ ] `robots.txt` points to `.com` sitemap; `/el/` crawlable
- [ ] `.gr` robots/sitemap not advertising dead `.gr` content post-retirement

## Structured data
- [ ] Person jobTitle = Business Advisor + Psychotherapist; BACP credential intact
- [ ] Schema URLs are final canonical URLs (no legacy)
- [ ] Greek schema keeps approved credential wording; no service schema for unoffered services
- [ ] JSON-LD validates (no syntax errors)

## Analytics / conversion
- [ ] GA present on all core pages (single property)
- [ ] Booking CTA → `/book/` reachable from every page
- [~] Event tracking for booking CTA clicks / language selection (add if feasible; document if not)

## Performance / accessibility
- [ ] Images optimised (webp), lazy where appropriate, hero eager
- [ ] Prerendered HTML present (no JS-only content for crawlers)
- [ ] Heading hierarchy (single h1/page), alt text, focus states, contrast, `lang` attributes
- [ ] Mobile: two-track & cause/effect sections stack readably; no horizontal scroll

## Crawl (post-build)
- [ ] All core routes return 200
- [ ] Old URLs return intended 301
- [ ] No broken internal links; no orphan core pages
- [ ] 404 page works for unknown URLs

## Old-URL spot checks
- [ ] Each `.com` legacy URL → intended outcome (200 retained / 301 target)
- [!] Each `.gr` URL → intended `/el/` target (post-DNS)
