import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Reveal from '../components/Reveal.jsx';
import ModuleExplorer from '../components/ModuleExplorer.jsx';
import { Magnetic } from '../components/motion.jsx';
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
  IconSparkle,
} from '../components/icons.jsx';

const MODULES = [
  {
    id: 'order', name: 'Ordering site', Icon: IconStore,
    eyebrow: 'Customer ordering site',
    heading: 'A bespoke storefront, designed around your brand.',
    body: 'Not a template with your logo dropped in - a fast, clear ordering experience built for your venue.',
    features: [
      'Custom design: your colours, type and photography.',
      'Card payments via Stripe, plus pay-in-store cash.',
      'Modifiers done properly - sizes, add-ons, dietary tags.',
      'Pickup and delivery slots tied to your live hours.',
    ],
    Mock: MockOrder,
  },
  {
    id: 'dash', name: 'Admin dashboard', Icon: IconLayout,
    eyebrow: 'Admin dashboard',
    heading: 'The control room for your operation.',
    body: 'Everything customers see and everything your team runs - from one dashboard shaped around the decisions you make.',
    features: [
      'Edit menu, prices, photos and hours - live instantly.',
      'Discount codes, surcharge days and email campaigns.',
      'Live view of orders, takings and best-sellers.',
      'Turn delivery, bookings or sections on and off in a click.',
    ],
    Mock: MockDashboard,
  },
  {
    id: 'staff', name: 'Staff portal', Icon: IconStaff,
    eyebrow: 'Staff portal',
    heading: 'The right tools for each role.',
    body: 'Staff get focused access on the shop tablet, separate from the owner view and tailored to the work they need to complete.',
    features: [
      'Individual logins with role-based permissions.',
      'Built-in time clock on the same tablet.',
      'Front-of-house sees orders, not your finances.',
      'Add or remove team members yourself in seconds.',
    ],
    Mock: MockStaff,
  },
  {
    id: 'kitchen', name: 'Kitchen + printer', Icon: IconChef,
    eyebrow: 'Kitchen board + receipt printing',
    heading: 'Orders hit the pass when they are placed.',
    body: 'A live kitchen board on one tablet, connected to receipt printing so the hand-off is immediate and visible.',
    features: [
      'New orders appear instantly with a sound alert.',
      'Dockets print automatically on compatible hardware.',
      'One tap to accept, mark ready or hand over.',
      'Mark an item sold out and it leaves the site.',
    ],
    Mock: MockKitchen,
  },
  {
    id: 'book', name: 'Bookings', Icon: IconCalendar,
    eyebrow: 'Table bookings',
    heading: 'Reservations beside your orders.',
    body: 'Take bookings through the customer experience you already own, with settings that reflect how your floor actually runs.',
    features: [
      'Bookings land in your dashboard beside orders.',
      'Set covers, time slots and blackout dates.',
      'Customers book in a few taps without an account.',
      'Every booking can connect to the customer record.',
    ],
    Mock: MockBookings,
  },
  {
    id: 'deliv', name: 'Uber Direct', Icon: IconTruck,
    eyebrow: 'Delivery with Uber Direct',
    heading: 'Delivery you own without owning drivers.',
    body: 'Offer delivery while keeping your direct customer relationship and avoiding marketplace commission on the order.',
    features: [
      'Dispatch an Uber Direct courier from the order flow.',
      'Keep the customer relationship and their data.',
      'Set your own delivery radius and fees.',
      'Track delivery from the same dashboard.',
    ],
    Mock: MockDelivery,
  },
];

const EXTRAS = [
  { Icon: IconRefresh, title: 'Real-time everything', body: 'Sold-out items can leave the menu the instant your team changes them.' },
  { Icon: IconCard, title: 'Cash or card', body: 'Customers choose and staff see exactly what to collect.' },
  { Icon: IconUsers, title: 'Customer CRM', body: 'Keep direct customer context in the system you own.' },
  { Icon: IconTag, title: 'Offers and loyalty', body: 'Shape discounts, rewards and campaigns around your strategy.' },
  { Icon: IconChart, title: 'Useful reporting', body: 'Put the numbers your team acts on where they can see them.' },
  { Icon: IconShield, title: 'Your data is yours', body: 'Keep control of your customer and operational data.' },
];

const CUSTOM_EXAMPLES = [
  ['Loyalty or memberships', 'Design a programme around how your regulars actually buy.'],
  ['Catering and large orders', 'Create an enquiry, approval and production flow that fits your kitchen.'],
  ['Special workflows', 'Scope a process or integration that is unique to your team.'],
];

export default function Platform() {
  return (
    <main id="main">
      <section className="page-hero grain">
        <div className="glow glow--violet" style={{ width: 480, height: 480, top: -160, left: -80, opacity: 0.4 }} />
        <div className="glow glow--coral" style={{ width: 360, height: 360, bottom: -180, right: '8%', opacity: 0.28 }} />
        <div className="container">
          <div className="page-hero__inner">
            <span className="eyebrow">A bespoke venue platform</span>
            <h1>A system built around <span className="grad-text">how you work.</span></h1>
            <p>
              We design and build every {BRAND.name} deployment from scratch.
              Use the proven modules below as a starting point, then add the
              workflows and capabilities your venue needs.
            </p>
            <div className="hero__actions page-hero__actions">
              <Magnetic>
                <Link to="/contact" className="btn btn-primary btn-lg">
                  Plan my system <IconArrowRight />
                </Link>
              </Magnetic>
              <Link to="/pricing" className="btn btn-ghost btn-lg">How pricing works</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Proven building blocks</span>
            <h2>Start with what you need.</h2>
            <p>Explore six connected modules we already know well. Your final build can use some, all or go beyond them.</p>
          </div>
          <ModuleExplorer modules={MODULES} />
        </div>
      </section>

      <section className="section section--subtle custom-capabilities">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <span className="eyebrow">Beyond the current platform</span>
              <h2>Need something different? Put it in the brief.</h2>
            </div>
            <p>
              You are not limited to this website's feature list. We will listen,
              test the idea against the rest of your operation and clearly scope
              what is practical before the build starts.
            </p>
          </div>
          <div className="custom-capabilities__grid">
            {CUSTOM_EXAMPLES.map(([title, body], index) => (
              <Reveal className="capability-card" key={title}>
                <span className="capability-card__num">0{index + 1}</span>
                <IconSparkle />
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
          <div className="custom-capabilities__action">
            <p><strong>Your idea is not listed?</strong> Tell us what the outcome needs to be.</p>
            <Link to="/contact" className="btn btn-primary">Request a capability <IconArrowRight /></Link>
          </div>
        </div>
      </section>

      <section className="section on-dark grain">
        <div className="glow glow--cyan" style={{ width: 400, height: 400, top: '10%', left: '-8%', opacity: 0.2 }} />
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">And everything around the edges</span>
            <h2>The details that keep a venue running.</h2>
            <p>These are common capabilities, not a fixed boundary for your build.</p>
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

      <section className="section">
        <div className="container">
          <Reveal className="cta-band grain">
            <div className="glow glow--violet" style={{ width: 380, height: 380, top: -140, left: '18%', opacity: 0.4 }} />
            <div className="glow glow--coral" style={{ width: 320, height: 320, bottom: -160, right: '16%', opacity: 0.3 }} />
            <h2>Bring us the workflow, not a shopping list.</h2>
            <p>We will show you a live build, learn what your venue needs and map a practical system of your own.</p>
            <div className="cta-band__actions">
              <Magnetic>
                <Link to="/contact" className="btn btn-primary btn-lg">Plan my system <IconArrowRight /></Link>
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
