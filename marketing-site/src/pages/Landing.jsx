import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Reveal from '../components/Reveal.jsx';
import DeviceFrame from '../components/DeviceFrame.jsx';
import ContactForm from '../components/ContactForm.jsx';
import {
  IconBolt,
  IconCard,
  IconCalendar,
  IconUsers,
  IconTag,
  IconPrinter,
  IconClock,
  IconDownload,
} from '../components/icons.jsx';

const PROBLEMS = [
  {
    title: 'Marketplaces take up to 30%.',
    body: 'Delivery apps own your customers and eat your margin on every order.',
  },
  {
    title: 'Template sites all look the same.',
    body: "Your food is unique — your ordering page shouldn't look like everyone else's.",
  },
  {
    title: 'Paper dockets and phone orders.',
    body: 'Missed calls, misheard orders, and a counter full of scribbled notes.',
  },
];

const SURFACES = [
  {
    eyebrow: 'For your customers',
    heading: 'A beautiful ordering site, designed just for you.',
    features: [
      'Bespoke design that matches your brand — not a template.',
      'Card payments via Stripe, or pay-in-store cash.',
      'Pickup time slots that follow your real opening hours.',
      'Dietary tags, item photos, and full modifier options (sizes, add-ons, sauces).',
    ],
    type: 'phone',
    src: 'customer-menu-phone.png',
    label: 'Screenshot — customer ordering site',
  },
  {
    eyebrow: 'For your kitchen',
    heading: 'Orders land on a live board — no more missed dockets.',
    features: [
      'New orders appear instantly with a sound alert.',
      'One tap to accept, mark ready, or hand over.',
      'Receipts print automatically when you accept.',
      'Mark an item sold out and it disappears from the ordering site immediately.',
    ],
    type: 'tablet',
    src: 'kitchen-board-tablet.png',
    label: 'Screenshot — kitchen order board',
  },
  {
    eyebrow: 'For you',
    heading: 'Run the whole thing yourself — no developer needed.',
    features: [
      'Edit your menu, prices, photos and hours any time.',
      'Discount codes, surcharge days, and email campaigns.',
      'Every customer is remembered — regulars and high-spenders are tagged automatically.',
      "See today's orders and takings at a glance.",
    ],
    type: 'desktop',
    src: 'admin-menu-desktop.png',
    label: 'Screenshot — admin menu management',
  },
];

const FEATURES = [
  {
    Icon: IconBolt,
    title: 'Real-time everything',
    body: 'Sold-out items vanish from the menu instantly.',
  },
  {
    Icon: IconCard,
    title: 'Cash or card',
    body: 'Customers choose; staff see exactly what to collect.',
  },
  {
    Icon: IconCalendar,
    title: 'Special days',
    body: 'Public-holiday surcharges and one-off hours, set in advance.',
  },
  {
    Icon: IconUsers,
    title: 'Returning customers',
    body: 'Checkout recognises them by phone number.',
  },
  {
    Icon: IconTag,
    title: 'Discount codes',
    body: 'Percent or fixed, with expiry and usage limits.',
  },
  {
    Icon: IconPrinter,
    title: 'Receipt printing',
    body: 'Kitchen dockets on a Star receipt printer.',
  },
  {
    Icon: IconClock,
    title: 'Staff time clock',
    body: 'Shifts tracked on the same tablet.',
  },
  {
    Icon: IconDownload,
    title: 'Your data is yours',
    body: 'Export your customer list any time.',
  },
];

const STEPS = [
  {
    title: 'We design your site.',
    body: 'You tell us about your venue; we design an ordering site that looks like you — and load your full menu.',
  },
  {
    title: 'We set up your kitchen.',
    body: 'Tablet, printer, and training for your team. Most venues are comfortable within a day.',
  },
  {
    title: 'You go live and run it.',
    body: 'Update the menu, change hours, run promos — all yourself. We stay on call.',
  },
];

export default function Landing() {
  return (
    <main id="main">
      {/* 5.1 Hero */}
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <h1>
              Online ordering that looks like <em>your</em> restaurant.
            </h1>
            <p className="hero__sub">
              A custom-designed ordering site for your customers, a live order
              screen for your kitchen, and an admin console for you.
              Commission-free.
            </p>
            <div className="hero__actions">
              <Link to="/contact" className="btn btn-primary">
                Talk to us
              </Link>
              <Link to="/case-study" className="textlink">
                See it live at Caffe Primo Firle →
              </Link>
            </div>
          </div>

          <div className="hero__composite">
            <DeviceFrame
              type="phone"
              src="customer-menu-phone.png"
              label="Screenshot — customer ordering site"
              alt="The customer ordering site shown on a phone"
            />
            <DeviceFrame
              type="tablet"
              src="kitchen-board-tablet.png"
              label="Screenshot — kitchen order board"
              alt="The kitchen order board shown on a tablet"
            />
          </div>
        </div>
      </section>

      {/* 5.2 Problem strip */}
      <section className="section" id="product">
        <div className="container">
          <div className="cards-3">
            {PROBLEMS.map((p) => (
              <Reveal className="problem-card" key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5.3 The three surfaces */}
      <section className="section section--tight">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">One system, three surfaces</span>
            <h2>Everything talks to each other, in real time.</h2>
          </div>

          {SURFACES.map((s, i) => (
            <Reveal
              className={`surface-block ${i % 2 === 1 ? 'surface-block--reverse' : ''}`}
              key={s.eyebrow}
            >
              <div>
                <span className="eyebrow">{s.eyebrow}</span>
                <h3>{s.heading}</h3>
                <ul className="feature-list">
                  {s.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="surface-block__media">
                <DeviceFrame
                  type={s.type}
                  src={s.src}
                  label={s.label}
                  light
                />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 5.4 Feature grid */}
      <section className="section" id="features">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">The details</span>
            <h2>And everything around the edges.</h2>
          </div>
          <div className="feature-grid">
            {FEATURES.map(({ Icon, title, body }) => (
              <Reveal className="feature-cell" key={title}>
                <span className="feature-cell__icon">
                  <Icon />
                </span>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 5.5 Case study teaser (dark) */}
      <section className="section section--dark" id="case-study">
        <div className="container">
          <div className="teaser teaser__grid">
            <Reveal>
              <span className="eyebrow">Running live today</span>
              <h2>Caffe Primo Firle runs on {BRAND.name}.</h2>
              <p>
                From breakfast rush to weekend queues, Primo Firle takes pickup
                orders through their own custom site — and the kitchen runs on
                one tablet.
              </p>
              <Link to="/case-study" className="btn btn-primary">
                Read the case study
              </Link>
            </Reveal>
            <Reveal>
              <DeviceFrame
                type="desktop"
                src="casestudy-hero.png"
                label="Screenshot — Caffe Primo Firle"
                alt="Caffe Primo Firle ordering site"
                light
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5.6 How we work */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How we work</span>
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
          <div className="center">
            <p className="lead" style={{ marginBottom: 24 }}>
              Every venue is different, so we don't do one-size-fits-all pricing
              — tell us about yours.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Talk to us
            </Link>
          </div>
        </div>
      </section>

      {/* 5.7 Contact form */}
      <section className="section section--tight" id="contact">
        <div className="container">
          <div className="contact__grid">
            <div className="contact__aside">
              <h2>Tell us about your venue.</h2>
              <p>
                Custom-designed, done-for-you online ordering. Tell us what you
                serve and what you need — we'll take it from there.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
