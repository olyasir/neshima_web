/* נשימה / Neshima — quiz funnel (quiz.html)
   All copy lives in the QUIZ config below, keyed by the stored keys the
   backend validates (PRO-33 spec) — copy edits touch one place. */
(function () {
  'use strict';

  // CHAT_URL is where visitors go (the אור app); ENDPOINT stays on the hila
  // backend, which hosts the quiz-response store.
  var CHAT_URL = 'https://app.neshimacare.co.il';
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
      sub: 'שש שאלות, דקה אחת, בלי שיפוט. בסוף מחכה לך פרופיל אישי.',
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
          { key: 'reward', label: 'פינוק — זה הפרס שלי, רגע קטן שכולו שלי' }
        ]
      },
      {
        key: 'hardest_cig',
        text: 'איזו סיגריה הכי קשה לוותר עליה?',
        options: [
          { key: 'first_morning', label: 'הראשונה של הבוקר, עם הקפה' },
          { key: 'after_hard_moment', label: 'זו שאחרי רגע קשה או עצבים' },
          { key: 'social_night', label: 'זו של הבילוי — עם חברים, בערב בחוץ' },
          { key: 'evening_treat', label: 'זו של סוף היום — השקט שמגיע לך' }
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
      eyebrow: 'פרופיל העישון שלך',
      types: {
        stress: {
          title: 'עישון של לחץ',
          essence: 'הסיגריה שלך היא שסתום לחץ — היא עובדת בדיוק ברגעים הקשים.',
          moment: 'הרגע שבו הלחץ עולה',
          techniques: [
            { name: 'רגע של עצירה', text: 'כשהלחץ עולה, לעצור שנייה אחת לפני שמדליקים. עצם העצירה מחזירה שליטה.' },
            { name: 'לשנות את הסיטואציה', text: 'לצאת מהחדר, להרחיק את החפיסה, לשתות משהו קר. חשק נחלש כשהטריגר רחוק.' },
            { name: 'לרכוב על הגל', text: 'רוב גלי החשק חולפים בלי לעשן. נשימה איטית עוזרת לעבור אותם, גל אחרי גל.' }
          ]
        },
        habit: {
          title: 'עישון של הרגל',
          essence: 'הסיגריה שלך תפורה לתוך היום — קפה, נהיגה, הפסקות.',
          moment: 'הרגע האוטומטי — קפה, הפסקה, נהיגה',
          techniques: [
            { name: 'למפות את הקבועות', text: 'לרשום את הסיגריות שבאות לבד (קפה, נהיגה, הפסקה). הרגל שרואים אפשר לפרק.' },
            { name: 'לשבור את הצמדים', text: 'לשנות פרט אחד בטקס: קפה במקום אחר, הפסקה בצד השני של הבניין.' },
            { name: 'להרחיק את הגירויים', text: 'חפיסה לא בכיס, מצת לא על השולחן. מה שרחוק מהיד רחוק מהפה.' }
          ]
        },
        social: {
          title: 'עישון חברתי',
          essence: 'הסיגריה שלך חיה בין אנשים — בבילויים ובהפסקות משותפות.',
          moment: 'הרגע שבו כולם יוצאים לעשן',
          techniques: [
            { name: 'משפט מוכן מראש', text: '«אני בניסיון הפסקה, אל תציעו לי» — כשיש תשובה מוכנה, הרגע הרבה פחות מביך.' },
            { name: 'לתכנן את הבילוי', text: 'לדעת מראש מתי כולם יוצאים לעשן, ולהחליט מה עושים באותן דקות במקום.' },
            { name: 'לגייס אדם אחד', text: 'חבר או בת זוג שיודעים ותומכים שווים יותר מכוח רצון כפול.' }
          ]
        },
        reward: {
          title: 'עישון של פינוק',
          essence: 'הסיגריה שלך היא הפרס — הרגע הקטן שמגיע לך.',
          moment: 'סוף היום, כשמגיע לך משהו טוב',
          techniques: [
            { name: 'להחליף את הפרס, לא לוותר עליו', text: 'ההפסקה, הקפה הטוב, הרגע באוויר נשארים. רק הסיגריה מתחלפת.' },
            { name: 'טקס ערב חדש', text: 'משהו קטן שמחכים לו בסוף היום, שהוא באמת פינוק ולא פשרה.' },
            { name: 'לשמור על ההפסקות', text: 'מותר לקחת הפסקה בלי סיגריה. ההפסקה היא הצורך האמיתי — לא העשן.' }
          ]
        }
      },
      secondaryChip: 'וגם: ',
      mixTwo: 'רוב האנשים הם שילוב של כמה סוגים — זה השילוב שלך.',
      mixSingle: 'אצלך התמונה חדה במיוחד — סוג אחד מוביל בבירור.',
      techniquesHeader: 'מה עובד לסוג שלך',
      secondarySubLabel: function (title) { return 'ובשביל הצד של ' + title + ':'; },
      bridgeHeader: 'ולרגע הקריטי עצמו',
      bridgeBody: function (moment) {
        return 'לסוג שלך הרגע הקריטי הוא ' + moment + '. בדיוק בשביל זה בנינו את נשימה — שיחה אמיתית בדיוק ברגע הזה, 24/7, בלי שיפוט.';
      },
      shareNudge: 'מזהים מישהו בסוג הזה? שלחו לו את השאלון.',
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
      header: 'רוצים את התוכנית המלאה, מותאמת לסוג שלך?',
      placeholder: 'המייל שלך',
      button: 'לשמור לי מקום',
      micro: 'נשתמש במייל רק כדי לעדכן על הגישה המוקדמת — שכבר תותאם לסוג שלך. בלי ספאם.',
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

  /* ---- Scoring (PRO-33 spec): weights 2/2/1, secondary only at score >= 2 ---- */
  var HARDEST_TO_TYPE = {
    first_morning: 'habit',
    after_hard_moment: 'stress',
    social_night: 'social',
    evening_treat: 'reward'
  };
  var CRAVING_TO_TYPE = {
    morning: 'habit',
    after_meals: 'habit',
    evening: 'reward',
    stress_moments: 'stress',
    with_friends: 'social'
  };
  var TIE_ORDER = ['stress', 'reward', 'habit', 'social'];

  // Pure: answers -> { primary, secondary|null }. Tie-break: Q2's vote, then
  // hardest_cig's vote, then the fixed order above. Timing alone (score 1)
  // never makes a secondary.
  function scoreProfile(a) {
    var scores = { stress: 0, habit: 0, social: 0, reward: 0 };
    scores[a.obstacle] += 2;
    scores[HARDEST_TO_TYPE[a.hardest_cig]] += 2;
    scores[CRAVING_TO_TYPE[a.craving_time]] += 1;

    function pick(excluded) {
      var best = -1;
      TIE_ORDER.forEach(function (t) {
        if (t !== excluded && scores[t] > best) best = scores[t];
      });
      var tied = TIE_ORDER.filter(function (t) {
        return t !== excluded && scores[t] === best;
      });
      if (tied.indexOf(a.obstacle) !== -1) return a.obstacle;
      if (tied.indexOf(HARDEST_TO_TYPE[a.hardest_cig]) !== -1) return HARDEST_TO_TYPE[a.hardest_cig];
      return tied[0];
    }

    var primary = pick(null);
    var secondary = pick(primary);
    return { primary: primary, secondary: scores[secondary] >= 2 ? secondary : null };
  }

  function profile() {
    return scoreProfile(answers);
  }

  function postResponse(email) {
    var p = profile();
    var payload = {
      quiz_id: quizId,
      answers: answers,
      result_type: p.primary,
      source: 'quiz'
    };
    if (p.secondary) payload.result_secondary = p.secondary;
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

  function techniquesHtml(items) {
    var html = '';
    items.forEach(function (t) {
      html += '<li class="quiz-tech"><strong>' + t.name + '</strong> — ' + t.text + '</li>';
    });
    return html;
  }

  function renderResult() {
    var p = profile();
    var primary = QUIZ.result.types[p.primary];
    var secondary = p.secondary ? QUIZ.result.types[p.secondary] : null;
    var cravingLine = QUIZ.result.cravingLines[answers.craving_time];
    var reassuranceLine = QUIZ.result.reassuranceLines[answers.concern];

    var cardHtml =
      '<div class="quiz-profile-card">' +
      '<p class="quiz-profile-brand" aria-hidden="true">' +
      '<svg class="brand-mark" viewBox="0 0 48 48"><use href="#logo-mark"></use></svg>' +
      '<span>נשימה</span>' +
      '</p>' +
      '<p class="eyebrow">' + QUIZ.result.eyebrow + '</p>' +
      '<h2 class="quiz-title quiz-profile-title" tabindex="-1" data-focus>' + primary.title + '</h2>' +
      (secondary
        ? '<p class="quiz-chip">' + QUIZ.result.secondaryChip + secondary.title + '</p>'
        : '') +
      '<p class="quiz-mix">' + (secondary ? QUIZ.result.mixTwo : QUIZ.result.mixSingle) + '</p>' +
      '<p class="quiz-essence">' + primary.essence + '</p>' +
      (secondary ? '<p class="quiz-essence">' + secondary.essence + '</p>' : '') +
      '<h3 class="quiz-tech-header">' + QUIZ.result.techniquesHeader + '</h3>' +
      '<ul class="quiz-tech-list">' + techniquesHtml(primary.techniques) + '</ul>' +
      (secondary
        ? '<p class="quiz-tech-sublabel">' + QUIZ.result.secondarySubLabel(secondary.title) + '</p>' +
          '<ul class="quiz-tech-list">' + techniquesHtml(secondary.techniques.slice(0, 2)) + '</ul>'
        : '') +
      '<h3 class="quiz-bridge-header">' + QUIZ.result.bridgeHeader + '</h3>' +
      '<p class="quiz-bridge-body">' + QUIZ.result.bridgeBody(primary.moment) + '</p>' +
      '</div>';

    app.innerHTML =
      '<div class="quiz-result">' +
      cardHtml +
      '<p class="quiz-share">' + QUIZ.result.shareNudge + '</p>' +
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
    var p = profile();
    var payload = {
      quiz_id: quizId,
      answers: answers,
      result_type: p.primary,
      source: 'quiz',
      email: email,
      website: honeypot
    };
    if (p.secondary) payload.result_secondary = p.secondary;
    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  }

  renderIntro();
})();
