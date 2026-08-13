# 02 — Regression Results (Phase 2)

**Date:** 2026-08-13 · **Scope:** destination build only (no production cutover)
**Runner:** [`seo-migration/scripts/regression_check.py`](./scripts/regression_check.py) — read-only, re-runnable, exit 0 = all pass.

```
python3 seo-migration/scripts/regression_check.py
```

## Result: 15 / 15 checks passed ✅

```
[PASS] Greek /el pages exist (9)                         9/9 present
[PASS] English URLs exist (48)                           en_sitemap=48 missing=[]
[PASS] Greek pages render (title+body)                   bad: []
[PASS] Greek self-canonical to /el (never .gr)           bad: []
[PASS] English canonicals unchanged (self)               bad: []
[PASS] Greek <html lang=el>                              bad: []
[PASS] English <html lang> still en-* (preserved)        bad: []
[PASS] hreflang reciprocal + points to canonicals (6)    bad: []
[PASS] ambiguous pages left unpaired (no forced alt)     forced: []
[PASS] no /el link href points to .gr                    bad: []
[PASS] sitemap valid (57 urls, 9 el, 0 .gr, no junk)     total=57 el=9 gr=0 dupes=False
[PASS] JSON-LD parses (Greek)                            bad: []
[PASS] unified Person @id (.com/#person, no .gr/#person) bad: []
[PASS] no unexpected .gr refs in /el (label allowlisted) unexpected: []
[PASS] English HTML changes additive-only (git del=0)    all deletions=0
```

## What each check maps to (Phase 2 spec)

| # | Check | Spec ref | How verified |
|---|-------|----------|--------------|
| 1 | 9 Greek `/el` pages exist | §1 | files on disk for all 9 slugs |
| 2 | 48 English URLs still exist | §4, §18 | every non-`/el` sitemap `<loc>` resolves to a file |
| 3 | Greek pages render | §2, §18 | `<title>` + `<body>` present on all 9 |
| 4 | Greek self-canonical to `/el` | §6 | canonical == `…/el/<slug>/`, never `.gr` |
| 5 | English canonicals unchanged | §4, §6 | canonical == its own sitemap `<loc>` |
| 6 | `<html lang>` correct | §7 | Greek `el`; English still `en-IE` (preserved) |
| 7 | hreflang reciprocal + canonical | §8 | 6 pairs round-trip; targets are canonical URLs |
| 8 | ambiguous pages unpaired | §2 (decision), §8 | `/el/{executive-coaching,burnout,career-coaching}` have **no** hreflang; the 3 EN candidates have **no** `hreflang=el` |
| 9 | no `/el` link → `.gr` | §10 | no `href` in any `/el` page contains `.gr` |
| 10 | sitemap valid | §12 | well-formed XML, 57 urls, 9 `/el`, 0 `.gr`, no `/404`/`llms`, no dupes |
| 11 | JSON-LD parses | §11 | `json.loads` on every LD block in all 9 pages |
| 12 | unified Person `@id` | §11 | every page uses `.com/#person`; zero `.gr/#person` |
| 13 | no unexpected `.gr` refs | §10 | only allow-listed occurrence is the diagnostic analytics label |
| 14 | English changes additive-only | §4 | `git diff --numstat` shows **0 deletions** across all 48 English HTML files |

## Known, documented, intentional non-failures

- **One `.gr` string remains** in `el/burnout-diagnostic/index.html`:
  `var SOURCE="GR — aggelosmouzakitis.gr"` and `site:'gr'`. These are **backend
  analytics labels** for the diagnostic's form submissions (EmailJS / Sheet), not
  URLs, links, canonicals, or schema. Per decision #4 (preserve analytics
  behaviour) they are **kept as-is** for measurement continuity and allow-listed in
  check 13. Changing them would alter how Greek submissions are categorised.
- **English `<html lang>` is `en-IE`, not `en`.** English pages already declared an
  English locale; per "preserve English exactly" it is left untouched (an
  `en`-family tag, consistent with `hreflang="en"`). Only Greek `lang` was set (`el`).

## Manual / visual QA performed

- Rendered `/el/`, `/el/burnout/`, and `/` in headless Chromium (external hosts
  blocked): Greek pages render **materially equivalent** to the current `.gr`
  versions (sidebar, CTA, copy, design system), and the `EN | ΕΛ` switcher shows on
  all three with the correct active language.
- Reciprocal-hreflang symmetry spot-checked (`/about/` ↔ `/el/about/`,
  `/imposter-syndrome-therapy/` ↔ `/el/imposter-syndrome/`).

## Not covered here (belongs to live QA / later phases)

- Live HTTP status codes and header behaviour (needs a real Netlify deploy-preview).
- Real Chromium render **with** React hydration + fonts + analytics network calls.
- `.gr` 301 behaviour — that lives in the **staged** redirect site and is a Phase 3
  activation step (see `gr-redirect-site/`), deliberately not active yet.
