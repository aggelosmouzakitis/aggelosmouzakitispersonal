# -*- coding: utf-8 -*-
# Generate /el/burnout-diagnostic/index.html by reusing the VERBATIM Greek
# diagnostic content from the retired .gr site (src/diagnostic_page.py), wrapped
# in the new .com site shell (React sidebar + shared footer). No content rewritten.
import json, os, sys

GR_SRC = "/home/user/aggelosmouzakitis-gr/src"
sys.path.insert(0, GR_SRC)
import diagnostic_page as D  # noqa

ROOT = "/home/user/aggelosmouzakitispersonal"
OUT_DIR = os.path.join(ROOT, "el", "burnout-diagnostic")
ORIGIN = "https://aggelosmouzakitis.com"
GA = "G-KV83RRF6ZM"
CANON = ORIGIN + "/el/burnout-diagnostic/"
EN = ORIGIN + "/burnout-diagnostic/"

data = ("var SECTIONS=" + json.dumps(D.SECTIONS, ensure_ascii=False) + ";"
        "var SCALE=" + json.dumps(D.SCALE, ensure_ascii=False) + ";"
        "var LEVELS=" + json.dumps(D.LEVELS, ensure_ascii=False) + ";"
        "var DIMS=" + json.dumps(D.DIMS, ensure_ascii=False) + ";"
        "var SECLABELS=" + json.dumps(D.SECLABELS, ensure_ascii=False) + ";"
        "var UI=" + json.dumps(D.UI, ensure_ascii=False) + ";")

# Inline data; drop the inline footer (we render the shared React SiteFooter instead);
# relabel lead-tracking source from GR to EL (same inbox, correct attribution).
diag_js = (D.DIAG_JS
           .replace("/*__DATA__*/", data)
           .replace("__FOOTER__", "")
           .replace("GR — aggelosmouzakitis.gr", "EL — aggelosmouzakitis.com/el")
           .replace("site:'gr'", "site:'com-el'"))

DIAG_STYLE = D.DIAG_STYLE  # already wrapped in <style>…</style>
EMAILJS = D.EMAILJS_SNIPPET

SHELL_CSS = """
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #root { height: 100%; }
body { background: #F5F5F5; font-family: 'Libre Franklin', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.7; -webkit-font-smoothing: antialiased; }
::selection { background: #282726; color: #FFFFFF; }
#root { display: flex; overflow: hidden; }
#main-scroll { flex: 1; overflow-y: auto; overflow-x: hidden; background: #FFFFFF; color: #282726; }
#main-scroll a { color: #1a7f37; text-underline-offset: 3px; text-decoration-thickness: 1px; }
#main-scroll a:hover { color: #146b2e; }
#main-scroll::-webkit-scrollbar { width: 4px; }
#main-scroll::-webkit-scrollbar-thumb { background: rgba(40,39,38,0.15); }
#sidebar { position: relative; flex-shrink: 0; }
.wrap { max-width: 760px; margin: 0 auto; padding: 4rem 2rem 2rem; }
.cta-btn { display: inline-block; padding: .85rem 1.6rem; font-family: inherit; font-weight: 700; font-size: 13px; letter-spacing: .06em; text-transform: uppercase; background: #1a7f37; border: 1.5px solid #1a7f37; color: #fff; text-decoration: none; border-radius: 2px; cursor: pointer; }
.cta-btn:hover { background: #146b2e; border-color: #146b2e; }
.cta-ghost { display: inline-block; padding: .85rem 1.6rem; font-family: inherit; font-weight: 700; font-size: 13px; letter-spacing: .06em; text-transform: uppercase; background: transparent; border: 1.5px solid rgba(40,39,38,.35); color: #282726; text-decoration: none; border-radius: 2px; cursor: pointer; }
.cta-ghost:hover { border-color: #1a7f37; color: #1a7f37; }
.ft-wrap { max-width: 760px; margin: 0 auto; padding: 0 2rem 5rem; }
a:focus-visible, button:focus-visible { outline: 3px solid #1a7f37; outline-offset: 2px; border-radius: 2px; }
@media (max-width: 767px) {
  #root { display: block; height: 100%; }
  #sidebar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 100; height: auto; width: 100% !important; }
  #main-scroll { height: 100%; padding-bottom: 80px; }
  .wrap { padding: 2rem 1.2rem 1.5rem; }
}
"""

MOUNT = """<script>
(function(){
  var e = React.createElement;
  function SB(){ var s = React.useState(true); return e(Sidebar, { page: 'diagnostic', lang: 'el', open: s[0], setOpen: s[1] }); }
  try { ReactDOM.createRoot(document.getElementById('sidebar')).render(e(SB)); } catch(x){}
  if (window.SiteFooter) { try { ReactDOM.createRoot(document.getElementById('footer-mount')).render(e(window.SiteFooter, { mob: window.innerWidth < 768, lang: 'el' })); } catch(x){} }
})();
</script>"""

def esc(s):
    return s.replace("&", "&amp;").replace('"', "&quot;").replace("<", "&lt;").replace(">", "&gt;")

title = D.TITLE
desc = D.DESC
person_ld = {
    "@context": "https://schema.org", "@type": "WebPage", "@id": CANON + "#webpage",
    "url": CANON, "name": title, "inLanguage": "el",
    "isPartOf": {"@id": ORIGIN + "/#website"}, "about": {"@id": ORIGIN + "/#person"},
}

html = """<!DOCTYPE html>
<html lang="el">
<head>
<script async src="https://www.googletagmanager.com/gtag/js?id=%(ga)s"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', '%(ga)s');
</script>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&display=swap" media="print" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;700&display=swap"></noscript>
<meta name="robots" content="max-image-preview:large">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<title>%(title)s</title>
<meta name="description" content="%(desc)s">
<link rel="canonical" href="%(canon)s">
<link rel="alternate" hreflang="en" href="%(en)s">
<link rel="alternate" hreflang="el" href="%(canon)s">
<link rel="alternate" hreflang="x-default" href="%(en)s">
<meta property="og:type" content="website">
<meta property="og:title" content="%(title)s">
<meta property="og:description" content="%(desc)s">
<meta property="og:url" content="%(canon)s">
<meta property="og:image" content="%(origin)s/img/og/burnout-diagnostic.png">
<meta property="og:site_name" content="Aggelos Mouzakitis">
<meta property="og:locale" content="el_GR">
<meta property="og:locale:alternate" content="en_IE">
<meta name="theme-color" content="#F5F5F5">
<link rel="manifest" href="/manifest.json">
<script type="application/ld+json">%(ld)s</script>
<style>%(shellcss)s</style>
</head>
<body>
<div id="root"><div id="sidebar"></div><div id="main-scroll"><main class="wrap">%(diagstyle)s<div id="diag-app"></div></main><div class="ft-wrap"><div id="footer-mount"></div></div></div></div>
<script src="/react.production.min.js?v=18.3.1" crossorigin="anonymous"></script>
<script src="/react-dom.production.min.js?v=18.3.1" crossorigin="anonymous"></script>
<script src="/sidebar.js?v=32"></script>
<script src="/content-pages.js?v=32"></script>
%(mount)s
%(emailjs)s
%(diagjs)s
</body>
</html>
""" % {
    "ga": GA, "title": esc(title), "desc": esc(desc), "canon": CANON, "en": EN, "origin": ORIGIN,
    "ld": json.dumps(person_ld, ensure_ascii=False), "shellcss": SHELL_CSS, "diagstyle": DIAG_STYLE,
    "mount": MOUNT, "emailjs": EMAILJS, "diagjs": diag_js,
}

os.makedirs(OUT_DIR, exist_ok=True)
with open(os.path.join(OUT_DIR, "index.html"), "w", encoding="utf-8") as f:
    f.write(html)
print("wrote el/burnout-diagnostic/index.html (%d bytes)" % len(html))
