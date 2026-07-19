import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Reveal from '../components/Reveal.jsx';
import DeviceFrame from '../components/DeviceFrame.jsx';

const RUNS = [
  {
    eyebrow: 'For their customers',
    heading: 'A modifier-heavy menu, their way.',
    lines: [
      'Over 100 items with sizes, add-ons and dietary options.',
      'Card payments via Stripe and pay-in-store cash at pickup.',
    ],
    type: 'phone',
    src: 'customer-checkout-phone.png',
    label: 'Screenshot — Primo checkout',
  },
  {
    eyebrow: 'In the kitchen',
    heading: 'One tablet, printed dockets.',
    lines: [
      'Orders land on the kitchen board with a sound alert.',
      'Dockets print automatically on a Star receipt printer as orders are accepted.',
    ],
    type: 'tablet',
    src: 'kitchen-board-tablet.png',
    label: 'Screenshot — Primo kitchen board',
  },
  {
    eyebrow: 'Behind the counter',
    heading: 'Special days and regulars, handled.',
    lines: [
      'Public-holiday surcharges set in advance for busy long weekends.',
      'Customers are tagged automatically — regulars and high-spenders stand out.',
    ],
    type: 'desktop',
    src: 'admin-customers-desktop.png',
    label: 'Screenshot — Primo customer list',
  },
];

const STATS = [
  { num: '[TBC]', label: 'Orders taken online' },
  { num: '$0', label: 'Commission paid on those orders' },
  { num: 'Instant', label: 'Time from order to kitchen' },
];

export default function CaseStudy() {
  return (
    <main id="main">
      {/* 1. Hero */}
      <section className="cs-hero">
        <div className="container cs-hero__grid">
          <div>
            <span className="eyebrow">Case study</span>
            <h1>Caffe Primo Firle, South Australia</h1>
            <p>
              A neighbourhood caffe running its whole pickup operation on{' '}
              {BRAND.name}.
            </p>
          </div>
          <DeviceFrame
            type="desktop"
            src="casestudy-hero.png"
            label="Screenshot — Caffe Primo Firle"
            alt="Caffe Primo Firle ordering site"
            light
          />
        </div>
      </section>

      {/* 2. The venue */}
      <section className="section">
        <div className="container">
          <Reveal className="prose">
            <span className="eyebrow">The venue</span>
            <h2 style={{ fontSize: '2rem', marginBottom: 18 }}>
              A busy suburban caffe with a full menu.
            </h2>
            <p>
              Primo Firle is a busy suburban caffe in Firle, Adelaide. It serves
              a full breakfast and lunch menu — over 100 items, with sizes,
              add-ons and dietary options — to a steady stream of counter
              service and regulars. From the breakfast rush to weekend queues,
              they take pickup orders through their own custom-designed site, and
              run the kitchen on a single tablet.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. What they run */}
      <section className="section section--tight">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What they run</span>
            <h2>Three surfaces, one system.</h2>
          </div>

          {RUNS.map((r, i) => (
            <Reveal
              className={`surface-block ${i % 2 === 1 ? 'surface-block--reverse' : ''}`}
              key={r.eyebrow}
            >
              <div>
                <span className="eyebrow">{r.eyebrow}</span>
                <h3>{r.heading}</h3>
                <ul className="feature-list">
                  {r.lines.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
              <div className="surface-block__media">
                <DeviceFrame type={r.type} src={r.src} label={r.label} light />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 4. Quote block — REAL QUOTE PENDING */}
      <section className="section section--dark">
        <div className="container">
          <Reveal className="cs-quote">
            <blockquote>“[Owner quote to be supplied]”</blockquote>
            <cite>— Owner, Caffe Primo Firle</cite>
          </Reveal>
        </div>
      </section>

      {/* 5. Results strip — REAL NUMBERS PENDING */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">The results</span>
            <h2>What it adds up to.</h2>
          </div>
          <div className="stats-3">
            {STATS.map((s) => (
              <Reveal className="stat-tile" key={s.label}>
                <div className="stat-tile__num">{s.num}</div>
                <div className="stat-tile__label">{s.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA */}
      <section className="section section--tight">
        <div className="container">
          <div className="cta-band">
            <h2>Want this for your venue?</h2>
            <Link to="/contact" className="btn btn-primary">
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
