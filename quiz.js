/* נשימה / Neshima — quiz funnel (quiz.html)
   All copy lives in the QUIZ config below, keyed by the stored keys the
   backend validates (PRO-2 spec) — copy edits touch one place. */
(function () {
  'use strict';

  var CHAT_URL = 'https://hila.neshimacare.co.il';
  var ENDPOINT = 'https://hila.neshimacare.co.il/api/quiz-response';

  /* ---- Shared shell (same behaviour as script.js on index.html) ---- */
  document.querySelectorAll('a.js-chat').forEach(function (a) {
    a.href = CHAT_URL;
    a.target = '_blank';
    a.rel = 'noopener';
  });

  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var toggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');
  toggle.addEventListener('click', function () {
    var open = mobileNav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');
  });
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'פתיחת תפריט');
    });
  });

  /* ---- Canonical copy (PRO-2 spec) ---- */
  var QUIZ = {
    intro: {
      title: 'מה סוג העישון שלך?',
      sub: 'חמש שאלות, דקה אחת, בלי שיפוט. בסוף מחכה לך תובנה אישית.',
      start: 'להתחיל'
    },
    questions: [
      {
        key: 'attempts',
        text: 'כמה פעמים ניסית ברצינות להפסיק לעשן?',
        options: [
          { key: 'never', label: 'עוד לא ניסיתי' },
          { key: 'once', label: 'פעם אחת' },
          { key: 'two_three', label: '2–3 פעמים' },
          { key: 'four_plus', label: '4 פעמים או יותר' }
        ]
      },
      {
        key: 'obstacle',
        text: 'מה הכי מקשה עליך להפסיק?',
        options: [
          { key: 'stress', label: 'לחץ — הסיגריה היא הדרך שלי להירגע' },
          { key: 'habit', label: 'הרגל — זה פשוט חלק מהיום שלי (קפה, נהיגה, הפסקות)' },
          { key: 'social', label: 'חברה — כשמעשנים סביבי, קשה לא להצטרף' },
          { key: 'waves', label: 'חשק — גלים עזים שמגיעים פתאום' }
        ]
      },
      {
        key: 'craving_time',
        text: 'מתי הכי קשה לך בלי סיגריה?',
        options: [
          { key: 'morning', label: 'בבוקר, עם הקפה הראשון' },
          { key: 'after_meals', label: 'אחרי ארוחות ובהפסקות' },
          { key: 'evening', label: 'בערבים ובסופי שבוע' },
          { key: 'stress_moments', label: 'ברגעים של לחץ ועצבים' },
          { key: 'with_friends', label: 'במפגשים עם חברים' }
        ]
      },
      {
        key: 'concern',
        text: 'מה הכי מדאיג אותך לגבי מאמנת AI?',
        options: [
          { key: 'privacy', label: 'פרטיות — מי רואה את מה שאספר?' },
          { key: 'robotic', label: 'שזה ירגיש רובוטי' },
          { key: 'wont_work', label: 'שזה פשוט לא יעבוד' },
          { key: 'price', label: 'המחיר' },
          { key: 'nothing', label: 'שום דבר — הייתי מנסה' }
        ]
      },
      {
        key: 'willingness_to_pay',
        text: 'אם זה באמת היה עוזר לך להפסיק — כמה היה הגיוני לשלם בחודש?',
        options: [
          { key: 'free_only', label: 'רק אם זה בחינם או במימון קופת החולים' },
          { key: 'upto_30', label: 'עד 30 ₪' },
          { key: '30_80', label: '30–80 ₪' },
          { key: 'over_80', label: 'יותר מ-80 ₪' }
        ]
      }
    ],
    result: {
      eyebrow: 'סוג העישון שלך',
      types: {
        stress: {
          title: 'עישון של לחץ',
          body: 'אצלך הסיגריה היא לא סתם הרגל — היא דרך להתמודד. כשהלחץ עולה, היא ההפסקה שמותר לקחת. לכן גמילה שמתעלמת מהלחץ לא מחזיקה אצלך מעמד. נשימה לומדת לזהות איתך את הרגעים האלה, ועוזרת למצוא דרכים אחרות לפרוק — בדיוק כשזה קורה, לא ביום שאחרי.'
        },
        habit: {
          title: 'עישון של הרגל',
          body: 'הסיגריה שלך תפורה לתוך היום — קפה, נהיגה, הפסקה בעבודה — עד שהיא כמעט מדליקה את עצמה. החדשות הטובות: הרגל שנבנה אפשר גם לפרק, חוליה אחר חוליה. נשימה עוזרת לך למפות את הרגעים האלה ולבנות להם גרסה חדשה — בלי להילחם בכל היום שלך בבת אחת.'
        },
        social: {
          title: 'עישון חברתי',
          body: 'אצלך העישון חי בין אנשים — בבילויים, עם אלכוהול, בהפסקות משותפות. להפסיק מרגיש כמו לצאת מהחבורה. נשימה עוזרת לך להתכונן מראש לרגעים האלה ולהישאר בפנים — בלי סיגריה ובלי להרגיש בחוץ.'
        },
        waves: {
          title: 'גלי חשק',
          body: 'אצלך החשק לא מבקש רשות — הוא מגיע פתאום וחזק, ומרגיש כאילו יישאר לנצח. אבל גלים כאלה חולפים, גם כשברגע עצמו זה לא מרגיש ככה. נשימה זמינה בדיוק ברגעים האלה, 24/7, ועוזרת לך לעבור את הגל — נשימה אחת בכל פעם.'
        }
      },
      cravingLines: {
        morning: 'הבוקר הוא נקודת ההתחלה שלך: לנצח את הסיגריה הראשונה זה לשנות את כל היום.',
        after_meals: 'הרגעים שאחרי האוכל הם ההזדמנות שלך: טקס חדש במקום טקס ישן.',
        evening: 'הערבים הם המגרש שלך: בדיוק כשקשה, נשימה ערה איתך.',
        stress_moments: 'רגעי הלחץ הם המפתח שלך: שם ההרגל הכי חזק — ושם גם משתנים.',
        with_friends: 'המפגשים הם האתגר שלך: אפשר להישאר בפנים גם בלי להדליק.'
      },
      reassuranceLines: {
        privacy: 'ומה שחשוב לדעת: השיחות שלך נשארות פרטיות. בלי שיתוף, בלי שיפוט.',
        robotic: 'ונשימה לא מרצה ולא מטיפה — היא מדברת איתך בגובה העיניים, בעברית.',
        wont_work: 'בלי הבטחות קסם: מתחילים בקטן, רואים מה עובד לך, ומתקדמים משם.',
        price: 'ונשימה זמינה עכשיו בחינם — בלי כרטיס אשראי.',
        nothing: 'אז אין מה לחכות — נשימה כאן עכשיו.'
      },
      cta: 'לדבר עם נשימה עכשיו'
    },
    email: {
      header: 'רוצים גישה מוקדמת לתוכנית המלאה?',
      placeholder: 'המייל שלך',
      button: 'לשמור לי מקום',
      micro: 'נשתמש במייל רק כדי לעדכן על הגישה המוקדמת. בלי ספאם.',
      success: 'המקום שלך שמור 💛 נהיה בקשר.',
      error: 'אופס, משהו השתבש בשליחה. אפשר לנסות שוב.'
    },
    ui: {
      back: 'חזרה לשאלה הקודמת',
      backToIntro: 'חזרה להתחלה',
      progress: function (n, total) { return 'שאלה ' + n + ' מתוך ' + total; }
    }
  };

  /* ---- State ---- */
  var app = document.getElementById('quizApp');
  var answers = {}; // question key -> stored option key
  var quizId = null; // client-generated at quiz start; joins the two POSTs
  var answersPosted = false; // POST №1 fires once, when the result renders

  function newQuizId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'q-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }

  function resultType() {
    return answers.obstacle; // Q2 key doubles as the type key (spec table)
  }

  function postResponse(email) {
    var payload = {
      quiz_id: quizId,
      answers: answers,
      result_type: resultType(),
      source: 'quiz'
    };
    if (email) payload.email = email;
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  /* ---- Rendering ---- */
  function focusHeading() {
    var h = app.querySelector('[data-focus]');
    if (h) h.focus();
  }

  function renderIntro() {
    app.innerHTML =
      '<div class="quiz-intro center">' +
      '<p class="eyebrow">נשימה</p>' +
      '<h1 class="quiz-title" tabindex="-1" data-focus>' + QUIZ.intro.title + '</h1>' +
      '<p class="quiz-sub">' + QUIZ.intro.sub + '</p>' +
      '<button type="button" class="btn btn-primary btn-lg" id="quizStart">' + QUIZ.intro.start + '</button>' +
      '</div>';
    document.getElementById('quizStart').addEventListener('click', function () {
      if (!quizId) quizId = newQuizId();
      renderQuestion(0);
    });
    focusHeading();
  }

  function renderDots(current) {
    var total = QUIZ.questions.length;
    var dots = '';
    for (var i = 0; i < total; i++) {
      var cls = i < current ? ' done' : i === current ? ' active' : '';
      dots += '<span class="quiz-dot' + cls + '"></span>';
    }
    return (
      '<div class="quiz-progress" aria-hidden="true">' + dots + '</div>' +
      '<p class="visually-hidden">' + QUIZ.ui.progress(current + 1, total) + '</p>'
    );
  }

  function renderQuestion(idx) {
    var q = QUIZ.questions[idx];
    var chosen = answers[q.key];
    var html =
      renderDots(idx) +
      '<h2 class="quiz-question" tabindex="-1" data-focus>' + q.text + '</h2>' +
      '<div class="quiz-options" role="group" aria-label="' + q.text + '">';
    q.options.forEach(function (opt) {
      var selected = chosen === opt.key;
      html +=
        '<button type="button" class="quiz-option' + (selected ? ' selected' : '') + '"' +
        ' data-key="' + opt.key + '"' +
        (selected ? ' aria-pressed="true"' : ' aria-pressed="false"') +
        '>' + opt.label + '</button>';
    });
    html += '</div>';
    html +=
      '<button type="button" class="quiz-back" id="quizBack">' +
      (idx === 0 ? QUIZ.ui.backToIntro : QUIZ.ui.back) +
      '</button>';
    app.innerHTML = html;

    app.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.addEventListener('click', function () {
        answers[q.key] = btn.getAttribute('data-key');
        if (idx + 1 < QUIZ.questions.length) renderQuestion(idx + 1);
        else renderResult();
      });
    });
    document.getElementById('quizBack').addEventListener('click', function () {
      if (idx === 0) renderIntro();
      else renderQuestion(idx - 1);
    });
    focusHeading();
  }

  function renderResult() {
    var type = QUIZ.result.types[resultType()];
    var cravingLine = QUIZ.result.cravingLines[answers.craving_time];
    var reassuranceLine = QUIZ.result.reassuranceLines[answers.concern];

    app.innerHTML =
      '<div class="quiz-result">' +
      '<p class="eyebrow">' + QUIZ.result.eyebrow + '</p>' +
      '<h2 class="quiz-title" tabindex="-1" data-focus>' + type.title + '</h2>' +
      '<p class="quiz-body">' + type.body + '</p>' +
      '<p class="quiz-line">' + cravingLine + '</p>' +
      '<p class="quiz-line">' + reassuranceLine + '</p>' +
      '<div class="quiz-email">' +
      '<h3>' + QUIZ.email.header + '</h3>' +
      '<form id="quizEmailForm" class="quiz-email-form" novalidate>' +
      '<div class="quiz-email-row">' +
      '<input type="email" id="quizEmail" name="email" class="quiz-email-input" maxlength="200"' +
      ' placeholder="' + QUIZ.email.placeholder + '" autocomplete="email" aria-label="' + QUIZ.email.placeholder + '" required />' +
      '<button type="submit" class="btn btn-primary">' + QUIZ.email.button + '</button>' +
      '</div>' +
      /* Honeypot — mirrors the backend contract; humans never see it. */
      '<input type="text" name="website" class="visually-hidden" tabindex="-1" autocomplete="off" aria-hidden="true" />' +
      '<p class="quiz-micro">' + QUIZ.email.micro + '</p>' +
      '<p class="form-status" id="quizEmailStatus" role="status"></p>' +
      '</form>' +
      '</div>' +
      '<hr class="quiz-divider" />' +
      '<div class="center">' +
      '<a href="#" class="btn btn-primary btn-lg js-chat">' + QUIZ.result.cta + '</a>' +
      '</div>' +
      '</div>';

    // Late js-chat link (rendered after the initial shell wiring).
    app.querySelectorAll('a.js-chat').forEach(function (a) {
      a.href = CHAT_URL;
      a.target = '_blank';
      a.rel = 'noopener';
    });

    // POST №1 — the anonymous answer set, once. Failure is silent to the
    // visitor: the result still shows.
    if (!answersPosted) {
      answersPosted = true;
      postResponse().catch(function (err) {
        console.error('[נשימה] quiz response not stored:', err);
      });
    }

    var form = document.getElementById('quizEmailForm');
    var input = document.getElementById('quizEmail');
    var status = document.getElementById('quizEmailStatus');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = '';
      status.classList.remove('error');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      var email = input.value.trim();
      var honeypot = form.querySelector('input[name="website"]').value;
      var payloadEmail = email;
      var send = honeypot
        ? postHoneypot(honeypot, payloadEmail)
        : postResponse(payloadEmail);
      send
        .then(function (res) {
          if (res.ok) {
            form.innerHTML = '<p class="quiz-email-success">' + QUIZ.email.success + '</p>';
          } else {
            throw new Error('bad status ' + res.status);
          }
        })
        .catch(function () {
          status.textContent = QUIZ.email.error;
          status.classList.add('error');
          btn.disabled = false;
        });
    });

    focusHeading();
  }

  // A filled honeypot still posts (the backend answers 200 and stores nothing),
  // so bots see nothing special.
  function postHoneypot(honeypot, email) {
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quiz_id: quizId,
        answers: answers,
        result_type: resultType(),
        source: 'quiz',
        email: email,
        website: honeypot
      })
    });
  }

  renderIntro();
})();
