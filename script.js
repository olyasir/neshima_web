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

  /* ---- Quit-timing chips: optional single-select, tap the chosen chip again to clear ---- */
  var chipsWrap = document.getElementById('quitTimingChips');
  var quitTimingInput = document.getElementById('quitTiming');
  chipsWrap.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var wasSelected = chip.getAttribute('aria-pressed') === 'true';
      chipsWrap.querySelectorAll('.chip').forEach(function (c) {
        c.setAttribute('aria-pressed', 'false');
      });
      if (!wasSelected) chip.setAttribute('aria-pressed', 'true');
      quitTimingInput.value = wasSelected ? '' : chip.getAttribute('data-value');
    });
  });

  /* ---- SOS preview demo: scripted tap-through, chips only, no network ---- */
  (function sosDemo() {
    var screen = document.querySelector('.demo-screen');
    var bubblesEl = document.getElementById('demoBubbles');
    var endCard = document.getElementById('demoEnd');
    var cta = document.getElementById('sosDemoCta');
    if (!screen || !bubblesEl || !endCard) return;

    var SCRIPT = {
      opening: 'רגע של חשק? בדיוק בשביל זה אני כאן. איפה זה תופס אותך עכשיו?',
      contexts: [
        { chip: 'בבית, אחרי ארוחה', reply: 'אחרי ארוחה זה אחד הרגעים הכי חזקים — הגוף התרגל לחבר בין השניים. יש סיגריות בהישג יד?' },
        { chip: 'בעבודה, יום לחוץ', reply: 'יום לחוץ מחפש שסתום, וזה הגיוני לגמרי. יש סיגריות בהישג יד?' },
        { chip: 'בערב, עם קפה', reply: 'קפה וסיגריה הם צמד ותיק — ההרגל מדבר כאן, לא הצורך. יש סיגריות בהישג יד?' }
      ],
      yesChip: 'כן, ממש כאן',
      yesReply: 'הצעד הכי חזק עכשיו הוא מרחק: להרחיק את החפיסה לחדר אחר, או לצאת רגע החוצה. הגל הכי חזק בדקות הראשונות — ומרחק קטן מחליש אותו מאוד.',
      yesGo: 'הרחקתי. ממשיכים',
      noChip: 'לא',
      noReply: 'מצוין — זה כבר חצי ניצחון. עכשיו נותנים לגל לעבור.',
      noGo: 'איך?',
      breath: 'נושמים יחד: שאיפה איטית ל־4 שניות, עצירה קצרה, ונשיפה ארוכה ל־6. עוד פעמיים כאלה. רוב גלי החשק חולפים בלי לעשן — הם עולים, מגיעים לשיא, ויורדים.',
      breathGo: 'הגל ירד',
      counter: 'עוד חשק שעברת ✔ נשימה סופרת את הרגעים האלה — מונה שרק עולה, גם אם הייתה נפילה בדרך. וברגע אמיתי, השיחה פרטית לגמרי ונשימה זוכרת מה עזר לך.'
    };

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var TYPING_MS = reducedMotion ? 250 : 900;
    var started = false;

    function scrollToLatest() {
      screen.scrollTop = screen.scrollHeight;
    }

    function coach(text, then) {
      var typing = document.createElement('div');
      typing.className = 'bubble bot typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      bubblesEl.appendChild(typing);
      scrollToLatest();
      window.setTimeout(function () {
        bubblesEl.removeChild(typing);
        var b = document.createElement('div');
        b.className = 'bubble bot';
        b.textContent = text;
        bubblesEl.appendChild(b);
        scrollToLatest();
        if (then) then();
      }, TYPING_MS);
    }

    function chips(options) {
      var row = document.createElement('div');
      row.className = 'demo-chips';
      options.forEach(function (opt) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'chip';
        chip.setAttribute('aria-pressed', 'false');
        chip.textContent = opt.label;
        chip.addEventListener('click', function () {
          row.querySelectorAll('.chip').forEach(function (c) { c.disabled = true; });
          chip.setAttribute('aria-pressed', 'true');
          opt.next();
        });
        row.appendChild(chip);
      });
      bubblesEl.appendChild(row);
      scrollToLatest();
    }

    function stepBreath() {
      coach(SCRIPT.breath, function () {
        chips([{ label: SCRIPT.breathGo, next: function () {
          coach(SCRIPT.counter, function () {
            endCard.hidden = false;
            scrollToLatest();
          });
        } }]);
      });
    }

    function stepCigarettes() {
      chips([
        { label: SCRIPT.yesChip, next: function () {
          coach(SCRIPT.yesReply, function () {
            chips([{ label: SCRIPT.yesGo, next: stepBreath }]);
          });
        } },
        { label: SCRIPT.noChip, next: function () {
          coach(SCRIPT.noReply, function () {
            chips([{ label: SCRIPT.noGo, next: stepBreath }]);
          });
        } }
      ]);
    }

    function start() {
      if (started) return;
      started = true;
      coach(SCRIPT.opening, function () {
        chips(SCRIPT.contexts.map(function (c) {
          return { label: c.chip, next: function () { coach(c.reply, stepCigarettes); } };
        }));
      });
    }

    // With JS on, the live script replaces the static no-JS fallback.
    bubblesEl.innerHTML = '';

    if (cta) cta.addEventListener('click', start);

    if ('IntersectionObserver' in window) {
      var demoIo = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { start(); demoIo.disconnect(); }
        });
      }, { threshold: 0.35 });
      demoIo.observe(screen);
    } else {
      start();
    }
  })();

  /* ---- Signup form (async JSON submit to the coach-app pilot endpoint) ---- */
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

    var showSuccess = function () {
      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    var showError = function () {
      btn.disabled = false;
      btn.textContent = original;
      setStatus('אופס, משהו השתבש בשליחה. אפשר לנסות שוב או לכתוב לנו ישירות.', true);
    };

    // A missing or placeholder action is a configuration bug: fail visibly,
    // never pretend the submission worked.
    var endpoint = form.getAttribute('action');
    if (!endpoint || endpoint.indexOf('your-form-id') !== -1 || endpoint.indexOf('formspree') !== -1) {
      console.error('[נשימה] form action is not configured');
      showError();
      return;
    }

    var data = new FormData(form);
    var payload = {
      name: data.get('name') || '',
      contact: data.get('contact') || '',
      cigarettes_per_day: data.get('cigarettes_per_day') || '',
      message: data.get('message') || '',
      website: data.get('website') || '',
      consent: true, // checkValidity above guarantees the required checkbox is ticked
      source: 'landing'
    };
    var quitTiming = data.get('quit_timing');
    if (quitTiming) payload.quit_timing = quitTiming;

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (res.ok) {
          showSuccess();
        } else {
          throw new Error('bad status');
        }
      })
      .catch(showError);
  });
})();
