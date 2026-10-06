// site-header.jsx — the header of a static page, without React.
//
// Every canonical page but /contact/, and every article, is static: the
// snapshot scripts/seo/prerender.js takes of its React render is the whole
// page, so the browser loads no React and no page bundle for it
// (scripts/gen-site-pages.js). The header is the one part of those pages
// that responds to the reader, and this gives the prerendered header the
// behaviour SiteHeader (site-chrome.jsx) has on a live page, on the same
// markup and the same state attributes:
//   - desktop: Services and Resources are disclosure buttons, one open at a
//     time; Escape closes the open one and returns focus to its button, as
//     do a click outside the header and focus leaving the nav; choosing a
//     link in a panel closes it;
//   - below 1080px: Menu opens and closes the menu (the button reads Close
//     while it is open); Escape closes it and returns focus to the button;
//     Services and Resources inside it are accordions, one open at a time.
// It also keeps the footer's year current, as SiteFooterX does.
//
// Plain JavaScript (no JSX, no dependencies), compiled with the other
// bundles. The static shells load it async, not defer: a deferred script
// holds the end of parsing, and with it the page's first layout, until it
// has downloaded. So it waits for the DOM itself.

(function () {
  function init() {
    var header = document.querySelector('header.hdr');
    if (!header) return;
    var byId = function (id) { return id ? document.getElementById(id) : null; };
    var each = function (sel, fn) { Array.prototype.forEach.call(header.querySelectorAll(sel), fn); };
    var setExpanded = function (btn, on) {
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
      var panel = byId(btn.getAttribute('aria-controls'));
      if (panel) panel.hidden = !on;
    };

    // ── Desktop: Services and Resources ────────────────────────────────────
    var nav = header.querySelector('.hdr__nav');
    var open = null; // the button whose panel is open
    var setOpen = function (btn) {
      if (open) setExpanded(open, false);
      open = btn;
      if (btn) setExpanded(btn, true);
    };
    each('.hdr__btn', function (btn) {
      btn.addEventListener('click', function (ev) {
        ev.stopPropagation();
        setOpen(open === btn ? null : btn);
      });
    });
    each('.hdr__panel a', function (a) {
      a.addEventListener('click', function () { setOpen(null); });
    });
    if (nav) {
      nav.addEventListener('focusout', function (ev) {
        if (open && !nav.contains(ev.relatedTarget)) setOpen(null);
      });
    }
    document.addEventListener('click', function (ev) {
      if (open && !header.contains(ev.target)) setOpen(null);
    });

    // ── Below 1080px: the menu and its two accordions ──────────────────────
    var menuBtn = header.querySelector('.hdr__menu-btn');
    var menuOpen = false;
    var setMenu = function (on) {
      menuOpen = on;
      setExpanded(menuBtn, on);
      // The label is the button's text, before the burger icon.
      for (var n = menuBtn.firstChild; n; n = n.nextSibling) {
        if (n.nodeType === 3) { n.nodeValue = on ? 'Close' : 'Menu'; break; }
      }
    };
    if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(!menuOpen); });

    var toggles = header.querySelectorAll('.mmenu__toggle');
    var setAccordion = function (btn, on) {
      setExpanded(btn, on);
      var sign = btn.querySelector('.mmenu__sign');
      if (sign) sign.textContent = on ? '−' : '+';
    };
    Array.prototype.forEach.call(toggles, function (btn) {
      btn.addEventListener('click', function () {
        var on = btn.getAttribute('aria-expanded') !== 'true';
        Array.prototype.forEach.call(toggles, function (other) {
          if (other !== btn && other.getAttribute('aria-expanded') === 'true') setAccordion(other, false);
        });
        setAccordion(btn, on);
      });
    });

    // ── Escape: the open panel first, then the menu ────────────────────────
    document.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Escape') return;
      if (open) {
        var btn = open;
        setOpen(null);
        btn.focus();
      } else if (menuOpen) {
        setMenu(false);
        menuBtn.focus();
      }
    });

    // ── Footer: the year in the rights line ────────────────────────────────
    var rights = document.querySelector('.ftr__bottom p');
    if (rights) {
      var year = String(new Date().getFullYear());
      var text = rights.textContent.replace(/\d{4}/, year);
      if (text !== rights.textContent) rights.textContent = text;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
