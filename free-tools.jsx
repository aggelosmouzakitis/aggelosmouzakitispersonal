// free-tools.jsx — the /free-tools/ collection page.
//
// Free Tools is the site's primary discovery destination: every free
// interactive resource lives here (diagnostics, roasts, sales/pricing/decision
// tools, exercises). "Clarity tool" stays as the TYPE of the five live
// self-scoring diagnostics — Free Tools is the section that contains them.
//
// Design source: the supplied Editorial Japandi Free Tools page. Chrome
// (header, footer, grain, palette, focus rings, .pill--green) comes from
// site-chrome.js; only the page-specific rules live in FREE_TOOLS_CSS, and the
// conceptual diagrams are inline SVG so the page ships no extra assets.
//
// Interactive parts:
//   • category filter (All / Business / Career / Psychology) — native buttons,
//     aria-pressed, live region announcing the result count
//   • five live tools linking to /free-tools/<slug>/
//   • per-tool "coming soon" email capture posting through the site's existing
//     EmailJS + Google Apps Script plumbing, tagged with the tool identifier

var e = React.createElement;
var R = React;

// ── Submission plumbing ──────────────────────────────────────────────────────
// Waitlist sign-ups go through the shared path in lead-capture.js, same as the
// contact form, WTF Friday and the clarity tools: one subject format, one
// header block, one row in the sheet.
var FT_EMAILJS_TEMPLATE = 'template_wdsrbdo';
if (typeof window !== 'undefined' && window.emailjs) {
  try { emailjs.init({ publicKey: 'bfBcHLXj2nKaev_lT' }); } catch (err) {}
}

var ASK_URL = '/ask-me-anything/';

// ── Analytics (existing gtag; no-op if absent) ───────────────────────────────
function ftTrack(name, params) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') window.gtag('event', name, params || {});
  } catch (err) { /* noop */ }
}

// Pragmatic address check on top of the browser's own type="email" validation.
function ftValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim());
}

// Waitlist submission — the tool identifier is what makes the notification and
// the sheet row say which tool this person is waiting for.
function ftSubmitInterest(tool, email, done) {
  if (typeof window === 'undefined' || typeof window.submitLead !== 'function') { done(false); return; }
  window.submitLead({
    source: 'tool-waitlist',
    detail: tool.id,
    detailLabel: tool.title,
    name: '',
    email: email,
    notes: 'Wants to be told when "' + tool.title + '" is ready.',
    body: 'Waiting on: ' + tool.title + ' (' + tool.id + ')',
    template: FT_EMAILJS_TEMPLATE,
    // Keep template_wdsrbdo's own fields populated so it renders as it always has.
    params: {
      overall_grade: 'Free tool waitlist — ' + tool.title,
      overall_score: tool.id,
      section_breakdown: 'Waitlist sign-up. No assessment taken.',
      all_answers: 'Waiting on: ' + tool.title + ' (' + tool.id + ')',
    },
  }, function (ok) { done(ok); });
}

// ─── Tool diagram motion ─────────────────────────────────────────────────────
// From Tool Diagram.dc.html. Each live tool's drawing tells its story once, on
// first entrance, in 600–700ms. The drawings themselves are unchanged — they
// are the site's graphic language already; this only animates them.
//
// Coming-soon diagrams stay static: they have no story to tell yet, and five
// narratives in one viewport would compete.
var FT_DUR = { 'business-constraint': 620, 'strategy-or-execution': 600, 'quit-your-job': 640,
               'become-a-solopreneur': 680, 'burned-out': 700 };
// [x, y, targetHeight, targetOpacity] — bar 0 is the green "before" reference.
var FT_BURN = [[4, 12, 80, 1], [36, 20, 72, 0.62], [68, 30, 62, 0.52], [100, 42, 50, 0.44],
               [132, 54, 38, 0.36], [164, 64, 28, 0.28], [196, 74, 18, 0.22], [228, 82, 10, 0.16], [260, 88, 4, 0.12]];

function ftDrive(root, id) {
  var M = window.Motion;
  if (!M || !FT_DUR[id]) return null;
  var q = function (k) { return root.querySelector('[data-el="' + k + '"]'); };
  var el = {};
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'p', 'out', 'tint', 'r0', 'r1', 'r2', 'r3', 'r4', 'r5',
   'b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8'].forEach(function (k) { el[k] = q(k); });
  var set = function (n, k, v) { if (n) n.setAttribute(k, v); };
  // One dash pair per length: stroke-dashoffset is the only thing that moves.
  var draw = function (n, len, prog) {
    if (!n) return;
    set(n, 'stroke-dasharray', (len + 2).toFixed(1));
    set(n, 'stroke-dashoffset', ((len + 2) * (1 - prog)).toFixed(2));
  };
  var seg = function (ms, a, d, ease) { return M.win(ms, a, d, ease); };

  return function paint(t, h) {
    var ms = t * FT_DUR[id];
    if (id === 'business-constraint') {
      // Inputs converge, the bottleneck appears, then one clean line out.
      var i1 = seg(ms, 0, 300), i2 = seg(ms, 40, 300), i3 = seg(ms, 80, 300);
      draw(el.a, 162.4, i1); draw(el.e, 162.4, i1);
      draw(el.b, 153.4, i2); draw(el.d, 153.4, i2);
      draw(el.c, 150, i3);
      var fp = seg(ms, 300, 120);
      set(el.f, 'y', (52 - 22 * fp).toFixed(2)); set(el.f, 'height', (44 * fp).toFixed(2));
      var gx = 300 + 12 * h;
      set(el.g, 'd', 'M170 52 H' + gx.toFixed(1));
      draw(el.g, gx - 170, seg(ms, 380, 240));
    } else if (id === 'strategy-or-execution') {
      // The plan draws, the doing draws over it, then the gap resolves.
      draw(el.a, 416, seg(ms, 0, 300));
      draw(el.b, 150, seg(ms, 120, 180));
      draw(el.c, 416, seg(ms, 220, 260));
      draw(el.d, 150, seg(ms, 300, 200));
      var mv = seg(ms, 220, 300);
      set(el.g, 'transform', 'translate(' + (14 * (1 - mv)).toFixed(2) + ' 0)');
      set(el.tint, 'fill-opacity', (0.07 * seg(ms, 440, 160)).toFixed(3));
      set(el.c, 'stroke-width', (1.6 + 0.4 * h).toFixed(2));
      var sq = 8 * seg(ms, 460, 140) + 2 * h;
      set(el.e, 'x', (156 - sq / 2).toFixed(2)); set(el.e, 'y', (38 - sq / 2).toFixed(2));
      set(el.e, 'width', sq.toFixed(2)); set(el.e, 'height', sq.toFixed(2));
    } else if (id === 'quit-your-job') {
      // The road in, the decision node, then the ways on, staggered.
      draw(el.a, 130, seg(ms, 0, 300));
      set(el.e, 'r', (5 * seg(ms, 260, 120) + 1.5 * h).toFixed(2));
      draw(el.c, 132, seg(ms, 340, 240));
      draw(el.b, 137.9, seg(ms, 380, 240));
      draw(el.d, 137.9, seg(ms, 400, 240));
      var fork = 'rgba(23,25,25,' + (0.34 + 0.16 * h).toFixed(3) + ')';
      [el.b, el.c, el.d].forEach(function (n) { set(n, 'stroke', fork); });
    } else if (id === 'become-a-solopreneur') {
      // The repeated row resolves, then one element leaves the system.
      [0, 1, 2, 3, 4, 5].forEach(function (i) { draw(el['r' + i], 88, seg(ms, i * 45, 180)); });
      var s = 88 * seg(ms, 360, 320, M.travel);
      var cx = s <= 34 ? 185 + s : 219, cy = s <= 34 ? 81 : 81 - (s - 34);
      cx += 3 * h; cy -= 3 * h;
      var sp = Math.min(71, s);
      set(el.p, 'd', sp <= 0.01 ? 'M185 81' : sp <= 34 ? 'M185 81 H' + (185 + sp).toFixed(2)
        : 'M185 81 H219 V' + (81 - (sp - 34)).toFixed(2));
      set(el.out, 'x', (cx - 11).toFixed(2)); set(el.out, 'y', (cy - 11).toFixed(2));
      set(el.out, 'opacity', seg(ms, 360, 80).toFixed(3));
    } else if (id === 'burned-out') {
      // Bars deplete high to low. The first stays green as the reference.
      FT_BURN.forEach(function (b, i) {
        var n = el['b' + i];
        if (!n || i === 0) return;
        var pr = seg(ms, 160 + (i - 1) * 40, 260, M.travel);
        var hh = Math.max(1, 80 - (80 - b[2]) * pr - 3 * h * (i / 8));
        set(n, 'y', (92 - hh).toFixed(2)); set(n, 'height', hh.toFixed(2));
        set(n, 'fill', 'rgba(23,25,25,' + (0.62 + (b[3] - 0.62) * pr).toFixed(3) + ')');
      });
    }
  };
}

// Attaches the entrance and the hover tween to one card. Cards in the same grid
// row stagger by 80ms (--stagger-row) so a row reads left to right.
function ftAttach(node, id, index) {
  var M = window.Motion;
  if (!node || !M) return function () {};
  var paint = ftDrive(node, id);
  if (!paint) return function () {};
  var t = 1, h = 0, raf = 0, hraf = 0;
  if (M.reduced) { paint(1, 0); return function () {}; }
  // Arm well before the card is visible, and never while it is on screen. That
  // keeps the undrawn state out of the prerendered snapshot — which is why a
  // JS-disabled visitor sees finished drawings rather than frozen fragments —
  // and means arming can never blank a diagram the visitor is looking at.
  M.onView(node, function (_, info) {
    if (!info.instant) paint(0, h);
  }, { threshold: 0, margin: '400px 0px 400px 0px' });
  M.onView(node, function (_, info) {
    if (info.instant) { paint(1, h); return; }
    var t0 = performance.now() + (index % 3) * 80;
    var step = function (now) {
      t = M.clamp01((now - t0) / (FT_DUR[id] || 600));
      paint(t, h);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  });
  // 240ms hover tween on the diagram's meaningful green element.
  var tween = function (to) {
    cancelAnimationFrame(hraf);
    var from = h, t0 = performance.now();
    var step = function (now) {
      var k = M.clamp01((now - t0) / 240);
      h = from + (to - from) * M.settle(k);
      paint(t, h);
      if (k < 1) hraf = requestAnimationFrame(step);
    };
    hraf = requestAnimationFrame(step);
  };
  var over = function () { tween(1); }, out = function () { tween(0); };
  node.addEventListener('mouseenter', over);
  node.addEventListener('mouseleave', out);
  node.addEventListener('focusin', over);
  node.addEventListener('focusout', out);
  return function () {
    cancelAnimationFrame(raf); cancelAnimationFrame(hraf);
    node.removeEventListener('mouseenter', over); node.removeEventListener('mouseleave', out);
    node.removeEventListener('focusin', over); node.removeEventListener('focusout', out);
    M.release(node);
  };
}

// ── Conceptual diagrams ──────────────────────────────────────────────────────
// One 320×104 line drawing per tool, transcribed from the design. Live tools
// draw their key line in green; coming-soon tools stay in ink.
var FT_MUTED = 'rgba(23,25,25,0.34)';
var FT_GREEN = '#047857';
var FT_INK2 = '#3A403A';
function ftPath(key, d, stroke, width, dash) {
  return e('path', { key: key, 'data-el': key, d: d, fill: 'none', stroke: stroke || FT_MUTED, strokeWidth: width || 1.25, strokeDasharray: dash || undefined });
}
function ftRect(key, x, y, w, h, o) {
  o = o || {};
  return e('rect', { key: key, 'data-el': key, x: x, y: y, width: w, height: h, fill: o.fill || 'none', fillOpacity: o.fo, stroke: o.stroke, strokeWidth: o.sw, strokeDasharray: o.dash });
}
function ftCircle(key, cx, cy, r, o) {
  o = o || {};
  return e('circle', { key: key, 'data-el': key, cx: cx, cy: cy, r: r, fill: o.fill || 'none', stroke: o.stroke, strokeWidth: o.sw });
}
function ftArt(children) {
  return e('svg', { viewBox: '0 0 320 104', width: 320, height: 104, 'aria-hidden': 'true', className: 'ft-art' }, children);
}

// 01 — many inputs narrowing to one constraint, then one clean line out.
function artConstraint() {
  return ftArt([
    ftPath('a', 'M0 8 H104 L150 44'), ftPath('b', 'M0 30 H104 L150 48'), ftPath('c', 'M0 52 H150'),
    ftPath('d', 'M0 74 H104 L150 56'), ftPath('e', 'M0 96 H104 L150 60'),
    ftRect('f', 158, 30, 4, 44, { fill: FT_GREEN }),
    ftPath('g', 'M170 52 H300', FT_GREEN, 1.75),
  ]);
}
// 02 — two overlapping frames: the plan and the doing.
function artStrategy() {
  return ftArt([
    ftRect('a', 6, 10, 150, 58, { stroke: FT_MUTED, sw: 1.25 }), ftPath('b', 'M6 39 H156'),
    e('g', { key: 'g', 'data-el': 'g' },
      ftRect('tint', 86, 38, 70, 30, { fill: FT_GREEN, fo: 0.07 }),
      ftRect('c', 86, 38, 150, 58, { stroke: FT_GREEN, sw: 1.6 }),
      ftPath('d', 'M86 67 H236', FT_GREEN, 1.6)),
    ftRect('e', 152, 34, 8, 8, { fill: FT_GREEN }),
  ]);
}
// 03 — one road arriving at a fork with three ways on.
function artQuit() {
  return ftArt([
    ftPath('a', 'M0 52 H130', FT_GREEN, 1.75),
    ftPath('b', 'M130 52 L262 12'), ftPath('c', 'M130 52 H262'), ftPath('d', 'M130 52 L262 92'),
    ftCircle('e', 130, 52, 5, { fill: FT_GREEN }),
  ]);
}
// 04 — a row of identical blocks; one steps out of the line.
function artSolopreneur() {
  var rects = [4, 38, 72, 106, 140, 174].map(function (x, i) {
    return ftRect('r' + i, x, 70, 22, 22, { stroke: FT_MUTED, sw: 1.25 });
  });
  return ftArt(rects.concat([
    ftRect('out', 208, 16, 22, 22, { fill: FT_GREEN }),
    ftPath('p', 'M185 81 H219 V27', FT_GREEN, 1.25, '3 5'),
  ]));
}
// 05 — a depleting bar chart.
function artBurnout() {
  var bars = [[4, 12, 80, FT_GREEN], [36, 20, 72, 'rgba(23,25,25,0.62)'], [68, 30, 62, 'rgba(23,25,25,0.52)'],
    [100, 42, 50, 'rgba(23,25,25,0.44)'], [132, 54, 38, 'rgba(23,25,25,0.36)'], [164, 64, 28, 'rgba(23,25,25,0.28)'],
    [196, 74, 18, 'rgba(23,25,25,0.22)'], [228, 82, 10, 'rgba(23,25,25,0.16)'], [260, 88, 4, 'rgba(23,25,25,0.12)']];
  return ftArt(bars.map(function (b, i) { return ftRect('b' + i, b[0], b[1], 4, b[2], { fill: b[3] }); }));
}
// 06 — two panels either side of a seam: the offer, and the offer after.
function artRoast() {
  return ftArt([
    ftRect('a', 96, 26, 46, 52, { stroke: FT_INK2, sw: 1.6 }), ftRect('b', 158, 26, 46, 52, { stroke: FT_INK2, sw: 1.6 }),
    ftPath('c', 'M150 6 V30 M150 74 V98'), ftPath('d', 'M40 52 H84 M216 52 H260'),
    ftCircle('e', 30, 52, 4, { fill: FT_INK2 }), ftCircle('f', 270, 52, 4, { fill: FT_INK2 }),
  ]);
}
// 07 — a path from interest to purchase, interrupted.
function artSales() {
  return ftArt([
    ftCircle('a', 24, 52, 15, { stroke: FT_INK2, sw: 1.6 }), ftCircle('b', 264, 52, 15, { fill: FT_INK2 }),
    ftPath('c', 'M44 52 H126'), ftPath('d', 'M170 52 H244'),
    ftPath('e', 'M140 34 V70 M158 34 V70', FT_INK2, 1.6),
  ]);
}
// 08 — two weights either side of a price line.
function artPricing() {
  return ftArt([
    ftCircle('a', 74, 52, 34, { stroke: FT_INK2, sw: 1.6 }), ftCircle('b', 222, 52, 20, { fill: FT_INK2 }),
    ftPath('c', 'M160 14 V90'), ftPath('d', 'M114 52 H150 M170 52 H198'),
  ]);
}
// 09 — one decision, two futures of different weight.
function artJob() {
  return ftArt([
    ftPath('a', 'M14 52 L240 18'), ftPath('b', 'M14 52 L240 88', FT_INK2, 1.6),
    ftCircle('c', 14, 52, 4, { fill: FT_INK2 }),
    ftCircle('d', 252, 16, 6, { stroke: FT_INK2, sw: 1.6 }), ftCircle('e', 252, 90, 12, { fill: FT_INK2 }),
  ]);
}
// 10 — a straight line detouring around the thing in the middle.
function artAvoiding() {
  return ftArt([
    ftCircle('a', 150, 58, 22, { fill: FT_INK2 }),
    ftPath('b', 'M0 58 H96 C120 58 120 14 150 14 C180 14 180 58 204 58 H300'),
  ]);
}

// ── The collection ───────────────────────────────────────────────────────────
// cat drives the filter; kind is the tool TYPE shown after the category.
var FT_TOOLS = [
  { id: 'business-constraint', cat: 'business', kind: 'Clarity tool', href: '/free-tools/business-constraint/',
    title: "What's limiting your business?",
    desc: 'Find the part of your business most likely restricting growth right now.',
    meta: '20 questions', art: artConstraint },
  { id: 'strategy-or-execution', cat: 'business', kind: 'Clarity tool', href: '/free-tools/strategy-or-execution/',
    title: 'Is it a strategy or execution problem?',
    desc: 'Separate strategy, execution, avoidance, capacity and coordination problems.',
    meta: '17 questions', art: artStrategy },
  { id: 'quit-your-job', cat: 'career', kind: 'Clarity tool', href: '/free-tools/quit-your-job/',
    title: "What's making you want to quit your job?",
    desc: 'Separate problems with your current job from a broader problem with your career direction.',
    meta: '20 questions', art: artQuit },
  { id: 'become-a-solopreneur', cat: 'career', kind: 'Clarity tool', href: '/free-tools/become-a-solopreneur/',
    title: 'Do you want to become a solopreneur?',
    desc: 'Separate wanting your own business from wanting autonomy or simply wanting out of employment.',
    meta: '20 questions', art: artSolopreneur },
  { id: 'burned-out', cat: 'psychology', kind: 'Clarity tool', href: '/free-tools/burned-out/',
    title: 'Are you burned out?',
    desc: 'Separate depletion, under-stimulation and simply no longer wanting the work.',
    note: 'Directional assessment. Not a clinical diagnosis.',
    meta: '20 questions', art: artBurnout },
  { id: 'roast-my-offer', cat: 'business', kind: 'Roast', soon: true,
    title: 'Roast my offer',
    desc: 'Give me your offer and get direct feedback on positioning, credibility and why someone might not buy.',
    art: artRoast },
  { id: 'why-arent-people-buying', cat: 'business', kind: 'Sales tool', soon: true,
    title: "Why aren't people buying?",
    desc: 'Work out where your sales process is actually breaking.',
    art: artSales },
  { id: 'what-should-i-charge', cat: 'business', kind: 'Pricing tool', soon: true,
    title: 'What should I charge?',
    desc: "Pressure-test your pricing against what you're selling and who you're selling it to.",
    art: artPricing },
  { id: 'should-i-take-this-job', cat: 'career', kind: 'Decision tool', soon: true,
    title: 'Should I take this job?',
    desc: 'Put an opportunity through a structured trade-off instead of arguing with yourself for three weeks.',
    art: artJob },
  { id: 'what-am-i-avoiding', cat: 'psychology', kind: 'Exercise', soon: true,
    title: 'What am I actually avoiding?',
    desc: 'Separate genuine lack of desire from fear, discomfort and avoidance.',
    art: artAvoiding },
];

var FT_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'business', label: 'Business' },
  { id: 'career', label: 'Career' },
  { id: 'psychology', label: 'Psychology' },
];
function ftCount(cat) {
  return cat === 'all' ? FT_TOOLS.length : FT_TOOLS.filter(function (t) { return t.cat === cat; }).length;
}
function ftCatLabel(cat) {
  for (var i = 0; i < FT_CATEGORIES.length; i++) if (FT_CATEGORIES[i].id === cat) return FT_CATEGORIES[i].label;
  return cat;
}

// ── Page-specific styles ─────────────────────────────────────────────────────
// Everything shared (palette tokens, grain, focus rings, .pill--green, header
// and footer) already ships in CHROME_CSS; these are only the page's own rules.
var FREE_TOOLS_CSS = [
  '.ft-main{background:var(--bone,#F3F0E8);color:var(--ink,#171919)}',

  // hero
  '.ft-hero{position:relative;background:var(--bone,#F3F0E8);overflow:clip}',
  '.ft-hero__rule{position:absolute;top:0;bottom:0;left:66%;width:1px;background:rgba(4,120,87,0.55)}',
  '.ft-hero__in{position:relative;display:flex;flex-wrap:wrap;align-items:center;gap:clamp(40px,5vw,64px);padding-block:clamp(72px,9vw,104px) clamp(64px,8vw,96px)}',
  '.ft-hero__copy{flex:1 1 380px;min-width:0;max-width:760px}',
  '.ft-eyebrow{margin:0;color:var(--green,#047857);font-size:13px;font-weight:700;line-height:1.3;letter-spacing:0.11em;text-transform:uppercase}',
  '.ft-hero__h1{max-width:22ch;margin:18px 0 0;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(38px,5vw,68px);font-weight:800;line-height:0.98;letter-spacing:-0.048em;color:var(--heading-ink,#14201C);text-wrap:balance}',
  '.ft-hero__tick{width:96px;height:1px;background:var(--green,#047857);margin:30px 0 0}',
  '.ft-hero__lead{max-width:56ch;margin:26px 0 0;font-size:21px;line-height:1.5;color:var(--ink-2,#3A403A);text-wrap:pretty}',
  '.ft-hero__note{max-width:48ch;margin:16px 0 0;font-size:15px;line-height:1.5;color:var(--meta,#6A6F67)}',
  '.ft-hero__fig{flex:0 1 clamp(190px,26vw,400px);margin:0;position:relative;aspect-ratio:1;align-self:center}',
  '.ft-hero__disc,.ft-hero__disc-cut{position:absolute;inset:8% 6% 6% 8%;border-radius:50%}',
  '.ft-hero__disc{background:var(--green,#047857)}',
  '.ft-hero__disc-cut{background:linear-gradient(90deg,rgba(243,240,232,0) 58%,var(--bone,#F3F0E8) 58%)}',
  '.ft-hero__h{position:absolute;left:0;right:-14%;top:50%;height:1px;background:rgba(23,25,25,0.24)}',
  '.ft-hero__v{position:absolute;left:58%;top:6%;bottom:4%;width:1px;background:rgba(4,120,87,0.55)}',

  // collection band
  // Small text on the bone-deep band needs a touch more weight than the base
  // tokens give it: --green on #EDE8DB is 4.48:1 and --meta 4.2:1, both under
  // AA for text this size. These two stay inside the palette (green-pressed /
  // a half-step darker meta) and clear 4.5:1.
  '.ft-collection{background:var(--bone-deep,#EDE8DB);padding-block:clamp(64px,8vw,96px) clamp(72px,9vw,112px);--ft-green-sm:var(--green-pressed,#03654A);--ft-meta:#60655D}',
  '.ft-collection__head{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:16px 40px}',
  '.ft-collection__h{margin:0;max-width:20ch;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(30px,3.7vw,46px);font-weight:800;line-height:1.02;letter-spacing:-0.042em;color:var(--heading-ink,#14201C);text-wrap:balance}',

  // filter
  '.ft-filter{margin-top:clamp(36px,4.4vw,52px);display:flex;flex-wrap:wrap;align-items:stretch;gap:0 clamp(18px,3vw,44px);border-top:1px solid var(--rule,rgba(23,25,25,0.18));border-bottom:1px solid var(--rule,rgba(23,25,25,0.18))}',
  // padding (not min-height) sets the strip's height, so the active tab's rule
  // sits just under its label instead of drifting to the bottom of a tall box
  '.ft-filter__btn{display:inline-flex;align-items:baseline;gap:10px;min-height:44px;padding:20px 0 16px;background:none;border:0;border-bottom:2px solid transparent;margin-bottom:-1px;cursor:pointer;font-family:inherit;font-size:18px;font-weight:700;line-height:1;letter-spacing:0.11em;text-transform:uppercase;color:var(--ink-2,#3A403A);transition:color .16s,border-color .16s}',
  '.ft-filter__btn:hover{color:var(--ft-green-sm,#03654A)}',
  '.ft-filter__btn[aria-pressed="true"]{color:var(--ft-green-sm,#03654A);border-bottom-color:var(--green,#047857)}',
  '.ft-filter__count{font-size:14px;font-weight:700;letter-spacing:0.06em;color:var(--ft-meta,#60655D);font-variant-numeric:tabular-nums}',
  '.ft-filter__btn[aria-pressed="true"] .ft-filter__count{color:var(--ft-green-sm,#03654A)}',

  // grid + cards
  '.ft-grid{margin-top:clamp(28px,3.4vw,44px);display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,400px),1fr));column-gap:clamp(36px,4.6vw,80px)}',
  '.ft-cell{min-width:0}',
  '.ft-card{display:flex;flex-direction:column;align-items:flex-start;padding:26px 0 clamp(44px,5vw,68px);border-top:1px solid var(--rule,rgba(23,25,25,0.18));color:var(--ink,#171919);transition:border-color .18s}',
  'a.ft-card{position:relative;color:var(--ink,#171919)}',
  'a.ft-card::before{content:"";position:absolute;left:0;right:0;top:-1px;height:2px;background:var(--green,#047857);transform:scaleX(0);transform-origin:left center;transition:transform var(--dur-rule,260ms) var(--ease-settle,cubic-bezier(.22,1,.36,1))}',
  'a.ft-card:hover::before,a.ft-card:focus-visible::before{transform:scaleX(1)}',
  '.ft-card__top{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;width:100%}',
  '.ft-card__num{font-family:var(--font-display);font-size:14px;line-height:1;letter-spacing:-0.01em;color:var(--ft-green-sm,#03654A);font-variant-numeric:tabular-nums}',
  '.ft-card--soon .ft-card__num{color:var(--ft-meta,#60655D)}',
  '.ft-card__kind{font-size:13px;font-weight:700;letter-spacing:0.11em;text-transform:uppercase;color:var(--ft-green-sm,#03654A)}',
  '.ft-card--soon .ft-card__kind{color:var(--ink-2,#3A403A)}',
  '.ft-card__soon{margin-left:auto;font-size:11.5px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--ft-meta,#60655D)}',
  '.ft-card__figure{margin:22px 0 0;width:100%;transition:transform .22s ease}',
  '.ft-card__figure{transition:transform var(--dur-nudge,220ms) var(--ease-settle,cubic-bezier(.22,1,.36,1))}',
  'a.ft-card:hover .ft-card__figure,a.ft-card:focus-visible .ft-card__figure{transform:translateX(4px)}',
  '.ft-art{display:block;width:100%;max-width:320px;height:auto}',
  '.ft-card__h{margin:26px 0 0;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(25px,2.1vw,30px);font-weight:800;line-height:1.08;letter-spacing:-0.035em;color:var(--heading-ink,#14201C);transition:color .18s}',
  '.ft-card__h{transition:color var(--dur-hover,180ms) var(--ease-settle,cubic-bezier(.22,1,.36,1))}',
  'a.ft-card:hover .ft-card__h,a.ft-card:focus-visible .ft-card__h{color:var(--green,#047857)}',
  '.ft-card__desc{margin:14px 0 0;max-width:42ch;font-size:17px;line-height:1.55;color:var(--ink-2,#3A403A);text-wrap:pretty}',
  '.ft-card__note{margin:12px 0 0;font-size:13px;line-height:1.45;color:var(--ft-meta,#60655D)}',
  '.ft-card__go{margin-top:26px;display:inline-flex;align-items:center;gap:9px;font-size:13px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--ft-green-sm,#03654A)}',
  '.ft-card__go span{transition:transform var(--dur-nudge,220ms) var(--ease-settle,cubic-bezier(.22,1,.36,1))}',
  'a.ft-card:hover .ft-card__go span,a.ft-card:focus-visible .ft-card__go span{transform:translateX(6px)}',

  // coming-soon signup
  '.ft-notify{margin-top:26px;display:inline-flex;align-items:center;gap:9px;min-height:44px;padding:0;background:none;border:0;cursor:pointer;font-family:inherit;font-size:13px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:var(--ft-green-sm,#03654A);transition:gap .18s,color .18s}',
  '.ft-notify:hover{color:var(--green-pressed,#03654A);gap:13px}',
  '.ft-form{margin-top:22px;width:100%;max-width:420px;padding-top:20px;border-top:1px solid var(--rule,rgba(23,25,25,0.18))}',
  '.ft-form__label{display:block;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-2,#3A403A)}',
  '.ft-form__hint{margin:8px 0 0;font-size:14px;line-height:1.45;color:var(--ft-meta,#60655D)}',
  '.ft-form__row{margin-top:12px;display:flex;flex-wrap:wrap;gap:10px}',
  '.ft-form__input{flex:1 1 200px;min-width:0;min-height:46px;padding:0 14px;background:var(--bone,#F3F0E8);border:1px solid rgba(23,25,25,0.34);border-radius:0;font-family:inherit;font-size:16px;color:var(--ink,#171919)}',
  '.ft-form__input:focus{border-color:var(--green,#047857)}',
  '.ft-form__input:focus-visible{outline:3px solid var(--green,#047857);outline-offset:2px}',
  '.ft-form__input[aria-invalid="true"]{border-color:#9B2C2C}',
  '.ft-form__submit{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;padding:0 18px;background:var(--green,#047857);border:0;cursor:pointer;font-family:inherit;font-size:13px;font-weight:750;letter-spacing:0.07em;text-transform:uppercase;color:var(--bone,#F3F0E8);transition:background .18s,gap .18s}',
  '.ft-form__submit:hover{background:var(--green-pressed,#03654A);gap:11px}',
  '.ft-form__submit[disabled]{opacity:.6;cursor:default}',
  '.ft-form__error{margin:10px 0 0;font-size:14px;line-height:1.45;color:#9B2C2C}',
  '.ft-done{margin-top:22px;width:100%;max-width:420px;padding-top:20px;border-top:2px solid var(--green,#047857)}',
  '.ft-done:focus{outline:none}',
  '.ft-done__h{margin:0;font-size:17px;font-weight:600;line-height:1.4;color:var(--ft-green-sm,#03654A)}',
  '.ft-done__p{margin:6px 0 0;font-size:14px;line-height:1.45;color:var(--ft-meta,#60655D)}',

  // ask me anything fallback
  '.ft-ask{position:relative;background:var(--forest,#16231E);color:var(--bone,#F3F0E8);padding-block:clamp(96px,12vw,164px);overflow:clip}',
  '.ft-ask__glow{position:absolute;top:-180px;right:-150px;width:480px;height:480px;border-radius:50%;background:rgba(143,191,167,0.07)}',
  '.ft-ask__in{position:relative}',
  '.ft-ask__eyebrow{margin:0;color:var(--sage,#8FBFA7);font-size:13px;font-weight:700;line-height:1.3;letter-spacing:0.11em;text-transform:uppercase}',
  '.ft-ask__h{max-width:16ch;margin:24px 0 0;font-family:var(--font-heading);font-synthesis:none;font-size:clamp(34px,4.6vw,58px);font-weight:800;line-height:1;letter-spacing:-0.045em;color:var(--bone,#F3F0E8);text-wrap:balance}',
  '.ft-ask__tick{width:120px;height:1px;background:var(--sage,#8FBFA7);margin:34px 0 0}',
  '.ft-ask__p{max-width:56ch;margin:30px 0 0;font-size:19px;line-height:1.62;color:var(--on-forest,#C0C9BF);text-wrap:pretty}',
  '.ft-ask__p + .ft-ask__p{margin-top:16px}',
  '.ft-ask .pill--green{margin-top:48px}',

  // responsive
  '@media (max-width:900px){.ft-hero__rule{display:none}}',
  '@media (max-width:640px){',
  // the "Coming soon" chip gets its own line so every card's top row reads the
  // same way, instead of wrapping only on the cards with a longer type label
  '.ft-card__soon{margin-left:0;flex:0 0 100%}',
  '.ft-filter{gap:0 22px}',
  '.ft-filter__btn{min-height:56px;font-size:17px;letter-spacing:0.07em}',
  '.ft-hero__fig{flex:0 0 clamp(150px,44vw,220px);align-self:flex-start}',
  '.ft-hero__lead{font-size:19px}',
  '.ft-form__submit{flex:1 1 100%}',
  '}',
  '@media (prefers-reduced-motion:reduce){.ft-card,.ft-card__figure,.ft-card__go span,.ft-notify,.ft-form__submit,a.ft-card::before{transition:none}a.ft-card:hover .ft-card__figure{transform:none}a.ft-card::before{transform:scaleX(0)}}',
].join('');

function FreeToolsStyles() {
  return e('style', { dangerouslySetInnerHTML: { __html: FREE_TOOLS_CSS } });
}

// ── Coming-soon email capture ────────────────────────────────────────────────
// Closed → open (compact field) → done. Validation, error and success states
// are all announced; focus moves with the state change.
function ComingSoonSignup(props) {
  var tool = props.tool;
  var R = React;
  var stageState = R.useState('closed'); var stage = stageState[0], setStage = stageState[1];
  var valueState = R.useState(''); var value = valueState[0], setValue = valueState[1];
  var errorState = R.useState(''); var error = errorState[0], setError = errorState[1];
  var inputRef = R.useRef(null);
  var doneRef = R.useRef(null);
  var inputId = 'notify-' + tool.id;
  var errorId = inputId + '-error';

  R.useEffect(function () {
    if (stage === 'open' && inputRef.current) { try { inputRef.current.focus(); } catch (err) {} }
    if (stage === 'done' && doneRef.current) { try { doneRef.current.focus(); } catch (err) {} }
  }, [stage]);

  function open() {
    setStage('open');
    ftTrack('free_tool_interest_open', { tool: tool.id });
  }

  function submit(ev) {
    ev.preventDefault();
    if (stage === 'sending') return;
    var email = String(value || '').trim();
    if (!ftValidEmail(email)) {
      setError('Enter an email address I can actually reach you on.');
      if (inputRef.current) { try { inputRef.current.focus(); } catch (err) {} }
      return;
    }
    setError('');
    setStage('sending');
    ftTrack('free_tool_interest_submit', { tool: tool.id });
    ftSubmitInterest(tool, email, function (ok) {
      if (ok) { setStage('done'); return; }
      // Don't claim they're on the list when the send actually failed.
      setStage('open');
      setError("That didn't go through. Try again in a moment.");
    });
  }

  if (stage === 'done') {
    return e('div', { className: 'ft-done', role: 'status', tabIndex: -1, ref: doneRef },
      e('p', { className: 'ft-done__h' }, "You're on the list."),
      e('p', { className: 'ft-done__p' }, 'One email, about this tool only.')
    );
  }

  if (stage === 'closed') {
    return e('button', { type: 'button', className: 'ft-notify', onClick: open },
      'Send it to me first ', e('span', { 'aria-hidden': 'true' }, '→'));
  }

  var sending = stage === 'sending';
  return e('form', { className: 'ft-form', onSubmit: submit, noValidate: true },
    e('label', { className: 'ft-form__label', htmlFor: inputId }, 'Email address'),
    e('p', { className: 'ft-form__hint' }, "I'll tell you when this one specifically is ready."),
    e('div', { className: 'ft-form__row' },
      e('input', {
        id: inputId, ref: inputRef, className: 'ft-form__input', name: 'email', type: 'email',
        required: true, autoComplete: 'email', placeholder: 'you@example.com',
        value: value, disabled: sending,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': error ? errorId : undefined,
        onChange: function (ev) { setValue(ev.target.value); if (error) setError(''); },
      }),
      e('button', { type: 'submit', className: 'ft-form__submit', disabled: sending },
        sending ? 'Sending…' : 'Let me know', e('span', { 'aria-hidden': 'true' }, sending ? '' : '→'))
    ),
    error ? e('p', { className: 'ft-form__error', id: errorId, role: 'alert' }, error) : null
  );
}

// ── One tool ─────────────────────────────────────────────────────────────────
function ToolCard(props) {
  var t = props.tool, num = props.num;
  var label = ftCatLabel(t.cat) + ' · ' + t.kind;
  var cardRef = R.useRef(null);
  R.useEffect(function () {
    if (t.soon) return;            // coming-soon diagrams stay static
    return ftAttach(cardRef.current, t.id, props.num ? Number(props.num) - 1 : 0);
  }, [t.id]);
  var head = e('div', { className: 'ft-card__top' },
    e('span', { className: 'ft-card__num', 'aria-hidden': 'true' }, num),
    e('span', { className: 'ft-card__kind' }, label),
    t.soon ? e('span', { className: 'ft-card__soon' }, 'Coming soon') : null
  );
  var art = e('div', { className: 'ft-card__figure' }, t.art());
  var body = [
    e('h3', { className: 'ft-card__h', key: 'h' }, t.title),
    e('p', { className: 'ft-card__desc', key: 'd' }, t.desc),
    t.note ? e('p', { className: 'ft-card__note', key: 'n' }, t.note) : null,
  ];

  if (t.soon) {
    return e('div', { className: 'ft-card ft-card--soon' }, head, art, body,
      e(ComingSoonSignup, { tool: t }));
  }
  return e('a', {
    className: 'ft-card', href: t.href, ref: cardRef,
    'aria-label': t.title + ' — ' + label + ', ' + t.meta,
    onClick: function () { ftTrack('free_tool_open', { tool: t.id }); },
  }, head, art, body,
    e('span', { className: 'ft-card__go' }, t.meta, ' ', e('span', { 'aria-hidden': 'true' }, '→'))
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
function FreeToolsPage() {
  var R = React;
  var catState = R.useState('all'); var cat = catState[0], setCat = catState[1];
  var liveRef = R.useRef(null);
  var firstRender = R.useRef(true);

  var visible = FT_TOOLS.filter(function (t) { return cat === 'all' || t.cat === cat; });

  // Announce the filtered result to screen readers, but not on first paint.
  R.useEffect(function () {
    if (firstRender.current) { firstRender.current = false; return; }
    if (liveRef.current) {
      var n = visible.length;
      liveRef.current.textContent = 'Showing ' + n + ' ' + (n === 1 ? 'tool' : 'tools')
        + (cat === 'all' ? '.' : ' in ' + ftCatLabel(cat) + '.');
    }
  }, [cat]);

  function choose(next) {
    if (next === cat) return;
    setCat(next);
    ftTrack('free_tools_filter', { category: next });
  }

  var filter = e('div', { className: 'ft-filter', role: 'group', 'aria-label': 'Filter tools by subject' },
    FT_CATEGORIES.map(function (c) {
      return e('button', {
        key: c.id, type: 'button', className: 'ft-filter__btn',
        'aria-pressed': cat === c.id ? 'true' : 'false',
        onClick: function () { choose(c.id); },
      },
        e('span', null, c.label),
        e('span', { className: 'ft-filter__count' }, String(ftCount(c.id)))
      );
    })
  );

  var grid = e('div', { className: 'ft-grid' },
    visible.map(function (t, i) {
      return e('div', { className: 'ft-cell', key: t.id },
        e(ToolCard, { tool: t, num: ('0' + (i + 1)).slice(-2) }));
    })
  );

  return e(React.Fragment, null,
    e(window.ChromeStyles),
    e(FreeToolsStyles),
    e(window.SiteHeader, { page: 'free-tools', lang: 'en' }),
    e('main', { className: 'ft-main' },
      // ── Hero ──
      e('section', { className: 'ft-hero' },
        e('div', { className: 'ft-hero__rule', 'aria-hidden': 'true' }),
        e('div', { className: 'site-container ft-hero__in' },
          e('div', { className: 'ft-hero__copy' },
            e('p', { className: 'ft-eyebrow' }, 'Free tools'),
            e('h1', { className: 'ft-hero__h1' }, 'Useful tools for business, career and everything going on in your head.'),
            e('div', { className: 'ft-hero__tick', 'aria-hidden': 'true' }),
            e('p', { className: 'ft-hero__lead' }, "Diagnostics, feedback, exercises and other things I've built to help you figure something out or make something better."),
            e('p', { className: 'ft-hero__note' }, 'The tools that are live are free to use immediately.')
          ),
          e('figure', { className: 'ft-hero__fig', 'aria-hidden': 'true' },
            e('div', { className: 'ft-hero__disc' }),
            e('div', { className: 'ft-hero__disc-cut' }),
            e('div', { className: 'ft-hero__h' }),
            e('div', { className: 'ft-hero__v' })
          )
        )
      ),
      // ── The collection ──
      e('section', { className: 'ft-collection' },
        e('div', { className: 'site-container' },
          e('div', { className: 'ft-collection__head' },
            e('h2', { className: 'ft-collection__h' }, 'What do you need help with?')
          ),
          filter,
          e('div', { ref: liveRef, 'aria-live': 'polite', role: 'status', style: { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' } }),
          grid
        )
      ),
      // ── Human fallback ──
      e('section', { className: 'ft-ask' },
        e('div', { className: 'ft-ask__glow', 'aria-hidden': 'true' }),
        e('div', { className: 'site-container ft-ask__in' },
          e('p', { className: 'ft-ask__eyebrow' }, 'Still not it?'),
          e('h2', { className: 'ft-ask__h' }, "Can't find the right tool?"),
          e('div', { className: 'ft-ask__tick', 'aria-hidden': 'true' }),
          e('p', { className: 'ft-ask__p' }, "Some problems don't fit neatly into a questionnaire."),
          e('p', { className: 'ft-ask__p' }, 'Ask me anything with your name or anonymously.'),
          e('a', {
            className: 'pill pill--green', href: ASK_URL,
            onClick: function () { ftTrack('free_tools_ask', {}); },
          }, e('span', null, 'ASK ME SOMETHING'), e('span', { 'aria-hidden': 'true' }, '→'))
        )
      )
    ),
    e(window.SiteFooterX, { lang: 'en' })
  );
}

function renderFreeTools() {
  ReactDOM.createRoot(document.getElementById('root')).render(e(FreeToolsPage, null));
}

Object.assign(window, { FreeToolsPage: FreeToolsPage, renderFreeTools: renderFreeTools, FT_TOOLS: FT_TOOLS });
