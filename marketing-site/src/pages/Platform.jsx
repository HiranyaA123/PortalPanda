import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Reveal from '../components/Reveal.jsx';
import { Tilt, Magnetic } from '../components/motion.jsx';
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
  IconCard,
  IconUsers,
  IconTag,
  IconChart,
  IconShield,
  IconRefresh,
  IconArrowRight,
  IconPhone,
} from '../components/icons.jsx';

const MODULES = [
  {
    Icon: IconStore,
    eyebrow: 'Customer ordering site',
    heading: 'A bespoke storefront, designed around your brand.',
    lead: 'Not a template with your logo dropped in — a fast, beautiful ordering site built for your venue.',
    features: [
      'Custom design: your colours, type, photography and voice.',
      'Card payments via Stripe, plus pay-in-store cash.',
      'Modifiers done properly — sizes, add-ons, sauces, dietary tags.',
      'Pickup and delivery slots tied to your live opening hours.',
    ],
    Mock: MockOrder,
  },
  {
    Icon: IconLayout,
    eyebrow: 'Admin dashboard',
    heading: 'The control room for your entire operation.',
    lead: 'Everything customers see and everything your team runs — controlled from one dashboard you actually own.',
    features: [
      'Edit menu, prices, photos and hours — changes go live instantly.',
      'Discount codes, public-holiday surcharges and email campaigns.',
      'Live view of orders, takings and your best-selling items.',
      'Turn delivery, bookings or whole sections on and off in a click.',
    ],
    Mock: MockDashboard,
  },
  {
    Icon: IconStaff,
    eyebrow: 'Staff portal',
    heading: 'Your team, with the right access — and nothing more.',
    lead: 'Staff get their own logins and their own portal on the shop tablet, separate from your owner dashboard.',
    features: [
      'Individual staff logins with role-based permissions.',
      'Built-in time clock — shifts tracked on the same tablet.',
      'Front-of-house sees orders and bookings, not your finances.',
      'Add or remove team members yourself in seconds.',
    ],
    Mock: MockStaff,
  },
  {
    Icon: IconChef,
    eyebrow: 'Kitchen board + receipt printing',
    heading: 'Orders hit the pass the moment they’re placed.',
    lead: 'A live kitchen board on one tablet, wired to a receipt printer so dockets print themselves.',
    features: [
      'New orders appear instantly with a sound alert.',
      'Dockets print automatically on a Star receipt printer as you accept.',
      'One tap to accept, mark ready, or hand over.',
      'Mark an item sold out and it disappears from the site immediately.',
    ],
    Mock: MockKitchen,
  },
  {
    Icon: IconCalendar,
    eyebrow: 'Table bookings',
    heading: 'Reservations, in the same portal as your orders.',
    lead: 'Stop juggling a separate booking app. Take reservations through the site customers already use.',
    features: [
      'Bookings land in your dashboard beside your orders.',
      'Set covers, time slots and blackout dates yourself.',
      'Customers book in a few taps — no account required.',
      'Every booking is tied to the same customer record.',
    ],
    Mock: MockBookings,
  },
  {
    Icon: IconTruck,
    eyebrow: 'Delivery with Uber Direct',
    heading: 'Delivery you own — without owning drivers.',
    lead: 'Offer delivery without handing your customers, or 30% of every order, to a marketplace.',
    features: [
      'Orders dispatch an Uber Direct courier automatically.',
      'You keep the customer relationship and their data.',
      'Set your own delivery radius and fees.',
      'Track every delivery from the same dashboard.',
    ],
    Mock: MockDelivery,
  },
];

const EXTRAS = [
  { Icon: IconRefresh, title: 'Real-time everything', body: 'Sold-out items vanish from the menu the instant you flip them.' },
  { Icon: IconCard, title: 'Cash or card', body: 'Customers choose; staff see exactly what to collect.' },
  { Icon: IconUsers, title: 'Customer CRM', body: 'Regulars and high-spenders are tagged automatically.' },
  { Icon: IconTag, title: 'Discount codes', body: 'Percent or fixed, with expiry and usage limits.' },
  { Icon: IconChart, title: 'Sales at a glance', body: 'Today’s takings and top items, always up to date.' },
  { Icon: IconShield, title: 'Your data is yours', body: 'Export your customer list any time. No lock-in.' },
];

export default function Platform() {
  return (
    <main id="main">
      {/* Page hero */}
      <section className="page-hero grain">
        <div className="glow glow--violet" style={{ width: 480, height: 480, top: -160, left: -80, opacity: 0.4 }} />
        <div className="glow glow--coral" style={{ width: 360, height: 360, bottom: -180, right: '8%', opacity: 0.28 }} />
        <div className="container">
          <div className="page-hero__inner">
            <span className="eyebrow">The platform</span>
            <h1>One portal that <span className="grad-text">does everything.</span></h1>
            <p>
              Portal Panda isn’t a menu page — it’s the full stack that runs an
              independent venue. Six connected modules, one login, zero
              commission.
            </p>
            <div className="hero__actions" style={{ marginTop: 32 }}>
              <Magnetic>
                <Link to="/contact" className="btn btn-primary btn-lg">
                  Book a demo <IconArrowRight />
                </Link>
              </Magnetic>
              <Link to="/pricing" className="btn btn-ghost btn-lg">See pricing</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="section">
        <div className="container">
          {MODULES.map((m, i) => {
            const Mock = m.Mock;
            return (
              <Reveal
                className={`surface-block ${i % 2 === 1 ? 'surface-block--reverse' : ''}`}
                key={m.eyebrow}
              >
                <div>
                  <span className="eyebrow">{m.eyebrow}</span>
                  <h3>{m.heading}</h3>
                  <p className="lead">{m.lead}</p>
                  <ul className="feature-list">
                    {m.features.map((f) => <li key={f}>{f}</li>)}
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

      {/* Extras bento */}
      <section className="section on-dark grain">
        <div className="glow glow--cyan" style={{ width: 400, height: 400, top: '10%', left: '-8%', opacity: 0.2 }} />
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">And everything around the edges</span>
            <h2>The details that keep a venue running.</h2>
          </div>
          <div className="bento">
            {EXTRAS.map(({ Icon, title, body }) => (
              <Reveal className="bento__cell bento__cell--span2 bento__cell--dark" key={title}>
                <span className="bento__icon"><Icon /></span>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <Reveal className="cta-band grain">
            <div className="glow glow--violet" style={{ width: 380, height: 380, top: -140, left: '18%', opacity: 0.4 }} />
            <div className="glow glow--coral" style={{ width: 320, height: 320, bottom: -160, right: '16%', opacity: 0.3 }} />
            <h2>See it running a real venue.</h2>
            <p>We’ll walk you through the whole platform live, then quote you for your venue.</p>
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
