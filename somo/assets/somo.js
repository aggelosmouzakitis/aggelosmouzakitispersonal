/* =============================================================================
   SOMO — interactions
   Vanilla, dependency-free. Progressive enhancement: the site is fully usable
   without this file (nav links work, <details> FAQs open, forms POST natively).
   ========================================================================== */
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Analytics dispatch ------------------------------------------------
     Platform-agnostic. Pushes to dataLayer and calls gtag if a tag is present.
     Nothing is loaded here; wire a platform in the page <head> if desired. */
  function track(name, params) {
    params = params || {};
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: name }, params));
      if (typeof window.gtag === 'function') window.gtag('event', name, params);
      if (typeof window.somoAnalytics === 'function') window.somoAnalytics(name, params);
    } catch (e) { /* never let analytics break the page */ }
  }

  // Delegate clicks for any element carrying data-analytics
  doc.addEventListener('click', function (e) {
    var el = e.target.closest('[data-analytics]');
    if (!el) return;
    track(el.getAttribute('data-analytics'), {
      placement: el.getAttribute('data-placement') || undefined,
      label: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 80)
    });
  });

  /* ---- Header: desktop dropdown ------------------------------------------ */
  var dropToggle = doc.querySelector('.nav__toggle[aria-controls]');
  if (dropToggle) {
    var dropId = dropToggle.getAttribute('aria-controls');
    var drop = doc.getElementById(dropId);
    var item = dropToggle.closest('.nav__item');

    function openDrop() { dropToggle.setAttribute('aria-expanded', 'true'); if (drop) drop.classList.add('is-open'); }
    function closeDrop() { dropToggle.setAttribute('aria-expanded', 'false'); if (drop) drop.classList.remove('is-open'); }

    dropToggle.addEventListener('click', function (e) {
      e.preventDefault();
      var open = dropToggle.getAttribute('aria-expanded') === 'true';
      open ? closeDrop() : openDrop();
    });
    // Hover intent (desktop): reflect state on aria for AT parity
    if (item) {
      item.addEventListener('mouseenter', openDrop);
      item.addEventListener('mouseleave', closeDrop);
    }
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeDrop(); dropToggle.focus(); }
    });
    doc.addEventListener('click', function (e) {
      if (item && !item.contains(e.target)) closeDrop();
    });
    // Track product selection
    if (drop) {
      drop.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          track('product_dropdown_select', { product: (a.getAttribute('data-product') || a.textContent || '').trim() });
        });
      });
    }
  }

  /* ---- Header: mobile menu ------------------------------------------------ */
  var burger = doc.querySelector('.nav__burger');
  var panel = doc.querySelector('.mobile-panel');
  if (burger && panel) {
    function setMenu(open) {
      doc.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
      doc.documentElement.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () {
      setMenu(!doc.body.classList.contains('menu-open'));
    });
    // Close when a real link is tapped
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && doc.body.classList.contains('menu-open')) { setMenu(false); burger.focus(); }
    });

    // Mobile accordion (Experiences)
    panel.querySelectorAll('.mobile-panel__acc-btn').forEach(function (btn) {
      var sub = btn.nextElementSibling;
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        if (sub) sub.classList.toggle('is-open', !open);
      });
    });
  }

  /* ---- Language change tracking ------------------------------------------ */
  doc.querySelectorAll('[data-lang-switch]').forEach(function (a) {
    a.addEventListener('click', function () {
      track('language_change', { to: a.getAttribute('data-lang-switch') });
    });
  });

  /* ---- Reveal on scroll --------------------------------------------------- */
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    doc.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    doc.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Forms: validation, submit, confirmation --------------------------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  doc.querySelectorAll('form[data-somo-form]').forEach(function (form) {
    var fields = Array.prototype.slice.call(form.querySelectorAll('[data-validate]'));
    var statusEl = form.querySelector('[data-form-status]');
    var confirmEl = doc.getElementById(form.getAttribute('data-confirm') || '');
    var endpoint = form.getAttribute('action') || '';
    var mailto = form.getAttribute('data-mailto') || '';
    var startTracked = false;

    function fieldWrap(el) { return el.closest('.field, .checkfield'); }

    function showError(el, msg) {
      var wrap = fieldWrap(el);
      if (!wrap) return;
      wrap.setAttribute('data-invalid', 'true');
      el.setAttribute('aria-invalid', 'true');
      var err = wrap.querySelector('.field__err');
      if (err) err.textContent = msg;
    }
    function clearError(el) {
      var wrap = fieldWrap(el);
      if (!wrap) return;
      wrap.removeAttribute('data-invalid');
      el.removeAttribute('aria-invalid');
      var err = wrap.querySelector('.field__err');
      if (err) err.textContent = '';
    }
    function validateField(el) {
      var v = (el.value || '').trim();
      var type = el.getAttribute('data-validate');
      var msgs = JSON.parse(el.getAttribute('data-msg') || '{}');
      if (el.type === 'checkbox') {
        if (!el.checked) { showError(el, msgs.required || 'Required'); return false; }
        clearError(el); return true;
      }
      if (type.indexOf('required') > -1 && !v) { showError(el, msgs.required || 'Required'); return false; }
      if (type.indexOf('email') > -1 && v && !EMAIL_RE.test(v)) { showError(el, msgs.email || 'Enter a valid email'); return false; }
      clearError(el); return true;
    }

    // Track first interaction (form start)
    form.addEventListener('input', function () {
      if (!startTracked) { startTracked = true; track(form.getAttribute('data-event-start') || 'form_start'); }
    }, { once: false });

    fields.forEach(function (el) {
      el.addEventListener('blur', function () { validateField(el); });
      el.addEventListener('input', function () { if (fieldWrap(el) && fieldWrap(el).getAttribute('data-invalid')) validateField(el); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true; var firstBad = null;
      fields.forEach(function (el) { if (!validateField(el)) { ok = false; if (!firstBad) firstBad = el; } });
      if (!ok) {
        if (statusEl) { statusEl.textContent = form.getAttribute('data-msg-invalid') || 'Please check the highlighted fields.'; statusEl.style.color = 'var(--error)'; }
        if (firstBad) firstBad.focus();
        return;
      }
      if (statusEl) { statusEl.textContent = ''; }

      var submitBtn = form.querySelector('[type="submit"]');
      var data = new FormData(form);

      function succeed() {
        track(form.getAttribute('data-event-submit') || 'form_submit');
        if (confirmEl) {
          confirmEl.hidden = false;
          form.hidden = true;
          confirmEl.setAttribute('tabindex', '-1');
          confirmEl.focus();
          confirmEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        } else if (statusEl) {
          statusEl.textContent = form.getAttribute('data-msg-success') || 'Thank you. Your message has been sent.';
          statusEl.style.color = 'var(--ok)';
        }
      }
      function fallbackMailto() {
        if (!mailto) { succeed(); return; } // no endpoint + no email: show confirmation UI (demo/template)
        var lines = [];
        data.forEach(function (val, key) { if (key !== 'privacy' && key !== '_gotcha') lines.push(key + ': ' + val); });
        var subject = form.getAttribute('data-mail-subject') || 'SOMO enquiry';
        var href = 'mailto:' + mailto + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
        window.location.href = href;
        succeed();
      }

      if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '.7'; }

      if (endpoint) {
        fetch(endpoint, { method: 'POST', body: data, headers: { 'Accept': 'application/json' } })
          .then(function (res) {
            if (res.ok) { succeed(); }
            else { throw new Error('bad status'); }
          })
          .catch(function () { fallbackMailto(); })
          .then(function () { if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ''; } });
      } else {
        // No endpoint configured yet: fall back to an email draft, else confirmation UI.
        fallbackMailto();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ''; }
      }
    });
  });

  /* ---- Smooth-scroll for in-page anchors carrying focus ------------------- */
  doc.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      var target = doc.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      history.replaceState(null, '', '#' + id);
    });
  });

})();
