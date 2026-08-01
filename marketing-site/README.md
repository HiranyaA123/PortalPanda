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

## Deployment

- Vercel SPA fallback: `vercel.json`
- Static-host SPA fallback: `public/_redirects`
- Sites configuration: `.openai/hosting.json`

Build command: `npm run build`
Publish directory: `dist/`

## Supporting assets

Reusable logo exports and business-card artwork are retained under `output/`. Generated browser profiles, temporary test captures and export logs are intentionally ignored and should not be committed.

The current Gmail-compatible signature is `gmail-signature.html`. `WEBSITE_AUDIT.md` remains as the pre-redesign decision record.
