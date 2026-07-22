import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Reveal from '../components/Reveal.jsx';
import { Tilt, Magnetic, CountUp } from '../components/motion.jsx';
import { MockOrder, MockKitchen, MockDashboard } from '../components/mocks.jsx';
import { IconArrowRight, IconPhone } from '../components/icons.jsx';

const RUNS = [
  {
    eyebrow: 'For their customers',
    heading: 'A modifier-heavy menu, their way.',
    lines: [
      'Over 100 items with sizes, add-ons and dietary options.',
      'Card payments via Stripe and pay-in-store cash at pickup.',
    ],
    Mock: MockOrder,
  },
  {
    eyebrow: 'In the kitchen',
    heading: 'One tablet, printed dockets.',
    lines: [
      'Orders land on the kitchen board with a sound alert.',
      'Dockets print automatically on a Star receipt printer as orders are accepted.',
    ],
    Mock: MockKitchen,
  },
  {
    eyebrow: 'Behind the counter',
    heading: 'Special days and regulars, handled.',
    lines: [
      'Public-holiday surcharges set in advance for busy long weekends.',
      'Customers tagged automatically — regulars and high-spenders stand out.',
    ],
    Mock: MockDashboard,
  },
];

const STATS = [
  { count: 100, suffix: '+', label: 'Menu items, fully modifiable' },
  { num: '$0', label: 'Commission paid, ever' },
  { num: 'Instant', label: 'From order placed to kitchen' },
];

export default function Live() {
  return (
    <main id="main">
      {/* Hero */}
      <section className="page-hero grain">
        <div className="glow glow--violet" style={{ width: 460, height: 460, top: -150, left: -70, opacity: 0.38 }} />
        <div className="glow glow--coral" style={{ width: 340, height: 340, bottom: -170, right: '8%', opacity: 0.28 }} />
        <div className="container">
          <div className="cs-hero__grid">
            <div>
              <span className="eyebrow">
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                Live now
              </span>
              <h1>Caffe Primo Firle runs on {BRAND.name}.</h1>
              <p>
                A busy neighbourhood caffe in Adelaide running its whole pickup
                operation — customer site, kitchen and counter — on one system.
              </p>
              <div className="hero__actions" style={{ marginTop: 30 }}>
                <Magnetic>
                  <Link to="/contact" className="btn btn-primary btn-lg">
                    Get this for your venue <IconArrowRight />
                  </Link>
                </Magnetic>
              </div>
            </div>
            <Tilt><MockOrder /></Tilt>
          </div>
        </div>
      </section>

      {/* The venue */}
      <section className="section">
        <div className="container">
          <Reveal className="prose">
            <span className="eyebrow">The venue</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.6vw, 2.4rem)', marginBottom: 18 }}>
              A busy suburban caffe with a full menu.
            </h2>
            <p>
              Primo Firle is a busy suburban caffe in Firle, Adelaide. It serves
              a full breakfast and lunch menu — over 100 items, with sizes,
              add-ons and dietary options — to a steady stream of counter
              service and regulars. From the breakfast rush to weekend queues,
              they take pickup orders through their own custom-designed site,
              and run the kitchen on a single tablet — all on {BRAND.name}.
            </p>
          </Reveal>
        </div>
      </section>

      {/* What they run */}
      <section className="section section--tight" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What they run</span>
            <h2>The whole system, in one venue.</h2>
          </div>

          {RUNS.map((r, i) => {
            const Mock = r.Mock;
            return (
              <Reveal
                className={`surface-block ${i % 2 === 1 ? 'surface-block--reverse' : ''}`}
                key={r.eyebrow}
              >
                <div>
                  <span className="eyebrow">{r.eyebrow}</span>
                  <h3>{r.heading}</h3>
                  <ul className="feature-list">
                    {r.lines.map((l) => <li key={l}>{l}</li>)}
                  </ul>
                </div>
                <div className="surface-block__media">
                  <Tilt><Mock /></Tilt>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Operational proof without an invented testimonial */}
      <section className="section on-dark grain">
        <div className="glow glow--violet" style={{ width: 420, height: 420, top: '-20%', left: '30%', opacity: 0.26 }} />
        <div className="container">
          <Reveal className="live-proof">
            <span className="eyebrow">Built in a real service environment</span>
            <h2>Designed around the rush, not a slide deck.</h2>
            <p>
              CentralPass is shaped by day-to-day venue work: modifiers that must
              be right, orders that must reach the kitchen instantly and tools
              staff can understand without a training manual.
            </p>
            <ul className="live-proof__list">
              <li>100+ menu items and modifiers</li>
              <li>Live kitchen board and printed dockets</li>
              <li>Hands-on setup and local support</li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Results */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">The results</span>
            <h2>What it adds up to.</h2>
          </div>
          <div className="stats-row">
            {STATS.map((s) => (
              <Reveal className="stat-tile" key={s.label}>
                <div className="stat-tile__num">
                  {s.count ? <CountUp to={s.count} suffix={s.suffix || ''} /> : s.num}
                </div>
                <div className="stat-tile__label">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--tight">
        <div className="container">
          <Reveal className="cta-band grain">
            <div className="glow glow--violet" style={{ width: 360, height: 360, top: -140, left: '18%', opacity: 0.4 }} />
            <div className="glow glow--coral" style={{ width: 300, height: 300, bottom: -150, right: '16%', opacity: 0.3 }} />
            <h2>Want this for your venue?</h2>
            <p>Book a demo, or call us and we’ll show you Primo’s setup and quote yours.</p>
            <div className="cta-band__actions">
              <Magnetic>
                <Link to="/contact" className="btn btn-primary btn-lg">Book a demo <IconArrowRight /></Link>
              </Magnetic>
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
