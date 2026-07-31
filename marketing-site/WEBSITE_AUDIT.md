# CentralPass website audit

**Audit date:** 1 August 2026  
**Audited product:** the current local React/Vite redesign in this working tree  
**Public comparison:** [centralpass.au](https://www.centralpass.au/)  
**Purpose:** improve commercial credibility, homepage appeal, lead conversion, accessibility, and search readiness without turning CentralPass into a generic SaaS site

## Executive verdict

The redesign is a meaningful visual improvement. The warm editorial palette, serif-led typography, restrained burnt-red accent, and rule-based layout give CentralPass a recognisable identity. It feels more considered and premium than the previous black-and-gradient SaaS treatment. Mobile layouts no longer overflow at the tested widths, the navigation works, work-in-progress projects remain blurred, and the site builds successfully.

The main weakness is now commercial rather than cosmetic. CentralPass tells visitors repeatedly that it builds bespoke systems, but it does not establish enough proof, specificity, or buying confidence near the top of the journey. A prospective customer has to scroll through approximately 6,100 px on desktop or 8,900 px on mobile before completing the home page, while the strongest real venue evidence appears after roughly 4,800 px on desktop and 6,800 px on mobile. The site looks like a capable design studio, but it does not yet answer the questions a venue owner will use to decide whether to contact an unfamiliar supplier:

- What exact problem does this solve for a restaurant or cafe?
- Who has trusted CentralPass and what changed for them?
- Can I see the live result rather than a recreated interface?
- What will this roughly cost and how long will it take?
- Who builds and supports it after launch?
- Is this proven, secure, reliable, and ready for a busy service?

The recommended direction is not another full visual reset. Keep the new editorial identity, shorten and reorder the home page, put a real customer result in the first two sections, make the primary action truthful and specific, and add the missing commercial evidence.

## Commercial-readiness scorecard

| Area | Assessment | Summary |
|---|---|---|
| Visual identity | Strong | Distinctive, coherent, premium, and less generic than the previous theme. |
| Mobile layout | Good | No document-level horizontal overflow at 390 px on the five main routes tested. |
| Positioning | Mixed | “Built around you” is clear, but the audience and business outcome are too vague in the first viewport. |
| Product clarity | Good foundation | The six connected modules are tangible, but the home and Platform experiences repeat one another. |
| Proof and trust | Weak | One live project, no customer quote, no live-site link, no team identity, no support/security detail, and two of three showcased projects are unfinished. |
| Conversion path | Needs work | CTA language changes across pages and “Book a demo” opens an enquiry form rather than a booking flow. |
| Pricing confidence | Weak | The page explains scope but provides no starting investment, example scope, or total delivery range. |
| Accessibility | Mixed | Good base contrast, focus styling, labels, and reduced-motion CSS; incomplete tabs, an unpausable auto-rotating module, and modal navigation focus issues remain. |
| SEO foundation | Mixed | Titles, descriptions, canonical tags, sitemap, robots, and schema exist; route metadata depends on JavaScript and unknown routes return the SPA shell. |
| Performance/maintainability | Good baseline, untidy | The build is modest, but the 3,100+ line stylesheet contains significant legacy CSS and duplicate design eras. |
| Release state | Blocked | The public domain is still serving the previous dark design rather than this audited redesign. |

## What the redesign gets right

These are assets worth preserving through the next iteration.

1. **It has a point of view.** The paper-and-ink treatment is more ownable than the crowded dark-neon SaaS category.
2. **The custom-build promise is finally explicit.** “Not on the feature list? Ask us to build it” correctly explains that customers are not limited to existing modules.
3. **The product is more tangible.** The coded ordering, booking, kitchen, staff, promotion, and delivery demonstrations turn abstract claims into visible workflows.
4. **The mobile page no longer traps or locks normal scrolling.** Only the intentionally opened mobile menu locks the body.
5. **Work-in-progress privacy is handled responsibly.** Needa Pizza and Beach Road Pizza remain clearly labelled, intentionally blurred, and not linked to unblurred originals.
6. **The content hierarchy is sound.** Routes have one H1, headings are generally logical, and mobile text remains legible.
7. **The technical SEO baseline exists.** The project has route-specific metadata logic, canonical URLs, `robots.txt`, `sitemap.xml`, a manifest, social imagery, and JSON-LD.
8. **The contact surface is real.** A branded email, phone number, privacy link, useful field labels, and a Formspree endpoint are present.
9. **The current branch builds successfully.** The production Vite build completed without a JavaScript compilation error.

## What major restaurant-technology companies do well

This comparison focuses on visible commercial patterns, not on copying their visual design. Their scale and budgets are different, but the buyer questions they answer are relevant. Quantified claims below are the companies' own published claims and were not independently verified in this audit.

| Company | What its website does well | Lesson for CentralPass |
|---|---|---|
| [Toast](https://pos.toasttab.com/restaurant-pos/) | Names the audience and outcome immediately, shows real restaurant hardware and people, explains restaurant-grade reliability, offers pricing beside the demo CTA, and follows product claims with named customer results. Its [customer stories](https://pos.toasttab.com/customers) lead with concrete outcomes such as higher check sizes. | Pair every major claim with a real screen, customer, operational detail, or result. Show reliability and support, not only capability. |
| [Square for Restaurants](https://squareup.com/au/en/point-of-sale/restaurants) | Segments visitors by quick service, full service, and bar use cases; shows specific workflows; presents plans and fees; offers both self-serve and sales-assisted next steps; and publishes a short interactive product tour. | Let buyers recognise their service model, provide a low-friction way to explore, and give at least a budget anchor. |
| [Lightspeed Restaurant](https://www.lightspeedhq.com/pos/restaurant/) | Leads with an operational outcome, places two clear CTAs together, uses customer counts and industry experience as early trust signals, and addresses questions such as offline operation and support. | Add evidence about launch, uptime, support, hardware, and what happens during an internet or service problem. |
| [SevenRooms](https://sevenrooms.com/restaurants/) | Translates features into revenue, cost, and guest-retention outcomes. Its case proof combines a named customer, quote, role, and quantified result. | Replace generic numeric tiles with a real customer story and an outcome the customer has approved for publication. |
| [Olo](https://www.olo.com/) | Puts a large customer-logo strip directly beneath the hero, then organises the product around revenue, complexity, personalisation, and scale instead of a long feature inventory. | Bring recognisable customer proof above the fold and group CentralPass around buyer outcomes. |
| [BentoBox](https://www.getbento.com/restaurant-websites-paid/) | Frames custom restaurant websites around sales, SEO, accessibility, easy menu updates, onboarding, maintenance, and hospitality expertise. Its [customer page](https://www.getbento.com/customers/) makes the work easy to browse by venue type. | CentralPass should sell the operating relationship around the custom build: onboarding, updates, maintenance, accessibility, SEO, and ongoing support. |

### Shared pattern across the benchmark

The strongest competitors generally use this sequence:

1. Clear audience and outcome.
2. Primary and secondary conversion choices.
3. Trust logos, counts, ratings, or a named customer.
4. Product visuals tied to specific workflows.
5. Business outcomes rather than feature volume.
6. Transparent pricing or a clear explanation of the investment.
7. Customer evidence with a quote and measurable result.
8. Support, reliability, security, and integration reassurance.
9. Repeated CTA with the same promise.

CentralPass currently covers steps 1, 2, 4, and 9 partially. Steps 3, 5, 6, 7, and 8 need the most work.

## Prioritised findings

### P0: resolve before the next public release

#### 1. The audited redesign is not the design currently served on the public domain

**Evidence:** On 1 August 2026, `https://www.centralpass.au/` returned the previous dark gradient interface. The local working tree renders the new warm editorial redesign. `https://portal-panda.vercel.app/` returned 404.

**Why it matters:** Visual QA, stakeholder feedback, and search checks can produce conflicting answers depending on which version is opened. A prospective customer sees a materially different brand from the one being reviewed internally.

**Recommendation:** Decide which version is authoritative, deploy the approved build, and complete a post-deploy checklist for the home page, all routes, mobile navigation, `robots.txt`, `sitemap.xml`, social image, canonical URLs, and the contact form.

**Acceptance criteria:** The commit/build approved for launch is visible at `centralpass.au`, all seven sitemap URLs render the same design system, and the retired Vercel URL either redirects to the canonical domain or stays intentionally retired without being referenced anywhere.

#### 2. The live case-study counter exposes “0+” before its animation runs

**Evidence:** The `/live` accessibility tree exposes the first result as `0+ Menu items, fully modifiable` until the visitor scrolls to the result section and the `IntersectionObserver` starts the count-up animation.

**Why it matters:** Screen readers, automation, prerenderers, screenshots, failed observers, and impatient users can receive the opposite of the intended proof. This repeats a credibility problem previously present in the site.

**Recommendation:** Render the truthful final value in the DOM from the start. If animation is retained, animate a decorative layer or provide an immediate accessible name/value of `100+`.

**Acceptance criteria:** The DOM, accessibility tree, no-JavaScript fallback, and first paint all expose `100+`, while optional animation never changes the semantic value.

#### 3. Public-facing proof must be made strictly accurate and permission-backed

**Evidence:** The home badge says “Running in Adelaide venues” in the plural, while the portfolio explicitly says one launched system and two active builds. “100% of every order stays yours” can be read as a statement about all revenue even though payment processor and courier fees may still apply. The more precise third-party-fee qualification appears only on Pricing.

**Why it matters:** A young company cannot afford avoidable ambiguity in its strongest trust claims.

**Recommendation:** Use exact copy such as “Live at Caffe Primo Firle” and “CentralPass takes $0 marketplace commission; payment and delivery provider fees may apply.” Confirm written permission for every customer name, logo, screenshot, quote, and result before launch.

**Acceptance criteria:** The home, Pricing, and Our Work pages use the same definitions; every published customer asset has consent; no claim depends on an interpretation more favourable than the underlying contract or fee model.

### P1: high-impact commercial and user-experience changes

#### 4. The hero sells the method before it identifies the buyer and outcome

**Evidence:** “Custom venue software, built around you” is attractive but broad. The visible copy never says “restaurant” or “cafe” in the first viewport. “Venue” can mean hospitality, events, sport, entertainment, or property. The value statement focuses on how CentralPass builds rather than what the buyer gains.

**Why it matters:** New visitors should not have to infer the category. Competitors repeatedly name restaurants and lead with speed, revenue, direct orders, guest experience, or operational control.

**Recommendation:** Keep the distinctive headline, but pair it with an explicit category and outcome. For example:

> **One connected system, built around how your restaurant actually runs.**  
> CentralPass designs and builds websites, direct ordering, kitchen, staff, and owner tools for independent restaurants and cafes.

#### 5. The strongest real proof appears far too late

**Evidence:** The Caffe Primo section begins around 4,800 px down the desktop home page and 6,800 px down the tested mobile page. Before that, visitors see a code-rendered dashboard, an interactive demo, benefits, a custom brief, numeric tiles, and process steps.

**Why it matters:** A new supplier needs evidence before explanation. The current order asks visitors to believe several claims before seeing the only launched customer.

**Recommendation:** Move a compact Caffe Primo proof block directly below the hero. Include a real screenshot, external live-site link, approved customer quote, scope, launch state, and one concrete result. Move the interactive six-system demo below that proof or simplify it on Home and keep the full explorer on Platform.

#### 6. The primary CTA promises booking but delivers a form

**Evidence:** The persistent header says “Book a demo,” but it routes to `/contact`, which is a multi-field enquiry form. Other primary actions say “Plan my system,” “Discuss my brief,” and “Send my build brief.”

**Why it matters:** CTA mismatch creates a small trust break at the exact conversion moment. The changing labels also make the desired next step feel undefined.

**Recommendation:** Choose one primary offer and make its destination match. Strong options are:

- “Book a 20-minute discovery call” leading to a real calendar.
- “Request a tailored demo” leading to a short form that explicitly says the next step is scheduling.
- “Send your build brief” if the form remains the only conversion path.

Use one primary phrase across the header, hero, Pricing, Platform, and final CTA. Keep “View live venue” as the consistent secondary action.

#### 7. Pricing explains process but withholds every useful budget anchor

**Evidence:** `/pricing` is approximately 5,000 px on desktop and 7,400 px on mobile. It explains five phases and five cost drivers but gives no starting investment, example scope, monthly support range, deposit structure, or typical total duration.

**Why it matters:** Buyers reach Pricing because they are qualifying fit. A fully custom quote is legitimate, but a zero-number pricing page feels evasive and can attract enquiries that have no budget fit.

**Recommendation:** Publish at least one of the following:

- A truthful “projects typically start from” figure.
- Two anonymised example briefs with indicative ranges.
- A discovery fee plus typical implementation and ongoing-support bands.
- A short estimator that outputs a broad range and invites validation.

Also show what is included, what remains third-party, payment milestones, ownership/licensing terms, and what ongoing maintenance covers.

#### 8. The platform auto-rotates content without a user pause control and changes layout height

**Evidence:** `ModuleExplorer` changes tabs every 4.2 seconds until the user clicks or hovers. At the tested 390 px viewport, the panel changed from Ordering to Staff after nine seconds and its measured height changed from 1,078 px to 852 px, a 226 px shift. Keyboard focus does not pause the cycle.

**Why it matters:** Text can change while someone is reading it, content below can jump, touch users cannot hover to pause, and the interaction risks failing the intent of WCAG's pause/stop guidance.

**Recommendation:** Remove auto-advance by default. If motion is retained, add an obvious pause control, pause on keyboard focus and pointer hover, preserve panel height, and never move a visitor's reading position.

#### 9. Product “tabs” are incomplete as accessible tab widgets

**Evidence:** Both interactive product selectors use `role="tab"` and `aria-selected`, but do not connect tabs to `tabpanel` elements with IDs and `aria-controls`, do not implement roving `tabIndex`, and do not support arrow-key navigation. The Our Work selector updates a very large `aria-live="polite"` region.

**Why it matters:** The visual interaction works with touch and mouse but does not behave like the tab pattern it announces to assistive technology. Announcing an entire replaced case-study subtree can also be overwhelming.

**Recommendation:** Either implement the WAI-ARIA tab pattern fully or remove tab roles and use ordinary buttons with a concise status announcement. On Our Work, announce only “Needa Pizza project selected” and move focus to the updated project heading when appropriate.

#### 10. The portfolio demonstrates activity but not enough customer success

**Evidence:** Two of the three featured venue projects are blurred work in progress. The launched Caffe Primo project links screenshots to image files, but the visible `primofirle.com.au` text is not an external link. There is no customer quotation, named stakeholder, launch date, before/after problem, or measurable operational result.

**Why it matters:** Three cards imply breadth, but two unfinished projects can also emphasise how early the company is. Screenshots prove design output, not reliability or business value.

**Recommendation:** Make the live project the main case study and WIP work a smaller “currently building” strip. Link to the live site, state exactly which components are live, add an approved customer quote, and document one real operating outcome. Suitable early-stage outcomes could be launch completion, menu scale, staff workflow consolidation, direct-order volume, time saved, or reduced manual hand-offs.

#### 11. Bespoke positioning raises risk questions the site never answers

**Evidence:** The site repeatedly says “from scratch,” “custom,” “open brief,” and “no fixed ceiling.” It does not explain warranty, hosting, backups, security, data export, ownership, support hours, incident response, update policy, or what happens if CentralPass is unavailable.

**Why it matters:** Custom software can sound expensive and fragile. A serious buyer will evaluate supplier risk as heavily as visual flexibility.

**Recommendation:** Add a concise “Built to last” section and a detailed Trust/Support page covering:

- Hosting and monitoring model.
- Backups and recovery.
- Payment and personal-data boundaries.
- Access control and staff roles.
- Data ownership and export.
- Support channels and target response times.
- Hardware and integration responsibility.
- Ongoing maintenance and change requests.
- Contract, warranty, and handover basics.

Only publish commitments CentralPass can actually meet.

#### 12. Buyers cannot see who they are trusting

**Evidence:** There is no About page, founder/team introduction, legal entity, ABN, portrait, background, or explanation of who supports a venue during launch.

**Why it matters:** This is especially important for a bespoke, high-touch service. The promise is personal, but the company presentation is anonymous.

**Recommendation:** Add an About section/page with the people behind CentralPass, hospitality/software experience, Adelaide base, working style, and who answers when something goes wrong. Add the contracting business name and ABN to the footer and legal pages after professional review.

#### 13. The contact journey adds friction before the form and requires two contact channels

**Evidence:** On the tested 390 px contact page, the explanatory content and contact cards appear before the form; the whole page is about 3,760 px. Name, venue, phone, and email are all required. The form has no native `action` or `method` fallback if JavaScript fails.

**Why it matters:** A visitor who already chose Contact has to scroll again to perform the action. Requiring both phone and email can reduce completion, especially if the promise is simply an initial reply.

**Recommendation:** Put a compact form or calendar immediately after the mobile intro, make either phone or email optional based on preferred contact method, and state the expected form length. Add a native POST action as a resilience fallback and test error, offline, duplicate, and spam states.

### P2: important refinement and maintainability

#### 14. The home page is long and repeats the same promise

**Evidence:** The home page repeats custom/bespoke/from-scratch language, repeats the commission message in the proof strip, benefit section, numeric strip, and case study, and closes with two CTA bands in close succession.

**Why it matters:** Repetition makes the page feel longer without reducing buyer uncertainty.

**Recommendation:** Reduce the home page to seven purposeful blocks and move detailed module/process content to Platform and Pricing.

#### 15. “Six systems” conflicts with the “one connected system” story

**Evidence:** The page says “One connected build” immediately above “Six systems you can start from.”

**Why it matters:** “Systems” suggests separate products and integrations, while CentralPass is selling reduced fragmentation.

**Recommendation:** Use “six connected workflows,” “six proven modules,” or “one platform, six starting points.”

#### 16. The visual system is distinctive but too uniform across pages

**Evidence:** Platform and Pricing use almost the same large left-aligned hero with an unused right half. Most surfaces use the same beige canvas, hairline, serif heading, and rectangular treatment. Real photography is absent from Home and Platform.

**Why it matters:** Consistency is good, but insufficient visual contrast makes a long site feel like one continuous document and hides important moments.

**Recommendation:** Keep the palette and typography but introduce controlled variety:

- One real venue/service photograph near the top.
- One large full-colour product screen.
- Customer-logo or venue-name typography.
- A dark or accent case-study section used once, not everywhere.
- More compact comparison/table patterns for process and pricing.

#### 17. The mobile menu is usable but not a complete modal navigation pattern

**Evidence:** Opening the menu locks background scroll, supports Escape, and shows a backdrop. However, focus is not trapped within the menu, focus is not explicitly moved to the first menu item, and the rest of the page remains exposed to the accessibility tree.

**Recommendation:** Treat it as either a non-modal disclosure that does not cover the page or a true modal navigation with focus management, `inert`/`aria-hidden` handling, and focus restoration.

#### 18. The custom cursor requirement has disappeared

**Evidence:** `Cursor.jsx` is deleted in the current working tree and `App.jsx` no longer renders a custom pointer.

**Assessment:** This is not inherently a usability problem; the native cursor is more reliable and accessible. It is, however, a regression against the earlier stated brand requirement.

**Recommendation:** Decide deliberately. If reintroduced, retain the native pointer, limit decoration to fine-pointer devices, position it exactly at pointer coordinates, disable it for reduced motion, and never add autonomous drift, trailing, or magnetic movement to the cursor itself.

#### 19. The stylesheet carries substantial legacy code

**Evidence:** The production CSS is about 83.3 KB before gzip, 15.9 KB gzipped, and the source stylesheet is over 3,100 lines. The repository's own CSS audit marks multiple families as entirely dead, including old device, placeholder, marquee, journey, stage, printer, and receipt rules. Home also imports unused `PhotoSlot` and `MockOrder` symbols. `git diff --check` reports trailing whitespace in `src/index.css`.

**Why it matters:** Runtime cost is still acceptable, but duplicate design eras make future UI changes unpredictable. Later rules currently override earlier legacy hero and colour rules.

**Recommendation:** After the design is approved, split tokens/base/layout/components/pages, remove dead selectors with route-by-route visual regression checks, remove unused imports, and add lint/format checks to CI.

#### 20. Social and image assets can be lighter

**Evidence:** Public static assets total roughly 2.0 MB. `og.png` alone is about 752 KB. Live-page WebP assets are generally well-sized and lazy-loaded, but several are 125–172 KB each.

**Recommendation:** Keep WebP/AVIF and lazy loading, target a materially smaller social card if visual quality holds, define image dimensions or aspect ratios consistently, and preload only the single genuinely critical image. The current Vite output of roughly 74.7 KB gzipped JavaScript and 15.9 KB gzipped CSS is acceptable for this scope.

#### 21. Route SEO works after JavaScript, but static sharing and error status remain weak

**Evidence:** Runtime checks show route-specific titles, descriptions, canonical URLs, and Open Graph values are applied correctly. However, the server delivers one `index.html` shell for every route, social metadata is corrected client-side, unknown URLs are rewritten to the SPA with a 200 response, and the runtime adds a second JSON-LD block beside the static Organization block.

**Why it matters:** Search engines can render JavaScript, but link preview bots and less capable crawlers may see home metadata for every route. Unknown pages risk behaving as soft 404s. Duplicate structured data is not automatically invalid, but two separate sources are easier to let drift.

**Recommendation:** Prerender or server-render important routes, return a true 404 status for unknown URLs, make route Open Graph tags available in the initial HTML, and use one deliberate schema graph per page. Validate the deployed output in Google Rich Results Test and social debuggers.

#### 22. SEO coverage is too narrow for the services being sold

**Evidence:** The sitemap contains only Home, Platform, Pricing, Our Work, Contact, Privacy, and Terms. Search intent for restaurant websites, direct ordering, restaurant CRM, kitchen systems, bookings, staff tools, and Adelaide software is compressed into the Platform page.

**Recommendation:** Build genuinely useful service pages rather than keyword-swapped duplicates. Good candidates are:

- Custom restaurant websites.
- Commission-free direct ordering.
- Restaurant CRM and loyalty.
- Kitchen and order operations.
- Restaurant bookings.
- Staff time and availability.
- Adelaide restaurant software.
- Caffe Primo Firle case study.

Each page should answer distinct buyer questions, show relevant proof, and link to the same clear conversion action.

#### 23. Legal and privacy copy needs a professional commercial review

**Evidence:** The policies are readable but brief. They do not name Formspree, the contracting entity, complaint/escalation process, overseas processing, detailed retention basis, or customer-system data responsibilities. No analytics or advertising tracker was found in the audited source, so a cookie banner should not be added unless tracking that requires one is introduced.

**Recommendation:** Before paid acquisition or signing more customers, have Australian counsel/accounting advisers confirm the entity, ABN display, privacy obligations, proposal/contract structure, terms, data processing, third-party services, and claims. This audit is a design and product review, not legal advice.

## Home page deep dive

### Current hero

**Strengths**

- Visually confident and recognisable.
- Large type works on desktop and remains readable at 390 px.
- Two actions are visible without interaction.
- “Built around you” accurately expresses the custom model.

**Problems**

- The audience is not explicit.
- The business outcome is secondary to the production method.
- The right half of the desktop hero is visually underused.
- The “real CentralPass screen” is a monochrome code-rendered mock below the core message, not an obvious customer deployment.
- The badge overstates the number of live venues.
- The persistent CTA says “Book a demo,” but the destination is not a booking experience.

### Recommended hero direction

Do not return to the old dark neon treatment. Keep the warm editorial design and use the open desktop space for a real proof visual.

**Eyebrow**  
Custom restaurant systems · Built and supported in Adelaide

**H1 option A**  
One connected system, built around how your restaurant actually runs.

**H1 option B**  
Your venue. One connected system. No off-the-shelf compromise.

**Supporting copy**  
CentralPass designs and builds websites, direct ordering, kitchen, staff, and owner tools for independent restaurants and cafes. Start with proven modules, then add the workflows your venue needs.

**Primary CTA**  
Book a 20-minute discovery call

**Secondary CTA**  
See Caffe Primo in action

**Proof line**  
Live at Caffe Primo Firle · CentralPass takes $0 order commission · Built in Adelaide

**Hero visual**  
A real split-screen showing the launched Caffe Primo customer ordering experience beside the staff order screen. Link it to the case study and live venue, not to a raw image file.

### Recommended home-page information architecture

1. **Hero:** audience, outcome, two truthful CTAs, one real product/customer visual.
2. **Immediate proof:** launched venue, approved quote, one operational fact or result.
3. **Problem-to-outcome section:** direct orders, one source of truth, less staff hand-off.
4. **Connected platform:** a simplified overview of six modules; keep the full interaction on Platform.
5. **Custom-build difference:** proven modules plus genuinely new scoped capabilities.
6. **Buying clarity:** typical investment/timeline, five-step process, support commitment.
7. **Final CTA:** one primary action, phone as secondary, compact FAQ.

This would remove the duplicate numeric strip, reduce repeated commission messaging, combine the two closing CTA bands, and bring proof forward by several thousand pixels.

## Page-by-page notes

### Home

- Keep the editorial hero but make restaurant/cafe explicit.
- Move the live case study directly below it.
- Rename “Six systems” to connected modules/workflows.
- Remove auto-style interaction duplication between Home and Platform.
- Replace the 100% / $0 / 1:1 strip with one customer quote and one approved result.
- Combine the final two CTA sections.

### Platform

- Remove auto-rotation or add full pause/focus support.
- Implement correct tab semantics.
- Group modules by buyer outcome: Sell direct, Run service, Know customers, Manage the venue.
- Add integrations, device/hardware, offline/reliability, security, and support detail.
- Use real production screens for at least the launched modules.

### Pricing

- Add an investment anchor and example scopes.
- State a typical total duration, not only phase labels.
- Explain deposit and milestone payment structure.
- Separate one-off build, third-party pass-through costs, and ongoing support/hosting.
- Clarify ownership, cancellation, changes, and what “support” covers.

### Our Work

- Keep the WIP blur treatment exactly as it is.
- Make Caffe Primo a standalone, indexable case-study route.
- Link the real customer site and clearly mark what is live.
- Add approved customer words and measurable evidence.
- De-emphasise the numerical impression of two unfinished projects.
- Fix the semantic counter and the oversized live-region announcement.

### Contact

- Match the page to the chosen primary CTA.
- Move the form/calendar higher on mobile.
- Reduce required fields or let the visitor choose phone versus email.
- Add office hours/time zone and the person who will reply.
- Add native form submission fallback and explicit error recovery.
- Instrument form-start, validation-error, submit-success, and calendar-booked events only after consent/privacy requirements are confirmed.

### Privacy and Terms

- Keep the plain-language structure.
- Add a real business identity and obtain professional review.
- Name relevant processors and clarify customer-system data responsibilities.
- Make “last updated” an actual release-controlled date.

## Accessibility checklist for implementation

- [ ] Automated axe scan on every route at desktop and mobile widths.
- [ ] Keyboard-only pass: header, menu, all interactive demos, venue picker, form, and footer.
- [ ] Screen-reader pass for headings, tabs, live regions, counter values, status labels, and form errors.
- [ ] Focus trap/restoration decision for mobile navigation.
- [ ] Fully implement or remove tab semantics.
- [ ] Stop automatic module changes unless the user explicitly starts them.
- [ ] Preserve visible focus indicators in every theme/surface.
- [ ] Confirm all touch targets and spacing against WCAG 2.2 target-size requirements.
- [ ] Validate 200% and 400% zoom without content loss.
- [ ] Test reduced motion, high contrast/forced colours, and font loading failure.
- [ ] Ensure animations never provide the only truthful value.

## SEO and measurement plan

### Technical

- Prerender key routes or adopt SSR/static generation.
- Return real 404 responses.
- Unify structured data and validate it after deployment.
- Put route-specific social metadata in initial HTML.
- Add `lastmod` values to the sitemap when they can be maintained honestly.
- Add a case-study schema/content model only when the visible page supports the claims.
- Verify Core Web Vitals on the deployed domain with Lighthouse and Search Console; this source review did not substitute for a production Lighthouse run.

### Content

- Publish focused service pages that answer different intents.
- Turn Caffe Primo into a complete case study.
- Publish a clear custom-build methodology and support model.
- Add About/company trust content.
- Use internal links from Home and Platform to the relevant service/case pages.

### Conversion events

Track a small set of decisions rather than every click:

1. Primary CTA click.
2. Live case-study view.
3. Pricing view.
4. Form start.
5. Form success/error.
6. Calendar booking, if added.
7. Phone and email link use.

Compare these by device and landing page. Do not claim that a visual change “converted better” without enough traffic and a defined success event.

## Recommended delivery roadmap

### Release 1: truth, proof, and conversion

- Deploy the correct approved design.
- Fix the `0+` semantic counter.
- Correct plural/fee claims.
- Standardise the primary CTA and destination.
- Move Caffe Primo proof under the hero.
- Add the live-site link and an approved customer quote/result.
- Add a truthful price or budget anchor.

### Release 2: buyer confidence

- Add About, Support/Trust, and a full Caffe Primo case-study page.
- Explain ownership, hosting, security, backup, support, and integration responsibilities.
- Simplify the home page to the seven-block architecture.
- Refine the contact form and add a real calendar if “Book” remains the CTA.

### Release 3: accessibility, SEO, and maintainability

- Remove unpausable auto-rotation.
- Correct tab/menu/live-region semantics.
- Prerender key routes and return real 404s.
- Consolidate structured data.
- Remove legacy CSS and unused code under visual regression coverage.
- Add focused service landing pages and production analytics.

## Verification performed

- Inspected all current source routes and major components.
- Confirmed the Vite production build succeeds.
- Tested Home, Platform, Pricing, Our Work, Contact, Privacy, Terms, and a missing route at a 1,440 × 1,000 desktop target.
- Tested the five main routes at a 390 × 844 mobile target.
- Confirmed no document-level horizontal overflow on those mobile routes.
- Opened and closed the mobile menu and inspected its accessibility tree.
- Verified WIP selection, explicit labels, and the `blur(12px) saturate(0.68) brightness(0.72)` treatment.
- Verified runtime route metadata and found two JSON-LD blocks.
- Compared the local redesign with the current public domain.
- Reviewed official current pages from Toast, Square, Lightspeed, SevenRooms, Olo, and BentoBox.

## Limits of this audit

- No website code was changed as part of the audit.
- No production form submission was made.
- No customer claims or permissions were independently verified.
- Competitor numbers are their own published marketing claims.
- A source/build/browser review is not a substitute for production Lighthouse, real-user Core Web Vitals, security testing, legal review, or observed conversion data.

