// site-undisguised.jsx — the Undisguised map and its motion, without React.
//
// /undisguised/ is a static page (scripts/gen-site-pages.js): React draws it
// once, at build time (UndisguisedPage in site-pages.jsx), and the browser
// gets that snapshot with no React and no page bundle. This gives the
// snapshot the behaviour of the approved design ("Undisguised Manifesto v2"):
//   - the map follows the reading: as the four movements pass the middle of
//     the screen, the way so far (the sage arc) is drawn round the ring, the
//     point travels to the movement being read, its node and name light up
//     and the centre of the figure names it. On wide screens the movements
//     not being read recede; below 980px a strip pinned above them marks the
//     one being read;
//   - blocks marked data-reveal that start below the fold rise into place as
//     they arrive, and the widening lines of the aphorism are drawn.
// Without JavaScript the page is complete: every movement at full strength
// and the figure at its first point. With reduced motion there are no
// reveals, no drawing and no fades; the map still follows the reading.
//
// Plain JavaScript (no JSX, no dependencies), compiled with the other
// bundles and loaded async, so it waits for the DOM itself. It only touches
// the page's own elements, found by their classes.

(function () {
  var SAGE = 'var(--sage)';
  var BONE = 'var(--bone)';
  var FOREST = 'var(--forest)';
  var R = 190;
  var C = 2 * Math.PI * R;
  var EASE = 'cubic-bezier(.22,1,.36,1)';

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  var each = function (list, fn) { Array.prototype.forEach.call(list, fn); };

  // ── The map ──────────────────────────────────────────────────────────────
  function initMap(sec) {
    var stages = Array.prototype.slice.call(sec.querySelectorAll('.ud-stage'));
    var arc = sec.querySelector('.ud-map__arc');
    var dot = sec.querySelector('.ud-map__dot');
    var nodes = sec.querySelectorAll('.ud-map__node');
    var labels = sec.querySelectorAll('.ud-map__label');
    var center = sec.querySelector('.ud-map__center');
    var big = sec.querySelector('.ud-map__t-big');
    var cap = sec.querySelector('.ud-map__t-cap');
    var tabs = sec.querySelectorAll('.ud-map__strip span');
    if (stages.length !== 4 || !arc || !dot || nodes.length !== 4 || labels.length !== 4) return;

    var active = -1;
    var done = null;
    var raf = 0;
    sec.classList.add('is-live');

    // `a`: the movement being read (0–3); `d`: the reader is past the last.
    function paint(a, d) {
      for (var i = 0; i < 4; i++) {
        nodes[i].style.fill = d ? (i === 0 ? SAGE : BONE) : i < a ? BONE : i === a ? SAGE : FOREST;
        labels[i].style.opacity = d || i === a ? '1' : i < a ? '0.6' : '0.38';
        stages[i].classList.toggle('is-active', i === a);
        if (tabs[i]) tabs[i].classList.toggle('is-active', i === a);
      }
      if (big) big.textContent = stages[a].getAttribute('data-num');
      if (cap) cap.textContent = String(stages[a].getAttribute('data-name')).toUpperCase();
      if (active !== -1 && a !== active && center && center.animate && !reducedMotion()) {
        center.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: 'ease-out' });
      }
    }

    // Progress f runs from 0 (the first movement's middle at the middle of
    // the screen) to 4 (past the last), between the movements' middles.
    function update() {
      raf = 0;
      var vh = window.innerHeight;
      var vc = vh * 0.5;
      var rs = stages.map(function (s) { return s.getBoundingClientRect(); });
      var pts = rs.map(function (r) { return r.top + r.height / 2; });
      pts.push(Math.max(rs[3].bottom - vh * 0.22, pts[3] + 40));
      var f = 0;
      if (vc >= pts[4]) f = 4;
      else if (vc > pts[0]) {
        for (var i = 0; i < 4; i++) {
          if (vc < pts[i + 1]) { f = i + (vc - pts[i]) / (pts[i + 1] - pts[i]); break; }
        }
      }
      arc.style.strokeDashoffset = (C * (1 - f / 4)).toFixed(2);
      var t = (225 + 90 * f) * Math.PI / 180;
      dot.setAttribute('cx', (300 + R * Math.cos(t)).toFixed(2));
      dot.setAttribute('cy', (300 + R * Math.sin(t)).toFixed(2));
      var a = Math.min(3, Math.floor(f + 0.5));
      var d = f > 3.92;
      if (a !== active || d !== done) {
        paint(a, d);
        active = a;
        done = d;
      }
    }
    var schedule = function () { if (!raf) raf = window.requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
  }

  // ── Reveals ──────────────────────────────────────────────────────────────
  // Only what starts below the fold: nothing already on screen ever hides.
  function initReveals(root) {
    if (reducedMotion() || !('IntersectionObserver' in window)) return;
    var vh = window.innerHeight;
    var below = function (el) { return el.getBoundingClientRect().top > vh * 0.92; };

    var els = Array.prototype.filter.call(root.querySelectorAll('[data-reveal]'), below);
    each(els, function (el) { el.style.opacity = '0'; el.style.transform = 'translateY(22px)'; });
    var io = new IntersectionObserver(function (entries) {
      each(entries, function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        el.style.transition = 'opacity .9s ' + EASE + ', transform .9s ' + EASE;
        el.style.opacity = '';
        el.style.transform = '';
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    each(els, function (el) { io.observe(el); });

    // The aphorism's lines are drawn from the straight one outwards.
    var fan = root.querySelector('.ud-fan');
    if (!fan || !below(fan)) return;
    var paths = fan.querySelectorAll('path');
    each(paths, function (p) { p.style.strokeDasharray = '1'; p.style.strokeDashoffset = '1'; });
    var fio = new IntersectionObserver(function (entries) {
      if (!entries.some(function (en) { return en.isIntersecting; })) return;
      fio.disconnect();
      each(paths, function (p, i) {
        var mid = (paths.length - 1) / 2;
        p.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(.65,0,.35,1) ' + (Math.abs(i - mid) * 0.09).toFixed(2) + 's';
        p.style.strokeDashoffset = '0';
      });
    }, { rootMargin: '0px 0px -15% 0px' });
    fio.observe(fan);
  }

  function init() {
    var root = document.querySelector('.pg--undisguised');
    if (!root) return;
    var map = root.querySelector('.ud-map');
    if (map) initMap(map);
    initReveals(root);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
