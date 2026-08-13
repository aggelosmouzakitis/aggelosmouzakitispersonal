# -*- coding: utf-8 -*-
"""Shared EN | ΕΛ language-switcher component, used by BOTH languages so there is
one switcher implementation for the whole site:

  * Greek pages   -> emitted by el-src/build.py
  * English pages -> injected by el-src/inject_en_switcher.py

Design constraints it satisfies (Phase 2 spec #9):
  * real <a> anchors with real URLs (crawlable; no JS-only routing)
  * self-contained inline styles (no dependency on either site's CSS)
  * position:fixed, rendered OUTSIDE #root, so the English React app's
    createRoot() client render cannot remove it after load.
"""
ACCENT = "#1a7f37"   # active language
INK    = "#282726"   # inactive language


def render(en_url, el_url, current):
    """current in {"en","el"} — marks which language is the page being viewed."""
    box = ("position:fixed;top:10px;right:12px;z-index:2147483000;display:flex;align-items:center;"
           "gap:7px;background:rgba(245,245,245,.97);border:1px solid rgba(40,39,38,.15);"
           "border-radius:999px;padding:5px 11px;font-family:-apple-system,BlinkMacSystemFont,"
           "'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:.04em;"
           "box-shadow:0 2px 10px rgba(0,0,0,.09)")
    en_c = ACCENT if current == "en" else INK
    el_c = ACCENT if current == "el" else INK
    en_cur = ' aria-current="page"' if current == "en" else ""
    el_cur = ' aria-current="page"' if current == "el" else ""
    return (f'<div class="amx-lang" style="{box}" aria-label="Language / Γλώσσα">'
            f'<a href="{en_url}" hreflang="en" lang="en"{en_cur} style="text-decoration:none;color:{en_c}">EN</a>'
            f'<span aria-hidden="true" style="color:rgba(40,39,38,.32)">|</span>'
            f'<a href="{el_url}" hreflang="el" lang="el"{el_cur} style="text-decoration:none;color:{el_c}">ΕΛ</a>'
            f'</div>')
