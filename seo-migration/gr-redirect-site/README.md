# `.gr` redirect site (STAGED — do not activate before Phase 3)

This folder is a **complete, deploy-ready Netlify site** whose only job is to 301
every valid `aggelosmouzakitis.gr` URL to its exact `aggelosmouzakitis.com/el/…`
counterpart. It is **not wired to any domain or DNS yet.**

## Why a dedicated site (the Netlify technicality)

Netlify **can** do hostname-specific permanent redirects — but **not** as a `Host`
condition on the main site. Netlify redirect `conditions` support Country / Language
/ Role / Cookie, **not** request host. The two same-site options both fail our need:

- **Domain alias + "primary domain" redirect** → Netlify would send `.gr/burnout`
  to `.com/burnout` (path preserved), **losing the required `/el/` prefix**.
- **`[[redirects]]` in the main `netlify.toml`** → applies to *every* hostname on
  the site, so it would also redirect `.com` visitors.

The correct, fully-supported Netlify pattern is a **separate, tiny redirect-only
site** bound to the `.gr` hostname, with an explicit `_redirects` map. That is what
this folder is. **Conclusion: Netlify supports the required redirects — no blocker.**

## Contents
- `_redirects` — the 9 explicit 301s + a genuine-404 catch-all (no homepage fallback).
- `404.html` — real not-found page (noindex) for any unlisted `.gr` path.

## Activation (Phase 3 only)
1. Create a new Netlify site; set its publish directory to this folder's contents
   (or point it at a `gr-redirect` branch/repo containing just these two files).
2. In that site: **Domain management → add custom domain** `aggelosmouzakitis.gr`
   (and `www.aggelosmouzakitis.gr`).
3. **Only then** repoint `.gr` DNS to that Netlify site (per Netlify's DNS records).
4. Verify: `curl -sI https://aggelosmouzakitis.gr/burnout/` → `301` →
   `location: https://aggelosmouzakitis.com/el/burnout/`; an unknown path → `404`.
5. Keep the `.gr` Search Console property live to watch the redirects resolve.

Do **not** perform steps 2–4 until the `/el` destination has passed QA.
