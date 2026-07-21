import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Reveal from '../components/Reveal.jsx';
import OrderFlowDemo from '../components/OrderFlowDemo.jsx';
import ModuleExplorer from '../components/ModuleExplorer.jsx';
import { Magnetic, CountUp } from '../components/motion.jsx';
import {
  MockOrder,
  MockDashboard,
  MockStaff,
  MockKitchen,
  MockBookings,
  MockDelivery,
} from '../components/mocks.jsx';
import {
  IconStore,
  IconLayout,
  IconStaff,
  IconChef,
  IconCalendar,
  IconTruck,
  IconArrowRight,
  IconPhone,
} from '../components/icons.jsx';

const MODULES = [
  {
    id: 'order', Icon: IconStore, name: 'Ordering site',
    eyebrow: 'For your customers',
    heading: 'A storefront that looks like your venue.',
    body: 'A bespoke, fast ordering site for pickup and delivery — your brand, your menu, not a template.',
    features: ['Custom design, not a theme', 'Stripe card + pay-in-store cash', 'Full modifiers & dietary tags'],
    Mock: MockOrder,
  },
  {
    id: 'dash', Icon: IconLayout, name: 'Admin dashboard',
    eyebrow: 'For you',
    heading: 'One dashboard that runs everything.',
    body: 'Change anything on your live site in seconds — menu, prices, hours, promos — with no developer.',
    features: ['Edits go live instantly', 'Discounts & surcharge days', 'Today’s takings at a glance'],
    Mock: MockDashboard,
  },
  {
    id: 'kitchen', Icon: IconChef, name: 'Kitchen + printer',
    eyebrow: 'For your team',
    heading: 'Orders hit the pass instantly.',
    body: 'A live kitchen board on one tablet, wired to a receipt printer so dockets print themselves.',
    features: ['Sound alert on every order', 'Auto-printed Star dockets', 'One tap: accept → ready'],
    Mock: MockKitchen,
  },
  {
    id: 'staff', Icon: IconStaff, name: 'Staff portal',
    eyebrow: 'For your team',
    heading: 'The right access for every role.',
    body: 'Staff get their own logins and a portal on the shop tablet — separate from your owner dashboard.',
    features: ['Role-based permissions', 'Built-in time clock', 'Add or remove staff yourself'],
    Mock: MockStaff,
  },
  {
    id: 'book', Icon: IconCalendar, name: 'Bookings',
    eyebrow: 'Beyond pickup',
    heading: 'Reservations in the same portal.',
    body: 'Take table bookings through the site your customers already order from — no separate app.',
    features: ['Set covers & time slots', 'Lands beside your orders', 'Tied to the customer record'],
    Mock: MockBookings,
  },
  {
    id: 'deliv', Icon: IconTruck, name: 'Uber Direct',
    eyebrow: 'Beyond pickup',
    heading: 'Delivery you own — without drivers.',
    body: 'Offer delivery without handing customers, or 30% of every order, to a marketplace.',
    features: ['Auto-dispatch a courier', 'You keep the customer', 'Set your radius & fees'],
    Mock: MockDelivery,
  },
];

export default function Home() {
  return (
    <main id="main">
      {/* Hero + interactive showpiece */}
      <section className="hero hero--center grain">
        <div className="hero__bg">
          <div className="glow glow--violet" />
          <div className="glow glow--coral" />
          <div className="glow glow--cyan" />
        </div>
        <div className="container hero__grid">
          <div>
            <span className="hero__badge">
              <b>Live</b> One portal · zero commission
            </span>
            <h1>
              The whole restaurant,<br />
              run from <span className="grad-text">one portal.</span>
            </h1>
            <p className="hero__sub">{BRAND.pitch}</p>
            <div className="hero__actions">
              <Magnetic>
                <Link to="/contact" className="btn btn-primary btn-lg">
                  Book a demo <IconArrowRight />
                </Link>
              </Magnetic>
              <Magnetic strength={0.25}>
                <Link to="/platform" className="btn btn-ghost btn-lg">
                  See the platform
                </Link>
              </Magnetic>
            </div>
            <div className="hero__proof">
              <span className="dot" aria-hidden="true" />
              Tap the menu below — watch an order flow through, live
            </div>
          </div>

          <div className="hero__showpiece">
            <OrderFlowDemo />
          </div>
        </div>
      </section>

      {/* Interactive module explorer */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">One portal, everything</span>
            <h2>Six modules. One login. Zero commission.</h2>
            <p>Click through the platform — every piece talks to every other piece, in real time.</p>
          </div>
          <ModuleExplorer modules={MODULES} />
        </div>
      </section>

      {/* Stats band */}
      <section className="section section--tight on-dark grain">
        <div className="glow glow--violet" style={{ width: 420, height: 420, top: '-30%', left: '30%', opacity: 0.24 }} />
        <div className="container">
          <div className="stats-row">
            <Reveal className="stat-tile">
              <div className="stat-tile__num"><CountUp to={100} suffix="%" /></div>
              <div className="stat-tile__label">of every order stays yours</div>
            </Reveal>
            <Reveal className="stat-tile">
              <div className="stat-tile__num">$0</div>
              <div className="stat-tile__label">commission taken, ever</div>
            </Reveal>
            <Reveal className="stat-tile">
              <div className="stat-tile__num"><CountUp to={6} /></div>
              <div className="stat-tile__label">modules in a single portal</div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Live now */}
      <section className="section">
        <div className="container">
          <Reveal className="cta-band grain" style={{ background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)', boxShadow: 'var(--shadow-soft)' }}>
            <span className="eyebrow" style={{ position: 'relative', zIndex: 2 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              Live now
            </span>
            <h2 style={{ color: 'var(--ink)' }}>Running a real venue today.</h2>
            <p style={{ color: 'var(--text-soft)' }}>
              Caffe Primo Firle takes its whole pickup operation through Portal
              Panda — 100+ menu items, one tablet in the kitchen.
            </p>
            <div className="cta-band__actions">
              <Link to="/live" className="btn btn-dark btn-lg">See it live <IconArrowRight /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section section--tight">
        <div className="container">
          <Reveal className="cta-band grain">
            <div className="glow glow--violet" style={{ width: 380, height: 380, top: -140, left: '18%', opacity: 0.4 }} />
            <div className="glow glow--coral" style={{ width: 320, height: 320, bottom: -160, right: '16%', opacity: 0.3 }} />
            <h2>Ready to run everything from one portal?</h2>
            <p>Book a demo and we’ll show you Portal Panda on a real venue — then quote yours.</p>
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
