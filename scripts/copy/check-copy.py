#!/usr/bin/env python3
"""check-copy.py — prove the published pages carry the final editorial copy.

For every page in the editorial document, checks that each heading,
paragraph, list item and CTA label appears word for word in that page's
prerendered HTML (the #root snapshot scripts/seo/prerender.js writes), after
the typographic normalisation the extractor applies. Run after prerendering:

    python3 scripts/copy/check-copy.py path/to/Final_Editorial.docx

Deliberate omissions are listed in EXPECTED_MISSING with the reason; anything
else missing is an error. Exit code 1 on any unexpected difference.
"""
import html
import re
import sys
from pathlib import Path

import docx

ROOT = Path(__file__).resolve().parents[2]

# Text in the document that is intentionally not visible on the page.
EXPECTED_MISSING = {
    'Suggested form fields': 'form specification, rendered as the form itself',
    'Service: Individual Psychotherapy / Couples Therapy / Professional Coaching / Not sure':
        'rendered as the Service options of the form',
    'Read': 'essay links withheld until the essays are restored (Writing phase)',
    'Terms and privacy': 'no Terms or Privacy text exists yet to link to',
    'Terms': 'no Terms text exists yet',
    'Privacy': 'no Privacy text exists yet (contact page H2 "Privacy" is checked separately)',
}

INLINE = r'</?(?:strong|em|b|i|a|span|abbr|small)\b[^>]*>'


def norm(s):
    s = s.replace("'", '’').replace(' ', ' ')
    s = s.replace('→', ' ')
    return re.sub(r'\s+', ' ', s).strip()


def page_text(file):
    h = file.read_text(encoding='utf-8')
    root = h.split('<div id="root">', 1)[1]
    root = re.sub(r'<(script|style)\b[\s\S]*?</\1>', ' ', root)
    root = re.sub(INLINE, '', root)
    root = re.sub(r'<[^>]+>', ' ', root)
    return norm(html.unescape(root))


def main(src):
    d = docx.Document(src)
    pages = []
    cur = None
    for p in d.paragraphs:
        style = p.style.name if p.style is not None else ''
        text = p.text.strip()
        if style == 'Heading 1' and re.match(r'^\d+\.\s', text):
            cur = {'name': text, 'url': None, 'items': []}
            pages.append(cur)
            continue
        if style == 'Heading 1' and text == 'Launch notes':
            cur = None
            continue
        if cur is None or not text:
            continue
        if style == 'Meta':
            m = re.match(r'^URL:\s*(\S+)', text)
            if m:
                cur['url'] = m.group(1)
            continue
        if style == 'Eyebrow' or text.startswith('Implementation note'):
            continue
        cur['items'].append((style, text))

    problems = 0
    for pg in pages:
        url = pg['url']
        file = ROOT / ('index.html' if url == '/' else url.strip('/') + '/index.html')
        body = page_text(file)
        missing = []
        for style, text in pg['items']:
            t = text[len('Related:'):] if text.startswith('Related:') else text
            label = norm(t)
            if label in {norm(k) for k in EXPECTED_MISSING} and not (url == '/contact/' and label == 'Privacy'):
                continue
            if label not in body:
                missing.append(f'[{style}] {text[:110]}')
        status = 'OK ' if not missing else 'ERR'
        print(f'{status} {url:36} {len(pg["items"]):3} items checked, {len(missing)} missing')
        for m in missing:
            print('      ' + m)
        problems += len(missing)
    print(f'\n{problems} unexpected difference(s)')
    return 1 if problems else 0


if __name__ == '__main__':
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    raise SystemExit(main(sys.argv[1]))
