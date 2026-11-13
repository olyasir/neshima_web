/* נשימה / Neshima — quiz funnel (quiz.html)
   All copy lives in the QUIZ config below, keyed by the stored keys the
   backend validates (PRO-33 spec) — copy edits touch one place. */
(function () {
  'use strict';

  // CHAT_URL is where visitors go (the אור app); ENDPOINT stays on the hila
  // backend, which hosts the quiz-response store.
  var CHAT_URL = 'https://app.neshimacare.co.il';
  var ENDPOINT = 'https://hila.neshimacare.co.il/api/quiz-response';
  var DOUBLE_TAP_WINDOW_MS = 1000;

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
    toggle.setAttribute('aria-label', open ? QUIZ.ui.menuClose : QUIZ.ui.menuOpen);
  });
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', QUIZ.ui.menuOpen);
    });
  });

  /* ---- Canonical copy (PRO-2 spec). quiz-en.html sets <html lang="en">. ---- */
  var QUIZ_EN = {
    brand: 'Neshima',
    intro: {
      title: 'What kind of smoker are you?',
      sub: 'Six questions, one minute, no judgement. A personal profile is waiting at the end.',
      start: 'Start'
    },
    questions: [
      {
        key: 'attempts',
        text: 'How many times have you seriously tried to quit?',
        options: [
          { key: 'never', label: 'I haven’t tried yet' },
          { key: 'once', label: 'Once' },
          { key: 'two_three', label: '2–3 times' },
          { key: 'four_plus', label: '4 times or more' }
        ]
      },
      {
        key: 'obstacle',
        text: 'What makes quitting hardest for you?',
        options: [
          { key: 'stress', label: 'Stress: a cigarette is how I calm down' },
          { key: 'habit', label: 'Habit: it’s just part of my day (coffee, driving, breaks)' },
          { key: 'social', label: 'Company: when people smoke around me, it’s hard not to join' },
          { key: 'reward', label: 'A treat: it’s my reward, a small moment that’s all mine' }
        ]
      },
      {
        key: 'hardest_cig',
        text: 'Which cigarette is hardest to give up?',
        options: [
          { key: 'first_morning', label: 'The first one in the morning, with coffee' },
          { key: 'after_hard_moment', label: 'The one after a hard or tense moment' },
          { key: 'social_night', label: 'The one when going out, with friends, in the evening' },
          { key: 'evening_treat', label: 'The one at the end of the day, the quiet you’ve earned' }
        ]
      },
      {
        key: 'craving_time',
        text: 'When is it hardest for you without a cigarette?',
        options: [
          { key: 'morning', label: 'In the morning, with the first coffee' },
          { key: 'after_meals', label: 'After meals and on breaks' },
          { key: 'evening', label: 'Evenings and weekends' },
          { key: 'stress_moments', label: 'In moments of stress and anger' },
          { key: 'with_friends', label: 'When I’m with friends' }
        ]
      },
      {
        key: 'concern',
        text: 'What worries you most about AI support?',
        options: [
          { key: 'privacy', label: 'Privacy: who sees what I share?' },
          { key: 'robotic', label: 'That it will feel robotic' },
          { key: 'wont_work', label: 'That it just won’t work' },
          { key: 'price', label: 'The price' },
          { key: 'nothing', label: 'Nothing, I’d give it a try' }
        ]
      },
      {
        key: 'willingness_to_pay',
        text: 'If it really helped you quit, how much would make sense to pay per month?',
        options: [
          { key: 'free_only', label: 'Only if it’s free or covered by my health fund' },
          { key: 'upto_30', label: 'Up to ₪30' },
          { key: '30_80', label: '₪30–80' },
          { key: 'over_80', label: 'More than ₪80' }
        ]
      }
    ],
    result: {
      eyebrow: 'Your smoking profile',
      types: {
        stress: {
          title: 'Stress smoking',
          essence: 'Your cigarette is a pressure valve: it kicks in exactly at the hard moments.',
          moment: 'the moment stress rises',
          techniques: [
            { name: 'A moment of pause', text: 'When stress rises, stop for one second before lighting up. The pause itself gives you back control.' },
            { name: 'Change the situation', text: 'Leave the room, move the pack away, drink something cold. A craving weakens when the trigger is far away.' },
            { name: 'Ride the wave', text: 'Most craving waves pass without smoking. Slow breathing helps you get through them, wave after wave.' }
          ]
        },
        habit: {
          title: 'Habit smoking',
          essence: 'Your cigarette is woven into your day: coffee, driving, breaks.',
          moment: 'the automatic moment: coffee, a break, driving',
          techniques: [
            { name: 'Map the regulars', text: 'Write down the cigarettes that come on their own (coffee, driving, breaks). A habit you can see, you can take apart.' },
            { name: 'Break the pairs', text: 'Change one detail of the ritual: coffee somewhere else, a break on the other side of the building.' },
            { name: 'Move the cues away', text: 'The pack out of your pocket, the lighter off the table. Out of reach is out of mind.' }
          ]
        },
        social: {
          title: 'Social smoking',
          essence: 'Your cigarette lives among people: nights out and shared breaks.',
          moment: 'the moment everyone goes out to smoke',
          techniques: [
            { name: 'A line ready in advance', text: '«I’m trying to quit, don’t offer me one.» With an answer ready, the moment is much less awkward.' },
            { name: 'Plan the night out', text: 'Know in advance when everyone steps out to smoke, and decide what you’ll do in those minutes instead.' },
            { name: 'Recruit one person', text: 'One friend or partner who knows and supports you is worth more than double the willpower.' }
          ]
        },
        reward: {
          title: 'Treat smoking',
          essence: 'Your cigarette is the reward: the small moment you’ve earned.',
          moment: 'the end of the day, when you’ve earned something good',
          techniques: [
            { name: 'Swap the reward, don’t give it up', text: 'The break, the good coffee, the moment outside all stay. Only the cigarette changes.' },
            { name: 'A new evening ritual', text: 'Something small to look forward to at the end of the day, that’s a real treat and not a compromise.' },
            { name: 'Keep your breaks', text: 'You can take a break without a cigarette. The break is the real need, not the smoke.' }
          ]
        }
      },
      secondaryChip: 'And also: ',
      mixTwo: 'Most people are a mix of a few types. This is your mix.',
      mixSingle: 'Your picture is especially clear: one type clearly leads.',
      techniquesHeader: 'What works for your type',
      secondarySubLabel: function (title) { return 'And for your ' + title.toLowerCase() + ' side:'; },
      bridgeHeader: 'And for the critical moment itself',
      bridgeBody: function (moment) {
        return 'For your type, the critical moment is ' + moment + '. That’s exactly why we built Neshima: a real conversation right at that moment, 24/7, without judgement. The Neshima app speaks Hebrew for now.';
      },
      shareNudge: 'Know people who’d recognise themselves in this type? Send them the quiz.',
      cravingLines: {
        morning: 'The morning is your starting point: beat the first cigarette and you change the whole day.',
        after_meals: 'The moments after meals are your opportunity: a new ritual instead of an old one.',
        evening: 'Evenings are your ground: right when it’s hard, Neshima is awake with you.',
        stress_moments: 'Moments of stress are your key: that’s where the habit is strongest, and that’s where it changes.',
        with_friends: 'Get-togethers are your challenge: you can stay in the room without lighting up.'
      },
      reassuranceLines: {
        privacy: 'A fair question. Ask us anything about how your information is handled before you start.',
        robotic: 'And Neshima doesn’t lecture or preach. It talks with you at eye level.',
        wont_work: 'No magic promises: you start small, see what works for you, and go from there.',
        price: 'And Neshima is available now for free, no credit card.',
        nothing: 'Then there’s no reason to wait. Neshima is here now.'
      },
      cta: 'Talk to Neshima now'
    },
    email: {
      header: 'Want the full plan, tailored to your type?',
      label: 'Your email',
      placeholder: 'name@example.com',
      invalid: 'That email address doesn’t look right. Could you check it?',
      button: 'Keep me posted',
      micro: 'We’ll use your email only to update you on what’s new and on the full plan for your type. No spam.',
      success: 'Thank you 💛 We’ll keep you posted.',
      error: 'Oops, something went wrong sending it. You can try again.'
    },
    ui: {
      back: 'Back to the previous question',
      backToIntro: 'Back to the start',
      progress: function (n, total) { return 'Question ' + n + ' of ' + total; },
      menuOpen: 'Open menu',
      menuClose: 'Close menu'
    }
  };

  var QUIZ_HE = {
    brand: 'נשימה',
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
          { key: 'two_three', label: '2-3 פעמים' },
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
        text: 'מה הכי מדאיג אותך לגבי ליווי AI?',
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
          { key: '30_80', label: '30-80 ₪' },
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
      shareNudge: 'מכירים אנשים שמזהים את עצמם בסוג הזה? שלחו להם את השאלון.',
      cravingLines: {
        morning: 'הבוקר הוא נקודת ההתחלה שלך: לנצח את הסיגריה הראשונה זה לשנות את כל היום.',
        after_meals: 'הרגעים שאחרי האוכל הם ההזדמנות שלך: טקס חדש במקום טקס ישן.',
        evening: 'הערבים הם המגרש שלך: בדיוק כשקשה, נשימה ערה איתך.',
        stress_moments: 'רגעי הלחץ הם המפתח שלך: שם ההרגל הכי חזק — ושם גם משתנים.',
        with_friends: 'המפגשים הם האתגר שלך: אפשר להישאר בפנים גם בלי להדליק.'
      },
      reassuranceLines: {
        privacy: 'ומה שחשוב לדעת: נשימה שומרת רק כמה פרטים שעזרו, כדי לזכור אותם בפעם הבאה. בלי שיפוט.',
        robotic: 'ונשימה לא מרצה ולא מטיפה — היא מדברת איתך בגובה העיניים, בעברית.',
        wont_work: 'בלי הבטחות קסם: מתחילים בקטן, רואים מה עובד לך, ומתקדמים משם.',
        price: 'ונשימה זמינה עכשיו בחינם — בלי כרטיס אשראי.',
        nothing: 'אז אין מה לחכות — נשימה כאן עכשיו.'
      },
      cta: 'לדבר עם נשימה עכשיו'
    },
    email: {
      header: 'רוצים את התוכנית המלאה, מותאמת לסוג שלך?',
      label: 'המייל שלך',
      placeholder: 'name@example.com',
      invalid: 'כתובת המייל לא נראית תקינה. אפשר לבדוק אותה?',
      button: 'לעדכן אותי',
      micro: 'נשתמש במייל רק כדי לעדכן על חידושים ועל התוכנית המלאה, מותאמת לסוג שלך. בלי ספאם.',
      success: 'תודה 💛 נעדכן אותך.',
      error: 'אופס, משהו השתבש בשליחה. אפשר לנסות שוב.'
    },
    ui: {
      back: 'חזרה לשאלה הקודמת',
      backToIntro: 'חזרה להתחלה',
      progress: function (n, total) { return 'שאלה ' + n + ' מתוך ' + total; },
      menuOpen: 'פתיחת תפריט',
      menuClose: 'סגירת תפריט'
    }
  };

  var LANG = document.documentElement.lang === 'en' ? 'en' : 'he';
  var QUIZ = LANG === 'en' ? QUIZ_EN : QUIZ_HE;

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
      source: 'quiz',
      lang: LANG
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
      '<p class="eyebrow">' + QUIZ.brand + '</p>' +
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

  // Keyboard activation fires a click with detail 0, so only pointer taps are held back.
  function ignoringEarlyPointerTaps(renderedAt, handler) {
    return function (e) {
      if (e.detail > 0 && Date.now() - renderedAt < DOUBLE_TAP_WINDOW_MS) return;
      handler();
    };
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

    var renderedAt = Date.now();
    app.querySelectorAll('.quiz-option').forEach(function (btn) {
      btn.addEventListener('click', ignoringEarlyPointerTaps(renderedAt, function () {
        answers[q.key] = btn.getAttribute('data-key');
        if (idx + 1 < QUIZ.questions.length) renderQuestion(idx + 1);
        else renderResult();
      }));
    });
    document.getElementById('quizBack').addEventListener('click', ignoringEarlyPointerTaps(renderedAt, function () {
      if (idx === 0) renderIntro();
      else renderQuestion(idx - 1);
    }));
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
      '<span>' + QUIZ.brand + '</span>' +
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
      '<label for="quizEmail" class="quiz-email-label">' + QUIZ.email.label + '</label>' +
      '<div class="quiz-email-row">' +
      '<input type="email" id="quizEmail" name="email" class="quiz-email-input" dir="ltr" maxlength="200"' +
      ' placeholder="' + QUIZ.email.placeholder + '" autocomplete="email" aria-describedby="quizEmailStatus" required />' +
      '<button type="submit" class="btn btn-primary">' + QUIZ.email.button + '</button>' +
      '</div>' +
      /* Honeypot — mirrors the backend contract; humans never see it. */
      '<input type="text" name="website" class="visually-hidden" tabindex="-1" autocomplete="off" aria-hidden="true" />' +
      '<p class="form-status" id="quizEmailStatus" role="status"></p>' +
      '<p class="quiz-micro">' + QUIZ.email.micro + '</p>' +
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
        console.error('[Neshima] quiz response not stored:', err);
      });
    }

    var form = document.getElementById('quizEmailForm');
    var input = document.getElementById('quizEmail');
    var status = document.getElementById('quizEmailStatus');
    function clearStatus() {
      input.removeAttribute('aria-invalid');
      status.textContent = '';
      status.classList.remove('error');
    }
    input.addEventListener('input', clearStatus);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearStatus();
      if (!input.checkValidity()) {
        input.setAttribute('aria-invalid', 'true');
        status.textContent = QUIZ.email.invalid;
        status.classList.add('error');
        input.focus();
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
      lang: LANG,
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
