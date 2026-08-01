# SOMO — bilingual website

A standalone, production-ready static website for SOMO. Greek is the default
language; English is available through a visible switcher. The site is generated
from reusable components into plain, SEO-friendly HTML.

> This folder is the **root of its own deployment** (its own domain). Internal
> links are root-relative (`/`, `/en/`, `/somo-circles/`, `/assets/…`). Serve the
> `somo/` directory as the web root.

## Structure

```
somo/
  assets/
    somo.css        Design system (one file)
    somo.js         Interactions (nav, dropdown, mobile menu, forms, analytics, reveal)
    img/            Founder photo, favicons, OG images (generated)
  src/
    config.js       All external URLs + contact + analytics (edit this)
    components.js   Reusable components (nav, footer, cards, CTA, FAQ, forms, layout)
    pages.js        Page bodies (language-agnostic)
    i18n/el.js      Greek copy (default)
    i18n/en.js      English copy
    build.js        Static-site generator
    og.js           OG images + favicon PNGs (Playwright)
  index.html …      Generated pages (do not edit by hand)
  en/…              Generated English pages
  sitemap.xml, robots.txt, 404.html   Generated
```

## Build

```bash
node somo/src/build.js          # build both languages + sitemap + robots + 404
node somo/src/build.js el       # one language, for quick checks
node somo/src/og.js             # (re)generate OG images + favicons
```

The generated `*.html`, `sitemap.xml`, `robots.txt` and `404.html` are committed
so the site can be served with no build step.

## Deploy to GitHub Pages

A workflow at `.github/workflows/somo-pages.yml` publishes this folder to Pages.

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions** (one time).
2. Push to the site branch (or run the workflow manually). It builds and deploys.
3. Live at `https://<owner>.github.io/<repo>/`.

The workflow rebuilds with the correct `BASE_PATH` automatically, because the
committed pages use root-relative links (`/assets/…`) that assume a domain root.
If the `github-pages` environment blocks deploys from a non-default branch, add
the branch under **Settings → Environments → github-pages → Deployment branches**,
or merge to `main`.

**Custom domain:** add a `somo/CNAME` file containing your domain (e.g.
`www.somo.gr`) and set the DNS. The workflow then publishes at the domain root
with no base path, and the committed root-relative build is already correct.

Base path is only needed for a project URL. Since `basePath` defaults to empty,
the committed files work as-is for any root deployment (custom domain, Netlify,
Cloudflare Pages, S3, etc.).

## Configuration

Everything external lives in `src/config.js` (or as environment variables at
build time). Replace the placeholders before launch, then rebuild.

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Production origin (canonical, hreflang, OG, sitemap) |
| `LUMA_ALL_EVENTS_URL` | Main SOMO calendar (nav, hero, footer CTAs) |
| `LUMA_CIRCLES_URL` | Upcoming Somo Circles |
| `LUMA_FLOW_WAITLIST_URL` | Somo Flow waiting list |
| `LUMA_OUTDOORS_URL` | Somo Outdoors events (accepted members) |
| `OUTDOORS_APPLICATION_URL` | POST endpoint for the Somo Outdoors application form |
| `CONTACT_FORM_URL` | POST endpoint for the organisation enquiry form |
| `CONTACT_EMAIL` | Contact address + mailto fallback for the forms |
| `ANALYTICS_ID` | Optional GA4 id. Empty = no analytics platform loaded |
| `SOMO_INSTAGRAM_URL`, `SOMO_LINKEDIN_URL` | Optional footer social links |

Example:

```bash
SITE_URL=https://somo.gr LUMA_CIRCLES_URL=https://lu.ma/xxxx \
CONTACT_FORM_URL=https://formspree.io/f/xxxx CONTACT_EMAIL=hello@somo.gr \
node somo/src/build.js && node somo/src/og.js
```

## Forms

The two non-Luma forms (Somo Outdoors application, organisation enquiry) POST to
`OUTDOORS_APPLICATION_URL` / `CONTACT_FORM_URL`. With JS they validate inline,
submit asynchronously and show a calm confirmation without losing entered data.
Without JS they submit natively. If no endpoint is set, they fall back to an
email draft to `CONTACT_EMAIL`. Luma handles all event booking and waiting lists.

## Analytics

No platform is installed by default. Every tracked interaction is pushed to
`window.dataLayer` (and to `gtag`/`window.somoAnalytics` if present), so a tag
manager can pick it up. Set `ANALYTICS_ID` to load GA4. Outbound Luma links carry
UTM parameters (source page + placement) that are never shown to users.

## Notes

- Legal copy on the Privacy and Participation pages is provisional and must be
  reviewed by a qualified professional before launch (see the source comment in
  `pages.js`).
- Event dates, prices and availability are never hardcoded. Luma is the source of
  truth; the site links to it.
