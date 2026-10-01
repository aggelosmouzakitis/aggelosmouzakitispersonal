#!/usr/bin/env python3
"""check-copy.py — prove the published pages carry the canonical copy.

For every page in the canonical document (content/canonical-copy.md), checks
that each eyebrow, heading, sentence, list item, quotation, label and link
wording appears word for word in that page's prerendered HTML (the #root
snapshot scripts/seo/prerender.js writes), after the typographic
normalisation the extractor applies. Headings and sentences must also appear
in document order. The check works sentence by sentence because the design
sometimes sets one paragraph as several elements (a lead line, four rows, a
statement): the words and their order are what must not change. Link wording
is checked for presence only, since a design may place links differently.
The header and footer wording is checked on the homepage. Run after
prerendering:

    python3 scripts/copy/check-copy.py [content/canonical-copy.md]

Deliberate omissions are listed in EXPECTED_MISSING with the reason; anything
else missing is an error. Exit code 1 on any unexpected difference.
"""
import html
import importlib.util
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('extract', Path(__file__).with_name('extract-canonical.py'))
extract = importlib.util.module_from_spec(spec)
spec.loader.exec_module(extract)

# Wording in the document that is intentionally not visible on the page.
EXPECTED_MISSING = {
    'Credential strip': 'a structural label: the strip itself has no visible heading',
}

INLINE = r'</?(?:strong|em|b|i|a|span|abbr|small|br)\b[^>]*>'
SENTENCE_END = re.compile(r'(?<=[.!?…])\s+(?=[“‘"(A-Z0-9])|(?<=[.!?…][”’])\s+(?=[“‘"(A-Z0-9])')


def norm(s):
    s = s.replace('**', '').replace("'", '’').replace(' ', ' ').replace('→', ' ')
    return re.sub(r'\s+', ' ', s).strip()


def sentences(text):
    return [t for t in (norm(x) for x in SENTENCE_END.split(norm(text))) if t]


def page_text(file):
    h = file.read_text(encoding='utf-8')
    root = h.split('<div id="root">', 1)[1]
    root = re.sub(r'<(script|style)\b[\s\S]*?</\1>', ' ', root)
    root = re.sub(INLINE, '', root)
    root = re.sub(r'<[^>]+>', ' ', root)
    return norm(html.unescape(root))


def items_for(page):
    """(kind, text) in document order; kind 'seq' = ordered, 'link' = presence."""
    out = []

    def blocks(bs):
        for b in bs:
            t = b['t']
            if t == 'p':
                out.extend(('seq', s) for s in sentences(b['text']))
            elif t == 'lines':
                out.extend(('seq', norm(l)) for l in b['lines'])
            elif t == 'list':
                for i in b['items']:
                    out.extend(('seq', s) for s in sentences(i))
            elif t in ('ctas', 'related'):
                out.extend(('link', norm(i['label'])) for i in b['items'])
            elif t == 'meta':
                out.append(('seq', norm(b['text'])))
            elif t == 'pairs':
                for i in b['items']:
                    out.append(('seq', norm(i['a'])))
                    out.append(('seq', norm(i['b'])))
            elif t == 'quote':
                out.extend(('seq', s) for s in sentences(b['text']))
                out.append(('seq', norm(b['cite'])))
            elif t == 'sub':
                out.append(('seq', norm(b['h3'])))
                blocks(b['blocks'])

    hero = page['hero']
    out.append(('seq', norm(hero['eyebrow'])))
    out.append(('seq', norm(hero['h1'])))
    if hero.get('sub'):
        out.append(('seq', norm(hero['sub'])))
    blocks(hero['blocks'])
    for s in page['sections']:
        out.append(('seq', norm(s['h2'])))
        blocks(s['blocks'])
    if page.get('form'):
        for f in page['form']['fields']:
            out.append(('link', norm(f['label'])))
            for o in f.get('options', []):
                out.append(('link', norm(o)))
        out.append(('link', norm(page['form']['submit']['label'])))
    return out


def check(url, items, body):
    missing, disordered = [], []
    cursor = 0
    for kind, text in items:
        if text in EXPECTED_MISSING:
            continue
        # case-insensitive for eyebrows and labels set in capitals by CSS
        pos = body.find(text, cursor) if kind == 'seq' else body.find(text)
        if pos < 0 and kind == 'seq':
            if body.find(text) >= 0:
                disordered.append(text)
                continue
        if pos < 0:
            missing.append(text)
            continue
        if kind == 'seq':
            cursor = pos + len(text)
    return missing, disordered


def main(src):
    pages, nav, footer = extract.main(src)
    problems = 0
    total = 0
    for page in sorted(pages.values(), key=lambda p: p['num']):
        url = page['url']
        file = ROOT / ('index.html' if url == '/' else url.strip('/') + '/index.html')
        if not file.exists():
            print(f'ERR {url:36} page file missing')
            problems += 1
            continue
        items = items_for(page)
        missing, disordered = check(url, items, page_text(file))
        total += len(items)
        bad = len(missing) + len(disordered)
        print(f'{"OK " if not bad else "ERR"} {url:36} {len(items):3} items checked, '
              f'{len(missing)} missing, {len(disordered)} out of order')
        for m in missing:
            print('      missing:      ' + m[:110])
        for m in disordered:
            print('      out of order: ' + m[:110])
        problems += bad

    # The header and footer wording, on the homepage.
    home = page_text(ROOT / 'index.html')
    chrome = []
    for it in nav['items']:
        chrome.append(it['label'])
        chrome.extend(i['label'] for i in it.get('items', []))
    chrome.append(nav['cta']['label'])
    chrome.append(footer['tagline'])
    for g in footer['groups']:
        chrome.append(g['label'])
        chrome.extend(i['label'] for i in g['items'])
    chrome.extend(i['label'] for i in footer['legal'])
    chrome.append(footer['rights'])
    gone = [c for c in chrome if norm(c) not in home]
    print(f'{"OK " if not gone else "ERR"} {"header + footer":36} {len(chrome):3} items checked, {len(gone)} missing')
    for g in gone:
        print('      missing:      ' + g)
    problems += len(gone)
    total += len(chrome)

    print(f'\n{total} items, {problems} unexpected difference(s)')
    return 1 if problems else 0


if __name__ == '__main__':
    raise SystemExit(main(sys.argv[1] if len(sys.argv) > 1 else extract.DEFAULT_SRC))
