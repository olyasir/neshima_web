# הילה — Website / אתר נחיתה

Landing page for **Hila (הילה)** — the Hebrew AI coaching app that helps pregnant
women quit smoking, with a pilot sign-up form. Static, responsive, RTL, no build step.

## Files
- `index.html` — the page (Hebrew, RTL)
- `styles.css` — soft premium design system + responsive/mobile
- `script.js` — mobile nav, scroll reveal, async form submit
- `assets/favicon.svg` — logo / favicon

## Run locally
Just open `index.html` in a browser, or serve it:
```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Set the live chat link (most important)
The hero and every "דברי עם הילה" button send her straight to your live chat — that's the
immediate-help path. Until you set it, those buttons fall back to the sign-up form. To turn them on:

1. Open `script.js`.
2. Set `CHAT_URL` to your real chat link — a WhatsApp link (`https://wa.me/9725XXXXXXXX`)
   or your web-app URL (`https://chat.hila.app`).

Every chat button across the page updates automatically (opens in a new tab).

## Wire up the pilot sign-up form (2 minutes)
The form currently runs in **demo mode** (it shows the thank-you message but does not
store anything). To actually receive sign-ups:

1. Create a free form at **https://formspree.io** (or Tally/Getform — any service that
   accepts a POST works).
2. Copy your endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
3. In `index.html`, find the `<form id="signupForm" ... action="...">` line and replace
   `https://formspree.io/f/your-form-id` with your real endpoint.

That's it — submissions will email you and the page shows the success state automatically.
Fields sent: `name`, `contact`, `pregnancy_week`, `message`, `consent`.

### Prefer a Google Form instead?
Replace the `<form>...</form>` block with an `<iframe src="YOUR_GOOGLE_FORM/viewform?embedded=true">`,
or link the "הצטרפי לפיילוט" buttons (`href="#signup"`) directly to the Google Form URL.

## Deploy (free)
Any static host works — the whole folder is the site:
- **Netlify / Vercel:** drag-and-drop the `website/` folder, or connect a git repo.
- **GitHub Pages:** push the folder, enable Pages on the branch.
- **Cloudflare Pages:** point it at the folder.

No server, database, or build required.

## Editing content
- **Copy/text:** all Hebrew copy lives directly in `index.html`.
- **Team:** the two `.member` cards in the `#team` section. Swap the initials avatars for
  real photos by replacing the `<div class="avatar ...">` with `<img class="avatar" src="...">`.
- **Colors:** the palette is at the top of `styles.css` under `:root` (cream / sage / blush).
- **Pilot details:** dates and numbers are in the `#pilot` section.

## Notes
- Fully responsive (desktop / tablet / mobile) and RTL.
- Respects `prefers-reduced-motion`.
- Includes a crisis-line note (ער"ן 1201) in the footer — keep this for the sensitive audience.
