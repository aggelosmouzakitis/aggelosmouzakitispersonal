# -*- coding: utf-8 -*-
"""Add the shared EN|ΕΛ language switcher to the English pages, and the reciprocal
hreflang="el" to the 6 pages that have a genuine Greek counterpart.

Purely ADDITIVE and IDEMPOTENT — it never touches titles, descriptions, canonicals,
robots, OG, existing schema, copy, or URLs. The switcher is inserted before </body>
(OUTSIDE #root) so React's createRoot() client render cannot remove it.

Run from the repo root:  python3 el-src/inject_en_switcher.py
"""
import os, re, glob, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lang_switch import render

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
ORIGIN = "https://aggelosmouzakitis.com"

# Utility / non-indexable pages that must NOT get a switcher.
SKIP = {"404.html", "admin/index.html", "blog/post-template.html"}

# The 6 English pages with a genuine Greek equivalent -> their /el/ counterpart.
# (Everything else is "unmatched" and the switcher points ΕΛ at the Greek home /el/.)
PAIRED = {
    "index.html":                        ORIGIN + "/el/",
    "about/index.html":                  ORIGIN + "/el/about/",
    "how-i-work/index.html":             ORIGIN + "/el/how-i-work/",
    "confidentiality/index.html":        ORIGIN + "/el/confidentiality/",
    "burnout-diagnostic/index.html":     ORIGIN + "/el/burnout-diagnostic/",
    "imposter-syndrome-therapy/index.html": ORIGIN + "/el/imposter-syndrome/",
}

def self_url(rel):
    if rel == "index.html":
        return ORIGIN + "/"
    return ORIGIN + "/" + rel[:-len("index.html")]   # ".../index.html" -> ".../"

def english_pages():
    out = []
    for p in glob.glob(os.path.join(ROOT, "**", "*.html"), recursive=True):
        rel = os.path.relpath(p, ROOT).replace(os.sep, "/")
        if rel in SKIP:            continue
        if rel.startswith("el/"):  continue        # Greek pages already carry the switcher
        if rel.startswith("el-src/"): continue      # build tooling
        if rel.startswith("seo-migration/"): continue  # docs + staged redirect-site artifacts
        out.append((p, rel))
    return sorted(out)

def main():
    switch_added = hreflang_added = skipped = 0
    for path, rel in english_pages():
        t = open(path, encoding="utf-8").read()
        orig = t

        # 1) reciprocal hreflang="el" for genuine pairs only (idempotent)
        if rel in PAIRED and 'hreflang="el"' not in t:
            el_link = f'<link rel="alternate" hreflang="el" href="{PAIRED[rel]}">'
            m = re.search(r'(<link rel="alternate" hreflang="x-default"[^>]*>)', t)
            if not m:
                m = re.search(r'(<link rel="canonical"[^>]*>)', t)
            if m:
                t = t[:m.end()] + "\n" + el_link + t[m.end():]
                hreflang_added += 1
            else:
                print(f"  WARN no anchor for hreflang in {rel}")

        # 2) language switcher before </body> (idempotent), EN active
        if 'class="amx-lang"' not in t:
            el_url = PAIRED.get(rel, ORIGIN + "/el/")   # counterpart, else Greek home
            block = render(self_url(rel), el_url, current="en")
            if "</body>" in t:
                t = t.replace("</body>", block + "\n</body>", 1)
                switch_added += 1
            else:
                print(f"  WARN no </body> in {rel}")
        else:
            skipped += 1

        if t != orig:
            with open(path, "w", encoding="utf-8") as f:
                f.write(t)

    print(f"English pages processed: {len(english_pages())}")
    print(f"  switchers added:  {switch_added}")
    print(f"  hreflang el added:{hreflang_added}  (expected 6 paired pages)")
    print(f"  already had switcher (skipped): {skipped}")

if __name__ == "__main__":
    main()
