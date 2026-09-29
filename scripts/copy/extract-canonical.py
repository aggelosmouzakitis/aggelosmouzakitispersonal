#!/usr/bin/env python3
"""extract-canonical.py — turn the canonical copy (Markdown) into site-copy.jsx
and site-nav.jsx.

The page copy on this site is not retyped by hand: it is extracted from the
approved "Canonical Website Copy & Metadata" document so that what ships is
word-for-word what was signed off. Run this again whenever a new version of
that document arrives:

    python3 scripts/copy/extract-canonical.py [content/canonical-copy.md]
    npm run build            # compiles site-copy.jsx / site-nav.jsx -> .js

The document lives in the repository at content/canonical-copy.md (it is not
published); replace that file with a new version, then re-run.

site-copy.jsx holds the 25 pages (loaded by the canonical pages only);
site-nav.jsx holds the header and footer wording (loaded on every page,
including the tools, so it is kept separate and small).

The only liberties it takes are typographic: straight apostrophes become
typographic ones (don't -> don’t) and "→" is split off link labels and drawn
by the UI. Everything else — every sentence, heading and label — is copied
verbatim. Links are resolved from their wording through CTA_HREF and NAV_HREF
below; a label that is not in those tables stops the build, so nothing ships
unlinked. Each page's URL, SEO title, meta description and H1 are also checked
against the document's own metadata index.
"""
import json
import re
import sys

# ── Page URL → page family (drives the layout in site-pages.jsx) ────────────
TYPE_BY_URL = {
    '/': 'home',
    '/about/': 'about',
    '/work-with-me/': 'hub',
    '/individual-psychotherapy/': 'service',
    '/couples-therapy/': 'service',
    '/professional-coaching/': 'service',
    '/therapy-vs-coaching/': 'resource',
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

# ── Link wording in the page copy → destination ──────────────────────────────
# None = the copy names a destination that is not published yet (the essays on
# /blog/); the UI leaves that link out rather than pointing it somewhere else.
CTA_HREF = {
    'Book a consultation': '/contact/',
    'Individual psychotherapy': '/individual-psychotherapy/',
    'Explore individual psychotherapy': '/individual-psychotherapy/',
    'How individual psychotherapy works': '/individual-psychotherapy/',
    'Couples therapy': '/couples-therapy/',
    'Explore couples therapy': '/couples-therapy/',
    'Professional coaching': '/professional-coaching/',
    'Explore professional coaching': '/professional-coaching/',
    'Therapy vs coaching': '/therapy-vs-coaching/',
    'Therapy for men': '/therapy-for-men-in-tech/',
    'Psychotherapy for men in tech': '/therapy-for-men-in-tech/',
    'Psychotherapy for executives': '/therapy-for-executives/',
    'Therapy for entrepreneurs, founders and business owners': '/therapy-for-founders/',
    'Therapy for founders': '/therapy-for-founders/',
    'Therapy for Founders': '/therapy-for-founders/',
    'Considering therapy': '/considering-therapy/',
    'Considering Therapy': '/considering-therapy/',
    'Relationship problems': '/relationship-problems-men/',
    'Separation & divorce': '/separation-divorce-men/',
    'Work & relationships': '/work-affecting-relationship/',
    'Work & Relationships': '/work-affecting-relationship/',
    'When work is affecting your relationship': '/work-affecting-relationship/',
    'Burnout & can’t switch off': '/executive-burnout-therapy/',
    'Burnout & Can’t Switch Off': '/executive-burnout-therapy/',
    'Career change & decisions': '/career-transition-therapy/',
    'Career Change & Decisions': '/career-transition-therapy/',
    'Anxiety & overthinking': '/anxiety-overthinking/',
    'Anxiety & Overthinking': '/anxiety-overthinking/',
    'Achievement & self-worth': '/achievement-self-worth/',
    'Achievement & Self-Worth': '/achievement-self-worth/',
    'About me': '/about/',
    'Read more about me': '/about/',
    'Work with me': '/work-with-me/',
    'Writing': '/blog/',
    'Free tools': '/free-tools/',
    'FAQ': '/faq/',
    'Confidentiality': '/confidentiality/',
    'Take the burnout check-in': '/free-tools/burned-out/',
    'Take the career reflection': '/free-tools/quit-your-job/',
    'Read Undisguised': 'https://www.undisguised.io/',
    'Read': None,
}

# ── Header and footer wording → destination ──────────────────────────────────
NAV_HREF = {
    'Home': '/',
    'About': '/about/',
    'FAQ': '/faq/',
    'Contact': '/contact/',
    'Confidentiality': '/confidentiality/',
    'Individual Psychotherapy': '/individual-psychotherapy/',
    'Couples Therapy': '/couples-therapy/',
    'Professional Coaching': '/professional-coaching/',
    'Therapy for Men in Tech & Business': '/therapy-for-men-in-tech/',
    'Therapy for Executives & Senior Leaders': '/therapy-for-executives/',
    'Therapy for Entrepreneurs, Founders & Business Owners': '/therapy-for-founders/',
    'Greek-speaking Psychotherapy': '/greek-speaking-psychotherapist/',
    'Men in Tech & Demanding Careers': '/therapy-for-men-in-tech/',
    'Founders & Business Owners': '/therapy-for-founders/',
    'Executives & Leaders': '/therapy-for-executives/',
    'Relationships & Separation': '/relationship-problems-men/',
    'Work & Relationships': '/work-affecting-relationship/',
    'Burnout & Can’t Switch Off': '/executive-burnout-therapy/',
    'Career Change & Decisions': '/career-transition-therapy/',
    'Anxiety & Overthinking': '/anxiety-overthinking/',
    'Achievement & Self-Worth': '/achievement-self-worth/',
    'Considering Therapy': '/considering-therapy/',
    'Therapy vs Coaching': '/therapy-vs-coaching/',
    'Writing': '/blog/',
    'Free Tools': '/free-tools/',
    'Reviews': '/reviews/',
}

FORM_SUBMIT = 'Send enquiry'

CTA_RE = re.compile(r'^\*\*(.+?)\s*→\*\*$')
RELATED_RE = re.compile(r'^Related:\s*\*\*(.+?)(\s*→)?\*\*$')
BOLD_LINE_RE = re.compile(r'^\*\*([^*]+)\*\*$')
ITALIC_LINE_RE = re.compile(r'^\*([^*]+)\*$')


def smart(s):
    """Typographic apostrophes only; the document already uses curly quotes."""
    return s.replace("'", '’')


def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower().replace('’', '').replace("'", '')).strip('-')


def href_for(label, where):
    if label not in CTA_HREF:
        raise SystemExit(f'unknown link wording {label!r} on {where}: add it to CTA_HREF')
    return CTA_HREF[label]


def nav_href(label):
    if label not in NAV_HREF:
        raise SystemExit(f'unknown navigation label {label!r}: add it to NAV_HREF')
    return NAV_HREF[label]


def paragraphs(lines):
    """Group raw lines into Markdown blocks: ('h', level, text), ('p', [lines]),
    ('list', [items]), ('quote', [lines]), ('rule',)."""
    out = []
    buf, kind = [], None

    def flush():
        nonlocal buf, kind
        if buf:
            out.append((kind, buf))
        buf, kind = [], None

    for raw in lines:
        line = raw.rstrip('\n')
        s = line.strip()
        if not s:
            flush()
            continue
        m = re.match(r'^(#{1,3})\s+(.*)$', s)
        if m:
            flush()
            out.append(('h', len(m.group(1)), m.group(2).strip()))
            continue
        if s == '---':
            flush()
            out.append(('rule', None))
            continue
        k = 'quote' if s.startswith('>') else 'list' if s.startswith('- ') else 'p'
        if kind and kind != k:
            flush()
        kind = k
        if k == 'quote':
            buf.append(s[1:].strip())
        elif k == 'list':
            buf.append(s[2:].strip())
        else:
            buf.append(s)
    flush()
    return out


def classify(lines, where):
    """One Markdown paragraph (its hard-broken lines) → list of copy blocks."""
    structural = lambda l: CTA_RE.match(l) or RELATED_RE.match(l) or ITALIC_LINE_RE.match(l)
    if all(structural(l) for l in lines):
        # links, "Related:" links and short italic notes, one line each;
        # consecutive links of one kind share a block
        blocks = []
        for l in lines:
            m = CTA_RE.match(l)
            r = RELATED_RE.match(l)
            if m or r:
                kind = 'ctas' if m else 'related'
                label = smart((m or r).group(1).strip())
                item = {'label': label, 'href': href_for(label, where)}
                if blocks and blocks[-1]['t'] == kind:
                    blocks[-1]['items'].append(item)
                else:
                    blocks.append({'t': kind, 'items': [item]})
            else:
                blocks.append({'t': 'meta', 'text': smart(ITALIC_LINE_RE.match(l).group(1).strip())})
        return blocks
    if (len(lines) == 2 and BOLD_LINE_RE.match(lines[0]) and not CTA_RE.match(lines[0])
            and not lines[1].startswith('*')):
        return [{'t': 'pairs', 'items': [{'a': smart(BOLD_LINE_RE.match(lines[0]).group(1).strip()),
                                           'b': smart(lines[1].strip())}]}]
    if len(lines) > 1:
        return [{'t': 'lines', 'lines': [smart(l.strip()) for l in lines]}]
    return [{'t': 'p', 'text': smart(lines[0].strip())}]


def parse_nav(blocks):
    """The header and footer sections at the top of the document."""
    nav = {'items': [], 'cta': None}
    footer = {'brand': None, 'tagline': None, 'groups': [], 'legal': [], 'rights': None}
    section = None
    group = None
    for b in blocks:
        if b[0] == 'h' and b[1] == 2:
            section = b[2]
            group = None
            continue
        if section == 'Header navigation':
            if b[0] == 'p':
                text = b[1][0]
                m = re.match(r'^\*\*Primary CTA:\*\*\s*(.+)$', text)
                if m:
                    nav['cta'] = {'label': smart(m.group(1).strip()), 'href': '/contact/'}
                    continue
                m = BOLD_LINE_RE.match(text)
                if m:
                    label = smart(m.group(1).strip())
                    group = {'label': label}
                    nav['items'].append(group)
                    continue
                # a note about where problem pages are linked from: not copy
                continue
            if b[0] == 'list' and group is not None:
                group['items'] = [{'label': smart(i), 'href': nav_href(smart(i))} for i in b[1]]
        elif section == 'Footer copy':
            if b[0] == 'p':
                text = b[1][0]
                m = BOLD_LINE_RE.match(text)
                if m and footer['brand'] is None:
                    footer['brand'] = m.group(1)
                    continue
                if m:
                    group = {'label': smart(m.group(1).strip()), 'items': []}
                    footer['groups'].append(group)
                    continue
                if footer['tagline'] is None:
                    footer['tagline'] = smart(text)
                elif text.startswith('©'):
                    footer['rights'] = smart(text)
                else:
                    footer['legal'].append({'label': smart(text), 'href': nav_href(smart(text))})
            elif b[0] == 'list' and group is not None:
                group['items'] = [{'label': smart(i), 'href': nav_href(smart(i))} for i in b[1]]
    for it in nav['items']:
        if 'items' not in it:
            it['href'] = nav_href(it['label'])
    return nav, footer


def parse_index(blocks):
    """The 'Canonical metadata index' table → {url: {title, description, h1}}."""
    idx = {}
    for b in blocks:
        if b[0] != 'p' or not b[1][0].startswith('|'):
            continue
        for row in b[1]:
            cells = [c.strip().replace('\\|', '|') for c in re.split(r'(?<!\\)\|', row.strip().strip('|'))]
            if len(cells) < 6 or not cells[0].isdigit():
                continue
            idx[cells[2]] = {'title': smart(cells[3]), 'description': smart(cells[4]), 'h1': smart(cells[5])}
    return idx


def main(path):
    src = open(path, encoding='utf-8').read().split('\n')
    first_page = next(i for i, l in enumerate(src) if re.match(r'^# \d+\.\s', l))
    top = paragraphs(src[:first_page])
    nav, footer = parse_nav(top)
    index = parse_index(top)

    pages = []
    page = section = sub = None
    in_hero = False
    for b in paragraphs(src[first_page:]):
        kind = b[0]
        if kind == 'h' and b[1] == 1 and re.match(r'^\d+\.\s', b[2]):
            num, name = b[2].split('.', 1)
            page = {'num': int(num), 'name': smart(name.strip()), 'hero': {'eyebrow': None, 'h1': None, 'blocks': []},
                    'sections': []}
            pages.append(page)
            section = sub = None
            in_hero = False
            continue
        if page is None or kind == 'rule':
            continue
        where = page['name']
        if kind == 'h' and b[1] == 2:
            sub = None
            if b[2] == 'Hero':
                in_hero = True
                section = None
                continue
            in_hero = False
            section = {'h2': smart(b[2]), 'id': slug(b[2]), 'blocks': []}
            page['sections'].append(section)
            continue
        if kind == 'h' and b[1] == 1:
            page['hero']['h1'] = smart(b[2])
            continue
        if kind == 'h' and b[1] == 3:
            sub = {'t': 'sub', 'h3': smart(b[2]), 'blocks': []}
            section['blocks'].append(sub)
            continue

        target = page['hero']['blocks'] if in_hero else (sub['blocks'] if sub else section['blocks'] if section else None)
        if kind == 'p':
            lines = b[1]
            meta = re.match(r'^\*\*(URL|SEO title|Meta description|Navigation label):\*\*\s*(.*)$', lines[0])
            if meta and not in_hero and section is None:
                for l in lines:
                    m = re.match(r'^\*\*(URL|SEO title|Meta description|Navigation label):\*\*\s*(.*)$', l)
                    key = {'URL': 'url', 'SEO title': 'seoTitle', 'Meta description': 'metaDescription',
                           'Navigation label': 'navLabel'}[m.group(1)]
                    val = m.group(2).strip()
                    page[key] = val.strip('`') if key == 'url' else smart(val)
                continue
            if in_hero:
                bold = BOLD_LINE_RE.match(lines[0]) if len(lines) == 1 else None
                if bold and not CTA_RE.match(lines[0]):
                    if page['hero']['h1'] is None:
                        page['hero']['eyebrow'] = smart(bold.group(1).strip())
                        continue
                    if not page['hero']['blocks'] and 'sub' not in page['hero']:
                        page['hero']['sub'] = smart(bold.group(1).strip())
                        continue
            if section is not None and section['id'] == 'suggested-form-fields':
                for l in lines:
                    m = CTA_RE.match(l)
                    if m:
                        label = smart(m.group(1).strip())
                        if label != FORM_SUBMIT:
                            raise SystemExit(f'unexpected form button {label!r}')
                        section['blocks'].append({'t': 'submit', 'label': label})
                        continue
                    m = re.match(r'^\*\*Service:\*\*\s*(.+)$', l)
                    if m:
                        opts = [smart(o.strip()) for o in m.group(1).split('/')]
                        section['blocks'].append({'t': 'field', 'label': 'Service', 'options': opts})
                        continue
                    m = BOLD_LINE_RE.match(l)
                    if not m:
                        raise SystemExit(f'unexpected form-field line {l!r}')
                    section['blocks'].append({'t': 'field', 'label': smart(m.group(1).strip())})
                continue
            new = classify(lines, where)
            # consecutive label/value pairs form one block (credentials, facts)
            if new[0]['t'] == 'pairs' and target and target[-1]['t'] == 'pairs':
                target[-1]['items'].extend(new[0]['items'])
            else:
                target.extend(new)
            continue
        if kind == 'list':
            target.append({'t': 'list', 'items': [smart(i) for i in b[1]]})
            continue
        if kind == 'quote':
            body = [l for l in b[1] if l]
            cite = BOLD_LINE_RE.match(body[-1])
            if not cite:
                raise SystemExit(f'quote without attribution on {where}: {body[0][:60]!r}')
            target.append({'t': 'quote', 'text': smart(' '.join(body[:-1])), 'cite': smart(cite.group(1).strip())})
            continue

    # ── Post-process + checks ────────────────────────────────────────────────
    out = {}
    problems = []
    for pg in pages:
        url = pg.get('url')
        if url not in TYPE_BY_URL:
            raise SystemExit(f'page without a known URL: {pg["name"]} ({url})')
        pid = 'home' if url == '/' else url.strip('/').replace('/', '-')
        if not pg['hero']['h1'] or not pg['hero']['eyebrow']:
            raise SystemExit(f'{url}: hero without eyebrow or H1')
        ix = index.get(url)
        if not ix:
            problems.append(f'{url}: not in the metadata index')
        else:
            for k, v in (('title', pg.get('seoTitle')), ('description', pg.get('metaDescription')), ('h1', pg['hero']['h1'])):
                if ix[k] != v:
                    problems.append(f'{url}: {k} differs from the metadata index\n    page:  {v}\n    index: {ix[k]}')
        entry = {'id': pid, 'num': pg['num'], 'name': pg['name'], 'url': url, 'type': TYPE_BY_URL[url],
                 'seoTitle': pg.get('seoTitle'), 'metaDescription': pg.get('metaDescription')}
        if pg.get('navLabel'):
            entry['navLabel'] = pg['navLabel']
        hero = {'eyebrow': pg['hero']['eyebrow'], 'h1': pg['hero']['h1']}
        if pg['hero'].get('sub'):
            hero['sub'] = pg['hero']['sub']
        hero['blocks'] = pg['hero']['blocks']
        entry['hero'] = hero
        entry['sections'] = pg['sections']
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
    titles = [p['seoTitle'] for p in out.values()]
    descs = [p['metaDescription'] for p in out.values()]
    if len(set(titles)) != len(titles):
        problems.append('duplicate SEO titles')
    if len(set(descs)) != len(descs):
        problems.append('duplicate meta descriptions')
    if problems:
        raise SystemExit('the document is inconsistent:\n  ' + '\n  '.join(problems))
    return out, nav, footer


def serialise(pages):
    """Compact but diff-friendly: one line per block, one line per page field."""
    j = lambda v: json.dumps(v, ensure_ascii=False)

    def blocks(bs, ind):
        return '[\n' + ',\n'.join(ind + '  ' + j(b) for b in bs) + '\n' + ind + ']'

    out = ['{', '  "pages": {']
    rows = []
    for pid, p in pages.items():
        fields = []
        for k, v in p.items():
            if k == 'hero':
                head = {kk: vv for kk, vv in v.items() if kk != 'blocks'}
                fields.append('      "hero": ' + j(head)[:-1] + ', "blocks": ' + blocks(v['blocks'], '      ') + '}')
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


DEFAULT_SRC = 'content/canonical-copy.md'

if __name__ == '__main__':
    src = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SRC
    outdir = sys.argv[2] if len(sys.argv) > 2 else '.'
    pages, nav, footer = main(src)
    source = ('// GENERATED by scripts/copy/extract-canonical.py from the canonical document\n'
              '// ("Aggelos Mouzakitis — Canonical Website Copy & Metadata"). The wording is\n'
              '// the approved wording: change it in the document and re-run the script,\n'
              '// rather than editing it here. Only typography differs from the source\n'
              '// (typographic apostrophes; → drawn by the UI).\n')
    copy_header = (
        '// site-copy.jsx — the canonical copy for the 25 canonical pages.\n//\n' + source + '//\n'
        '// Shape: pages[id] = { url, type, seoTitle, metaDescription, hero, sections }\n'
        '//   hero     = { eyebrow, h1, sub?, blocks }\n'
        '//   sections = [{ h2, id, blocks }]\n'
        '//   blocks   = p | lines | list | ctas | related | meta | pairs | quote | sub (an h3 with its own blocks)\n'
        '//   **text** marks the bold runs of the source.\n'
        '// Rendered by site-pages.jsx; SEO fields are read by scripts/seo/site-meta.js.\n\n'
    )
    with open(f'{outdir}/site-copy.jsx', 'w', encoding='utf-8') as f:
        f.write(copy_header + 'window.SITE_COPY = ' + serialise(pages) + ';\n')
    nav_header = (
        '// site-nav.jsx — the header and footer wording, from the canonical copy.\n//\n' + source + '//\n'
        '// Loaded on every page before site-chrome.js, which renders it.\n\n'
    )
    j = lambda v: json.dumps(v, ensure_ascii=False, indent=2)
    with open(f'{outdir}/site-nav.jsx', 'w', encoding='utf-8') as f:
        f.write(nav_header + 'window.SITE_NAV = ' + j({'nav': nav, 'footer': footer}) + ';\n')
    print(f'wrote {outdir}/site-copy.jsx ({len(pages)} pages) and {outdir}/site-nav.jsx')
