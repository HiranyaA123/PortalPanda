# PayPanda Marketing Site — Build Specification

> **Purpose of this document:** a complete, self-contained spec for building the
> marketing website for "PayPanda" (working name — the business name is
> undecided, so ALL branding must be driven from one config file, see §3).
> Any AI or developer should be able to build the entire site from this file
> alone, without any other context.

---

## 1. What the product is (context for whoever builds this)

PayPanda sells a complete online ordering system to independent restaurants
and caffes. Each client gets:

1. **A custom-designed customer ordering website** — bespoke design per venue
   (NOT a template), with menu browsing, item modifiers, cart, pickup-time
   slots, card payment (Stripe) or pay-in-store cash, and live "sold out"
   updates.
2. **A kitchen / staff dashboard** — a live order board on a tablet: new
   orders arrive in real time with sound alerts, staff tap to
   accept / mark ready / hand over, receipts print automatically, staff can
   mark items sold out, plus a staff time clock.
3. **An admin console** — the owner manages everything themselves: menu items
   and categories, modifier groups, opening hours and special days, discount
   codes, marketing campaigns, and a customer database that automatically
   tags customers as New / Regular / High-value.

Key selling points (use these in copy, do not invent others):

- **Commission-free.** Unlike Uber Eats / DoorDash / marketplace apps that
  take up to ~30%, the venue keeps its margin. (Stripe card processing fees
  still apply — do NOT claim "no fees at all", say "commission-free".)
- **The venue's own brand.** Customers order on the restaurant's own
  beautiful website, and the restaurant owns the customer relationship and
  data — not a marketplace.
- **One system, not a patchwork.** Ordering site, kitchen screen, printing,
  and admin all talk to each other in real time.
- **Custom-designed, done-for-you.** PayPanda designs the site, loads the
  menu, and trains the team. The owner runs it day-to-day without a
  developer.

**Live proof:** the system runs in production at **Caffe Primo Firle**, a caffe
in Firle, South Australia. The owner has agreed to be named and featured.

**Audience:** non-technical restaurant/caffe owners, probably reading on a
phone. Copy must be plain-English. Never use words like "multi-tenant",
"SaaS", "white-label", "instance", "stack".

---

## 2. Tech requirements

- **Location:** new folder `marketing-site/` at the root of this monorepo
  (siblings: `customer-site/`, `admin-portal/`, `staff-dashboard/`,
  `backend/`).
- **Stack:** React 18 + Vite, plain CSS (CSS custom properties for tokens).
  Match the conventions of the sibling apps: functional components, no
  TypeScript, no CSS-in-JS, no Tailwind, no UI framework.
- **Static build:** `vite build` must produce a fully static site deployable
  to any static host (Netlify / Vercel / Cloudflare Pages). No backend, no
  API dependency, no database. The site must never depend on any client's
  running instance.
- **Routing:** React Router v6. Three routes (see §4). Client-side routing
  needs an index.html fallback on the host — note this in the README.
- **Contact form:** submit via a form service (Formspree or equivalent free
  tier) using a plain `fetch` POST. The endpoint URL lives in the brand
  config (§3). Include a graceful failure state ("Something went wrong —
  email us at {email}") and a success state ("Thanks — we'll be in touch
  within one business day."). Also render the email and phone as plain
  clickable links (`mailto:` / `tel:`) near the form as a fallback path.
- **No CMS, no blog, no analytics** in v1. Keep dependencies minimal:
  react, react-dom, react-router-dom only.
- **Add a `marketing-site/README.md`** covering: install/run/build commands,
  how to change the brand config, how to swap in real screenshots, and how to
  set the form endpoint.

---

## 3. Brand config — single source of truth

Create `marketing-site/src/brand.js`. Every brand-specific string, colour and
contact detail on the site MUST come from this file (the business name is
likely to change, and this makes renaming a one-file edit):

```js
export const BRAND = {
  name: 'PayPanda',
  tagline: 'Online ordering that looks like your restaurant.',
  contactEmail: 'agarwalhiranya@gmail.com',
  contactPhone: '0452145196',
  contactPhoneDisplay: '0452 145 196',
  formEndpoint: '',            // Formspree (or similar) URL — blank until configured
  accent: '#0F9D6E',           // see §6
  location: 'Adelaide, South Australia',
};
```

Rules:
- No component may hardcode "PayPanda", the email, or the phone number.
- If `formEndpoint` is blank, the contact form should render but on submit
  show the fallback message pointing at the email/phone instead of erroring.

---

## 4. Site structure

Three routes, shared header + footer:

| Route | Page | Purpose |
|---|---|---|
| `/` | Landing page | The pitch. Single scrolling page with anchor nav. |
| `/case-study` | Caffe Primo Firle case study | Proof it works, in depth. |
| `/contact` | Contact page | Standalone form for direct linking. |

**Header (all pages):** brand name (text logomark is fine — see §6), anchor
links on the landing page (Product, Features, Case study, How it works),
and a prominent "Talk to us" button → `/contact`. Collapses to a burger menu
under 720px.

**Footer (all pages):** brand name, one-line description, email + phone
(clickable), location line, link to case study. Small print: "© {year}
{brand name}". No fake legal links (no privacy policy / terms pages in v1 —
do not invent them).

---

## 5. Landing page — section by section (with copy)

The copy below is final draft quality — the builder should use it verbatim or
with only minor polish. {braces} mean: pull from brand config.

### 5.1 Hero
- **Headline:** "Online ordering that looks like *your* restaurant."
- **Subline:** "A custom-designed ordering site for your customers, a live
  order screen for your kitchen, and an admin console for you. Commission-free."
- **Primary CTA button:** "Talk to us" → scrolls to §5.7 form / links `/contact`.
- **Secondary link:** "See it live at Caffe Primo Firle →" → `/case-study`.
- **Visual:** composite device mockup — a phone frame showing the customer
  ordering site next to a tablet frame showing the kitchen order board.
  Use placeholder images for now (see §7).

### 5.2 Problem strip
Three short cards, each an owner pain point:
1. **"Marketplaces take up to 30%."** Delivery apps own your customers and
   eat your margin on every order.
2. **"Template sites all look the same."** Your food is unique — your
   ordering page shouldn't look like everyone else's.
3. **"Paper dockets and phone orders."** Missed calls, misheard orders, and
   a counter full of scribbled notes.

### 5.3 The three surfaces (core section)
Three alternating image/text blocks, one per product surface. Each has a
small eyebrow label, a heading, 3–4 bullet features, and a screenshot
placeholder.

**Block A — eyebrow "For your customers" — heading "A beautiful ordering
site, designed just for you."**
- Bespoke design that matches your brand — not a template.
- Card payments via Stripe, or pay-in-store cash.
- Pickup time slots that follow your real opening hours.
- Dietary tags, item photos, and full modifier options (sizes, add-ons,
  sauces).

**Block B — eyebrow "For your kitchen" — heading "Orders land on a live
board — no more missed dockets."**
- New orders appear instantly with a sound alert.
- One tap to accept, mark ready, or hand over.
- Receipts print automatically when you accept.
- Mark an item sold out and it disappears from the ordering site immediately.

**Block C — eyebrow "For you" — heading "Run the whole thing yourself — no
developer needed."**
- Edit your menu, prices, photos and hours any time.
- Discount codes, surcharge days, and email campaigns.
- Every customer is remembered — regulars and high-spenders are tagged
  automatically.
- See today's orders and takings at a glance.

### 5.4 Feature grid
Heading: "And everything around the edges." 8 small cards, icon + one line:
1. **Real-time everything** — sold-out items vanish from the menu instantly.
2. **Cash or card** — customers choose; staff see exactly what to collect.
3. **Special days** — public-holiday surcharges and one-off hours, set in advance.
4. **Returning customers** — checkout recognises them by phone number.
5. **Discount codes** — percent or fixed, with expiry and usage limits.
6. **Receipt printing** — kitchen dockets on a Star receipt printer.
7. **Staff time clock** — shifts tracked on the same tablet.
8. **Your data is yours** — export your customer list any time.

### 5.5 Case study teaser
- Eyebrow: "Running live today"
- Heading: "Caffe Primo Firle runs on {brand name}."
- Body: "From breakfast rush to weekend queues, Primo Firle takes pickup
  orders through their own custom site — and the kitchen runs on one
  tablet." 
- One wide screenshot placeholder + button "Read the case study" → `/case-study`.

### 5.6 How we work
Heading: "From first chat to first order." Three numbered steps:
1. **We design your site.** You tell us about your venue; we design an
  ordering site that looks like you — and load your full menu.
2. **We set up your kitchen.** Tablet, printer, and training for your team.
  Most venues are comfortable within a day.
3. **You go live and run it.** Update the menu, change hours, run promos —
  all yourself. We stay on call.

End with one line: "Every venue is different, so we don't do one-size-fits-all
pricing — tell us about yours." + CTA button "Talk to us".

### 5.7 Contact form (also the whole of `/contact`)
- Heading: "Tell us about your venue."
- Fields: Your name*, Venue name*, Phone*, Email*, Message (optional,
  textarea, placeholder "What are you serving, and what do you need?").
  Client-side required validation only — no phone-format validation.
- Submit button: "Send". Success / failure states per §2.
- Beside or under the form: "Prefer to talk? Call {phone} or email {email}."

---

## 6. Visual design system

Deliberately **unlike** the earthy/organic Primo Firle aesthetic. This site
must read as a modern software company; the warmth lives in the product
screenshots.

**Tokens** (define in `:root` in `index.css`):

```css
--bg: #FAFAF8;            /* near-white, slightly warm */
--surface: #FFFFFF;
--ink: #101418;           /* near-black text */
--ink-soft: #4A5560;
--ink-muted: #8A94A0;
--accent: #0F9D6E;        /* bamboo green — panda-adjacent, name-agnostic */
--accent-dark: #0B7A56;
--accent-soft: #E6F5EF;
--line: #E7E9EC;
--radius: 16px;
--radius-sm: 10px;
```

- **Dark sections:** the hero and the case-study teaser (§5.5) sit on an
  `--ink` background with white text for contrast rhythm; everything else on
  `--bg`.
- **Type:** one modern grotesque for everything — use `Inter` from Google
  Fonts (weights 400/500/700/800). Headlines large and tight
  (`clamp(2rem, 5vw, 3.5rem)`, letter-spacing −0.02em). Body 16–18px,
  line-height ≥1.6. NO serif fonts anywhere.
- **Logomark:** text-only: brand name in bold with a `🐼`-free custom touch —
  a small rounded square in `--accent` containing the first letter is enough.
  Do NOT use a panda emoji or clipart; the name is temporary.
- **Buttons:** solid `--accent` primary with white text, generous padding
  (14px 28px), `--radius-sm`, subtle hover lift. Ghost/outline secondary.
- **Cards:** white surface, 1px `--line` border, `--radius`, very soft
  shadow. No glassmorphism, no gradients except a single subtle radial
  accent glow allowed in the hero.
- **Motion:** CSS-only scroll-reveal (fade + 12px rise) via
  IntersectionObserver, `prefers-reduced-motion` respected. Nothing else.
- **Responsive:** mobile-first; test at 375px, 768px, 1280px. Device-mockup
  composites stack vertically on mobile. No horizontal scroll ever.
- **Accessibility:** semantic landmarks, one `h1` per page, alt text on all
  images, visible focus rings (2px `--accent`), form labels always visible
  (no placeholder-as-label), colour contrast AA minimum.

---

## 7. Screenshots & placeholders

Real screenshots are NOT available yet — the owner will supply them later.

- Create `marketing-site/src/assets/screenshots/` and reference images by
  these exact filenames, so real files can be dropped in without code
  changes:
  - `customer-menu-phone.png` — customer site menu on a phone
  - `customer-checkout-phone.png` — checkout step on a phone
  - `kitchen-board-tablet.png` — staff dashboard order board on a tablet
  - `admin-menu-desktop.png` — admin menu management on desktop
  - `admin-customers-desktop.png` — admin customer list on desktop
  - `casestudy-hero.png` — wide shot for the case-study teaser + page
- Until real files exist, generate simple SVG/CSS placeholder blocks at the
  correct aspect ratios (phone 9:19.5, tablet 4:3, desktop 16:10) with a
  muted label like "Screenshot — kitchen order board". The site must build
  and look intentional with placeholders in place.
- Frame all screenshots in minimal CSS device frames (rounded rect + notch
  for phone; rounded rect + bezel for tablet/desktop). No skeuomorphic
  device images.

---

## 8. Case-study page (`/case-study`)

Structure:
1. **Hero:** eyebrow "Case study", heading "Caffe Primo Firle, South
   Australia", subline "A neighbourhood caffe running its whole pickup
   operation on {brand name}." Wide `casestudy-hero.png`.
2. **The venue:** short paragraph — busy suburban caffe in Firle, Adelaide;
   full breakfast/lunch menu (100+ items with sizes, add-ons and dietary
   options); counter service with regulars.
3. **What they run:** the three surfaces, each with a screenshot and 2–3
   lines of what Primo specifically uses (e.g. modifier-heavy menu, cash +
   card at pickup, kitchen tablet with printed dockets, special-day
   surcharges, automatic customer tagging).
4. **Quote block:** owner testimonial — REAL QUOTE PENDING. Use a clearly
   marked placeholder: `"[Owner quote to be supplied]" — Owner, Caffe Primo
   Firle`. Build the layout; do not invent a quote.
5. **Results strip:** three stat tiles — REAL NUMBERS PENDING. Placeholder
   labels: "Orders taken online", "Commission paid on those orders: $0",
   "Time from order to kitchen: instant". Mark the first tile's number as
   `[TBC]`. Do not fabricate figures.
6. **CTA:** "Want this for your venue?" + "Talk to us" button → `/contact`.

---

## 9. Explicitly out of scope (do not build)

- Pricing page or any price figures anywhere.
- Blog, CMS, newsletter signup, cookie banner, analytics.
- Login/portal of any kind.
- Privacy policy / terms pages (add later when the business name is final).
- Any dependency on the Primo Firle backend or any live API.
- Panda illustrations/emoji branding (name is temporary).

---

## 10. Acceptance checklist

- [ ] `npm run build` succeeds in `marketing-site/` with zero warnings.
- [ ] All three routes render; direct URL loads work (SPA fallback noted in README).
- [ ] Renaming the business = editing only `src/brand.js` (grep confirms no
      hardcoded "PayPanda"/email/phone anywhere else).
- [ ] Site is fully presentable with screenshot placeholders.
- [ ] Form works against a configured endpoint AND degrades gracefully with
      `formEndpoint` blank.
- [ ] No horizontal scroll at 375px; nav collapses under 720px.
- [ ] Lighthouse: accessibility ≥ 95, performance ≥ 90 on the landing page.
- [ ] No invented facts: no fake testimonial text, no fake stats, no pricing.
