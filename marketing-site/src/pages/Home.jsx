import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Reveal from '../components/Reveal.jsx';
import DeviceFrame from '../components/DeviceFrame.jsx';
import {
  IconStore,
  IconLayout,
  IconStaff,
  IconChef,
  IconCalendar,
  IconTruck,
  IconRefresh,
  IconArrowRight,
  IconPhone,
} from '../components/icons.jsx';

const MARQUEE = [
  'Custom ordering site',
  'Admin dashboard',
  'Staff portal',
  'Kitchen board',
  'Receipt printing',
  'Table bookings',
  'Uber Direct delivery',
  'Stripe payments',
  'Customer CRM',
  'Commission-free',
];

const SURFACES = [
  {
    eyebrow: 'For your customers',
    heading: 'An ordering site that looks like your venue — not a template.',
    lead: 'A bespoke, lightning-fast ordering site designed around your brand, your menu and your hours.',
    features: [
      'Custom design — colours, type and photography that are unmistakably yours.',
      'Card payments via Stripe, or pay-in-store cash.',
      'Full modifiers: sizes, add-ons, sauces, dietary tags and item photos.',
      'Pickup slots that follow your real opening hours in real time.',
    ],
    type: 'phone',
    src: 'customer-menu-phone.png',
    label: 'Customer ordering site',
  },
  {
    eyebrow: 'For you',
    heading: 'One dashboard that controls the whole thing.',
    lead: 'Change anything on your live site in seconds — no developer, no waiting, no ticket.',
    features: [
      'Edit menu, prices, photos and hours and it goes live instantly.',
      'Discount codes, surcharge days and email campaigns.',
      'See today’s orders, takings and top items at a glance.',
      'Every customer remembered — regulars and big spenders tagged automatically.',
    ],
    type: 'desktop',
    src: 'admin-menu-desktop.png',
    label: 'Admin dashboard',
  },
  {
    eyebrow: 'For your team',
    heading: 'Orders hit the kitchen the second they’re placed.',
    lead: 'A live order board and a staff portal on one tablet — with dockets that print themselves.',
    features: [
      'New orders appear instantly with a sound alert.',
      'Dockets print automatically on a Star receipt printer.',
      'Staff log in to their own portal and clock shifts.',
      'Mark an item sold out and it vanishes from the site immediately.',
    ],
    type: 'tablet',
    src: 'kitchen-board-tablet.png',
    label: 'Kitchen order board',
  },
];

const BENTO = [
  { Icon: IconStore, title: 'Ordering site', body: 'A custom-built storefront for pickup and delivery.' },
  { Icon: IconLayout, title: 'Admin dashboard', body: 'Control your menu, prices, hours and promos live.' },
  { Icon: IconStaff, title: 'Staff portal', body: 'Roles, logins and a built-in time clock.' },
  { Icon: IconChef, title: 'Kitchen + printer', body: 'Live order board with auto-printed dockets.' },
  { Icon: IconCalendar, title: 'Bookings', body: 'Take table reservations alongside orders.' },
  { Icon: IconTruck, title: 'Uber Direct delivery', body: 'On-demand drivers, dispatched automatically.' },
];

const STEPS = [
  { title: 'We design & build.', body: 'You tell us about your venue; we design your ordering site, load your full menu and wire up payments, printing and delivery.' },
  { title: 'We set up your floor.', body: 'Tablet, receipt printer, staff portal and training for your team. Most venues are live and comfortable within a day.' },
  { title: 'You run it — we’re on call.', body: 'Update anything yourself from the dashboard. We handle the tech, updates and support in the background.' },
];

export default function Home() {
  return (
    <main id="main">
      {/* Hero */}
      <section className="hero grain">
        <div className="hero__bg">
          <div className="glow glow--violet" />
          <div className="glow glow--coral" />
          <div className="glow glow--cyan" />
        </div>
        <div className="container hero__grid">
          <div>
            <span className="hero__badge">
              <b>New</b> Now with Uber Direct delivery
            </span>
            <h1>
              The whole restaurant,<br />
              run from <span className="grad-text">one portal.</span>
            </h1>
            <p className="hero__sub">{BRAND.pitch}</p>
            <div className="hero__actions">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Book a demo <IconArrowRight />
              </Link>
              <Link to="/platform" className="btn btn-ghost btn-lg">
                See the platform
              </Link>
            </div>
            <div className="hero__proof">
              <span className="dot" aria-hidden="true" />
              Live now at Caffe Primo Firle, Adelaide
            </div>
          </div>

          <div className="hero__stage">
            <div className="portal hero__portal" aria-hidden="true" />
            <div className="hero__devices">
              <DeviceFrame
                type="phone"
                src="customer-menu-phone.png"
                label="Customer ordering site"
                alt="The customer ordering site shown on a phone"
              />
              <DeviceFrame
                type="tablet"
                src="kitchen-board-tablet.png"
                label="Kitchen order board"
                alt="The kitchen order board shown on a tablet"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="on-dark" style={{ padding: '26px 0', borderTop: '1px solid var(--line-dark)', borderBottom: '1px solid var(--line-dark)' }}>
        <div className="marquee">
          <div className="marquee__track">
            {[...MARQUEE, ...MARQUEE].map((m, i) => (
              <span className="marquee__item" key={i}>
                <IconRefresh /> {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bento — one portal, everything */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">One portal, everything</span>
            <h2>Not another template site. A whole operating system for your venue.</h2>
            <p>
              Most tools give you a menu page and leave the hard parts to you.
              Portal Panda runs the entire operation — front of house, back of
              house and everything in between.
            </p>
          </div>
          <div className="bento">
            {BENTO.map(({ Icon, title, body }, i) => (
              <Reveal
                className={`bento__cell bento__cell--span2 bento__cell--feature ${i === 0 ? 'bento__cell--dark' : ''}`}
                key={title}
              >
                <span className="bento__icon"><Icon /></span>
                <h3>{title}</h3>
                <p>{body}</p>
                <div className="bento__spacer" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Three surfaces preview */}
      <section className="section section--tight" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Three surfaces, one system</span>
            <h2>Everything talks to everything — instantly.</h2>
          </div>

          {SURFACES.map((s, i) => (
            <Reveal
              className={`surface-block ${i % 2 === 1 ? 'surface-block--reverse' : ''}`}
              key={s.eyebrow}
            >
              <div>
                <span className="eyebrow">{s.eyebrow}</span>
                <h3>{s.heading}</h3>
                <p className="lead">{s.lead}</p>
                <ul className="feature-list">
                  {s.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="surface-block__media">
                <DeviceFrame type={s.type} src={s.src} label={s.label} light />
              </div>
            </Reveal>
          ))}

          <div className="center" style={{ marginTop: 48 }}>
            <Link to="/platform" className="btn btn-dark btn-lg">
              Explore the full platform <IconArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Delivery + bookings dark highlight */}
      <section className="section on-dark grain">
        <div className="glow glow--violet" style={{ width: 460, height: 460, top: -120, right: -60, opacity: 0.3 }} />
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Beyond pickup</span>
            <h2>Bookings and delivery, built in.</h2>
            <p>The things other platforms bolt on with a third-party app — we run them from the same portal.</p>
          </div>
          <div className="bento">
            <Reveal className="bento__cell bento__cell--span3 bento__cell--dark bento__cell--feature">
              <span className="bento__icon"><IconTruck /></span>
              <h3>Delivery with Uber Direct</h3>
              <p>Offer delivery without owning drivers or handing your customers to a marketplace. Orders dispatch an Uber Direct courier automatically, and you keep the customer relationship — and the margin.</p>
              <div className="bento__spacer" />
            </Reveal>
            <Reveal className="bento__cell bento__cell--span3 bento__cell--dark bento__cell--feature">
              <span className="bento__icon"><IconCalendar /></span>
              <h3>Table bookings</h3>
              <p>Take reservations through the same site your customers already order from. Bookings land in your dashboard next to your orders — one place, one login, no double-handling.</p>
              <div className="bento__spacer" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How it works</span>
            <h2>From first chat to first order.</h2>
          </div>
          <div className="steps">
            {STEPS.map((s, i) => (
              <Reveal className="step" key={s.title}>
                <span className="step__num">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Live now teaser */}
      <section className="section section--tight" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="cs-hero__grid">
            <Reveal>
              <span className="eyebrow">Live now</span>
              <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', marginBottom: 18 }}>
                Caffe Primo Firle runs on {BRAND.name}.
              </h2>
              <p className="lead" style={{ marginBottom: 28 }}>
                From the breakfast rush to weekend queues, Primo Firle takes
                pickup orders through their own custom site — and runs the whole
                kitchen on a single tablet.
              </p>
              <Link to="/live" className="btn btn-dark btn-lg">
                See it live <IconArrowRight />
              </Link>
            </Reveal>
            <Reveal>
              <DeviceFrame
                type="desktop"
                src="casestudy-hero.png"
                label="Caffe Primo Firle"
                alt="Caffe Primo Firle ordering site"
                light
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section">
        <div className="container">
          <Reveal className="cta-band grain">
            <div className="glow glow--violet" style={{ width: 380, height: 380, top: -140, left: '18%', opacity: 0.4 }} />
            <div className="glow glow--coral" style={{ width: 320, height: 320, bottom: -160, right: '16%', opacity: 0.3 }} />
            <h2>Ready to run everything from one portal?</h2>
            <p>Book a demo and we’ll show you Portal Panda running a real venue — then quote you for yours.</p>
            <div className="cta-band__actions">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Book a demo <IconArrowRight />
              </Link>
              <a href={`tel:${BRAND.contactPhone}`} className="btn btn-ghost btn-lg">
                <IconPhone /> {BRAND.contactPhoneDisplay}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
