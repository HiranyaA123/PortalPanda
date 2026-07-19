# PayPanda marketing site

Static marketing website for PayPanda (working name) — commission-free,
custom-designed online ordering for independent restaurants and caffes.

Built with **React 18 + Vite + React Router v6** and plain CSS. No backend, no
CMS, no analytics. `vite build` produces a fully static site deployable to any
static host.

> **Renaming the business is a one-file edit.** Every brand-specific string,
> colour and contact detail comes from [`src/brand.js`](src/brand.js). See
> [Changing the brand](#changing-the-brand).

## Requirements

- Node 18+ and npm.

## Install / run / build

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # produce the static site in dist/
npm run preview  # serve the built dist/ locally to check it
```

## Project structure

```
src/
  brand.js                 # single source of truth for name/contact/colour/form
  index.css                # design tokens (:root) + all styles
  main.jsx                 # app entry (BrowserRouter)
  App.jsx                  # routes, page title, scroll-to-top
  components/
    Header.jsx             # sticky header, anchor nav, burger menu < 720px
    Footer.jsx
    ContactForm.jsx        # submits to the form endpoint; degrades gracefully
    DeviceFrame.jsx        # phone/tablet/desktop frames + screenshot fallback
    Reveal.jsx             # IntersectionObserver scroll-reveal
    icons.jsx              # inline SVG icons (no icon library)
  pages/
    Landing.jsx            # "/"  — the full pitch (§5)
    CaseStudy.jsx          # "/case-study"
    Contact.jsx            # "/contact"
  assets/
    screenshots/           # drop real screenshots here (see below)
```

## Changing the brand

Edit **only** [`src/brand.js`](src/brand.js):

```js
export const BRAND = {
  name: 'PayPanda',
  tagline: 'Online ordering that looks like your restaurant.',
  contactEmail: 'you@example.com',
  contactPhone: '0452145196',        // used for tel: links (no spaces)
  contactPhoneDisplay: '0452 145 196', // shown to humans
  formEndpoint: '',                   // see "Contact form endpoint" below
  accent: '#0F9D6E',                  // keep in sync with --accent in index.css
  location: 'Adelaide, South Australia',
};
```

No component hardcodes the name, email or phone number. If you change the
accent colour, also update `--accent` (and the related `--accent-dark` /
`--accent-soft`) in [`src/index.css`](src/index.css), where the CSS-driven
styling reads it.

## Contact form endpoint

The contact form (on both `/` and `/contact`) submits with a plain `fetch` POST
to `BRAND.formEndpoint`.

1. Create a free form endpoint — e.g. a [Formspree](https://formspree.io) form.
2. Paste its URL into `formEndpoint` in `src/brand.js`.

Behaviour:

- **Endpoint set:** on submit, shows _"Thanks — we'll be in touch within one
  business day."_ on success, or _"Something went wrong — email us at
  {email}"_ on failure.
- **Endpoint blank (default):** the form still renders and validates, but
  submitting shows the fallback message pointing at the email and phone. It
  never throws.

The email and phone are also rendered as clickable `mailto:` / `tel:` links
beside the form as a fallback path.

## Swapping in real screenshots

Placeholders are shown until real images exist. To use real screenshots, drop
files into [`src/assets/screenshots/`](src/assets/screenshots/) using the exact
filenames documented in
[`src/assets/screenshots/README.md`](src/assets/screenshots/README.md)
(`customer-menu-phone.png`, `kitchen-board-tablet.png`, etc.). They're picked up
automatically — no code change needed.

## Deploying (SPA fallback)

This is a client-side–routed single-page app, so the host must serve
`index.html` for unknown paths (otherwise a direct load of `/case-study`
404s). Config for the common hosts is included:

- **Netlify / Cloudflare Pages:** [`public/_redirects`](public/_redirects)
  (`/* /index.html 200`).
- **Vercel:** [`vercel.json`](vercel.json) rewrites all paths to `/index.html`.
- **Other hosts:** configure a catch-all rewrite to `/index.html`.

Build command: `npm run build`. Publish directory: `dist/`.
