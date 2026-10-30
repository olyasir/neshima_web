/* נשימה / Neshima — interactions */
(function () {
  'use strict';

  /* ---- Chat link: the live coach (web app) ---- */
  var CHAT_URL = 'https://hila.neshimacare.co.il';
  (function wireChat() {
    var ready = CHAT_URL && CHAT_URL.indexOf('PASTE_YOUR') === -1;
    document.querySelectorAll('a.js-chat').forEach(function (a) {
      if (ready) {
        a.href = CHAT_URL;
        a.target = '_blank';
        a.rel = 'noopener';
      } else {
        a.href = '#signup'; // fallback until the chat link is set
      }
    });
  })();

  /* ---- Sticky header shadow on scroll ---- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  function closeNav() {
    mobileNav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'פתיחת תפריט');
  }
  toggle.addEventListener('click', function () {
    var open = mobileNav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
  });
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeNav);
  });

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Signup form (Formspree-style async submit) ---- */
  var form = document.getElementById('signupForm');
  var status = document.getElementById('formStatus');
  var success = document.getElementById('formSuccess');

  function setStatus(msg, isError) {
    status.textContent = msg || '';
    status.classList.toggle('error', !!isError);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    setStatus('');

    if (!form.checkValidity()) {
      setStatus('נראה שחסר משהו — נא למלא את שדות החובה ולאשר יצירת קשר.', true);
      form.reportValidity();
      return;
    }

    var btn = form.querySelector('button[type="submit"]');
    var original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'שולחים…';

    var endpoint = form.getAttribute('action');
    var notConfigured = !endpoint || endpoint.indexOf('your-form-id') !== -1;

    var showSuccess = function () {
      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // If the Formspree endpoint isn't wired yet, succeed gracefully (demo mode).
    if (notConfigured) {
      console.warn('[נשימה] טופס לא מחובר עדיין — יש להחליף את action ב-Formspree endpoint.');
      setTimeout(showSuccess, 600);
      return;
    }

    fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (res) {
        if (res.ok) {
          showSuccess();
        } else {
          throw new Error('bad status');
        }
      })
      .catch(function () {
        btn.disabled = false;
        btn.textContent = original;
        setStatus('אופס, משהו השתבש בשליחה. אפשר לנסות שוב או לכתוב לנו ישירות.', true);
      });
  });
})();
