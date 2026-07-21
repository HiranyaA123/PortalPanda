# Portal Panda marketing site

Static marketing website for **Portal Panda** — the all-in-one, commission-free
ordering platform for independent restaurants and caffes (custom ordering site,
admin dashboard, staff portal, kitchen + receipt printing, table bookings and
Uber Direct delivery).

Built with **React 18 + Vite + React Router v6** and plain CSS. No backend, no
CMS, no analytics. `vite build` produces a fully static site deployable to any
static host.

> **Renaming the business is a one-file edit.** Every brand-specific string and
> contact detail comes from [`src/brand.js`](src/brand.js); the design tokens
> (colours) live in the `:root` block of [`src/index.css`](src/index.css). See
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
  brand.js                 # single source of truth for name/contact/form/colours
  index.css                # design tokens (:root) + all styles
  main.jsx                 # app entry (BrowserRouter)
  App.jsx                  # routes, page title, scroll-to-top
  components/
    Header.jsx             # sticky header, multi-page nav, burger menu < 860px
    Footer.jsx
    Logo.jsx               # the Portal Panda mark (panda face + portal ring, SVG)
    ContactForm.jsx        # submits to the form endpoint; degrades gracefully
    DeviceFrame.jsx        # phone/tablet/desktop frames + screenshot fallback
    Reveal.jsx             # IntersectionObserver scroll-reveal
    icons.jsx              # inline SVG icons (no icon library)
  pages/
    Home.jsx               # "/"         — the flagship pitch
    Platform.jsx           # "/platform" — the full six-module platform
    Pricing.jsx            # "/pricing"  — plans + call-for-quote panel
    Live.jsx               # "/live"     — Caffe Primo Firle (running today)
    Contact.jsx            # "/contact"  — book-a-demo form
  assets/
    screenshots/           # drop real screenshots here (see below)
```

## Changing the brand

Edit **only** [`src/brand.js`](src/brand.js):

```js
export const BRAND = {
  name: 'Portal Panda',
  tagline: 'The whole restaurant, run from one portal.',
  pitch: '…',                          // one-liner used in hero + meta
  contactEmail: 'you@example.com',
  contactPhone: '0452145196',          // used for tel: links (no spaces)
  contactPhoneDisplay: '0452 145 196', // shown to humans
  formEndpoint: '',                    // see "Contact form endpoint" below
  location: 'Adelaide, South Australia',
  colors: { … },                       // reference copy of the brand palette
};
```

No component hardcodes the name, email or phone number. The **colours** used for
styling live in the `:root` block of [`src/index.css`](src/index.css) — the
"portal spectrum" is `--violet` / `--coral` / `--cyan`, composed into
`--grad-brand`, `--grad-portal` and `--grad-text`. Change them there to re-theme
the whole site.

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
