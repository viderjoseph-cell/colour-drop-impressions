# Colour Drop Impression — Website Source

This is the full source code for the Colour Drop Impression website. It's a
plain HTML/CSS/JS site — no build step, no framework, no server required to
view it.

## Files

```
index.html      The website itself
styles.css      All styling
script.js       Nav menu, portfolio scroller, quote-form → WhatsApp logic
admin.html      Password-gated content editor (see "The admin page" below)
admin.js        Logic for admin.html
images/         All photos, logo, and portfolio pictures
```

## Viewing it locally

Because `admin.html` and the quote form use `fetch()`, opening `index.html`
by double-clicking it will mostly work, but **admin.html needs a local
server** (browsers block `fetch()` on `file://` pages). The easiest way:

- **VS Code**: install the "Live Server" extension, right-click
  `index.html`, choose "Open with Live Server."
- **Or**, with Python installed, run this in the project folder:
  ```
  python3 -m http.server 8000
  ```
  then open `http://localhost:8000` in a browser.

## Deploying it

Any static host works: Netlify, Vercel, GitHub Pages, Cloudflare Pages, or
regular shared hosting (just upload the files via FTP/cPanel). There's
nothing to build or install — upload the files as they are.

## Editing text content

Instead of hunting through the HTML, open **admin.html** (locally or on
your live site) and you'll get a form for:

- The homepage subtitle
- About us text and the four value bullets
- The CEO bio
- The achievements paragraph
- All 6 service cards (title, description, examples)
- Phone numbers, email, studio address line, payment note
- The footer blurb

Fill it in, click **"Download updated index.html,"** and replace the old
`index.html` on your host with the new one. `styles.css`, `script.js`, and
the `images/` folder don't need to change for a text edit.

The default password is set in `admin.js`:

```js
const EDITOR_PASSWORD = "colourdrop2026";
```

**Change this before handing the site to a client or going live.**

### ⚠️ Please read this part before relying on the admin page

`admin.html` is a convenience tool, not a security system. Here's exactly
what it does and doesn't do:

- It runs **entirely in the browser**. There's no server, no login system,
  no database — it fetches `index.html`, lets you edit the text in a form,
  and hands you back a new file to upload.
- The password is sitting in plain text in `admin.js`. Anyone who knows the
  URL and opens their browser's dev tools (or just views the page source)
  can read it, or skip the check entirely. It will stop a random visitor
  from poking around; it will **not** stop anyone who actually wants in.
- Nothing saves automatically. Every change means downloading a new
  `index.html` and re-uploading it. There's no version history and no undo
  beyond keeping your own backups.

**If you need real "only the admin can log in and change this" security** —
a proper login, instant saves with no re-uploading, multiple staff
accounts, an activity log — that requires an actual backend. A developer
could add this a few different ways, roughly easiest → most involved:

1. **Decap CMS** (free, git-based) — bolts a real password-protected admin
   UI onto a static site like this one; edits commit straight to GitHub and
   the host rebuilds automatically. Purpose-built for exactly this
   situation.
2. **Netlify/Vercel + serverless functions** — add a small login function
   and a database (e.g. Supabase, Firebase, or their built-in key-value
   stores) behind a couple of API routes.
3. **A small custom backend** — Node.js + Express (or similar) with a
   login route, sessions, and a database (SQLite is plenty for a site this
   size), hosted anywhere that runs Node.

Any of these give you real access control. The current `admin.html` does
not, and shouldn't be trusted with anything sensitive.

## Contact info: single source of truth

Phone numbers and email live in one place — three attributes on the
`<body>` tag at the top of `index.html`:

```html
<body data-phone1="0594953352" data-phone2="0249495835" data-email="colordropimpressions100@gmail.com">
```

`script.js` reads these on page load and fills in every phone/email link on
the page automatically (contact section, footer, and the WhatsApp button on
the "Get a Quote" form). Change a number there — by hand or through
`admin.html` — and it updates everywhere.

## Adding a new portfolio photo or service

These aren't wired into the admin editor yet (image uploads and adding a
whole new card are a bit more involved than a text field). For now:

- **New portfolio photo**: drop the image in `images/`, then copy one of
  the `<div class="pf-card">` blocks in `index.html` (in the Portfolio
  section) and point it at the new file.
- **New service card**: copy one `<div class="service-card ...">` block in
  the Services section and edit its text.

A developer can wire these into `admin.html` the same way the current
fields work, if that's worth doing later.
