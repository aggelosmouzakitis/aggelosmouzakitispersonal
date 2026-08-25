/* =============================================================================
   LOGOUT CLUB — behaviour
   Nav, mobile menu, FAQ accordion, Luma embed, config-driven links,
   language-switch section preservation, subtle scroll reveal.
   Everything degrades gracefully without JS (this only enhances).
   ========================================================================== */
(function () {
  "use strict";
  var doc = document;
  var root = doc.documentElement;
  root.classList.add("js");

  var CFG = window.LOGOUT_CLUB_CONFIG || {};
  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(s, c) { return (c || doc).querySelector(s); }
  function $all(s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); }

  /* ---- Sticky nav shadow state -------------------------------------------- */
  var nav = $(".lc-nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("is-stuck", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile nav toggle --------------------------------------------------- */
  var toggle = $(".lc-nav__toggle");
  var links = $(".lc-nav__links");
  if (toggle && links) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      links.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    // close on link tap, on Escape, and on outside click
    $all("a", links).forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false); toggle.focus();
      }
    });
    doc.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (!links.contains(e.target) && !toggle.contains(e.target)) setOpen(false);
    });
  }

  /* ---- Language switch: keep the current section when switching languages -- */
  $all("[data-lang-switch]").forEach(function (a) {
    a.addEventListener("click", function () {
      if (window.location.hash) {
        a.setAttribute("href", a.getAttribute("href").split("#")[0] + window.location.hash);
      }
    });
  });

  /* ---- FAQ accordion ------------------------------------------------------- */
  $all(".faq__q").forEach(function (btn) {
    var panel = doc.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;

    var open = function () {
      btn.setAttribute("aria-expanded", "true");
      panel.hidden = false;
      panel.classList.add("is-open");
      if (reduce) { panel.style.height = "auto"; return; }
      panel.style.height = panel.scrollHeight + "px";
      var done = function () {
        panel.style.height = "auto";
        panel.removeEventListener("transitionend", done);
      };
      panel.addEventListener("transitionend", done);
    };
    var close = function () {
      btn.setAttribute("aria-expanded", "false");
      panel.classList.remove("is-open");
      if (reduce) { panel.style.height = "0px"; panel.hidden = true; return; }
      panel.style.height = panel.scrollHeight + "px";
      // force reflow so the transition from a fixed height runs
      void panel.offsetHeight;
      panel.style.height = "0px";
      var done = function () {
        panel.hidden = true;
        panel.removeEventListener("transitionend", done);
      };
      panel.addEventListener("transitionend", done);
    };

    btn.addEventListener("click", function () {
      if (btn.getAttribute("aria-expanded") === "true") close(); else open();
    });
  });

  /* ---- Luma embed + fallback link ----------------------------------------- */
  var mount = $("#luma-mount");
  if (mount) {
    var url = (CFG.lumaCalendarUrl || "").trim();
    if (url) {
      var ph = $("#luma-placeholder");
      if (ph) ph.hidden = true;
      var frame = doc.createElement("iframe");
      frame.className = "luma-embed";
      frame.src = url;
      frame.title = mount.getAttribute("data-embed-title") || "Upcoming events calendar";
      frame.loading = "lazy";
      frame.setAttribute("allowfullscreen", "");
      frame.setAttribute("aria-hidden", "false");
      mount.appendChild(frame);
    }
  }
  // "View on Luma" fallback link (shown when a page URL is configured)
  var lumaLink = $("#luma-link");
  if (lumaLink) {
    var page = (CFG.lumaPageUrl || CFG.lumaCalendarUrl || "").trim();
    if (page) {
      lumaLink.setAttribute("href", page);
      lumaLink.setAttribute("target", "_blank");
      lumaLink.setAttribute("rel", "noopener");
      lumaLink.hidden = false;
    }
  }

  /* ---- Config-driven links (footer social + suggest CTAs) ------------------ */
  // data-lc="instagram|luma|contact" → external/mailto links, else plain text.
  var linkMap = {
    instagram: CFG.instagramUrl,
    luma: CFG.lumaPageUrl || CFG.lumaCalendarUrl,
    contact: CFG.contactEmail ? ("mailto:" + CFG.contactEmail) : ""
  };
  $all("[data-lc]").forEach(function (el) {
    var val = (linkMap[el.getAttribute("data-lc")] || "").trim();
    if (val) {
      el.setAttribute("href", val);
      if (val.indexOf("mailto:") !== 0) {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
    } else {
      // replace unconfigured link with plain text to avoid a broken href
      var span = doc.createElement("span");
      span.textContent = el.textContent;
      span.className = el.className;
      el.parentNode.replaceChild(span, el);
    }
  });
  // Suggest-an-activity CTAs → mailto when a contact email is set (keeps a
  // safe in-page fallback href otherwise).
  $all("[data-suggest]").forEach(function (el) {
    if (CFG.contactEmail) {
      var subj = el.getAttribute("data-suggest-subject") || "Activity idea for Logout Club";
      el.setAttribute("href", "mailto:" + CFG.contactEmail + "?subject=" + encodeURIComponent(subj));
    }
  });

  /* ---- Subtle scroll reveal ------------------------------------------------ */
  var reveals = $all(".reveal");
  if (reveals.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }
})();
