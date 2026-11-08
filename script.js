/* נשימה / Neshima — interactions */
(function () {
  'use strict';

  /* ---- Chat links: anchors carry the app URL in plain href (works with JS off);
     JS only adds new-tab behaviour. ---- */
  var CHAT_URL = 'https://app.neshimacare.co.il';
  (function wireChat() {
    document.querySelectorAll('a.js-chat').forEach(function (a) {
      a.href = CHAT_URL;
      a.target = '_blank';
      a.rel = 'noopener';
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
      breathStill: 'עדיין חזק',
      stillStrong: 'זה בסדר, אפשר להישאר כאן. לפעמים הגל מגיע בכמה סבבים, ואין לאן למהר. מה יעזור עכשיו?',
      againChip: 'עוד סבב נשימה',
      otherChip: 'משהו אחר',
      breathAgain: 'עוד סבב, באותו קצב: שאיפה איטית ל־4, עצירה קצרה, נשיפה ארוכה ל־6. אני כאן איתכם.',
      other: 'אפשר לצאת רגע החוצה, לשטוף פנים במים קרים או לקום ולהתהלך בבית. אני כאן עד שתגידו שהגל ירד.',
      otherAgain: 'עוד דבר קטן: כוס מים לאט, או לספור חמישה דברים שרואים סביבכם. אני כאן.',
      appNudge: 'אם הגל עדיין חזק, אפשר לעבור לשיחה אמיתית. בפנים נשימה מכירה את מה שעזר לכם קודם ומתאימה את הצעד הבא. ואפשר גם להישאר כאן.',
      openApp: 'לפתוח את נשימה',
      counter: 'עוד חשק שעבר ✔ נשימה סופרת את הרגעים האלה — מונה שרק עולה, גם אם הייתה נפילה בדרך. וברגע אמיתי, נשימה שומרת רק כמה פרטים שעזרו, כדי לזכור אותם בפעם הבאה.'
    };

    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var TYPING_MS = reducedMotion ? 250 : 900;
    var started = false;
    var stillStrongTaps = 0;

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

    function appLink() {
      var a = document.createElement('a');
      a.className = 'btn btn-ghost btn-sm js-chat';
      a.href = CHAT_URL;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = SCRIPT.openApp;
      return a;
    }

    function chips(options, extra) {
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
      if (extra) row.appendChild(extra);
      bubblesEl.appendChild(row);
      scrollToLatest();
    }

    function finish() {
      coach(SCRIPT.counter, function () {
        endCard.hidden = false;
        scrollToLatest();
      });
    }

    function askHowTheWaveIs() {
      var waveChips = [
        { label: SCRIPT.breathGo, next: finish },
        { label: SCRIPT.breathStill, next: stepStillStrong }
      ];
      if (stillStrongTaps < 2) {
        chips(waveChips);
        return;
      }
      coach(SCRIPT.appNudge, function () { chips(waveChips, appLink()); });
    }

    function stepStillStrong() {
      stillStrongTaps += 1;
      var otherReply = stillStrongTaps < 2 ? SCRIPT.other : SCRIPT.otherAgain;
      coach(SCRIPT.stillStrong, function () {
        chips([
          { label: SCRIPT.againChip, next: function () { coach(SCRIPT.breathAgain, askHowTheWaveIs); } },
          { label: SCRIPT.otherChip, next: function () { coach(otherReply, askHowTheWaveIs); } }
        ]);
      });
    }

    function stepBreath() {
      coach(SCRIPT.breath, askHowTheWaveIs);
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
})();
