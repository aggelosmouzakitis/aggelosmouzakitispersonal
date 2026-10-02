// check-articles.js — every published article against its brief.
//
// Builds public/ (scripts/build-public.js), serves it the way Netlify does
// (scripts/seo/netlify-emulator.js) and reads each article page twice:
//
// As a crawler gets it (JavaScript off: the prerendered HTML)
//   - fidelity: block by block, the page carries Part 2 of the brief — every
//     heading, paragraph, list item, table cell, FAQ answer, reference and
//     the CTA, in order, with the same words, the same links (text and
//     destination), the same bold and italic runs. The only differences
//     allowed are the documented ones (scripts/articles/extract-articles.js):
//     typographic apostrophes, root-relative internal links, the caption
//     sentence in the <caption>, and unresolved link placeholders left out
//     with their pointers;
//   - structure: one H1; breadcrumb → metadata line → H1 → deck → author
//     block → TOC → introduction; the exact metadata line, author block and
//     TOC (labels, order, every target an H2 with the brief's id); the table
//     (caption or name, description, header cells both ways); the FAQ in
//     full with no accordion; the numbered references; one CTA with one
//     button, the only booking link in the content;
//   - head: title, description, canonical, og:type article; the BlogPosting
//     (headline, description, author, publisher, dates, en-GB, section, the
//     image the page shows, wordCount recounted from the page); no FAQPage;
//   - no [INTERNAL LINK NEEDED] marker in any published file;
//   - an article that replaces an earlier one: each former URL is a single
//     301 straight to it.
// As a reader gets it (JavaScript on)
//   - no page-level horizontal overflow from 320px to 1280px;
//   - below 640px the table is set as its brief asks: labelled row groups
//     with the column label beside every cell ('stack'), or its columns kept
//     in a labelled, focusable region that scrolls ('scroll'); its text is
//     never shrunk to fit;
//   - every TOC link lands its heading at the top of the viewport, with
//     scrolling smooth only for readers who have not asked for less motion;
//   - the header marks Writing as the article's section.
//
// Unresolved placeholders are listed as PUBLICATION BLOCKERS: not an error
// (the page ships without them), but each must be resolved before release.
//
//   node scripts/articles/check-articles.js     # exit 1 on any error

const fs = require('fs');
const path = require('path');
const { ARTICLES, ORIGIN, dataBundle, INDEX_BUNDLE } = require('./articles.js');
const { extract, blocksOf, splitParts, plain, words } = require('./extract-articles.js');
const { build: buildPublic } = require('../build-public.js');
const { serve, PUBLIC } = require('../seo/netlify-emulator.js');
const { PERSON_ID } = require('../seo/site-meta.js');

let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const ROOT = path.resolve(__dirname, '..', '..');
const PORT = 8125;
const BASE = `http://localhost:${PORT}`;
const MARKER = /INTERNAL LINK NEEDED/;

// The first response for a URL: its status and where it redirects.
const status = (u) => new Promise((resolve) => require('http').get(u, (res) => {
  res.resume();
  resolve({ status: res.statusCode, location: res.headers.location });
}).on('error', () => resolve({ status: 0 })));

const errors = [];
const archived = {}; // essays proven word for word against the archive: slug → words
const err = (slug, msg) => errors.push(`${slug} — ${msg}`);
const norm = (s) => String(s).replace(/[’‘]/g, "'").replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
const relative = (href) => (href.startsWith(ORIGIN + '/') ? href.slice(ORIGIN.length) : href);

// ── What Part 2 says, block by block ─────────────────────────────────────────
// Inline runs of one Markdown string: its text, links, bold and italic.
function runs(md) {
  const links = [...md.matchAll(/\[([^\]]*)\]\(([^)\s]+)\)/g)].map((m) => ({ text: norm(plain(m[1])), href: relative(m[2]) }));
  const noLinks = md.replace(/\[([^\]]*)\]\(([^)\s]+)\)/g, '$1');
  const strong = [...noLinks.matchAll(/\*\*([^*]+)\*\*/g)].map((m) => norm(m[1]));
  const em = [...noLinks.replace(/\*\*([^*]+)\*\*/g, '$1').matchAll(/\*([^*]+)\*/g)].map((m) => norm(m[1]));
  return { text: norm(plain(md)), links, strong, em };
}

function expected(a, report) {
  let src = fs.readFileSync(path.join(ROOT, a.brief), 'utf8');
  // A link to a merged page goes straight to where it now 301s (relink).
  for (const [from, to] of Object.entries(a.relink || {})) src = src.split('](' + from + ')').join('](' + to + ')');
  // Contextual links the site adds (contextLinks): the phrase, linked, in Part 2.
  for (const [phrase, href] of a.contextLinks || []) {
    const cut = src.indexOf('## PART 3');
    src = src.slice(0, cut).replace(phrase, '[' + phrase + '](' + href + ')') + src.slice(cut);
  }
  const blocks = blocksOf(splitParts(src, a.slug)['2'], a.slug);
  // The documented differences: resolved placeholders become their links,
  // unresolved ones are hidden with their pointers, a caption sentence moves
  // into the table, a caption Part 3 writes joins it, and the thematic break
  // before the CTA is the CTA band's own edge.
  const hidden = report.blockers.map((b) => norm(b.hidden || `[INTERNAL LINK NEEDED: ${b.placeholder}]`));
  const out = [];
  const cfg = a.table || {};
  const moved = cfg.caption && (cfg.captionFrom || 'paragraph') === 'paragraph' ? norm(cfg.caption) : null;
  blocks.forEach((b, i) => {
    if (b.t === 'hr') return;
    if (b.t === 'h') { out.push(Object.assign({ kind: 'h' + b.level }, runs(b.md))); return; }
    if (b.t === 'quote') { out.push(Object.assign({ kind: 'p' }, runs(b.md))); return; }
    if (b.t === 'p') {
      let raw = b.md;
      for (const r of report.resolved) raw = raw.split(r.from).join(r.to);
      let md = norm(raw);
      for (const h of hidden) if (md.includes(h)) md = norm(md.replace(h, ' '));
      if (!md) return;
      const next = blocks[i + 1];
      if (moved && next && next.t === 'table' && md.endsWith(' ' + moved)) {
        out.push(Object.assign({ kind: 'p' }, runs(md.slice(0, -moved.length))));
        out.push(Object.assign({ kind: 'caption' }, runs(moved)));
        return;
      }
      const button = md.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (button && i === blocks.length - 1) { out.push({ kind: 'button', text: norm(button[1]), links: [], strong: [], em: [], href: relative(button[2]) }); return; }
      out.push(Object.assign({ kind: 'p' }, runs(md)));
      return;
    }
    if (b.t === 'ul' || b.t === 'ol') { b.items.forEach((it) => out.push(Object.assign({ kind: 'li' }, runs(it)))); return; }
    if (cfg.caption && cfg.captionFrom === 'brief') out.push(Object.assign({ kind: 'caption' }, runs(cfg.caption)));
    const rows = b.rows.map((r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
    rows[0].forEach((c) => out.push(Object.assign({ kind: 'th' }, runs(c))));
    rows.slice(2).forEach((r) => r.forEach((c, j) => out.push(Object.assign({ kind: j ? 'td' : 'th' }, runs(c)))));
  });
  return out;
}

// ── What the page carries, block by block (run in the page) ──────────────────
function pageBlocks() {
  const SKIP = 'nav.art-crumbs, p.art-meta, .art-author, nav.art-toc';
  const norm = (s) => String(s).replace(/[’‘]/g, "'").replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
  const text = (el) => {
    const c = el.cloneNode(true);
    c.querySelectorAll('[aria-hidden="true"]').forEach((x) => x.remove());
    return norm(c.textContent);
  };
  const scope = [document.querySelector('article.art'), document.querySelector('section.art-cta')].filter(Boolean);
  const out = [];
  for (const root of scope) {
    for (const el of root.querySelectorAll('h1, h2, h3, p, li, caption, th, td, a.btn')) {
      if (el.closest(SKIP)) continue;
      const kind = el.matches('a.btn') ? 'button' : el.tagName.toLowerCase();
      out.push({
        kind,
        text: text(el),
        href: kind === 'button' ? el.getAttribute('href') : undefined,
        links: kind === 'button' ? [] : [...el.querySelectorAll('a')].map((x) => ({ text: text(x), href: x.getAttribute('href') })),
        strong: [...el.querySelectorAll('strong')].map(text),
        em: [...el.querySelectorAll('em')].map(text),
      });
    }
  }
  return out;
}

// An essay brought back: the words of its archived page (title, standfirst,
// body), in order. Conversion debris ("_ **", "##") has no letters, so it
// drops out; quotes are compared as quotes, whatever their shape.
const decodeHtml = (s) => s.replace(/&#(\d+);/g, (m, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi, (m, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const tokens = (s) => norm(s).replace(/[“”]/g, '"').split(' ').filter((w) => /[\p{L}\p{N}]/u.test(w));
function archiveTokens(a) {
  const html = fs.readFileSync(path.join(ROOT, a.source), 'utf8');
  const pick = (re) => (html.match(re) || [])[1] || '';
  const body = html.slice(html.indexOf('<article'), html.indexOf('</article>'));
  return tokens(decodeHtml([pick(/<h1 class="article-title">([\s\S]*?)<\/h1>/), pick(/<p class="article-desc">([\s\S]*?)<\/p>/),
    body.replace(/<\/?(?:strong|em|b|i|a|span)\b[^>]*>/g, '').replace(/<[^>]+>/g, ' ')].join(' ')));
}

function compareBlocks(slug, want, got) {
  const show = (b) => (b ? `${b.kind}: "${b.text.slice(0, 80)}"` : '(nothing)');
  const n = Math.max(want.length, got.length);
  let reported = 0;
  for (let i = 0; i < n && reported < 8; i++) {
    const w = want[i];
    const g = got[i];
    const same = w && g && w.kind === g.kind && w.text === g.text && (w.href || '') === (g.href || '') &&
      JSON.stringify(w.links) === JSON.stringify(g.links) &&
      JSON.stringify(w.strong) === JSON.stringify(g.strong) && JSON.stringify(w.em) === JSON.stringify(g.em);
    if (same) continue;
    reported++;
    let why = '';
    if (w && g && w.kind === g.kind && w.text === g.text) {
      why = JSON.stringify(w.links) !== JSON.stringify(g.links) ? `links ${JSON.stringify(g.links)} ≠ ${JSON.stringify(w.links)}`
        : JSON.stringify(w.strong) !== JSON.stringify(g.strong) ? `bold ${JSON.stringify(g.strong)} ≠ ${JSON.stringify(w.strong)}`
          : JSON.stringify(w.em) !== JSON.stringify(g.em) ? `italic ${JSON.stringify(g.em)} ≠ ${JSON.stringify(w.em)}` : `href ${g.href} ≠ ${w.href}`;
    }
    err(slug, `block ${i + 1} differs from the brief${why ? ' (' + why + ')' : ''}\n      brief: ${show(w)}\n      page:  ${show(g)}`);
  }
  return n;
}

// ── One article ──────────────────────────────────────────────────────────────
async function checkArticle(browser, a) {
  const slug = a.slug;
  const { page: art, report } = extract(a);
  const url = BASE + art.url;

  // As a crawler gets it.
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const p = await ctx.newPage();
  const res = await p.goto(url);
  if (!res || res.status() !== 200) { err(slug, `${art.url} returns ${res && res.status()}`); await ctx.close(); return; }

  const want = expected(a, report);
  const got = await p.evaluate(pageBlocks);
  const n = compareBlocks(slug, want, got);
  if (a.source) {
    const was = archiveTokens(a);
    const now = tokens(got.map((b) => b.text).join(' '));
    const at = was.findIndex((w, i) => w !== now[i]);
    if (at >= 0 || was.length !== now.length) {
      const i = at >= 0 ? at : Math.min(was.length, now.length);
      err(slug, `differs from its archived text (${a.source}) at word ${i + 1}:\n      archive: ${was.slice(Math.max(0, i - 5), i + 6).join(' ')}\n      page:    ${now.slice(Math.max(0, i - 5), i + 6).join(' ')}`);
    } else archived[slug] = was.length;
  }

  const s = await p.evaluate(() => {
    const q = (sel) => document.querySelector(sel);
    const qa = (sel) => [...document.querySelectorAll(sel)];
    const t = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : null);
    const order = (...sels) => sels.map((x) => q(x)).every((el, i, all) => el && (i === 0 || (all[i - 1].compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)));
    const h1 = qa('h1');
    const toc = q('nav.art-toc');
    const tocLabel = toc && document.getElementById(toc.getAttribute('aria-labelledby'));
    const table = q('.art-table');
    const desc = table && document.getElementById(table.getAttribute('aria-describedby'));
    const named = table && table.getAttribute('aria-labelledby') && document.getElementById(table.getAttribute('aria-labelledby'));
    const ld = qa('script[type="application/ld+json"]').map((x) => x.textContent);
    const head = (sel, attr) => { const el = document.head.querySelector(sel); return el ? el.getAttribute(attr) : null; };
    const words = (els) => els.map((el) => el.textContent).join(' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
    // (a visually hidden caption names the table; it is not article text)
    const blocks = (root) => (root ? [...root.querySelectorAll('h2, h3, p, li, caption:not(.sp-vh), th, td')] : []);
    const refsSec = q('.art-sec--references');
    const bodyEls = [...qa('.art-body > .flow p'), ...qa('.art-body > .art-sec:not(.art-sec--references)').flatMap(blocks)];
    const ids = qa('[id]').map((el) => el.id);
    return {
      h1: h1.map(t),
      h1Next: h1[0] && h1[0].nextElementSibling ? h1[0].nextElementSibling.className : null,
      order: order(...['nav.art-crumbs', 'p.art-meta', 'h1', 'p.art-deck', '.art-author', 'nav.art-toc', '.art-body p'].filter((x) => x !== 'nav.art-toc' || q(x))),
      crumbs: qa('nav.art-crumbs a').map((x) => [x.getAttribute('href'), t(x)]),
      meta: t(q('p.art-meta')),
      times: qa('p.art-meta time').map((x) => x.getAttribute('datetime')),
      img: q('.art-author img') && [q('.art-author img').getAttribute('src'), q('.art-author img').getAttribute('alt')],
      authorLink: q('.art-author__name a') && [q('.art-author__name a').getAttribute('href'), t(q('.art-author__name a'))],
      authorLines: qa('.art-author__line').map(t),
      tocLabel: t(tocLabel),
      toc: qa('nav.art-toc li a').map((x) => [x.getAttribute('href'), t(x)]),
      h2s: qa('article.art h2').map((x) => [x.id, t(x)]),
      cta: { eyebrow: t(q('.art-cta .close__label')), h2: q('.art-cta h2') && [q('.art-cta h2').id, t(q('.art-cta h2'))], links: qa('.art-cta a').map((x) => [x.getAttribute('href'), t(x).replace(/\s*→$/, '')]) },
      close: q('main section.close:not(.art-cta)') && { label: t(q('main section.close:not(.art-cta) .close__label')), text: t(q('main section.close:not(.art-cta) .close__text')),
        links: qa('main section.close:not(.art-cta) a').map((x) => [x.getAttribute('href'), t(x).replace(/\s*→$/, '')]) },
      booking: qa('main a[href="/contact/"]').length,
      dupIds: ids.filter((x, i) => ids.indexOf(x) !== i),
      table: table && {
        caption: t(table.querySelector('caption')),
        captionHidden: !!table.querySelector('caption.sp-vh'),
        describedBy: t(desc),
        labelledBy: named ? named.tagName + '#' + named.id : null,
        cols: table.querySelectorAll('thead th[scope="col"]').length,
        rows: table.querySelectorAll('tbody tr').length,
        rowHeaders: table.querySelectorAll('tbody th[scope="row"]').length,
        roles: !!table.querySelector('[role="columnheader"]') && !!table.querySelector('[role="rowheader"]') && !!table.querySelector('[role="cell"]'),
        // the scrolling region: [role, its name, focusable]
        region: table.parentElement.matches('.art-table-scroll')
          ? [table.parentElement.getAttribute('role'), t(document.getElementById(table.parentElement.getAttribute('aria-labelledby'))), table.parentElement.getAttribute('tabindex')]
          : null,
      },
      faq: q('.art-sec--faq') ? q('.art-sec--faq').querySelectorAll('h3').length : 0,
      accordions: qa('main details, main summary').length,
      refs: refsSec ? refsSec.querySelectorAll('ol > li').length : 0,
      words: {
        headline: words(h1),
        deck: words(qa('p.art-deck')),
        body: words(bodyEls),
        references: words(blocks(refsSec)),
      },
      title: document.title,
      description: head('meta[name="description"]', 'content'),
      canonical: head('link[rel="canonical"]', 'href'),
      ogType: head('meta[property="og:type"]', 'content'),
      published: head('meta[property="article:published_time"]', 'content'),
      modified: head('meta[property="article:modified_time"]', 'content'),
      ld,
      html: document.documentElement.outerHTML,
    };
  });
  await ctx.close();

  const eq = (what, got, want) => { if (JSON.stringify(got) !== JSON.stringify(want)) err(slug, `${what}: ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`); };
  eq('H1s', s.h1, [art.h1]);
  eq('element after the H1', s.h1Next, 'lead art-deck');
  if (!s.order) err(slug, 'header order is not breadcrumb → metadata → H1 → deck → author → TOC → introduction');
  eq('breadcrumb', s.crumbs, [['/blog/', 'Writing']]);
  const metaLine = (art.meta.labels || [art.meta.category, art.meta.type].filter(Boolean)).concat(art.meta.publishedLabel, art.meta.readTime).join(' · ') +
    (art.meta.modified ? ` · Updated ${art.meta.modifiedLabel}` : '');
  eq('metadata line', s.meta, metaLine);
  eq('metadata dates', s.times, [art.meta.published].concat(art.meta.modified ? [art.meta.modified] : []));
  eq('author image', s.img, [art.author.image, art.author.alt]);
  eq('author name', s.authorLink, [art.author.href, art.author.name]);
  eq('author lines', s.authorLines, [art.author.credential, art.author.background]);
  eq('TOC label', s.tocLabel, art.toc ? art.toc.label : null);
  eq('TOC', s.toc, art.toc ? art.toc.items.map((it) => ['#' + it.id, it.label]) : []);
  eq('H2 ids', s.h2s, art.sections.map((x) => [x.id, x.h2]));
  if (art.cta) {
    eq('CTA', s.cta, { eyebrow: art.cta.eyebrow, h2: [art.cta.id, art.cta.h2], links: [[art.cta.button.href, art.cta.button.label]] });
    eq('closes', s.close, null);
  } else {
    eq('close (the Writing page’s)', s.close, { label: art.close.label, text: art.close.text,
      links: art.close.actions.map((it) => [it.href, it.label]) });
    eq('CTA', s.cta.links, []);
  }
  eq('booking links in the content', s.booking, 1);
  eq('duplicate ids', s.dupIds, []);
  const tbl = [];
  art.sections.forEach((x) => x.blocks.forEach((b) => { if (b.t === 'table') tbl.push(b); if (b.t === 'sub') b.blocks.forEach((c) => c.t === 'table' && tbl.push(c)); }));
  if (tbl.length) {
    const t = tbl[0];
    const desc = t.describedBy && art.sections.flatMap((x) => x.blocks.flatMap((b) => (b.t === 'sub' ? b.blocks : [b]))).find((b) => b.id === t.describedBy);
    eq('table', s.table, {
      caption: t.caption || null,
      captionHidden: !!t.captionHidden,
      describedBy: desc ? plain(desc.text) : null,
      labelledBy: t.labelledBy ? 'H2#' + t.labelledBy : null,
      cols: t.head.length, rows: t.rows.length, rowHeaders: t.rows.length, roles: true,
      region: t.narrow === 'scroll' ? ['region', t.caption || art.sections.find((x) => x.id === t.labelledBy).h2, '0'] : null,
    });
  }
  const notice = art.sections.find((x) => x.kind === 'notice');
  if (notice && !s.html.includes(`<section class="art-sec art-sec--notice"><h2 class="h2" id="${notice.id}">`)) err(slug, `the "${notice.h2}" section is not in the notice treatment`);
  const faq = art.sections.find((x) => x.kind === 'faq');
  eq('FAQ questions', s.faq, faq ? faq.blocks.length : 0);
  eq('accordions', s.accordions, 0);
  const refs = art.sections.find((x) => x.kind === 'references');
  eq('references', s.refs, refs ? refs.blocks[0].items.length : 0);

  // Head and structured data.
  eq('title', s.title, art.title);
  eq('meta description', s.description, art.description);
  eq('canonical', s.canonical, ORIGIN + art.url);
  eq('og:type', s.ogType, 'article');
  eq('article:published_time', s.published, art.meta.published);
  eq('article:modified_time', s.modified, art.meta.modified || null);
  // An article that replaces an earlier one: each former URL, with or
  // without its trailing slash, is one 301 straight here.
  for (const from of a.replaces || []) {
    for (const u of [from, from.replace(/\/$/, '')]) {
      const r = await status(BASE + u);
      if (r.status !== 301 || r.location !== art.url) err(slug, `${u} answers ${r.status}${r.location ? ' → ' + r.location : ''}, expected one 301 to ${art.url}`);
    }
  }
  const graph = [].concat(...s.ld.map((x) => JSON.parse(x)['@graph'] || []));
  const posts = graph.filter((x) => x['@type'] === 'BlogPosting');
  if (graph.some((x) => x['@type'] === 'FAQPage')) err(slug, 'FAQPage structured data');
  if (posts.length !== 1) err(slug, `${posts.length} BlogPosting entities`);
  else {
    const bp = posts[0];
    const scope = new Set(a.wordCount || ['headline', 'deck', 'body', 'references']);
    const pageWords = [...scope].reduce((sum, k) => sum + s.words[k], 0);
    eq('BlogPosting', bp, Object.assign({
      '@type': 'BlogPosting', '@id': ORIGIN + art.url + '#article', url: ORIGIN + art.url, mainEntityOfPage: ORIGIN + art.url,
      headline: art.h1, description: art.description,
      author: Object.assign({ '@type': 'Person', '@id': PERSON_ID, name: art.author.name, url: ORIGIN + art.author.href },
        a.schemaImage === 'author' ? { image: ORIGIN + art.author.image } : {}),
      publisher: { '@id': PERSON_ID },
      datePublished: art.meta.published,
    }, art.meta.modified ? { dateModified: art.meta.modified } : a.schemaModified === 'published' ? { dateModified: art.meta.published } : {}, {
      inLanguage: a.inLanguage || 'en-GB', articleSection: art.meta.category,
    }, a.schemaImage === 'none' || a.schemaImage === 'author' ? {} : { image: ORIGIN + art.author.image }, {
      wordCount: pageWords,
    }));
    // One Person: the author is the site's Person entity, and no other node
    // describes it differently.
    if (graph.some((x) => x['@id'] === PERSON_ID)) err(slug, 'a second node for the site’s Person beside the author');
  }

  // No placeholder marker in anything published for this page.
  if (MARKER.test(s.html)) err(slug, 'an [INTERNAL LINK NEEDED] marker is in the page');
  for (const f of [dataBundle(a), INDEX_BUNDLE]) {
    if (MARKER.test(fs.readFileSync(path.join(PUBLIC, f), 'utf8'))) err(slug, `an [INTERNAL LINK NEEDED] marker is in ${f}`);
  }

  // As a reader gets it.
  for (const width of [320, 375, 414, 768, 1024, 1280]) {
    const c = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await c.route(/googletagmanager|emailjs/, (r) => r.fulfill({ body: '' }));
    const pg = await c.newPage();
    await pg.goto(url, { waitUntil: 'load' });
    await pg.waitForFunction(() => document.querySelector('main section.close .btn'));
    const r = await pg.evaluate(() => {
      const over = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const cells = [...document.querySelectorAll('.art-table tbody th, .art-table tbody td')];
      const labels = cells.map((el) => [getComputedStyle(el, '::before').content, el.getAttribute('data-label')]);
      const thead = document.querySelector('.art-table thead');
      const region = document.querySelector('.art-table-scroll');
      return {
        over,
        mode: document.querySelector('.art-table--scroll') ? 'scroll' : document.querySelector('.art-table--fit') ? 'fit' : document.querySelector('.art-table') ? 'stack' : null,
        aligned: [...document.querySelectorAll('.art-table .art-num--right')].every((el) => getComputedStyle(el).textAlign === 'right'),
        labelled: cells.length > 0 && labels.every(([content, label]) => content.includes(JSON.stringify(label))),
        theadShown: thead ? thead.getBoundingClientRect().height > 2 : null,
        scrolls: region ? region.scrollWidth > region.clientWidth : null,
        fontPx: cells.length ? parseFloat(getComputedStyle(cells[cells.length - 1]).fontSize) : null,
        section: [
          !!document.querySelector('.hdr__btn.is-current'),
          [...document.querySelectorAll('.hdr__panel a, .mmenu__links a')].filter((x) => x.getAttribute('aria-current') === 'true').map((x) => x.getAttribute('href')),
        ],
      };
    });
    if (r.over > 0) err(slug, `${width}px: page overflows horizontally by ${r.over}px`);
    if (r.mode === 'stack' && width < 640 && (r.theadShown || !r.labelled)) err(slug, `${width}px: the table is not set as labelled row groups`);
    if (r.mode === 'scroll' && width < 640 && (!r.theadShown || !r.scrolls)) err(slug, `${width}px: the table does not keep its columns and scroll in its region`);
    if (r.mode && width >= 768 && r.theadShown === false) err(slug, `${width}px: the table header row is hidden`);
    if (r.mode === 'scroll' && width >= 768 && r.scrolls) err(slug, `${width}px: the table scrolls where it should fit`);
    if (r.mode === 'fit' && !r.theadShown) err(slug, `${width}px: the table header row is hidden`);
    if (!r.aligned) err(slug, `${width}px: a right-aligned column is not right-aligned`);
    if (r.fontPx !== null && r.fontPx < 15) err(slug, `${width}px: table text shrunk to ${r.fontPx}px`);
    if (width === 1280) {
      eq('header section', r.section, [true, ['/blog/', '/blog/']]);
      // Every TOC link lands its heading at the top, instantly (reduced motion).
      const behaviour = await pg.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
      if (behaviour !== 'auto') err(slug, `scroll-behavior is ${behaviour} for a reader who asked for reduced motion`);
      for (const it of art.toc ? art.toc.items : []) {
        await pg.click(`nav.art-toc a[href="#${it.id}"]`);
        await pg.waitForTimeout(60);
        const top = await pg.evaluate((id) => document.getElementById(id).getBoundingClientRect().top, it.id);
        if (top < 0 || top > 60) err(slug, `TOC "${it.label}" lands its heading ${Math.round(top)}px from the top`);
        await pg.evaluate(() => window.scrollTo(0, 0));
      }
    }
    await c.close();
  }
  const c2 = await browser.newContext({ reducedMotion: 'no-preference' });
  const pg2 = await c2.newPage();
  await pg2.goto(url, { waitUntil: 'load' });
  const smooth = await pg2.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
  if (smooth !== 'smooth') err(slug, `scroll-behavior is ${smooth} without a reduced-motion preference`);
  await c2.close();

  console.log(`${errors.some((e) => e.startsWith(slug + ' ')) ? 'ERR' : 'OK '} ${art.url.padEnd(20)} ${n} blocks against the brief, ` +
    `${art.toc ? art.toc.items.length + ' TOC targets' : 'no TOC'}, wordCount ${art.wordCount}` +
    (archived[slug] ? `, ${archived[slug]} words as archived` : ''));
  return report.blockers.map((b) => Object.assign({ slug }, b));
}

(async () => {
  buildPublic();
  const server = serve(PUBLIC);
  await new Promise((r) => server.listen(PORT, r));
  const browser = await chromium.launch();
  const blockers = [];
  try {
    for (const a of ARTICLES) blockers.push(...(await checkArticle(browser, a)));
  } finally {
    await browser.close();
    server.close();
  }
  if (blockers.length) {
    console.log(`\nPUBLICATION BLOCKERS — ${blockers.length} unresolved internal-link placeholder(s), kept out of the pages:`);
    for (const b of blockers) console.log(`  ✗ ${b.slug}: [INTERNAL LINK NEEDED: ${b.placeholder}]` + (b.hidden ? `\n      hidden with it: "${b.hidden}"` : ''));
    console.log('  Resolve each in scripts/articles/articles.js once its page is live, before release.');
  }
  if (errors.length) {
    console.log(`\n${errors.length} error(s):`);
    for (const e of errors) console.log('  ✗ ' + e);
    process.exit(1);
  }
  console.log(`\n✓ ${ARTICLES.length} article(s) match their briefs`);
})().catch((e) => { console.error(e); process.exit(1); });
