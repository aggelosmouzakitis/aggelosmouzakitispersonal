# -*- coding: utf-8 -*-
"""Regenerate the single root sitemap.xml for the consolidated site.

Idempotent: keeps every existing English <url> entry byte-for-byte, strips any
previously-inserted /el/ entries, then appends the 9 canonical Greek /el/ URLs.
Never emits .gr URLs, /el/404, /el/llms.txt or the /el/ index of assets.

Run from the repo root:  python3 el-src/build_sitemap.py
"""
import os, re

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
SITEMAP = os.path.join(ROOT, "sitemap.xml")
ORIGIN = "https://aggelosmouzakitis.com"
LASTMOD = "2026-07-20"  # Greek content build date (content is frozen by the migration)

# 9 canonical, indexable Greek URLs (slug -> priority). Mirrors el-src/build.py PAGES.
EL_PAGES = [
    ("",                   "1.0"),
    ("how-i-work",         "0.8"),
    ("executive-coaching", "0.8"),
    ("burnout",            "0.9"),
    ("career-coaching",    "0.9"),
    ("imposter-syndrome",  "0.8"),
    ("burnout-diagnostic", "0.9"),
    ("about",              "0.8"),
    ("confidentiality",    "0.8"),
]

def el_url_line(slug, pr):
    loc = ORIGIN + "/el/" + (slug + "/" if slug else "")
    return (f'  <url><loc>{loc}</loc><lastmod>{LASTMOD}</lastmod>'
            f'<changefreq>monthly</changefreq><priority>{pr}</priority></url>')

def main():
    with open(SITEMAP, encoding="utf-8") as f:
        lines = f.read().split("\n")

    # Drop any previously-inserted /el/ entries (idempotency); keep English untouched.
    kept = [ln for ln in lines if "aggelosmouzakitis.com/el/" not in ln]

    # Insert the 9 /el/ entries immediately before </urlset>.
    out = []
    for ln in kept:
        if ln.strip() == "</urlset>":
            out.extend(el_url_line(s, p) for s, p in EL_PAGES)
        out.append(ln)

    text = "\n".join(out)
    with open(SITEMAP, "w", encoding="utf-8") as f:
        f.write(text)

    total = text.count("<url>")
    el = text.count("aggelosmouzakitis.com/el/")
    gr = text.count("aggelosmouzakitis.gr")
    print(f"sitemap.xml: {total} URLs total | {el} Greek /el URLs | {gr} .gr URLs (must be 0)")

if __name__ == "__main__":
    main()
