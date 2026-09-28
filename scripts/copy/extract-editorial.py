#!/usr/bin/env python3
"""extract-editorial.py — turn the final editorial copy (.docx) into site-copy.jsx.

The page copy on this site is not retyped by hand: it is extracted from the
approved editorial document so that what ships is word-for-word what was
signed off. Run this again whenever a new version of that document arrives.

    pip install python-docx
    python3 scripts/copy/extract-editorial.py path/to/Final_Editorial.docx
    npm run build            # compiles site-copy.jsx -> site-copy.js

What it does, and the only liberties it takes (all typographic, per the
implementation brief):
  - straight apostrophes become typographic ones (don't -> don’t);
  - "→" is split off CTA labels and drawn by the UI instead;
  - document markers (HERO, URL, SEO title, meta description) become data,
    not visible copy;
  - implementation notes and the launch notes are left out entirely: they are
    instructions, not copy. The script prints them so they are not lost.

Everything else — every sentence, heading and label — is copied verbatim.
Links are resolved from the CTA wording through CTA_HREF below; a CTA whose
wording is not in that table stops the build, so nothing ships unlinked.
"""
import json
import re
import sys

import docx

# ── Page slugs and page types ────────────────────────────────────────────────
# The type selects the page shell in site-pages.jsx (see PAGE_TYPES there).
TYPE_BY_URL = {
    '/': 'home',
    '/about/': 'about',
    '/work-with-me/': 'hub',
    '/individual-psychotherapy/': 'service',
    '/couples-therapy/': 'service',
    '/professional-coaching/': 'service',
    '/therapy-for-men-in-tech/': 'audience',
    '/therapy-for-founders/': 'audience',
    '/therapy-for-executives/': 'audience',
    '/greek-speaking-psychotherapist/': 'audience',
    '/relationship-problems-men/': 'problem',
    '/separation-divorce-men/': 'problem',
    '/work-affecting-relationship/': 'problem',
    '/executive-burnout-therapy/': 'problem',
    '/career-transition-therapy/': 'problem',
    '/anxiety-overthinking/': 'problem',
    '/achievement-self-worth/': 'problem',
    '/considering-therapy/': 'resource',
    '/faq/': 'faq',
    '/reviews/': 'reviews',
    '/free-tools/': 'tools',
    '/blog/': 'writing',
    '/contact/': 'contact',
    '/confidentiality/': 'legal',
}

# ── CTA wording → destination ────────────────────────────────────────────────
# None = the editorial names a destination that does not exist yet; the UI
# leaves that link out rather than pointing it somewhere else (see HELD below).
CTA_HREF = {
    'Book a consultation': '/contact/',
    'Individual psychotherapy': '/individual-psychotherapy/',
    'Explore individual psychotherapy': '/individual-psychotherapy/',
    'How individual psychotherapy works': '/individual-psychotherapy/',
    'Couples therapy': '/couples-therapy/',
    'Explore couples therapy': '/couples-therapy/',
    'Professional coaching': '/professional-coaching/',
    'Explore professional coaching': '/professional-coaching/',
    'Relationship problems': '/relationship-problems-men/',
    "Burnout & can't switch off": '/executive-burnout-therapy/',
    "Burnout & Can't Switch Off": '/executive-burnout-therapy/',
    'Career change & decisions': '/career-transition-therapy/',
    'Career Change & Decisions': '/career-transition-therapy/',
    'About me': '/about/',
    'Read more about me': '/about/',
    'Considering therapy': '/considering-therapy/',
    'Writing': '/blog/',
    'Free tools': '/free-tools/',
    'Work with me': '/work-with-me/',
    'Psychotherapy for men in tech': '/therapy-for-men-in-tech/',
    'When work is affecting your relationship': '/work-affecting-relationship/',
    'Achievement & self-worth': '/achievement-self-worth/',
    'Achievement & Self-Worth': '/achievement-self-worth/',
    'Work & relationships': '/work-affecting-relationship/',
    'Work & Relationships': '/work-affecting-relationship/',
    'Separation & divorce': '/separation-divorce-men/',
    'Therapy for founders': '/therapy-for-founders/',
    'Therapy for Founders': '/therapy-for-founders/',
    'Anxiety & Overthinking': '/anxiety-overthinking/',
    'Take the burnout check-in': '/free-tools/burned-out/',
    'Take the career reflection': '/free-tools/quit-your-job/',
    'Read Undisguised': 'https://www.undisguised.io/',
    'Confidentiality': '/confidentiality/',
    'FAQ': '/faq/',
    # The four featured essays exist only in the private archive until the
    # Writing restoration phase; their future URLs are recorded as `planned`.
    'Read': None,
    # No Terms or Privacy text exists on the site yet (see the report).
    'Terms': None,
    'Privacy': None,
}
FORM_SUBMIT = 'Send enquiry'

# Where each featured essay will live once it is restored (its old /blog/ URL).
PLANNED_ESSAYS = {
    'You took the vacation. You came back feeling the same way.': '/blog/vacation-same-feeling/',
    'Who are you if you’re not “crushing” it?': '/blog/who-are-you-if-you-are-not-crushing-it/',
    'The loneliness and emotional pressure that founders experience': '/blog/the-loneliness-and-emotional-pressure-that-founders-experience/',
    'The high cost of endless pondering': '/blog/the-high-cost-of-endless-pondering/',
}

# Testimonials held back from publication. Each one's wording differs from the
# feedback recorded in the previous site's copy (content-pages.jsx, marked
# "verbatim"), so it cannot be published as a verbatim quote until checked
# against the original (brief, Phase 9). Matched on the opening words.
HELD_QUOTES = [
    '“I started working with Aggelos during a confusing period in my career.',
]


def smart(s):
    """Typographic apostrophes only; the document already uses curly quotes."""
    return s.replace("'", '’')


def slug(s):
    s = s.lower().replace('&', 'and')
    s = re.sub(r'[‘’“”\'"?.,:;!()]', '', s)
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def rich(p):
    """Paragraph → text with **bold** markers. Italic is carried by block type."""
    out = []
    for r in p.runs:
        t = r.text
        if not t:
            continue
        if r.bold and not r.italic:
            # keep surrounding spaces outside the markers
            lead = t[:len(t) - len(t.lstrip())]
            trail = t[len(t.rstrip()):]
            core = t.strip()
            out.append(lead + ('**' + core + '**' if core else '') + trail)
        else:
            out.append(t)
    s = ''.join(out).replace('****', '')
    return smart(s)


def cta(text):
    t = text.strip()
    arrow = t.endswith('→')
    label = t[:-1].strip() if arrow else t
    return label, arrow


def main(path):
    d = docx.Document(path)
    paras = list(d.paragraphs)

    pages = []
    notes = []
    held = []
    page = None
    section = None
    sub = None
    hero_state = None  # None | 'eyebrow' | 'body'
    in_launch = False
    in_nav = False
    nav = []

    def target():
        if sub is not None:
            return sub['blocks']
        if section is not None:
            return section['blocks']
        return page['hero']['blocks']

    def push(block):
        blocks = target()
        # consecutive CTAs share one row
        if block['t'] == 'cta' and blocks and blocks[-1]['t'] == 'ctas':
            blocks[-1]['items'].append(block['item'])
            return
        if block['t'] == 'cta':
            blocks.append({'t': 'ctas', 'items': [block['item']]})
            return
        blocks.append(block)

    for p in paras:
        style = p.style.name if p.style is not None else ''
        text = p.text.strip()
        runs = [r for r in p.runs if r.text]

        if style == 'Title':
            continue
        if style == 'Heading 2' and text == 'Final navigation':
            in_nav = True
            continue
        if style == 'Heading 1' and re.match(r'^\d+\.\s', text):
            in_nav = False
            num, name = text.split('.', 1)
            page = {'num': int(num), 'name': name.strip(), 'hero': {'eyebrow': None, 'h1': None, 'blocks': []},
                    'sections': []}
            pages.append(page)
            section = sub = None
            hero_state = None
            continue
        if style == 'Heading 1' and text == 'Launch notes':
            in_launch = True
            continue
        if in_launch:
            if text:
                notes.append({'page': 'Launch notes', 'note': text})
            continue
        if in_nav:
            if text:
                nav.append({'style': style, 'text': text})
            continue
        if page is None or not text:
            continue

        # implementation notes are instructions, never copy
        if runs and runs[0].italic and text.startswith('Implementation note'):
            notes.append({'page': page['name'], 'note': text})
            continue

        if style == 'Meta':
            m = re.match(r'^(URL|SEO title|Meta description|Navigation label):\s*(.*)$', text)
            if not m:
                raise SystemExit(f'unrecognised Meta line on {page["name"]}: {text!r}')
            key = {'URL': 'url', 'SEO title': 'seoTitle', 'Meta description': 'metaDescription',
                   'Navigation label': 'navLabel'}[m.group(1)]
            page[key] = smart(m.group(2).strip())
            continue
        if style == 'Eyebrow':
            if text != 'HERO':
                raise SystemExit(f'unexpected Eyebrow marker {text!r}')
            hero_state = 'eyebrow'
            continue
        if hero_state == 'eyebrow':
            page['hero']['eyebrow'] = smart(text)
            hero_state = 'body'
            continue
        if style == 'Heading 1':
            page['hero']['h1'] = smart(text)
            continue
        if style == 'Heading 2':
            section = {'h2': smart(text), 'id': slug(text), 'blocks': []}
            page['sections'].append(section)
            sub = None
            continue
        if style == 'Heading 3':
            sub = {'t': 'sub', 'h3': smart(text), 'blocks': []}
            (section['blocks'] if section is not None else page['hero']['blocks']).append(sub)
            continue
        if style == 'CTA':
            label, arrow = cta(text)
            if label == FORM_SUBMIT:
                push({'t': 'submit', 'label': smart(label), 'arrow': arrow})
                continue
            if label not in CTA_HREF:
                raise SystemExit(f'CTA without a destination on {page["name"]}: {label!r}')
            item = {'label': smart(label), 'href': CTA_HREF[label], 'arrow': arrow}
            if label == 'Read' and sub is not None:
                item['planned'] = PLANNED_ESSAYS.get(sub['h3'])
                if not item['planned']:
                    raise SystemExit(f'no planned URL for essay {sub["h3"]!r}')
            push({'t': 'cta', 'item': item})
            continue
        if style == 'List Bullet':
            blocks = target()
            if blocks and blocks[-1]['t'] == 'list':
                blocks[-1]['items'].append(rich(p))
            else:
                blocks.append({'t': 'list', 'items': [rich(p)]})
            continue
        if style != 'Normal':
            raise SystemExit(f'unhandled style {style!r} on {page["name"]}: {text!r}')

        # ── Normal paragraphs with a special role ────────────────────────────
        if text.startswith('Related:'):
            label, arrow = cta(text[len('Related:'):])
            if label not in CTA_HREF:
                raise SystemExit(f'Related link without a destination: {label!r}')
            push({'t': 'related', 'label': smart(label), 'href': CTA_HREF[label], 'arrow': arrow})
            continue
        all_italic = all(r.italic for r in runs)
        all_bold = all(r.bold for r in runs)
        if all_italic and all_bold:
            # testimonial attribution: belongs to the quote just before it
            blocks = target()
            if not blocks or blocks[-1]['t'] != 'quote':
                raise SystemExit(f'attribution without a quote: {text!r}')
            blocks[-1]['cite'] = smart(text)
            continue
        if all_italic and text.startswith('“'):
            block = {'t': 'quote', 'text': smart(text)}
            if any(text.startswith(h) for h in HELD_QUOTES):
                block['held'] = True
            push(block)
            continue
        if all_italic:
            push({'t': 'meta', 'text': smart(text)})
            continue
        if page.get('url') == '/contact/' and section is not None and section['id'] == 'suggested-form-fields':
            if all_bold:
                push({'t': 'field', 'label': smart(text)})
            elif text.startswith('Service:'):
                opts = [smart(o.strip()) for o in text[len('Service:'):].split('/')]
                push({'t': 'field', 'label': 'Service', 'options': opts})
            else:
                raise SystemExit(f'unexpected form-field line {text!r}')
            continue
        push({'t': 'p', 'text': rich(p)})

    # ── Post-process ─────────────────────────────────────────────────────────
    out = {}
    for pg in pages:
        url = pg.get('url')
        if url not in TYPE_BY_URL:
            raise SystemExit(f'page without a known URL: {pg["name"]} ({url})')
        pid = 'home' if url == '/' else url.strip('/').replace('/', '-')
        for s in pg['sections']:
            # drop held testimonials entirely: they must not ship in the bundle
            before = len(s['blocks'])
            kept = []
            for b in s['blocks']:
                if b['t'] == 'quote' and b.get('held'):
                    held.append({'page': url, 'section': s['h2'], 'text': b['text'], 'cite': b.get('cite')})
                    continue
                kept.append(b)
            s['blocks'] = kept
            if len(kept) != before:
                s['heldQuotes'] = before - len(kept)
        entry = {
            'id': pid, 'num': pg['num'], 'name': pg['name'], 'url': url, 'type': TYPE_BY_URL[url],
            'seoTitle': pg.get('seoTitle'), 'metaDescription': pg.get('metaDescription'),
        }
        if pg.get('navLabel'):
            entry['navLabel'] = pg['navLabel']
        entry['hero'] = pg['hero']
        entry['sections'] = pg['sections']
        # the contact form spec is a form, not a visible section
        if url == '/contact/':
            spec = next(s for s in pg['sections'] if s['id'] == 'suggested-form-fields')
            fields = [b for b in spec['blocks'] if b['t'] == 'field']
            submit = next(b for b in spec['blocks'] if b['t'] == 'submit')
            entry['form'] = {'fields': fields, 'submit': submit}
            entry['sections'] = [s for s in pg['sections'] if s is not spec]
        out[pid] = entry

    missing = [u for u in TYPE_BY_URL if u not in {p['url'] for p in out.values()}]
    if missing:
        raise SystemExit(f'pages missing from the document: {missing}')

    return out, notes, held, nav


def serialise(pages):
    """Compact but diff-friendly: one line per block, one line per page field."""
    j = lambda v: json.dumps(v, ensure_ascii=False)

    def blocks(bs, ind):
        return '[\n' + ',\n'.join(ind + '  ' + j(b) for b in bs) + '\n' + ind + ']'

    out = ['{\n  "pages": {']
    rows = []
    for pid, p in pages.items():
        fields = []
        for k, v in p.items():
            if k == 'hero':
                fields.append('      "hero": {"eyebrow": %s, "h1": %s, "blocks": %s}' % (
                    j(v['eyebrow']), j(v['h1']), blocks(v['blocks'], '      ')))
            elif k == 'sections':
                secs = []
                for s in v:
                    head = {kk: vv for kk, vv in s.items() if kk != 'blocks'}
                    secs.append('        ' + j(head)[:-1] + ', "blocks": ' + blocks(s['blocks'], '        ') + '}')
                fields.append('      "sections": [\n' + ',\n'.join(secs) + '\n      ]')
            else:
                fields.append('      %s: %s' % (j(k), j(v)))
        rows.append('    %s: {\n%s\n    }' % (j(pid), ',\n'.join(fields)))
    out.append(',\n'.join(rows))
    out.append('  }\n}')
    return '\n'.join(out)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    src = sys.argv[1]
    dest = sys.argv[2] if len(sys.argv) > 2 else 'site-copy.jsx'
    pages, notes, held, nav = main(src)
    header = (
        '// site-copy.jsx — the final editorial copy for the 24 canonical pages.\n'
        '//\n'
        '// GENERATED by scripts/copy/extract-editorial.py from the final editorial\n'
        '// document ("Aggelos Mouzakitis — Final Website Copy", final editorial draft).\n'
        '// The wording is the approved wording: change it in the document and\n'
        '// re-run the script, rather than editing sentences here. Only typography\n'
        '// differs from the source (typographic apostrophes; → drawn by the UI).\n'
        '//\n'
        '// Shape: pages[id] = { url, type, seoTitle, metaDescription, hero, sections }\n'
        '//   hero     = { eyebrow, h1, blocks }\n'
        '//   sections = [{ h2, id, blocks }]\n'
        '//   blocks   = p | list | ctas | related | meta | quote | sub (an h3 with its own blocks)\n'
        '//   **text** marks the bold runs of the source.\n'
        '// Rendered by site-pages.jsx; SEO fields are copied into scripts/seo/site-meta.js.\n\n'
    )
    body = 'window.SITE_COPY = ' + serialise(pages) + ';\n'
    with open(dest, 'w', encoding='utf-8') as f:
        f.write(header + body)
    print(f'wrote {dest}: {len(pages)} pages')
    print(f'\n{len(notes)} implementation/launch note(s) left out of the copy:')
    for n in notes:
        print(f'  [{n["page"]}] {n["note"]}')
    print(f'\n{len(held)} testimonial(s) held back:')
    for h in held:
        print(f'  [{h["page"]} / {h["section"]}] {h["cite"]}: {h["text"][:90]}…')
