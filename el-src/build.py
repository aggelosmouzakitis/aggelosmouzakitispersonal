# -*- coding: utf-8 -*-
"""
Static-site generator for the Greek-market version of aggelosmouzakitis.com.
Reuses the original site's design system (sidebar layout, colours, typography,
components) 1:1 and adapts the copy for the Greek audience.

Links AND assets are relative + depth-aware, so the site works both under a
GitHub Pages project sub-path (preview) and later at a root domain.
Photos, OG images and favicons are self-hosted (copied from the original site).
"""
import os, shutil, json, re, html as _html

HERE = os.path.dirname(os.path.abspath(__file__))
# Phase 2 consolidation: the Greek site is emitted into the .com project's /el folder.
OUT = os.path.normpath(os.path.join(HERE, "..", "el"))
ASSETS = os.path.join(HERE, "assets")

# ── Config ───────────────────────────────────────────────────────────────────
# Single consolidated host: English lives at the root, Greek under /el.
SITE_ORIGIN = "https://aggelosmouzakitis.com"   # consolidated production host
EL_PREFIX   = "/el"                              # Greek language folder
BASE_URL    = SITE_ORIGIN + EL_PREFIX           # drives Greek canonical / OG / sitemap / hreflang
EMAIL      = "aggelos.mouzakitis@gmail.com"
MAILTO     = "mailto:aggelos.mouzakitis@gmail.com?subject=%CE%95%CF%80%CE%B9%CE%BA%CE%BF%CE%B9%CE%BD%CF%89%CE%BD%CE%AF%CE%B1"
LINKEDIN   = "https://www.linkedin.com/in/growth-product-manager/"
YOUTUBE    = "https://www.youtube.com/channel/UCfeHgYhNWwIRgWyRW9J0YCA"
INSTAGRAM  = "https://www.instagram.com/_aggelosmouzakitis_/"
GA_ID      = "G-H5ZDTS9FC8"   # Greek-market GA4 property (aggelosmouzakitis.gr)

# ── Design tokens (from the original site) ───────────────────────────────────
ACCENT   = "#1a7f37"
ACCENT_D = "#146b2e"
TEXT     = "#282726"
MUTED    = "#6e6e6e"
BG       = "#F5F5F5"

# ── Navigation model ─────────────────────────────────────────────────────────
# Sidebar "Υπηρεσίες" dropdown: Imposter Syndrome lives in the FOOTER only.
SIDEBAR_SERVICES = [
    ("executive-coaching", "Executive Coaching"),
    ("burnout",            "Burnout Coaching"),
    ("career-coaching",    "Career Coaching"),
]
SERVICE_SLUGS = ["executive-coaching", "burnout", "career-coaching", "imposter-syndrome"]
FOOTER_SERVICES = [
    ("executive-coaching", "Executive Coaching"),
    ("burnout",            "Burnout"),
    ("career-coaching",    "Career Coaching"),
    ("imposter-syndrome",  "Imposter Syndrome"),
]

# ── Cross-language equivalents (Greek slug -> English canonical URL) ──────────
# CONSERVATIVE: only genuine alternate-language versions of substantially the same
# page/intent. Drives reciprocal hreflang AND the language switcher's EN target.
# Intentionally ABSENT (coaching vs therapy intent mismatch — left unpaired by decision):
#   executive-coaching, burnout, career-coaching  -> switcher falls back to the EN home.
EN_ALT = {
    "":                   SITE_ORIGIN + "/",
    "about":              SITE_ORIGIN + "/about/",
    "how-i-work":         SITE_ORIGIN + "/how-i-work/",
    "confidentiality":    SITE_ORIGIN + "/confidentiality/",
    "burnout-diagnostic": SITE_ORIGIN + "/burnout-diagnostic/",
    "imposter-syndrome":  SITE_ORIGIN + "/imposter-syndrome-therapy/",
}


def rel(depth, slug):
    """Depth-aware relative href. depth 0 = homepage, depth 1 = /slug/ pages."""
    prefix = "../" * depth
    if slug == "":
        return prefix if depth > 0 else "./"
    return (prefix if depth > 0 else "") + slug + "/"


def A(depth, path):
    """Depth-aware asset path (no trailing slash)."""
    return ("../" * depth) + path


# ── SVG icons ────────────────────────────────────────────────────────────────
IC_HOME = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 21 9 12 15 12 15 21"/></svg>'
IC_COMPASS = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>'
IC_LAYERS = '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'
IC_PULSE = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>'
IC_CLIP = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>'
IC_CHEV = '<svg class="svc-chev" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>'
IC_EXT = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>'
IC_LI = '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>'
IC_YT = '<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#F5F5F5"/></svg>'
IC_IG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" y1="6.5" x2="17.5" y2="6.5"/></svg>'


# ── Shared CSS (mirrors the original inline styles) ──────────────────────────
CSS = f"""
*,*::before,*::after{{margin:0;padding:0;box-sizing:border-box}}
html,body,#root{{height:100%}}
body{{background:{BG};font-family:'Libre Franklin',-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.7;-webkit-font-smoothing:antialiased;color:{TEXT}}}
::selection{{background:{TEXT};color:#fff}}
.skip-link{{position:absolute;left:-9999px;top:0;z-index:1000;background:{ACCENT};color:#fff;padding:10px 16px;font-weight:700;text-decoration:none}}
.skip-link:focus{{left:8px;top:8px}}
a:focus-visible,button:focus-visible,input:focus-visible,[tabindex]:focus-visible{{outline:3px solid {ACCENT};outline-offset:2px;border-radius:2px}}
@media (prefers-reduced-motion: reduce){{*{{animation-duration:.001ms!important;transition-duration:.001ms!important;scroll-behavior:auto!important}}}}
#root{{display:flex;overflow:hidden}}
#main-scroll{{flex:1;overflow-y:auto;overflow-x:hidden;background:#fff;color:{TEXT}}}
#main-scroll a{{color:{ACCENT};text-underline-offset:3px;text-decoration-thickness:1px}}
#main-scroll a:hover{{color:{ACCENT_D};text-decoration-thickness:2px}}
#main-scroll a.cta-btn,#main-scroll a.cta-btn:hover{{color:#fff;text-decoration:none}}
#main-scroll a.cta-ghost,#main-scroll a.cta-ghost:hover{{color:{TEXT};text-decoration:none}}
#main-scroll a.cta-ghost:hover{{color:{ACCENT}}}
#main-scroll strong{{font-weight:400;color:{TEXT};border-bottom:1px solid rgba(40,39,38,.3);padding-bottom:1px}}
#main-scroll::-webkit-scrollbar{{width:4px}}
#main-scroll::-webkit-scrollbar-thumb{{background:rgba(40,39,38,.15)}}

/* ── SIDEBAR (matches original layout: profile · nav · find-me · spacer · CTA box) ── */
#sidebar{{width:300px;min-width:300px;background:{BG};border-right:1px solid rgba(40,39,38,.1);height:100vh;position:relative;flex-shrink:0;display:flex;flex-direction:column;overflow:visible}}
.sb-scroll{{flex:1;overflow-y:auto;overflow-x:hidden;display:flex;flex-direction:column}}
.sb-profile{{display:flex;align-items:center;gap:12px;padding:22px 18px 20px;border-bottom:1px solid rgba(40,39,38,.1);flex-shrink:0;text-decoration:none}}
.sb-profile img{{width:38px;height:38px;border-radius:50%;object-fit:cover;flex-shrink:0;display:block}}
.sb-name{{font-size:15px;font-weight:700;letter-spacing:.02em;text-transform:uppercase;color:{TEXT};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}
.sb-role{{font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:{MUTED};margin-top:3px}}
.sb-nav{{padding:10px 0 0}}
.nav-item{{display:flex;align-items:center;gap:12px;width:100%;padding:11px 18px;background:transparent;border-left:2px solid transparent;cursor:pointer;font-family:inherit;text-decoration:none;font-size:14px;font-weight:500;letter-spacing:.03em;text-transform:uppercase;color:rgba(40,39,38,.65);transition:background .12s,color .12s}}
.nav-item:hover{{background:rgba(40,39,38,.04);color:rgba(40,39,38,.85)}}
.nav-item.active{{background:rgba(40,39,38,.08);border-left:2px solid {ACCENT};color:{TEXT}}}
.svc-toggle{{display:flex;align-items:center;justify-content:space-between;width:100%;padding:11px 18px;background:transparent;border:none;border-left:2px solid transparent;cursor:pointer;font-family:inherit;font-size:14px;font-weight:500;letter-spacing:.03em;text-transform:uppercase;color:rgba(40,39,38,.65);transition:background .12s,color .12s}}
.svc-toggle:hover{{background:rgba(40,39,38,.04);color:rgba(40,39,38,.85)}}
.svc-toggle.active{{color:{TEXT}}}
.svc-toggle .svc-left{{display:flex;align-items:center;gap:12px}}
.svc-chev{{transition:transform .2s ease}}
.svc-group.collapsed .svc-chev{{transform:rotate(-90deg)}}
.svc-group.collapsed .svc-sub{{display:none}}
.svc-sub a{{display:block;padding:9px 18px 9px 50px;font-family:inherit;text-decoration:none;font-size:13px;font-weight:500;letter-spacing:.02em;color:rgba(40,39,38,.6);border-left:2px solid transparent;transition:background .12s,color .12s}}
.svc-sub a:hover{{background:rgba(40,39,38,.04);color:rgba(40,39,38,.85)}}
.svc-sub a.active{{color:{ACCENT};border-left:2px solid {ACCENT};background:rgba(26,127,55,.06)}}
.sb-lbl{{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:{MUTED};padding:18px 18px 6px}}
.sb-social{{display:flex;align-items:center;justify-content:space-between;padding:10px 18px;text-decoration:none;background:transparent;color:rgba(40,39,38,.65);font-size:13px;letter-spacing:.03em;text-transform:uppercase;transition:color .12s,background .12s}}
.sb-social:hover{{background:rgba(40,39,38,.04);color:rgba(40,39,38,.85)}}
.sb-social .l{{display:flex;align-items:center;gap:12px}}
.sb-social .ext{{opacity:.4}}
.sb-spacer{{flex:1}}
.sb-cta-wrap{{padding:0 16px 22px;flex-shrink:0}}
.sb-cta-box{{border:1.5px solid rgba(26,127,55,.45);padding:19px;background:rgba(26,127,55,.08)}}
.sb-cta-lbl{{font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:{ACCENT_D};margin-bottom:9px}}
.sb-cta-txt{{font-size:14px;font-weight:500;color:{TEXT};line-height:1.6;margin-bottom:16px}}
.sb-cta-btn{{display:block;text-align:center;width:100%;padding:13px 0;font-family:inherit;font-weight:700;font-size:13px;letter-spacing:.06em;text-transform:uppercase;background:{ACCENT};border:1.5px solid {ACCENT};color:#fff;cursor:pointer;text-decoration:none;transition:background .15s,border-color .15s}}
.sb-cta-btn:hover{{background:{ACCENT_D};border-color:{ACCENT_D}}}

/* ── MOBILE bottom nav + services bottom-sheet ── */
#mnav,#msheet,#msheet-bd{{display:none}}
@media (max-width:767px){{
  #root{{display:block;height:100%}}
  #sidebar{{display:none}}
  #main-scroll{{height:100%;padding-bottom:80px}}
  #mnav{{display:flex;position:fixed;left:0;right:0;bottom:0;height:64px;background:{BG};border-top:1px solid rgba(40,39,38,.1);align-items:stretch;z-index:130;padding-bottom:env(safe-area-inset-bottom)}}
  #mnav a,#mnav .mnav-btn{{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:8px 4px;text-decoration:none;color:#565654;font-size:10px;letter-spacing:.06em;text-transform:uppercase;transition:color .15s;font-family:inherit;background:none;border:none;cursor:pointer}}
  #mnav a.active,#mnav .mnav-btn.active,#mnav .mnav-btn[aria-expanded="true"]{{color:{ACCENT}}}
  #mnav .mnav-btn .svc-chev{{display:none}}
  #msheet-bd{{display:block;position:fixed;inset:0;background:rgba(20,20,20,.42);z-index:120;opacity:0;transition:opacity .22s ease}}
  #msheet-bd[hidden]{{display:none}}
  #msheet-bd.open{{opacity:1}}
  #msheet{{display:block;position:fixed;left:0;right:0;bottom:calc(64px + env(safe-area-inset-bottom));z-index:125;background:#fff;border-top-left-radius:16px;border-top-right-radius:16px;box-shadow:0 -12px 34px rgba(0,0,0,.18);padding:0 0 12px;transform:translateY(140%);transition:transform .28s cubic-bezier(.2,.85,.25,1);visibility:hidden;max-height:66vh;overflow-y:auto}}
  #msheet.open{{transform:translateY(0);visibility:visible}}
  #msheet .msheet-grab{{display:block;width:40px;height:4px;border-radius:2px;background:rgba(40,39,38,.2);margin:9px auto 4px}}
  #msheet .msheet-label{{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:{MUTED};padding:8px 22px 6px}}
  #msheet a{{display:flex;align-items:center;justify-content:space-between;padding:15px 22px;text-decoration:none;font-size:16px;font-weight:500;color:{TEXT};border-top:1px solid rgba(40,39,38,.07)}}
  #msheet a::after{{content:'›';color:rgba(40,39,38,.35);font-size:22px;line-height:1}}
  #msheet a:active{{background:rgba(26,127,55,.06)}}
  #msheet a.active{{color:{ACCENT_D}}}
}}

/* ── content typography ── */
.wrap{{max-width:940px;margin:0 auto;padding:4rem 2rem 7rem}}
.wrap-home{{max-width:1100px;margin:0 auto;padding:4rem 2.5rem 7rem}}
h1{{font-size:32px;font-weight:400;line-height:1.4;letter-spacing:-.02em;margin-bottom:2.5rem}}
.lead{{font-size:23px;font-weight:500;letter-spacing:-.01em;line-height:1.6;margin-bottom:1.4rem}}
.sec{{display:grid;grid-template-columns:184px 1fr;gap:0 2.25rem;margin-bottom:3rem}}
.sec h2{{font-size:17px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:{MUTED};padding-top:.25rem;line-height:1.5;text-wrap:balance}}
.sec p{{margin-bottom:1.2rem;line-height:1.75;font-size:18px}}
.sec p:last-child{{margin-bottom:0}}
.kick{{font-size:17px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:{MUTED};margin:0 0 1.2rem;line-height:1.5}}
.block{{margin-bottom:3.5rem}}
hr.sep{{border:none;border-top:1px solid rgba(40,39,38,.2);margin:2.5rem 0}}
.cta-btn{{font-family:inherit;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:{TEXT};border:1px solid {TEXT};text-decoration:none;padding:.8rem 1.5rem;display:inline-block;cursor:pointer;transition:background .15s,border-color .15s}}
.cta-btn:hover{{background:{ACCENT};border-color:{ACCENT};color:#fff;box-shadow:0 6px 18px rgba(26,127,55,.28)}}
.cta-ghost{{font-family:inherit;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:{TEXT};background:transparent;border:1px solid rgba(40,39,38,.3);text-decoration:none;padding:.8rem 1.5rem;display:inline-block;cursor:pointer;transition:border-color .15s,color .15s}}
.cta-ghost:hover{{border-color:{ACCENT};color:{ACCENT}}}
.card{{border:1px solid rgba(40,39,38,.12);border-radius:12px;background:#fff;padding:1.35rem;transition:border-color .18s,box-shadow .18s,transform .18s}}
.card:hover{{border-color:rgba(26,127,55,.5);box-shadow:0 8px 26px rgba(26,127,55,.10);transform:translateY(-3px)}}
.card h3{{font-size:17px;font-weight:700;color:{TEXT};margin:0 0 .5rem}}
.card p{{font-size:15px;line-height:1.65;margin:0}}
.grid2{{display:flex;gap:1rem;align-items:stretch}}
.grid2>*{{flex:1}}
.grid3{{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}}
.plist{{border:1px solid rgba(40,39,38,.12);border-radius:12px;background:#fff;overflow:hidden;margin:.4rem 0 1.4rem}}
.plist .row{{display:grid;grid-template-columns:246px 26px 1fr;align-items:baseline;padding:.95rem 1.3rem;font-size:15px;line-height:1.55}}
.plist .row+.row{{border-top:1px solid rgba(40,39,38,.12)}}
.plist .cause{{font-weight:700}}
.plist .arw{{color:{ACCENT};font-weight:700;text-align:center}}
.faq h3{{font-size:18px;font-weight:400;line-height:1.7;margin-bottom:.6rem;border-bottom:1px solid rgba(40,39,38,.12);padding-bottom:.4rem}}
.faq .qa{{margin-bottom:2rem}}
.faq p{{font-size:18px;line-height:1.75}}
.doclist{{margin:.2rem 0 1.2rem;padding-left:1.25rem;line-height:1.75;font-size:18px}}
.doclist li{{margin-bottom:.35rem}}
.faq .doclist{{margin:.4rem 0 .6rem}}
.termlist p{{margin-bottom:1rem}}
.termlist .term{{font-weight:600;color:{TEXT};border-bottom:none}}
.topics{{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-top:1rem}}
.topic{{display:block;border:1px solid rgba(40,39,38,.12);border-radius:12px;background:#fff;padding:1.4rem 1.5rem;text-decoration:none;color:{TEXT};transition:border-color .18s,box-shadow .18s,transform .18s}}
.topic:hover{{border-color:rgba(26,127,55,.5);box-shadow:0 8px 26px rgba(26,127,55,.10);transform:translateY(-3px)}}
.topic .t-name{{font-size:19px;font-weight:700;color:{TEXT};margin-bottom:.35rem}}
.topic .t-desc{{font-size:15px;color:{MUTED};line-height:1.6}}
.callout{{border:1px solid rgba(40,39,38,.12);border-left:3px solid {ACCENT};border-radius:10px;background:rgba(26,127,55,.04);padding:1.35rem 1.5rem;font-size:16px;line-height:1.7}}
.sectitle{{font-size:22px;font-weight:700;letter-spacing:-.01em;color:{ACCENT};margin-bottom:1.2rem;line-height:1.3}}
.hero{{display:flex;gap:4rem;align-items:center}}
.hero-txt{{flex:1.15 1 0;min-width:0;max-width:520px}}
.hero-txt p{{font-size:18px;line-height:1.75;margin-bottom:1.2rem}}
.hero-txt p:last-child{{margin-bottom:0}}
.hero-txt .lead{{font-size:23px;font-weight:500;line-height:1.6;margin-bottom:1.4rem}}
.hero-img{{flex:1 1 0;min-width:0}}
.hero-img img{{width:100%;height:auto;aspect-ratio:4/5;object-fit:cover;border-radius:14px;display:block}}
.hero-cta{{display:flex;flex-wrap:wrap;gap:.8rem;margin-top:1.8rem}}

/* ── footer (matches original 3-column layout) ── */
.site-ft{{margin-top:5rem;padding-top:3.25rem;border-top:1px solid rgba(40,39,38,.2)}}
.site-ft-cols{{display:grid;grid-template-columns:repeat(3,1fr);gap:2.5rem}}
.site-ft-h{{font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:{ACCENT};margin-bottom:1.1rem}}
.site-ft-row{{margin-bottom:.75rem}}
.site-ft a{{display:inline-flex;align-items:baseline;gap:.35rem;font-size:15px;color:{TEXT};text-decoration:none;line-height:1.4;transition:color .12s}}
.site-ft a:hover{{color:{ACCENT}}}
.site-ft-social{{display:flex;gap:10px;margin-top:.1rem}}
.site-ft-social a{{display:flex;align-items:center;justify-content:center;width:38px;height:38px;border:1px solid rgba(40,39,38,.15);border-radius:8px;color:rgba(40,39,38,.6);transition:color .12s,border-color .12s}}
.site-ft-social a:hover{{color:{ACCENT};border-color:rgba(26,127,55,.5)}}
.site-ft-copy{{margin-top:2.5rem;padding-top:1.5rem;border-top:1px solid rgba(40,39,38,.12);font-size:13px;color:{MUTED}}}

@media (max-width:767px){{
  .wrap,.wrap-home{{padding:2rem 1.2rem 4rem}}
  h1{{font-size:24px;margin-bottom:1.5rem}}
  .lead{{font-size:19px}}
  .sec{{display:block;margin-bottom:2rem}}
  .sec h2{{padding-bottom:.4rem;margin-bottom:.6rem}}
  .hero{{flex-direction:column;gap:1.5rem}}
  .hero-txt{{max-width:none}}
  .hero-img img{{aspect-ratio:16/10}}
  .grid2,.grid3,.topics{{grid-template-columns:1fr;display:grid}}
  .grid2{{gap:.9rem}}
  .plist .row{{grid-template-columns:1fr;gap:.15rem}}
  .plist .arw{{display:none}}
  .site-ft-cols{{display:block}}
  .site-ft-col{{margin-bottom:2rem}}
}}
"""

SITE_NAME = "Aggelos Mouzakitis"
# Unified Person entity across the consolidated site (one identity on the root host).
# Greek pages must NOT mint a second aggelosmouzakitis.gr/#person identity.
PERSON_ID = SITE_ORIGIN + "/#person"
# Market-specific website/practice nodes, scoped under /el so they don't collide with
# the English root nodes (aggelosmouzakitis.com/#website, /#practice).
ORG_ID    = BASE_URL + "/#practice"
SITE_ID   = BASE_URL + "/#website"
BUILD_DATE = "2026-07-20"
BUILD_DT = BUILD_DATE + "T00:00:00+00:00"  # ISO 8601 datetime for schema.org date fields


def strip_html(s):
    s = re.sub(r"<[^>]+>", "", s)
    return _html.unescape(re.sub(r"\s+", " ", s)).strip()


def _person():
    return {
        "@type": "Person", "@id": PERSON_ID,
        "name": "Aggelos Mouzakitis", "alternateName": "Άγγελος Μουζακίτης",
        "url": SITE_ORIGIN + "/", "image": SITE_ORIGIN + "/img/aggelos.jpg",
        "jobTitle": "Σύμβουλος Ψυχικής Υγείας",
        "description": ("Σύμβουλος Ψυχικής Υγείας με υπόβαθρο founder και 18+ χρόνια σε product, "
                        "growth και τεχνολογία. Δουλεύει με στελέχη, founders και έμπειρους επαγγελματίες "
                        "σε burnout, αλλαγή καριέρας, πίεση ηγεσίας και imposter syndrome."),
        "knowsAbout": ["Executive Coaching", "Burnout", "Career Coaching", "Imposter Syndrome",
                       "Επαγγελματική εξουθένωση", "Σύνδρομο του απατεώνα", "Συμβουλευτική στελεχών",
                       "Αλλαγή καριέρας", "Ψυχική υγεία", "Ηγεσία"],
        "alumniOf": {"@type": "CollegeOrUniversity", "name": "University of Derby"},
        "hasCredential": {"@type": "EducationalOccupationalCredential",
                          "credentialCategory": "MSc Integrative Counselling & Psychotherapy"},
        "memberOf": {"@type": "Organization", "name": "British Association for Counselling and Psychotherapy",
                     "alternateName": "BACP", "url": "https://www.bacp.co.uk"},
        "sameAs": [LINKEDIN, YOUTUBE, INSTAGRAM],
    }


def _website():
    return {"@type": "WebSite", "@id": SITE_ID, "url": BASE_URL + "/", "name": SITE_NAME,
            "inLanguage": "el-GR", "publisher": {"@id": PERSON_ID}}


def _practice():
    return {
        "@type": "ProfessionalService", "@id": ORG_ID, "name": SITE_NAME,
        "url": BASE_URL + "/", "image": SITE_ORIGIN + "/img/aggelos.jpg",
        "description": ("Σύμβουλος Ψυχικής Υγείας για στελέχη, founders και έμπειρους επαγγελματίες — "
                        "Executive Coaching, Burnout, Career Coaching και Imposter Syndrome, με ψυχολογικό βάθος."),
        "founder": {"@id": PERSON_ID}, "provider": {"@id": PERSON_ID},
        "areaServed": {"@type": "Country", "name": "Greece"},
        "availableLanguage": ["el", "en"],
        "knowsAbout": ["Executive Coaching", "Burnout", "Career Coaching", "Imposter Syndrome"],
        "sameAs": [LINKEDIN, YOUTUBE, INSTAGRAM],
    }


def page_ld(title, desc, canonical, og_img, depth, bc, faq_items, service, ptype, is_home):
    g = [_person(), _website()]
    if is_home:
        g.append(_practice())
    webpage = {
        "@type": ptype, "@id": canonical + "#webpage", "url": canonical, "name": title,
        "description": desc, "isPartOf": {"@id": SITE_ID}, "inLanguage": "el-GR",
        "about": {"@id": PERSON_ID}, "primaryImageOfPage": og_img,
        "datePublished": BUILD_DT, "dateModified": BUILD_DT,
    }
    # ProfilePage requires mainEntity: the person the profile is about.
    if ptype == "ProfilePage":
        webpage["mainEntity"] = {"@id": PERSON_ID}
    # Breadcrumbs
    crumbs = [{"@type": "ListItem", "position": 1, "name": "Αρχική", "item": BASE_URL + "/"}]
    if bc:
        crumbs.append({"@type": "ListItem", "position": 2, "name": bc, "item": canonical})
    bc_node = {"@type": "BreadcrumbList", "@id": canonical + "#breadcrumb", "itemListElement": crumbs}
    webpage["breadcrumb"] = {"@id": canonical + "#breadcrumb"}
    g.append(webpage)
    g.append(bc_node)
    if service:
        g.append({"@type": "Service", "name": service["name"], "serviceType": service.get("type", service["name"]),
                  "url": canonical, "provider": {"@id": PERSON_ID},
                  "areaServed": {"@type": "Country", "name": "Greece"},
                  "audience": {"@type": "Audience", "audienceType": "στελέχη, founders, επαγγελματίες"},
                  "description": service["desc"]})
    if faq_items:
        g.append({"@type": "FAQPage", "@id": canonical + "#faq",
                  "mainEntity": [{"@type": "Question", "name": strip_html(q),
                                  "acceptedAnswer": {"@type": "Answer", "text": strip_html(a)}}
                                 for q, a in faq_items]})
    doc = {"@context": "https://schema.org", "@graph": g}
    return '<script type="application/ld+json">' + json.dumps(doc, ensure_ascii=False, separators=(",", ":")) + '</script>'


_LAT = ("U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,"
        "U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD")
_LATX = ("U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,"
         "U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF")


def fontface(depth):
    # Self-hosted Libre Franklin (Latin subsets) — Greek text falls back to the system stack,
    # since Libre Franklin ships no Greek glyphs. No third-party font request (privacy + perf).
    return (f"@font-face{{font-family:'Libre Franklin';font-style:normal;font-weight:400 700;"
            f"font-display:swap;src:url({A(depth,'fonts/lf-latin.woff2')}) format('woff2');unicode-range:{_LAT}}}"
            f"@font-face{{font-family:'Libre Franklin';font-style:normal;font-weight:400 700;"
            f"font-display:swap;src:url({A(depth,'fonts/lf-latin-ext.woff2')}) format('woff2');unicode-range:{_LATX}}}")


def head(title, desc, slug, depth, og, bc=None, faq_items=None, service=None,
         ptype="WebPage", preload=None, og_alt=""):
    canonical = BASE_URL + "/" + (slug + "/" if slug else "")
    og_img = BASE_URL + "/" + og
    og_alt = og_alt or title
    is_home = (slug == "")
    preload_tag = (f'<link rel="preload" as="image" href="{A(depth, preload)}" fetchpriority="high">'
                   if preload else "")
    ld = page_ld(title, desc, canonical, og_img, depth, bc, faq_items, service, ptype, is_home)
    # Conservative cross-language hreflang: only where a genuine English equivalent exists.
    en_alt = EN_ALT.get(slug)
    if en_alt:
        # Reciprocal, symmetric cluster (matches the English side exactly): en + el + x-default->en.
        hreflang = (f'<link rel="alternate" hreflang="en" href="{en_alt}">\n'
                    f'<link rel="alternate" hreflang="el" href="{canonical}">\n'
                    f'<link rel="alternate" hreflang="x-default" href="{en_alt}">')
    else:
        # No genuine English equivalent -> intentionally NO cross-language hreflang.
        hreflang = '<!-- no hreflang: no genuine English equivalent for this page (intentional) -->'
    return f"""<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{canonical}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
<link rel="preload" as="font" type="font/woff2" href="{A(depth,'fonts/lf-latin.woff2')}" crossorigin>
{preload_tag}
<link rel="icon" href="{A(depth,'favicon.svg')}" type="image/svg+xml">
<link rel="icon" href="{A(depth,'favicon.ico')}" sizes="32x32">
<link rel="apple-touch-icon" href="{A(depth,'apple-touch-icon.png')}">
<link rel="manifest" href="{A(depth,'manifest.json')}">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{og_img}">
<meta property="og:image:secure_url" content="{og_img}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{og_alt}">
<meta property="og:locale" content="el_GR">
<meta property="og:site_name" content="{SITE_NAME}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{desc}">
<meta name="twitter:image" content="{og_img}">
<meta name="twitter:image:alt" content="{og_alt}">
<meta name="author" content="Aggelos Mouzakitis">
<meta name="theme-color" content="{BG}">
{hreflang}
{ld}
<style>{fontface(depth)}{CSS}</style>
</head>
<body>
<a class="skip-link" href="#main-scroll">Μετάβαση στο περιεχόμενο</a>
<script>
// Defer Google Analytics until idle so it never blocks first paint.
(function(){{var l=function(){{if(window.__ga)return;window.__ga=1;
var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id={GA_ID}';
document.head.appendChild(s);window.dataLayer=window.dataLayer||[];function g(){{dataLayer.push(arguments);}}
window.gtag=g;g('js',new Date());g('config','{GA_ID}');}};
var go=function(){{if('requestIdleCallback' in window){{requestIdleCallback(l);}}else{{setTimeout(l,1);}}}};
if(document.readyState==='complete'){{go();}}else{{window.addEventListener('load',go);}}
}})();
</script>"""


# ── Sidebar (original layout, CTA pinned at the bottom) ──────────────────────
def sidebar(active, depth):
    def cls(slug):
        return " active" if active == slug else ""
    svc_open = active in SERVICE_SLUGS
    svc_group_cls = "svc-group" if svc_open else "svc-group collapsed"
    svc_links = "".join(
        f'<a href="{rel(depth, s)}" class="{ "active" if active==s else "" }">{label}</a>'
        for s, label in SIDEBAR_SERVICES
    )
    def social(href, label, icon):
        return (f'<a class="sb-social" href="{href}" target="_blank" rel="noopener" title="{label}">'
                f'<span class="l"><span style="display:flex;flex-shrink:0">{icon}</span><span>{label}</span></span>'
                f'<span class="ext">{IC_EXT}</span></a>')
    return f"""
<div id="sidebar">
  <div class="sb-scroll">
    <a class="sb-profile" href="{rel(depth,'')}">
      <img src="{A(depth,'img/aggelos-96.webp')}" alt="Άγγελος Μουζακίτης" width="38" height="38">
      <div style="overflow:hidden;flex:1">
        <div class="sb-name">Aggelos Mouzakitis</div>
        <div class="sb-role">Σύμβουλος Ψυχικής Υγείας</div>
      </div>
    </a>
    <nav class="sb-nav">
      <a class="nav-item{cls('')}" href="{rel(depth,'')}"><span style="display:flex;flex-shrink:0">{IC_HOME}</span><span>Αρχική</span></a>
      <a class="nav-item{cls('how-i-work')}" href="{rel(depth,'how-i-work')}"><span style="display:flex;flex-shrink:0">{IC_COMPASS}</span><span>Πώς δουλεύω</span></a>
      <div class="{svc_group_cls}" id="svcGroup">
        <button class="svc-toggle{' active' if svc_open else ''}" id="svcToggle" aria-expanded="{'true' if svc_open else 'false'}">
          <span class="svc-left"><span style="display:flex;flex-shrink:0">{IC_LAYERS}</span><span>Υπηρεσίες</span></span>{IC_CHEV}
        </button>
        <div class="svc-sub">{svc_links}</div>
      </div>
    </nav>
    <div class="sb-lbl">Βρείτε με</div>
    {social(LINKEDIN, 'LinkedIn', IC_LI)}
    {social(YOUTUBE, 'YouTube', IC_YT)}
    {social(INSTAGRAM, 'Instagram', IC_IG)}
    <div class="sb-spacer"></div>
    <div class="sb-cta-wrap">
      <div class="sb-cta-box">
        <div class="sb-cta-lbl">Burnout Diagnostic</div>
        <div class="sb-cta-txt">Ένα σύντομο, δωρεάν εργαλείο αυτοαξιολόγησης. Περίπου 8 λεπτά.</div>
        <a class="sb-cta-btn" href="{rel(depth,'burnout-diagnostic')}">Ξεκίνα το Diagnostic →</a>
      </div>
    </div>
  </div>
</div>"""


def mobile_nav(active, depth):
    def tab(slug, label, icon):
        c = " active" if active == slug else ""
        return f'<a class="{c.strip()}" href="{rel(depth, slug)}">{icon}<span>{label}</span></a>'
    svc_active = " active" if active in SERVICE_SLUGS else ""
    svc_items = "".join(
        f'<a href="{rel(depth,s)}" class="{ "active" if active==s else "" }">{label}</a>'
        for s, label in SIDEBAR_SERVICES
    )
    return f"""
<nav id="mnav">
  {tab('', 'Αρχική', IC_HOME)}
  {tab('how-i-work', 'Πώς δουλεύω', IC_COMPASS)}
  <button id="msvc" class="mnav-btn{svc_active}" aria-expanded="false" aria-controls="msheet" aria-label="Υπηρεσίες">{IC_LAYERS}<span>Υπηρεσίες</span></button>
  {tab('burnout-diagnostic', 'Diagnostic', IC_CLIP)}
</nav>
<div id="msheet-bd" hidden></div>
<div id="msheet" role="menu" aria-label="Υπηρεσίες" aria-hidden="true">
  <span class="msheet-grab"></span>
  <div class="msheet-label">Υπηρεσίες</div>
  {svc_items}
</div>"""


JS = """
<script>
(function(){
  // desktop sidebar "Υπηρεσίες" accordion
  var t=document.getElementById('svcToggle'),g=document.getElementById('svcGroup');
  if(t&&g)t.addEventListener('click',function(){
    var open=!g.classList.contains('collapsed');
    g.classList.toggle('collapsed');t.setAttribute('aria-expanded',String(!open));
  });
  // mobile services bottom-sheet
  var sv=document.getElementById('msvc'),sh=document.getElementById('msheet'),bd=document.getElementById('msheet-bd');
  function closeSheet(){if(!sh)return;sh.classList.remove('open');bd.classList.remove('open');sv.setAttribute('aria-expanded','false');sh.setAttribute('aria-hidden','true');setTimeout(function(){if(!bd.classList.contains('open'))bd.hidden=true;},240);}
  if(sv&&sh&&bd){
    sv.addEventListener('click',function(){
      var open=!sh.classList.contains('open');
      if(open){bd.hidden=false;requestAnimationFrame(function(){bd.classList.add('open');});sh.classList.add('open');sv.setAttribute('aria-expanded','true');sh.setAttribute('aria-hidden','false');}
      else{closeSheet();}
    });
    bd.addEventListener('click',closeSheet);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSheet();});
  }
})();
</script>
"""


def footer(depth):
    svc_links = "".join(
        f'<div class="site-ft-row"><a href="{rel(depth,s)}">{label}</a></div>'
        for s, label in FOOTER_SERVICES
    )
    return f"""
<footer class="site-ft">
  <div class="site-ft-cols">
    <div class="site-ft-col">
      <div class="site-ft-h">Υπηρεσίες</div>
      {svc_links}
    </div>
    <div class="site-ft-col">
      <div class="site-ft-h">Ιστότοπος</div>
      <div class="site-ft-row"><a href="{rel(depth,'')}">Αρχική</a></div>
      <div class="site-ft-row"><a href="{rel(depth,'how-i-work')}">Πώς δουλεύω</a></div>
      <div class="site-ft-row"><a href="{rel(depth,'about')}">Σχετικά</a></div>
      <div class="site-ft-row"><a href="{rel(depth,'burnout-diagnostic')}">Burnout Diagnostic</a></div>
      <div class="site-ft-row"><a href="{rel(depth,'confidentiality')}">Εμπιστευτικότητα</a></div>
    </div>
    <div class="site-ft-col">
      <div class="site-ft-h">Ακολουθήστε</div>
      <div class="site-ft-social">
        <a href="{LINKEDIN}" target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn">{IC_LI}</a>
        <a href="{YOUTUBE}" target="_blank" rel="noopener" aria-label="YouTube" title="YouTube">{IC_YT}</a>
        <a href="{INSTAGRAM}" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram">{IC_IG}</a>
      </div>
    </div>
  </div>
  <div class="site-ft-copy">© Aggelos Mouzakitis · Σύμβουλος Ψυχικής Υγείας</div>
</footer>"""


def page(slug, depth, title, desc, main_html, og, wrap="wrap",
         bc=None, service=None, ptype="WebPage", preload=None):
    # Auto-extract FAQ Q&A from the rendered HTML for FAQPage schema (AEO).
    faq_items = re.findall(r'<div class="qa"><h3>(.*?)</h3>(.*?)</div>', main_html, re.S) or None
    return (head(title, desc, slug, depth, og, bc=bc, faq_items=faq_items,
                 service=service, ptype=ptype, preload=preload)
            + '<div id="root">'
            + sidebar(slug, depth)
            + f'<div id="main-scroll"><main id="main" class="{wrap}">'
            + main_html
            + footer(depth)
            + '</main></div></div>'
            + mobile_nav(slug, depth)
            + JS
            + '\n</body>\n</html>\n')


# ── Content helpers ──────────────────────────────────────────────────────────
def sec(label, *paras):
    inner = "".join(f"<p>{p}</p>" for p in paras)
    return f'<section class="sec"><h2>{label}</h2><div>{inner}</div></section>'


def sec_html(label, inner):
    return f'<section class="sec"><h2>{label}</h2><div>{inner}</div></section>'


def diag_cta(depth, label="Κάνε το Burnout Diagnostic →"):
    return f'<div style="margin-top:1.4rem"><a class="cta-btn" href="{rel(depth,"burnout-diagnostic")}">{label}</a></div>'


def _ans(a):
    # allow HTML answers (lists); wrap plain strings in <p>
    return a if a.lstrip().startswith("<") else f"<p>{a}</p>"


def faq(items):
    qa = "".join(f'<div class="qa"><h3>{q}</h3>{_ans(a)}</div>' for q, a in items)
    return f'<section class="sec"><h2>Συχνές ερωτήσεις</h2><div class="faq">{qa}</div></section>'


def ul(items):
    lis = "".join(f"<li>{x}</li>" for x in items)
    return f'<ul class="doclist">{lis}</ul>'


def il(depth, slug, text):
    return f'<a href="{rel(depth, slug)}">{text}</a>'


# ── Language switcher (EN | ΕΛ) — shared component (see el-src/lang_switch.py) ─
from lang_switch import render as render_lang_switch


def lang_switch(slug):
    el_url = BASE_URL + "/" + (slug + "/" if slug else "")   # this (Greek) page
    en_url = EN_ALT.get(slug, SITE_ORIGIN + "/")             # genuine counterpart, else EN home
    return render_lang_switch(en_url, el_url, current="el")


# ═══════════════════════════════════════════════════════════════════════════
#  BUILD
# ═══════════════════════════════════════════════════════════════════════════
PAGES_OUT = {}


def emit(slug, html):
    path = "index.html" if slug == "" else f"{slug}/index.html"
    PAGES_OUT[slug] = path
    html = html.replace("</body>", lang_switch(slug) + "\n</body>", 1)  # crawlable, outside #root
    full = os.path.join(OUT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(html)


# fresh output + copy self-hosted assets
if os.path.isdir(OUT):
    shutil.rmtree(OUT)
os.makedirs(OUT, exist_ok=True)
for name in os.listdir(ASSETS):
    src = os.path.join(ASSETS, name)
    dst = os.path.join(OUT, name)
    if os.path.isdir(src):
        shutil.copytree(src, dst)
    else:
        shutil.copy2(src, dst)

import pages_content as PC
for spec in PC.build(rel, A, sec, sec_html, faq, diag_cta, il, ul):
    emit(spec["slug"], page(spec["slug"], spec["depth"], spec["title"], spec["desc"],
                            spec["main"], spec["og"], wrap=spec.get("wrap", "wrap"),
                            bc=spec.get("bc"), service=spec.get("service"),
                            ptype=spec.get("ptype", "WebPage"), preload=spec.get("preload")))

import diagnostic_page as DP
emit("burnout-diagnostic", DP.render(head, sidebar, footer, mobile_nav, JS, rel))

# NOTE (Phase 2 consolidation): 404, sitemap.xml and robots.txt are ROOT-LEVEL
# singletons on the consolidated .com host and are intentionally NOT emitted per
# language here:
#   * 404         -> the existing root /404.html handles unmatched /el/... paths (noindex).
#   * sitemap.xml -> the root /sitemap.xml carries BOTH English and /el/ URLs
#                    (regenerated by el-src/build_sitemap.py; zero .gr URLs).
#   * robots.txt  -> the single root /robots.txt already allows /el/ and links the sitemap.

# llms.txt — Greek-language structured summary for AI / answer engines (GEO/AEO).
# Additive, language-scoped at /el/llms.txt; the root /llms.txt stays English.
def _u(slug):
    return BASE_URL + "/" + (slug + "/" if slug else "")
llms = f"""# Aggelos Mouzakitis — Σύμβουλος Ψυχικής Υγείας

> Σύμβουλος Ψυχικής Υγείας (Mental Health Counsellor) με υπόβαθρο founder και 18+ χρόνια σε product, growth και τεχνολογία. Δουλεύει ιδιωτικά με στελέχη, founders και έμπειρους επαγγελματίες, όταν ένα επαγγελματικό ζήτημα έχει και ψυχολογική διάσταση: burnout, αλλαγή καριέρας, πίεση ηγεσίας, imposter syndrome.

Το διαφοροποιητικό είναι ο συνδυασμός: πραγματική επαγγελματική εμπειρία μαζί με ψυχολογικό βάθος. Δεν είναι καθαρά coaching με έτοιμο framework, ούτε αφηρημένη συζήτηση αποκομμένη από τη δουλειά. Οι συνεδρίες γίνονται online ή με φυσική παρουσία, ατομικά και με πλήρη εμπιστευτικότητα. Εκπαίδευση: MSc Integrative Counselling & Psychotherapy (University of Derby)· εγγεγραμμένος στο BACP (British Association for Counselling and Psychotherapy).

## Υπηρεσίες
- [Executive Coaching]({_u('executive-coaching')}): coaching στελεχών με ψυχολογικό βάθος — πίεση, ευθύνη, δύσκολες αποφάσεις, απομόνωση στον ρόλο, burnout στελεχών.
- [Burnout]({_u('burnout')}): επαγγελματική εξουθένωση — τι είναι, συμπτώματα, τι το συντηρεί, γιατί η ξεκούραση/άδεια δεν αρκεί, πότε να ζητήσεις υποστήριξη.
- [Career Coaching]({_u('career-coaching')}): αλλαγή καριέρας και σημαντικές επαγγελματικές αποφάσεις — πρακτικό και ψυχολογικό επίπεδο, ταυτότητα, ρίσκο, φόβος αλλαγής.
- [Imposter Syndrome]({_u('imposter-syndrome')}): σύνδρομο του απατεώνα στη δουλειά — σημάδια, συμπτώματα, σύνδεση με burnout και αποφάσεις καριέρας.

## Εργαλεία
- [Burnout Diagnostic]({_u('burnout-diagnostic')}): δωρεάν εργαλείο αυτοαξιολόγησης (~8 λεπτά, 45 ερωτήσεις) που δίνει επίπεδο και ανάλυση κατά διάσταση. Ενδεικτικό, όχι κλινική διάγνωση.

## Σελίδες
- [Πώς δουλεύω]({_u('how-i-work')}): η μέθοδος — δύο επίπεδα ταυτόχρονα (πρακτικό + ψυχολογικό).
- [Σχετικά]({_u('about')}): υπόβαθρο, εκπαίδευση, με ποιους δουλεύει.
- [Εμπιστευτικότητα]({_u('confidentiality')}): τι μένει εμπιστευτικό και ποια είναι τα όρια.

## Επικοινωνία
- Email: {EMAIL}
- LinkedIn: {LINKEDIN}
- YouTube: {YOUTUBE}
- Instagram: {INSTAGRAM}
"""
with open(os.path.join(OUT, "llms.txt"), "w", encoding="utf-8") as f:
    f.write(llms)

print("Built", len(PAGES_OUT), "Greek pages + assets + llms.txt into", OUT)
print("Next: run  python3 el-src/build_sitemap.py  to refresh the root sitemap.xml (EN + /el).")
