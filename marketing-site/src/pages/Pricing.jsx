import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Reveal from '../components/Reveal.jsx';
import { IconArrowRight, IconPhone, IconSparkle } from '../components/icons.jsx';

const PLANS = [
  {
    name: 'Pickup',
    desc: 'Everything you need to take commission-free online orders for pickup.',
    price: 'Custom',
    unit: 'per venue',
    features: [
      'Custom-designed ordering site',
      'Admin dashboard + staff portal',
      'Kitchen board + receipt printing',
      'Stripe card & cash payments',
      'Customer CRM',
    ],
    featured: false,
  },
  {
    name: 'Full service',
    desc: 'The complete platform — pickup, delivery and bookings, all in one system.',
    price: 'Custom',
    unit: 'per venue',
    features: [
      'Everything in Pickup, plus:',
      'Uber Direct delivery',
      'Table bookings',
      'Discount codes & email campaigns',
      'Priority support',
    ],
    featured: true,
  },
  {
    name: 'Multi-venue',
    desc: 'For groups running more than one location from a single system.',
    price: 'Custom',
    unit: 'per group',
    features: [
      'Everything in Full service, plus:',
      'Multiple venues, one login',
      'Per-venue menus & pricing',
      'Group-wide reporting',
      'Dedicated account manager',
    ],
    featured: false,
  },
];

const FAQ = [
  {
    q: 'Why is pricing custom?',
    a: 'Every venue is different — menu size, delivery, number of staff, hardware you already have. We quote a fair, flat price for your setup rather than forcing you into a tier that doesn’t fit.',
  },
  {
    q: 'Do you take a commission on orders?',
    a: 'No. CentralPass is commission-free. You keep 100% of every order (aside from the standard Stripe card processing fee). That’s the whole point.',
  },
  {
    q: 'What about hardware?',
    a: 'We help you get set up with a tablet and a Star receipt printer, and configure everything. If you already have compatible hardware, even better.',
  },
  {
    q: 'How long until we’re live?',
    a: 'Most venues are designed, built and trained within a week or two, depending on menu size. Setup on the floor is usually done in a single day.',
  },
];

export default function Pricing() {
  return (
    <main id="main">
      {/* Page hero */}
      <section className="page-hero grain">
        <div className="glow glow--violet" style={{ width: 460, height: 460, top: -150, right: -60, opacity: 0.38 }} />
        <div className="glow glow--cyan" style={{ width: 320, height: 320, bottom: -160, left: '6%', opacity: 0.2 }} />
        <div className="container">
          <div className="page-hero__inner">
            <span className="eyebrow">Pricing</span>
            <h1>Simple, flat, and <span className="grad-text">commission-free.</span></h1>
            <p>
              No cut of your orders. No per-order fees. One fair price for your
              venue — quoted after a quick demo so it actually fits how you run.
            </p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="section">
        <div className="container">
          <div className="pricing-grid">
            {PLANS.map((p) => (
              <Reveal
                className={`price-card ${p.featured ? 'price-card--featured' : ''}`}
                key={p.name}
              >
                {p.featured && (
                  <span className="price-card__ribbon">
                    Most popular
                  </span>
                )}
                <div className="price-card__name">{p.name}</div>
                <p className="price-card__desc">{p.desc}</p>
                <div className="price-card__price">
                  {p.price} <small>/ {p.unit}</small>
                </div>
                <ul className="price-card__list">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`btn btn-block price-card__cta ${p.featured ? 'btn-primary' : 'btn-dark'}`}
                >
                  Get a quote
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="center lead" style={{ marginTop: 32, fontSize: '1rem', color: 'var(--text-muted)' }}>
            All plans are commission-free. Standard Stripe card processing fees apply.
          </p>
        </div>
      </section>

      {/* Big call-for-quote panel */}
      <section className="section section--tight">
        <div className="container">
          <Reveal className="quote-panel grain">
            <div className="glow glow--violet" style={{ width: 400, height: 400, top: -160, left: '14%', opacity: 0.4 }} />
            <div className="glow glow--coral" style={{ width: 340, height: 340, bottom: -170, right: '12%', opacity: 0.32 }} />
            <span className="eyebrow" style={{ position: 'relative', zIndex: 2 }}>
              <IconSparkle /> Get your number
            </span>
            <h2>Call us for a demo and a quote.</h2>
            <p>
              Two minutes on the phone and we’ll show you {BRAND.name} running a
              real venue, then give you a straight price for yours.
            </p>
            <a href={`tel:${BRAND.contactPhone}`} className="quote-phone">
              <IconPhone />
              <span className="grad-text">{BRAND.contactPhoneDisplay}</span>
            </a>
            <div className="cta-band__actions" style={{ marginTop: 34 }}>
              <Link to="/contact" className="btn btn-primary btn-lg">
                Or book a demo online <IconArrowRight />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="section section--tight">
        <div className="container container--narrow">
          <div className="section-head">
            <span className="eyebrow">Questions</span>
            <h2>Good to know.</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {FAQ.map((f) => (
              <Reveal className="bento__cell" key={f.q}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: 10 }}>{f.q}</h3>
                <p style={{ color: 'var(--text-soft)' }}>{f.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
