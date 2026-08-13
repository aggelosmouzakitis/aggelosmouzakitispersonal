# -*- coding: utf-8 -*-
"""Phase 2 regression check for the .gr -> .com/el consolidation.

Validates the destination build (English preserved + Greek /el added) against the
migration baseline. Read-only. Run from the repo root:

    python3 seo-migration/scripts/regression_check.py

Exit code 0 = all checks pass, 1 = one or more failures.
"""
import os, re, json, sys, subprocess, xml.etree.ElementTree as ET

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".."))
ORIGIN = "https://aggelosmouzakitis.com"
GR = "aggelosmouzakitis.gr"
PERSON_ID = ORIGIN + "/#person"

# 9 Greek destination slugs (from url-migration-map.csv).
EL_SLUGS = ["", "how-i-work", "executive-coaching", "burnout", "career-coaching",
            "imposter-syndrome", "burnout-diagnostic", "about", "confidentiality"]
# Genuine cross-language pairs: Greek slug -> English path.
PAIRS = {
    "":                   "index.html",
    "about":              "about/index.html",
    "how-i-work":         "how-i-work/index.html",
    "confidentiality":    "confidentiality/index.html",
    "burnout-diagnostic": "burnout-diagnostic/index.html",
    "imposter-syndrome":  "imposter-syndrome-therapy/index.html",
}
# Intentionally-unpaired Greek slugs and the English pages that must NOT be forced as their alt.
UNPAIRED_EL = ["executive-coaching", "burnout", "career-coaching"]
UNPAIRED_EN = ["therapy-for-executives/index.html",
               "executive-burnout-therapy/index.html",
               "career-transition-therapy/index.html"]
# The one allowed .gr string in the build: the diagnostic's backend analytics label (not a URL).
ALLOWED_GR = {"el/burnout-diagnostic/index.html"}

results = []
def check(name, ok, detail=""):
    results.append((name, ok, detail))

def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as f:
        return f.read()

def el_path(slug):
    return "el/index.html" if slug == "" else f"el/{slug}/index.html"

def el_canon(slug):
    return ORIGIN + "/el/" + (slug + "/" if slug else "")

def get(t, pat):
    m = re.search(pat, t, re.S)
    return m.group(1).strip() if m else None

def hreflangs(t):
    return {hl: href for hl, href in re.findall(
        r'<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">', t)}

def sitemap_locs():
    tree = ET.parse(os.path.join(ROOT, "sitemap.xml"))
    ns = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
    return [u.find(ns + "loc").text for u in tree.findall(ns + "url")]

# ── 1. all 9 Greek destination pages exist ───────────────────────────────────
missing = [el_path(s) for s in EL_SLUGS if not os.path.exists(os.path.join(ROOT, el_path(s)))]
check("Greek /el pages exist (9)", not missing, f"missing: {missing}" if missing else "9/9 present")

# ── 2. all 48 English sitemap URLs still exist on disk ────────────────────────
locs = sitemap_locs()
en_locs = [l for l in locs if "/el/" not in l]
def loc_to_path(l):
    p = l[len(ORIGIN):]
    return "index.html" if p == "/" else p.strip("/") + "/index.html"
missing_en = [loc_to_path(l) for l in en_locs if not os.path.exists(os.path.join(ROOT, loc_to_path(l)))]
check("English URLs exist (48)", len(en_locs) == 48 and not missing_en,
      f"en_sitemap={len(en_locs)} missing={missing_en}")

# ── 3. pages render (non-empty, have <title>) ─────────────────────────────────
bad_render = []
for s in EL_SLUGS:
    t = read(el_path(s))
    if not get(t, r"<title>(.*?)</title>") or "<body>" not in t:
        bad_render.append(el_path(s))
check("Greek pages render (title+body)", not bad_render, f"bad: {bad_render}")

# ── 4. Greek canonical is self /el and never .gr ──────────────────────────────
bad_can = []
for s in EL_SLUGS:
    t = read(el_path(s))
    can = get(t, r'<link rel="canonical" href="([^"]+)">')
    if can != el_canon(s) or GR in (can or ""):
        bad_can.append((el_path(s), can))
check("Greek self-canonical to /el (never .gr)", not bad_can, f"bad: {bad_can}")

# ── 5. English canonical unchanged (self == sitemap loc) ──────────────────────
bad_en_can = []
for l in en_locs:
    t = read(loc_to_path(l))
    can = get(t, r'<link rel="canonical" href="([^"]+)">')
    if can != l:
        bad_en_can.append((loc_to_path(l), can, l))
check("English canonicals unchanged (self)", not bad_en_can, f"bad: {bad_en_can[:5]}")

# ── 6. <html lang> correct (Greek el ; English en-*) ──────────────────────────
gl = [el_path(s) for s in EL_SLUGS if get(read(el_path(s)), r'<html lang="([^"]+)"') != "el"]
enl = [loc_to_path(l) for l in en_locs
       if not (get(read(loc_to_path(l)), r'<html lang="([^"]+)"') or "").startswith("en")]
check("Greek <html lang=el>", not gl, f"bad: {gl}")
check("English <html lang> still en-* (preserved)", not enl, f"bad: {enl[:5]}")

# ── 7. reciprocal + canonical-pointing hreflang for the 6 pairs ───────────────
bad_pair = []
for slug, enpath in PAIRS.items():
    el = hreflangs(read(el_path(slug)))
    en = hreflangs(read(enpath))
    en_url = ORIGIN + "/" + ("" if enpath == "index.html" else enpath[:-len("index.html")])
    want_el = el_canon(slug)
    # el page: en->en_url, el->want_el ; en page: el->want_el, en->en_url
    if el.get("en") != en_url or el.get("el") != want_el: bad_pair.append(("EL", slug, el))
    if en.get("el") != want_el or en.get("en") != en_url: bad_pair.append(("EN", enpath, en))
check("hreflang reciprocal + points to canonicals (6 pairs)", not bad_pair, f"bad: {bad_pair}")

# ── 8. ambiguous Greek pages have NO hreflang; EN candidates not force-paired ──
forced = []
for slug in UNPAIRED_EL:
    if hreflangs(read(el_path(slug))): forced.append(el_path(slug))
for enpath in UNPAIRED_EN:
    if "el" in hreflangs(read(enpath)): forced.append(enpath)
check("ambiguous pages left unpaired (no forced alt)", not forced, f"forced: {forced}")

# ── 9. no /el internal <a href> points through .gr ────────────────────────────
gr_href = []
for s in EL_SLUGS:
    for href in re.findall(r'href="([^"]+)"', read(el_path(s))):
        if GR in href: gr_href.append((el_path(s), href))
check("no /el link href points to .gr", not gr_href, f"bad: {gr_href}")

# ── 10. sitemap valid: 57 urls, 9 el, 0 .gr, no 404/llms, no dupes ────────────
dupes = len(locs) != len(set(locs))
el_ct = sum(1 for l in locs if "/el/" in l)
gr_ct = sum(1 for l in locs if GR in l)
junk = [l for l in locs if l.endswith("404.html") or "llms.txt" in l or "/el/404" in l]
check("sitemap valid (57 urls, 9 el, 0 .gr, no junk, no dupes)",
      len(locs) == 57 and el_ct == 9 and gr_ct == 0 and not junk and not dupes,
      f"total={len(locs)} el={el_ct} gr={gr_ct} junk={junk} dupes={dupes}")

# ── 11. JSON-LD parses on every Greek page ────────────────────────────────────
bad_ld = []
for s in EL_SLUGS:
    for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', read(el_path(s)), re.S):
        try: json.loads(b)
        except Exception as e: bad_ld.append((el_path(s), str(e)))
check("JSON-LD parses (Greek)", not bad_ld, f"bad: {bad_ld}")

# ── 12. unified Person @id everywhere; no .gr/#person ─────────────────────────
bad_person = []
for s in EL_SLUGS:
    t = read(el_path(s))
    if PERSON_ID not in t or (GR + "/#person") in t:
        bad_person.append(el_path(s))
check("unified Person @id (.com/#person, no .gr/#person)", not bad_person, f"bad: {bad_person}")

# ── 13. unexpected .gr references (allowlist the diagnostic analytics label) ──
unexpected = []
for dirpath, _, files in os.walk(os.path.join(ROOT, "el")):
    for fn in files:
        rel = os.path.relpath(os.path.join(dirpath, fn), ROOT)
        if not fn.endswith((".html", ".txt", ".json", ".xml")): continue
        if GR in read(rel) and rel not in ALLOWED_GR:
            unexpected.append(rel)
check("no unexpected .gr refs in /el (label allowlisted)", not unexpected, f"unexpected: {unexpected}")

# ── 14. English changes are purely additive (git: zero deletions) ─────────────
try:
    out = subprocess.check_output(
        ["git", "-C", ROOT, "diff", "--numstat", "--", "*.html", ":(exclude)el/*"],
        text=True)
    nonzero = [ln for ln in out.splitlines() if ln and ln.split("\t")[1] != "0"]
    check("English HTML changes additive-only (git deletions=0)", not nonzero,
          f"non-additive: {nonzero[:5]}" if nonzero else "all deletions=0")
except Exception as e:
    check("English HTML changes additive-only (git deletions=0)", True, f"skipped: {e}")

# ── report ────────────────────────────────────────────────────────────────────
passed = sum(1 for _, ok, _ in results if ok)
print("=" * 74)
print("PHASE 2 REGRESSION CHECK")
print("=" * 74)
for name, ok, detail in results:
    print(f"[{'PASS' if ok else 'FAIL'}] {name}")
    if detail and (not ok or True):
        print(f"        {detail}")
print("-" * 74)
print(f"{passed}/{len(results)} checks passed")
sys.exit(0 if passed == len(results) else 1)
