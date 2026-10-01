// extract-articles.js — turn each article brief into the data the site renders.
//
// The article wording is not retyped: it is taken from Part 2 of the brief
// (content/articles/<slug>.md), the editorial source of truth, so what ships is
// what was written. Part 1 supplies the page spec, Part 3 the TOC labels and
// anchor IDs, the author block and the CTA; scripts/articles/articles.js the
// decisions a brief leaves open. Run it whenever a brief or articles.js
// changes, then the pipeline in scripts/seo/README.md from `npm run build`:
//
//   node scripts/articles/extract-articles.js
//
// Writes article-<slug>.jsx for each article (window.SITE_ARTICLE_PAGES[slug]:
// the whole page, loaded by that page only) and site-articles.jsx
// (window.SITE_ARTICLES: the listing on /blog/, newest first).
//
// The liberties it takes, and nothing else:
//   - typography: straight apostrophes become typographic ones, as everywhere
//     on the site (don't → don’t);
//   - links to https://aggelosmouzakitis.com/… become root-relative (/about/):
//     the same destination, in the form the build checks resolves;
//   - a table caption sentence (articles.js table.caption) moves from the end
//     of the paragraph before the table into its <caption>, so it is visible
//     once; the words keep their order;
//   - an unresolved [INTERNAL LINK NEEDED: …] placeholder is left out with its
//     pointer (articles.js links). It is printed as a PUBLICATION BLOCKER and
//     never reaches a published file.
// Inline Markdown (**bold**, *italic*, [text](url)) stays in the strings and
// is drawn by site-pages.jsx. Anything the article and its spec disagree on
// stops the script.

const fs = require('fs');
const path = require('path');
const { ARTICLES, ORIGIN, dataSource, INDEX_SOURCE } = require('./articles.js');

const ROOT = path.resolve(__dirname, '..', '..');
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];
const NUMBERS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
const PLACEHOLDER = /\[INTERNAL LINK NEEDED: ([^\]]+)\]/;

class BriefError extends Error {}
const fail = (slug, msg) => { throw new BriefError(`${slug}: ${msg}`); };

// ── Text helpers ─────────────────────────────────────────────────────────────
// Typographic apostrophes in the words, never inside a link's address; a
// straight quote that opens a quotation ('the one who succeeds') opens it.
const smart = (s) => s.split(/(\]\([^)\s]*\))/).map((part, i) => (i % 2 ? part
  : part.replace(/(^|[\s(“[—–-])'(?=[\p{L}\p{N}])/gu, '$1‘').replace(/'/g, '’'))).join('');
const straight = (s) => s.replace(/’/g, "'");

// Inline Markdown → plain text: the words a reader sees.
function plain(md) {
  return md
    .replace(/\[([^\]]*)\]\((?:[^()]|\([^()]*\))*\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1');
}
const words = (text) => text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

// Sentences of a Markdown paragraph: a break after . ! ? (and a closing quote
// or bracket) before a capital, an opening quote or a bracket. URLs never
// contain a space, so a link is never split.
const sentencesOf = (md) => md.split(/(?<=[.!?…][”’")\]]?)\s+(?=[A-Z“‘"(\[*])/);

// Links: internal ones root-relative; everything else must be https.
function normaliseLinks(md, slug) {
  return md.replace(/\]\(([^)\s]+)\)/g, (m, href) => {
    if (href.startsWith(ORIGIN + '/')) return '](' + href.slice(ORIGIN.length) + ')';
    if (/^\/(?!\/)/.test(href)) return m;
    if (!/^https:\/\//.test(href)) fail(slug, `link is neither a site path nor https: ${href}`);
    return m;
  });
}

const slugify = (s) => s.toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Every bracket and asterisk must belong to markup the renderer draws, so
// nothing reaches the page as stray Markdown.
function checkInline(md, slug, where) {
  if (/[*[\]]/.test(plain(md))) fail(slug, `unbalanced inline Markdown in ${where}: ${md.slice(0, 90)}`);
}

// ── The brief ────────────────────────────────────────────────────────────────
function splitParts(md, slug) {
  const marks = [...md.matchAll(/^## PART (\d+) — (.+)$/gm)];
  const parts = {};
  marks.forEach((m, i) => {
    parts[m[1]] = md.slice(m.index + m[0].length, i + 1 < marks.length ? marks[i + 1].index : md.length);
  });
  for (const n of ['1', '2', '3']) if (!parts[n]) fail(slug, `the brief has no PART ${n}`);
  return parts;
}

// "Key: value" lines (Part 1); a value wholly in backticks loses them.
function specOf(text) {
  const spec = {};
  for (const line of text.split('\n')) {
    const m = line.match(/^([A-Z][A-Za-z0-9 ]+):\s*(.+?)\s*$/);
    if (m) spec[m[1]] = m[2].replace(/^`([^`]*)`$/, '$1');
  }
  return spec;
}

// Part 3's "### " subsections, by title.
function subsections(text) {
  const out = {};
  const marks = [...text.matchAll(/^### (.+)$/gm)];
  marks.forEach((m, i) => {
    out[m[1].trim()] = text.slice(m.index + m[0].length, i + 1 < marks.length ? marks[i + 1].index : text.length);
  });
  return out;
}

// "Key: `value`" lines of a subsection, bulleted or not; keys lower-case and
// without "Exact" ("- Exact heading: `…`" and "Heading: `…`" are one field).
// A field that names a link ("Exact name, linked to `/about/`: `…`" or
// "Name: `…`, linked to `/about/`.") also gives "<key> link".
function fieldsOf(text) {
  const out = {};
  for (const m of text.matchAll(/^(?:- )?(.+?): `([^`]+)`(?:,? linked to `([^`]+)`\.?)?\s*$/gm)) {
    const raw = m[1].trim();
    const key = raw.replace(/,?\s*linked to `[^`]+`/i, '').trim().toLowerCase().replace(/^exact /, '');
    out[key] = m[2];
    const link = m[3] || (raw.match(/linked to `([^`]+)`/i) || [])[1];
    if (link) out[key + ' link'] = link;
  }
  return out;
}

// Markdown blocks: headings, paragraphs (lines joined), lists, pipe tables,
// block quotes, thematic breaks.
function blocksOf(md, slug) {
  const out = [];
  let para = null;
  let list = null;
  let table = null;
  let quote = null;
  const flush = () => {
    if (para) out.push({ t: 'p', md: para.join(' ') });
    if (list) out.push(list);
    if (table) out.push(table);
    if (quote) out.push({ t: 'quote', md: quote.join(' ') });
    para = list = table = quote = null;
  };
  for (const raw of md.split('\n')) {
    const line = raw.replace(/\s+$/, '');
    let m;
    if (!line.trim()) { flush(); continue; }
    if ((m = line.match(/^(#{1,6})\s+(.+)$/))) { flush(); out.push({ t: 'h', level: m[1].length, md: m[2].trim() }); continue; }
    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(line)) { flush(); out.push({ t: 'hr' }); continue; }
    if ((m = line.match(/^[-*] (.+)$/))) {
      if (!list || list.t !== 'ul') { flush(); list = { t: 'ul', items: [] }; }
      list.items.push(m[1].trim());
      continue;
    }
    if ((m = line.match(/^(\d+)\. (.+)$/))) {
      if (!list || list.t !== 'ol') { flush(); list = { t: 'ol', items: [] }; }
      if (+m[1] !== list.items.length + 1) fail(slug, `ordered list jumps to ${m[1]}`);
      list.items.push(m[2].trim());
      continue;
    }
    if (line.startsWith('|')) {
      if (!table) { flush(); table = { t: 'table', rows: [] }; }
      table.rows.push(line);
      continue;
    }
    if ((m = line.match(/^> ?(.*)$/))) {
      if (!quote) { flush(); quote = []; }
      quote.push(m[1].trim());
      continue;
    }
    if (/^\s/.test(raw)) fail(slug, `unsupported Markdown (indented): ${line.slice(0, 60)}`);
    if (list || table || quote) fail(slug, `text directly after a list, table or quote: ${line.slice(0, 60)}`);
    para = para || [];
    para.push(line.trim());
  }
  flush();
  return out;
}

const cellsOf = (row) => row.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

// ── One article ──────────────────────────────────────────────────────────────
function extract(a) {
  const slug = a.slug;
  const src = fs.readFileSync(path.join(ROOT, a.brief), 'utf8');
  const parts = splitParts(src, slug);
  const report = { blockers: [], resolved: [] };

  // Part 1: the page spec.
  const spec = specOf(parts['1']);
  const url = a.url || '/' + slug + '/';
  if (spec.URL !== ORIGIN + url && spec.URL !== url) fail(slug, `Part 1 URL is ${spec.URL}, expected ${url}`);
  for (const k of ['Title tag', 'Meta description', 'H1']) if (!spec[k]) fail(slug, `Part 1 has no ${k}`);
  const minutes = ((spec['Estimated reading time'] || '').match(/(\d+) minute/) || [])[1];
  if (minutes && !a.readTime.startsWith(minutes + ' ')) fail(slug, `Part 1 says ${minutes} minutes; articles.js says "${a.readTime}"`);

  // Part 3: TOC (if the brief gives one), CTA id, author block, CTA wording
  // (or the close articles.js names), header notes.
  const notes = subsections(parts['3']);
  const need = (t) => notes[t] || fail(slug, `Part 3 has no "### ${t}"`);
  const tocText = notes['Table of contents'] || '';
  const tocLabel = tocText ? (tocText.match(/label:? `([^`]+)`/i) || [])[1] || fail(slug, 'Part 3 TOC has no label') : null;
  const toc = [...tocText.matchAll(/^\|\s*([^|`]+?)\s*\|\s*`#([a-z0-9-]+)`\s*\|$/gm)]
    .map((m) => ({ label: smart(m[1]), id: m[2] }));
  if (tocText && !toc.length) fail(slug, 'Part 3 TOC table is empty');
  // The CTA heading's id, when Part 3 gives one (else one from its words).
  const ctaIdGiven = (tocText.match(/Assign `#([a-z0-9-]+)` to the final commercial CTA H2/)
    || tocText.match(/final CTA the ID `#?([a-z0-9-]+)`/) || [])[1];

  const authorText = need('Author block');
  const af = fieldsOf(authorText);
  const author = {
    name: af['name'],
    href: (af['name link'] || (authorText.match(/Link the (?:author['’]s )?name to `([^`]+)`/) || [])[1] || '').replace(ORIGIN, ''),
    image: a.authorImage,
    width: a.authorImageSize[0],
    height: a.authorImageSize[1],
    alt: af['alt text'],
    credential: af['credential line'] || af['credentials line'] || af['credentials'] || af['credential'],
    background: af['background line'] || af['background'],
  };
  for (const [k, v] of Object.entries(author)) if (!v) fail(slug, `author block: no ${k}`);
  if (/^\[/.test(af.image || '') && !a.authorImage) fail(slug, 'the brief asks for the approved image: set authorImage in articles.js');

  const ctaSpec = notes['Final CTA'] ? fieldsOf(notes['Final CTA']) : {};
  if (!notes['Final CTA'] && a.close !== 'writing') fail(slug, 'no Final CTA in Part 3 and no close in articles.js');
  const ctaId = notes['Final CTA'] ? ctaIdGiven || slugify(ctaSpec.heading || '') : null;
  const ids = toc.map((t) => t.id).concat(notes['Final CTA'] ? [ctaId] : []);
  if ((notes['Final CTA'] && !ctaId) || new Set(ids).size !== ids.length) fail(slug, 'duplicate or missing anchor IDs in Part 3');
  const header = need('Article header');
  for (const v of [a.category, a.type, a.readTime].filter(Boolean)) {
    if (!header.includes(v)) fail(slug, `articles.js says "${v}"; Part 3 Article header does not`);
  }
  const canonical = (header.match(/Canonical URL: `([^`]+)`/) || [])[1];
  if (canonical && canonical !== ORIGIN + url) fail(slug, `Part 3 canonical is ${canonical}`);
  const Q = '[“"`]([^”"`]+)[”"`]';
  const first = (...res) => (res.map((re) => header.match(re)).find(Boolean) || [])[1];
  const deckFull = first(/^> (.+)$/m, /is the deck: `([^`]+)`/);
  const deckStart = first(new RegExp('deck is the paragraph beginning ' + Q), new RegExp('paragraph under the H1, beginning ' + Q + ', is the deck'),
    new RegExp('the deck, the paragraph beginning ' + Q));
  const introStart = first(new RegExp('(?:introduction|body opening) begins ' + Q), new RegExp('paragraph beginning ' + Q + ' starts the article introduction'),
    new RegExp('beginning ' + Q + ' starts the body'));
  const introCount = NUMBERS[((header.match(/\b(one|two|three|four|five|six) (?:opening )?paragraphs\b/i) || [])[1] || '').toLowerCase()];

  // Part 2: the article.
  const blocks = blocksOf(parts['2'], slug);
  const h1 = blocks.shift();
  if (!h1 || h1.t !== 'h' || h1.level !== 1) fail(slug, 'Part 2 does not open with the H1');
  if (smart(h1.md) !== smart(spec.H1)) fail(slug, `Part 2 H1 differs from Part 1:\n  ${h1.md}\n  ${spec.H1}`);
  if (blocks.some((b) => b.t === 'h' && b.level === 1)) fail(slug, 'more than one H1 in Part 2');

  // Placeholders: resolved from articles.js or, while unresolved, left out
  // with their pointer (the sentence that holds one, unless articles.js names
  // the exact text that only leads to the link).
  const links = {};
  for (const [k, v] of Object.entries(a.links || {})) links[straight(k)] = v && typeof v === 'object' ? v : { resolved: v || null };
  const placeholders = (md, where) => {
    let out = md;
    for (const m of md.matchAll(new RegExp(PLACEHOLDER.source, 'g'))) {
      const marker = m[0];
      const cfg = links[straight(m[1])] || fail(slug, `placeholder not listed in articles.js links: "${m[1]}"`);
      const given = cfg.pointer ? straight(cfg.pointer) : null;
      if (given && !(given.includes(marker) && out.includes(given))) fail(slug, `pointer for "${m[1]}" is not in the article with its placeholder`);
      if (cfg.resolved) {
        out = out.replace(given || marker, () => cfg.resolved);
        report.resolved.push({ placeholder: m[1], from: given || marker, to: cfg.resolved });
        continue;
      }
      if (where !== 'p') fail(slug, `unresolved placeholder outside a paragraph: ${md.slice(0, 80)}`);
      const pointer = given || sentencesOf(out).find((s) => s.includes(marker));
      out = out.replace(pointer, ' ').replace(/\s{2,}/g, ' ').trim();
      report.blockers.push({ placeholder: m[1], hidden: pointer.trim() === marker ? null : pointer.trim() });
    }
    return out;
  };

  // Placeholders, typography and links, block by block; inline Markdown checked.
  const text = (md, where) => {
    const out = normaliseLinks(smart(placeholders(md, where)), slug);
    checkInline(out, slug, where);
    return out;
  };

  const intro = [];
  const sections = [];
  let section = null;
  let sub = null;
  let cta = null;
  for (const [i, b] of blocks.entries()) {
    if (b.t === 'hr') {
      // A thematic break that marks the boundary before the CTA (its eyebrow,
      // then its heading) is the CTA band's own edge; anywhere else it is a
      // section break the article keeps.
      const eyebrow = blocks[i + 1];
      const heading = blocks[i + 2];
      if (ctaSpec.heading && eyebrow && eyebrow.t === 'p' && eyebrow.md === ctaSpec.eyebrow && heading && heading.t === 'h' &&
        smart(heading.md) === smart(ctaSpec.heading)) continue;
      if (cta) fail(slug, 'a thematic break inside the CTA');
      (sub ? sub.blocks : section ? section.blocks : intro).push({ t: 'hr' });
      continue;
    }
    if (b.t === 'h' && b.level === 2) {
      const h2 = text(b.md, 'heading');
      sub = null;
      if (h2 === smart(ctaSpec.heading || '')) {
        // The CTA: its eyebrow is the paragraph just before its heading.
        const prev = section && section.blocks[section.blocks.length - 1];
        if (!prev || prev.t !== 'p' || prev.text !== ctaSpec.eyebrow) fail(slug, 'no CTA eyebrow before the CTA heading');
        section.blocks.pop();
        cta = { id: ctaId, eyebrow: prev.text, h2, text: null, button: null };
        section = null;
        continue;
      }
      section = { h2, id: null, blocks: [] };
      sections.push(section);
      continue;
    }
    if (b.t === 'h' && b.level === 3) {
      if (!section) fail(slug, `H3 outside a section: ${b.md}`);
      sub = { t: 'sub', h3: text(b.md, 'heading'), blocks: [] };
      section.blocks.push(sub);
      continue;
    }
    if (b.t === 'h') fail(slug, `unsupported heading level ${b.level}: ${b.md}`);
    let block;
    if (b.t === 'p') {
      const t = text(b.md, 'p');
      if (!t) continue; // a paragraph that was only a pointer to an unresolved link
      block = { t: 'p', text: t };
    } else if (b.t === 'ul' || b.t === 'ol') {
      block = { t: b.t, items: b.items.map((it) => text(it, 'list')) };
    } else if (b.t === 'quote') {
      block = { t: 'quote', text: text(b.md, 'quote') };
    } else {
      const rows = b.rows.map(cellsOf);
      if (rows.length < 3 || !rows[1].every((c) => /^:?-{3,}:?$/.test(c))) fail(slug, 'malformed table');
      const head = rows[0].map((c) => text(c, 'table'));
      const body = rows.slice(2).map((r) => r.map((c) => text(c, 'table')));
      if (body.some((r) => r.length !== head.length)) fail(slug, 'table row with the wrong number of cells');
      block = { t: 'table', head, rows: body };
    }
    if (cta) {
      // After the CTA heading: its copy, then the paragraph that is its link.
      const link = block.t === 'p' && block.text.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link && cta.text) cta.button = { label: link[1], href: link[2] };
      else if (block.t === 'p' && !cta.text) cta.text = block.text;
      else fail(slug, 'unexpected content after the CTA');
      continue;
    }
    if (sub) sub.blocks.push(block);
    else if (section) section.blocks.push(block);
    else intro.push(block);
  }

  // The deck, then the introduction.
  const deck = intro.shift();
  if (!deck || deck.t !== 'p') fail(slug, 'no deck under the H1');
  if (deckFull && deck.text !== smart(deckFull)) fail(slug, 'the deck differs from the one quoted in Part 3');
  if (deckStart && !deck.text.startsWith(smart(deckStart))) fail(slug, 'the deck does not begin as Part 3 says');
  if (introStart && !(intro[0] && plain(intro[0].text).startsWith(smart(introStart)))) fail(slug, 'the introduction does not begin as Part 3 says');
  if (introCount && intro.filter((b) => b.t === 'p').length !== introCount) fail(slug, `the introduction has ${intro.length} paragraphs; Part 3 says ${introCount}`);
  if (intro.some((b) => !['p', 'quote', 'hr'].includes(b.t))) fail(slug, 'the introduction holds more than paragraphs');

  // Sections ↔ the TOC table: same headings, same order; ids from the table.
  // Without a TOC (an essay), each H2 still gets an id from its words.
  const got = sections.map((s) => s.h2);
  if (toc.length && got.join('\n') !== toc.map((t) => t.label).join('\n')) {
    fail(slug, `the H2s and the Part 3 TOC differ:\n  H2s: ${got.join(' | ')}\n  TOC: ${toc.map((t) => t.label).join(' | ')}`);
  }
  const used = new Set();
  sections.forEach((s, i) => {
    let id = toc.length ? toc[i].id : slugify(plain(s.h2));
    for (let n = 2; !toc.length && used.has(id); n++) id = slugify(plain(s.h2)) + '-' + n;
    used.add(s.id = id);
    const subs = s.blocks.filter((b) => b.t === 'sub');
    if (s.blocks.length && subs.length === s.blocks.length && subs.every((q) => /\?$/.test(q.h3))) s.kind = 'faq';
    if (s.blocks.length === 1 && s.blocks[0].t === 'ol') s.kind = 'references';
  });

  // The CTA against Part 3, word for word; or, for an essay, the Writing
  // page's own close from the canonical copy (no new wording).
  let close = null;
  if (notes['Final CTA']) {
    if (!cta || !cta.text || !cta.button) fail(slug, 'the CTA is incomplete');
    if (smart(ctaSpec.copy || '') !== cta.text) fail(slug, 'CTA copy differs from Part 3');
    if (smart(ctaSpec['button label'] || '') !== cta.button.label) fail(slug, 'CTA button label differs from Part 3');
    if ((ctaSpec.destination || '').replace(ORIGIN, '') !== cta.button.href) fail(slug, 'CTA destination differs from Part 3');
  } else {
    if (cta) fail(slug, 'a CTA in Part 2 without its Final CTA spec');
    const window = {};
    // eslint-disable-next-line no-eval
    eval(fs.readFileSync(path.join(ROOT, 'site-copy.jsx'), 'utf8'));
    const writing = window.SITE_COPY.pages.blog.sections.find((s) => s.id === 'contact');
    close = {
      label: writing.h2,
      text: writing.blocks.filter((b) => b.t === 'p').map((b) => b.text).join(' '),
      actions: [].concat(...writing.blocks.filter((b) => b.t === 'ctas').map((b) => b.items)).filter((it) => it.href),
    };
  }

  // A table: named by its caption (a sentence moved from the end of the
  // paragraph before it, or one Part 3 writes, visible or not) or else by its
  // section's H2; described by the paragraph next to it that articles.js
  // names, if any; set for narrow screens as labelled row groups ('stack',
  // the default) or as a table that scrolls inside its own region ('scroll').
  const listsOf = (s) => [s.blocks].concat(s.blocks.filter((b) => b.t === 'sub').map((q) => q.blocks));
  const tables = [];
  sections.forEach((s) => listsOf(s).forEach((list) => list.forEach((b, i) => {
    if (b.t === 'table') tables.push({ t: b, list, i, section: s });
  })));
  if (tables.length > 1) fail(slug, 'more than one table: each needs its own caption and note');
  if (tables.length) {
    const { t, list, i, section: s } = tables[0];
    const cfg = a.table || fail(slug, 'a table needs its caption or note (articles.js table)');
    const before = list[i - 1];
    const after = list[i + 1];
    if (cfg.caption && (cfg.captionFrom || 'paragraph') === 'paragraph') {
      const caption = smart(cfg.caption);
      if (!before || before.t !== 'p' || !before.text.endsWith(' ' + caption)) {
        fail(slug, `the paragraph before the table does not end with "${caption}"`);
      }
      before.text = before.text.slice(0, -caption.length).trim();
      t.caption = caption;
    } else if (cfg.caption) {
      if (!parts['3'].includes('`' + cfg.caption + '`')) fail(slug, `Part 3 does not give the caption "${cfg.caption}"`);
      t.caption = smart(cfg.caption);
    } else {
      t.labelledBy = s.id;
    }
    if (cfg.captionHidden) t.captionHidden = true;
    if (cfg.narrow === 'scroll') t.narrow = 'scroll';
    else if (cfg.narrow && cfg.narrow !== 'stack') fail(slug, `table.narrow is 'stack' or 'scroll', not ${cfg.narrow}`);
    if (cfg.note) {
      const note = [before, after].find((b) => b && b.t === 'p' && plain(b.text).startsWith(smart(cfg.note)));
      if (!note) fail(slug, `no paragraph next to the table begins "${cfg.note}"`);
      note.id = 'table-note';
      t.describedBy = note.id;
    }
    const all = [];
    sections.forEach((x) => listsOf(x).forEach((l) => l.forEach((b) => b.t === 'p' && all.push(plain(b.text)))));
    if (t.caption && !t.captionHidden && all.some((p) => p.includes(t.caption))) fail(slug, 'the caption sentence would be visible twice');
  }

  // The one callout, if the brief asks for one: the final paragraph of its
  // section, beginning as specified.
  if (a.callout) {
    const s = sections.find((x) => x.h2 === smart(a.callout.section)) || fail(slug, `no section "${a.callout.section}"`);
    const last = s.blocks[s.blocks.length - 1];
    if (!last || last.t !== 'p' || !plain(last.text).startsWith(smart(a.callout.startsWith))) {
      fail(slug, `the final paragraph of "${a.callout.section}" does not begin with ${a.callout.startsWith}`);
    }
    last.role = 'callout';
  }

  // Published dates, from articles.js, read as written (never shifted by a
  // time zone): "October 2026". A new article gives its release with a time
  // and offset; an essay brought back keeps the date it was first published,
  // which is all its archived page recorded.
  const monthOf = (iso, what) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})(?:T\d{2}:\d{2}(?::\d{2})?(?:Z|[+-]\d{2}:\d{2}))?$/.exec(iso || '');
    if (!m || (!a.source && iso.length === 10)) fail(slug, `${what} must be ISO 8601 with a time and an offset, e.g. 2026-10-01T09:00:00+01:00`);
    return MONTHS[+m[2] - 1] + ' ' + m[1];
  };
  // The metadata line shows `labels` when the brief fixes it ("Guide · …"),
  // else the category and the type.
  const meta = {
    category: a.category,
    ...(a.type ? { type: a.type } : {}),
    ...(a.labels ? { labels: a.labels } : {}),
    published: a.published,
    publishedLabel: monthOf(a.published, 'published'),
    readTime: a.readTime,
  };
  if (a.modified) {
    if (Date.parse(a.modified) <= Date.parse(a.published)) fail(slug, 'modified must be later than published');
    meta.modified = a.modified;
    meta.modifiedLabel = monthOf(a.modified, 'modified');
  }

  // wordCount over what the brief counts (articles.js wordCount); never the
  // breadcrumb, metadata line, author block, TOC or CTA.
  const scope = new Set(a.wordCount || ['headline', 'deck', 'body', 'references']);
  // (A visually hidden caption is an accessible name, not article text.)
  const textOf = (b) => (b.t === 'p' || b.t === 'quote' ? [b.text] : b.t === 'hr' ? []
    : b.t === 'sub' ? [b.h3].concat(...b.blocks.map(textOf))
      : b.t === 'table' ? [b.captionHidden ? '' : b.caption || ''].concat(b.head, ...b.rows) : b.items);
  const sectionText = (s) => [s.h2].concat(...s.blocks.map(textOf));
  const counted = [].concat(
    scope.has('headline') ? [h1.md] : [],
    scope.has('deck') ? [deck.text] : [],
    scope.has('body') ? [].concat(...intro.map(textOf), ...sections.filter((s) => s.kind !== 'references').map(sectionText)) : [],
    scope.has('references') ? [].concat(...sections.filter((s) => s.kind === 'references').map(sectionText)) : []);
  const wordCount = counted.reduce((n, t) => n + words(plain(t)), 0);

  const page = {
    id: slug,
    url,
    title: smart(spec['Title tag']),
    description: smart(spec['Meta description']),
    h1: smart(h1.md),
    deck: deck.text,
    meta,
    author,
    toc: toc.length ? { label: tocLabel, items: toc } : null,
    intro,
    sections,
    cta,
    ...(close ? { close } : {}),
    wordCount,
  };
  // The listing on /blog/. An essay brought back fills the canonical Featured
  // entry it was listed under (`listing`, that entry's title) rather than
  // adding one of its own.
  const entry = Object.assign({ id: slug, url, h1: page.h1, deck: page.deck, category: meta.category },
    meta.type ? { type: meta.type } : {}, meta.labels ? { labels: meta.labels } : {},
    { published: meta.published, publishedLabel: meta.publishedLabel, readTime: meta.readTime, related: a.related || null },
    a.listing ? { listing: smart(a.listing) } : {});
  return { page, entry, report };
}

// ── Output ───────────────────────────────────────────────────────────────────
// One line per block, so a changed sentence is a one-line diff.
function serialise(page) {
  const j = (v) => JSON.stringify(v);
  const blockLines = (list, ind) => '[\n' + list.map((b) => ind + '  ' + (b.t === 'sub'
    ? j({ t: 'sub', h3: b.h3 }).slice(0, -1) + ', "blocks": ' + blockLines(b.blocks, ind + '  ') + '}'
    : j(b))).join(',\n') + '\n' + ind + ']';
  const lines = [];
  for (const [k, v] of Object.entries(page)) {
    if (k === 'intro') lines.push(`  "intro": ${blockLines(v, '  ')}`);
    else if (k === 'sections') {
      lines.push('  "sections": [\n' + v.map((s) => {
        const head = Object.assign({}, s);
        delete head.blocks;
        return '    ' + j(head).slice(0, -1) + ', "blocks": ' + blockLines(s.blocks, '    ') + '}';
      }).join(',\n') + '\n  ]');
    } else lines.push(`  ${j(k)}: ${j(v)}`);
  }
  return '{\n' + lines.join(',\n') + '\n}';
}

const GENERATED = (brief) => `// GENERATED by scripts/articles/extract-articles.js from ${brief}
// (Part 2 is the editorial source of truth). Change the brief or
// scripts/articles/articles.js and re-run the script, rather than editing it
// here. Only typography differs from the source (typographic apostrophes),
// internal links are root-relative, and unresolved internal-link
// placeholders are left out with their pointers.
`;

function main() {
  const entries = [];
  const blockers = [];
  for (const a of ARTICLES) {
    const { page, entry, report } = extract(a);
    const out = GENERATED(a.brief) +
      '//\n// Shape: { url, title, description, h1, deck, meta, author, toc, intro, sections, cta, wordCount }\n' +
      '//   sections = [{ h2, id, kind?, blocks }]; blocks = p | ul | ol | table | sub (an h3 with its blocks)\n' +
      '// Rendered by site-pages.jsx (renderArticlePage); metadata read by scripts/seo/site-meta.js.\n\n' +
      'window.SITE_ARTICLE_PAGES = window.SITE_ARTICLE_PAGES || {};\n' +
      `window.SITE_ARTICLE_PAGES[${JSON.stringify(a.slug)}] = ${serialise(page)};\n`;
    fs.writeFileSync(path.join(ROOT, dataSource(a)), out);
    entries.push(entry);
    console.log(`wrote ${dataSource(a)}: ${page.sections.length} sections, wordCount ${page.wordCount}`);
    for (const r of report.resolved) console.log(`  link placeholder resolved: ${r.placeholder}\n      → ${r.to}`);
    for (const b of report.blockers) blockers.push(Object.assign({ slug: a.slug }, b));
  }
  // Newest first: the order the listing shows.
  entries.sort((x, y) => Date.parse(y.published) - Date.parse(x.published));
  fs.writeFileSync(path.join(ROOT, INDEX_SOURCE), '// site-articles.jsx — the articles listed on /blog/ (Writing), newest first.\n//\n' +
    GENERATED('content/articles/') + '\n' +
    'window.SITE_ARTICLES = [\n' + entries.map((e) => '  ' + JSON.stringify(e)).join(',\n') + '\n];\n');
  console.log(`wrote ${INDEX_SOURCE}: ${entries.length} article(s)`);
  if (blockers.length) {
    console.log(`\nPUBLICATION BLOCKERS — ${blockers.length} unresolved internal-link placeholder(s), kept out of the pages:`);
    for (const b of blockers) {
      console.log(`  ✗ ${b.slug}: [INTERNAL LINK NEEDED: ${b.placeholder}]` + (b.hidden ? `\n      hidden with it: "${b.hidden}"` : ''));
    }
    console.log('  Resolve each in scripts/articles/articles.js (links) once its page is live.');
  }
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    if (!(e instanceof BriefError)) throw e;
    console.error('extract-articles: ' + e.message);
    process.exit(1);
  }
}

module.exports = { extract, blocksOf, splitParts, plain, words, smart, PLACEHOLDER };
