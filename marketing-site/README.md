# CentralPass marketing site

Commercial React website for CentralPass, a custom software studio for independent restaurants and cafes. The site presents the platform, pricing approach, live and in-development venue work, and the project enquiry flow.

## Stack

- React 18
- Vite 5
- React Router 6
- Plain CSS

## Local development

```bash
npm install
npm run dev
npm run build
npm run preview
```

The production build is written to `dist/`.

`npm run build` runs three steps:

1. `vite build` — the client bundle.
2. `vite build --ssr` — a build-time-only server bundle in `.ssr-build/` (deleted afterwards).
3. `scripts/prerender.mjs` — renders every route to static HTML.

### Prerendering

Each route is written to `dist/<route>/index.html` with its own `<title>`,
description, canonical URL, OG/Twitter tags and JSON-LD. This matters because
social unfurlers and many crawlers do not execute JavaScript — without it, every
route serves the homepage's metadata and a canonical pointing at `/`.

Route metadata lives in `src/seo.js`. `getSeoData()` is the single pure source
used by both the client-side `applySeo()` and the prerenderer, so the two cannot
drift apart.

**Because every route is prerendered, there is no SPA fallback.** Hosting must
resolve: exact file → `<path>/index.html` → `/404.html` with a real 404 status.
All three configs in this repo do that. `vite preview` does **not** — it applies
SPA fallback and will serve the homepage for every route, which makes
prerendering look broken. To verify a build locally, use:

```bash
npm run build
node scripts/serve-dist.mjs 4180
```

### Images

`npm run images` regenerates responsive variants (480/720/960/1440) for
everything in `public/live/` and rewrites the generated `src/content/images.js`
manifest of intrinsic dimensions and srcset strings. Run it after adding or
replacing a screenshot. Variants are committed, so a normal build needs no image
tooling. Render screenshots through `src/components/Shot.jsx`, which reads that
manifest — it supplies `width`/`height` (preventing layout shift) and
`srcset`/`sizes`.

## Project structure

```text
src/
  App.jsx                 Routes and shared page behaviour
  brand.js                Business name, contact details and public URL
  seo.js                  Route metadata and structured data
  index.css               Shared design system and responsive styles
  components/
    Header.jsx            Desktop and mobile navigation
    Footer.jsx            Shared commercial footer
    Logo.jsx              CentralPass logo assets
    ModuleExplorer.jsx    Interactive Platform module selector
    ScrollThread.jsx      Home-page scroll path
    ContactForm.jsx       Project enquiry form
    mocks.jsx             Product interface illustrations
    motion.jsx            Magnetic CTA and count-up utilities
  pages/
    Home.jsx
    Platform.jsx
    Pricing.jsx
    Live.jsx
    Contact.jsx
    Legal.jsx
    NotFound.jsx
public/
  brand/                   Header and footer logo assets
  live/                    Venue screenshots
  robots.txt
  sitemap.xml
  site.webmanifest
```

## Brand and contact details

Update `src/brand.js` when the business name, public URL, phone number, email address or location changes. Route metadata is defined in `src/seo.js`.

## CSS maintenance

Report classes that are no longer referenced by the current React source:

```bash
npm run audit:css
```

The `--fix` option removes fully unused class rules, orphaned animations and empty media queries:

```bash
npm run audit:css:fix
```

Always run the production build and responsive browser checks after using `--fix`.

> **History worth knowing.** `--fix` once silently deleted the entire scroll-reveal
> block. `Reveal.jsx` built its class as `` `reveal …`.trim() ``, and the scanner
> only walked a call expression's *arguments* — never `callee.object` — so the
> template literal holding `reveal` was never read and the class looked unused.
> The walker now handles that, a `KEEP` allowlist pins runtime-toggled state
> classes, and `--fix` prints every class it is about to delete. Add to `KEEP`
> rather than loosening the walker.

## Deployment

- Vercel SPA fallback: `vercel.json`
- Static-host SPA fallback: `public/_redirects`
- Sites configuration: `.openai/hosting.json`

Build command: `npm run build`
Publish directory: `dist/`

## Supporting assets

Reusable logo exports and business-card artwork are retained under `output/`. Generated browser profiles, temporary test captures and export logs are intentionally ignored and should not be committed.

The current Gmail-compatible signature is `gmail-signature.html`. `WEBSITE_AUDIT.md` remains as the pre-redesign decision record.
