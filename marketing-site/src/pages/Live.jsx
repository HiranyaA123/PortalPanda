import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Reveal from '../components/Reveal.jsx';
import { Magnetic, CountUp } from '../components/motion.jsx';
import { IconArrowRight, IconPhone, IconSparkle, IconStore } from '../components/icons.jsx';

const CUSTOMER_SCREENS = [
  {
    src: '/live/venue-home.webp',
    label: 'Customer website',
    title: 'A storefront designed for the Primo brand.',
    body: 'A custom home page brings ordering and table bookings into one polished customer journey.',
    alt: 'Caffe Primo Firle website home page with ordering and booking calls to action',
    className: 'live-shot--wide',
  },
  {
    src: '/live/ordering-mobile.webp',
    label: 'Mobile ordering',
    title: 'A 100+ item menu that remains easy to browse.',
    body: 'Categories, item photography, modifiers and pricing are clear on the screen customers use most.',
    alt: 'Caffe Primo Firle mobile ordering menu showing pizza items and category navigation',
    className: 'live-shot--portrait',
  },
];

const SERVICE_SCREENS = [
  {
    src: '/live/staff-orders.webp',
    label: 'Orders',
    title: 'A live service board',
    body: 'Pending, in-progress and ready orders stay visible, with cash collection and allergy notes where staff need them.',
    alt: 'Caffe Primo Firle staff orders portal with a pending pickup order',
  },
  {
    src: '/live/staff-time-clock.webp',
    label: 'Time clock',
    title: 'Clock-in on the venue tablet',
    body: 'Staff select their profile and use a personal PIN without needing access to owner controls.',
    alt: 'Caffe Primo Firle staff time clock with employee selection and PIN keypad',
  },
  {
    src: '/live/staff-availability.webp',
    label: 'Availability',
    title: 'Sold-out changes reach the menu',
    body: 'The team can search items and update availability from the same operational portal.',
    alt: 'Caffe Primo Firle item availability screen with menu item status controls',
  },
];

const OWNER_SCREENS = [
  {
    src: '/live/admin-analytics.webp',
    label: 'Overview',
    title: 'Performance at a glance',
    body: 'Revenue by day and hour turns the dashboard into a practical operating view.',
    alt: 'Caffe Primo Firle admin dashboard with revenue charts',
  },
  {
    src: '/live/admin-menu.webp',
    label: 'Menu management',
    title: 'Menus stay under venue control',
    body: 'Categories, items, prices, status and sold-out controls live in one management surface.',
    alt: 'Caffe Primo Firle admin menu management table with item controls',
  },
  {
    src: '/live/admin-payroll.webp',
    label: 'Staff and pay',
    title: 'Shifts move towards payroll cleanly',
    body: 'Collect shifts, review corrections, lock the week and export for payroll from one workflow.',
    alt: 'Caffe Primo Firle weekly payroll preparation dashboard',
  },
];

const WIP_SCREENS = {
  needa: [
    {
      src: '/live/needa-pizza-wip.webp',
      label: 'Customer website direction',
      alt: 'Intentionally blurred work-in-progress preview for the Needa Pizza customer website',
    },
  ],
  beach: [
    {
      src: '/live/beach-road-wip-1.webp',
      label: 'Brand and venue story',
      alt: 'Intentionally blurred work-in-progress preview for the Beach Road Pizza customer website',
    },
    {
      src: '/live/beach-road-wip-2.webp',
      label: 'Menu showcase direction',
      alt: 'Intentionally blurred work-in-progress menu preview for Beach Road Pizza',
    },
    {
      src: '/live/beach-road-wip-3.webp',
      label: 'Food and service story',
      alt: 'Intentionally blurred work-in-progress food and service preview for Beach Road Pizza',
    },
  ],
};

const VENUES = [
  {
    id: 'primo',
    name: 'Caffe Primo Firle',
    location: 'Firle, South Australia',
    status: 'Live',
    statusKind: 'live',
    scope: 'Customer, staff and owner portals',
    description: 'A connected pickup operation running from customer order through service and owner controls.',
    cover: '/live/venue-home.webp',
    coverAlt: 'Caffe Primo Firle live customer website',
  },
  {
    id: 'needa',
    name: 'Needa Pizza',
    location: 'Aberfoyle Park, South Australia',
    status: 'Work in progress',
    statusKind: 'wip',
    scope: 'Branded website and ordering journey',
    description: 'A bold, mobile-first pizza experience being shaped around the Needa Pizza brand and service flow.',
    cover: '/live/needa-pizza-wip.webp',
    coverAlt: 'Intentionally blurred work-in-progress Needa Pizza website preview',
  },
  {
    id: 'beach',
    name: 'Beach Road Pizza',
    location: 'Christies Beach, South Australia',
    status: 'Work in progress',
    statusKind: 'wip',
    scope: 'Venue website and menu experience',
    description: 'A character-led website in active development for Beach Road Pizza and its generous local menu.',
    cover: '/live/beach-road-wip-1.webp',
    coverAlt: 'Intentionally blurred work-in-progress Beach Road Pizza website preview',
  },
];

const STATS = [
  { count: 100, suffix: '+', label: 'Menu items, fully modifiable' },
  { num: '$0', label: 'Marketplace commission taken' },
  { num: '3', label: 'Connected portals in one build' },
];

function StatusPill({ venue }) {
  return (
    <span className={`venue-status venue-status--${venue.statusKind}`}>
      <i aria-hidden="true" /> {venue.status}
    </span>
  );
}

function VenueCard({ venue, selected, onSelect }) {
  const isWip = venue.statusKind === 'wip';

  return (
    <button
      type="button"
      className={`venue-card ${selected ? 'is-selected' : ''}`}
      aria-pressed={selected}
      aria-controls="venue-project-details"
      onClick={() => onSelect(venue.id)}
    >
      <span className={`venue-card__visual ${isWip ? 'is-wip' : ''}`}>
        <img src={venue.cover} alt={venue.coverAlt} loading="lazy" decoding="async" />
        {isWip && <span className="wip-watermark">Preview blurred</span>}
      </span>
      <span className="venue-card__body">
        <span className="venue-card__topline">
          <StatusPill venue={venue} />
          <span>{venue.location}</span>
        </span>
        <strong>{venue.name}</strong>
        <span className="venue-card__scope">{venue.scope}</span>
        <span className="venue-card__action">{selected ? 'Viewing project' : 'View project'} <IconArrowRight /></span>
      </span>
    </button>
  );
}

function ScreenshotCard({ screen, priority = false }) {
  return (
    <Reveal className={`live-shot ${screen.className || ''}`}>
      <a
        className="live-shot__link"
        href={screen.src}
        target="_blank"
        rel="noreferrer"
        aria-label={`Open full screenshot: ${screen.title}`}
      >
        <div className="live-shot__chrome" aria-hidden="true">
          <span><i /><i /><i /></span>
          <em>{screen.label}</em>
          <b>Open full image</b>
        </div>
        <div className="live-shot__image">
          <img
            src={screen.src}
            alt={screen.alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
          />
        </div>
        <div className="live-shot__caption">
          <span className="eyebrow">{screen.label}</span>
          <h3>{screen.title}</h3>
          <p>{screen.body}</p>
        </div>
      </a>
    </Reveal>
  );
}

function PrimoProject() {
  const venue = VENUES[0];

  return (
    <>
      <section className="section selected-project">
        <div className="container">
          <div className="selected-project__grid">
            <div className="selected-project__copy">
              <StatusPill venue={venue} />
              <span className="selected-project__location">{venue.location}</span>
              <h2>{venue.name} runs on {BRAND.name}.</h2>
              <p>{venue.description}</p>
              <div className="selected-project__facts">
                <span>Customer experience</span>
                <span>Service operations</span>
                <span>Owner controls</span>
              </div>
            </div>

            <a
              className="live-hero__window"
              href={CUSTOMER_SCREENS[0].src}
              target="_blank"
              rel="noreferrer"
              aria-label="Open the full Caffe Primo Firle website screenshot"
            >
              <div className="live-shot__chrome" aria-hidden="true">
                <span><i /><i /><i /></span>
                <em>primofirle.com.au</em>
                <b>Live build</b>
              </div>
              <img
                src={CUSTOMER_SCREENS[0].src}
                alt={CUSTOMER_SCREENS[0].alt}
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </a>
          </div>

          <div className="live-proof-strip" aria-label="Caffe Primo Firle portal coverage">
            <div><strong>Customer portal</strong><span>Website, ordering and bookings</span></div>
            <div><strong>Staff portal</strong><span>Orders, time clock and availability</span></div>
            <div><strong>Owner portal</strong><span>Reporting, menus and payroll preparation</span></div>
          </div>
        </div>
      </section>

      <section className="section section--subtle live-screens">
        <div className="container">
          <div className="live-screens__head">
            <span className="eyebrow">For customers</span>
            <h2>A branded experience from home page to checkout.</h2>
            <p>The public site is designed for the venue, then connected directly to the tools running service.</p>
          </div>
          <div className="live-customer-grid">
            {CUSTOMER_SCREENS.map((screen, index) => (
              <ScreenshotCard screen={screen} priority={index === 0} key={screen.src} />
            ))}
          </div>
        </div>
      </section>

      <section className="section live-screens">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <span className="eyebrow">For the service team</span>
              <h2>Focused tools for the work happening now.</h2>
            </div>
            <p>
              Staff see the next operational action without being exposed to the
              full owner dashboard. Each screen is shaped for a shared venue tablet.
            </p>
          </div>
          <div className="live-screen-grid">
            {SERVICE_SCREENS.map((screen) => <ScreenshotCard screen={screen} key={screen.src} />)}
          </div>
        </div>
      </section>

      <section className="section section--subtle live-screens">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <span className="eyebrow">For the owner</span>
              <h2>Control, reporting and payroll preparation in one place.</h2>
            </div>
            <p>
              The operations desk connects day-to-day venue changes with the
              reporting and review work that happens behind the scenes.
            </p>
          </div>
          <div className="live-screen-grid">
            {OWNER_SCREENS.map((screen) => <ScreenshotCard screen={screen} key={screen.src} />)}
          </div>
        </div>
      </section>

      <section className="section on-dark grain">
        <div className="glow glow--violet" style={{ width: 420, height: 420, top: '-20%', left: '30%', opacity: 0.26 }} />
        <div className="container">
          <Reveal className="live-proof">
            <span className="eyebrow">Built in a real service environment</span>
            <h2>Designed around the rush, not a slide deck.</h2>
            <p>
              CentralPass is shaped by day-to-day venue work: modifiers that must
              be right, orders that must reach staff immediately and controls that
              make sense without a training manual.
            </p>
            <ul className="live-proof__list">
              <li>100+ menu items and modifiers</li>
              <li>Live orders and printed dockets</li>
              <li>Staff time and availability tools</li>
              <li>Owner reporting and menu control</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">The result</span>
            <h2>One build, working across the venue.</h2>
          </div>
          <div className="stats-row">
            {STATS.map((stat) => (
              <Reveal className="stat-tile" key={stat.label}>
                <div className="stat-tile__num">
                  {stat.count ? <CountUp to={stat.count} suffix={stat.suffix || ''} /> : stat.num}
                </div>
                <div className="stat-tile__label">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function WorkInProgressProject({ venue }) {
  const screens = WIP_SCREENS[venue.id];

  return (
    <section className="section selected-project selected-project--wip">
      <div className="container">
        <div className="selected-project__copy selected-project__copy--wide">
          <StatusPill venue={venue} />
          <span className="selected-project__location">{venue.location}</span>
          <h2>{venue.name} is currently being built.</h2>
          <p>{venue.description}</p>
        </div>

        <div className="wip-notice" role="note">
          <IconSparkle />
          <span>
            <strong>Work in progress</strong>
            These previews are intentionally blurred because the design and functionality are still being developed with the customer.
          </span>
        </div>

        <div className={`wip-gallery ${screens.length === 1 ? 'wip-gallery--single' : ''}`}>
          {screens.map((screen) => (
            <Reveal className="wip-shot" key={screen.src}>
              <div className="live-shot__chrome" aria-hidden="true">
                <span><i /><i /><i /></span>
                <em>{screen.label}</em>
                <b>Private preview</b>
              </div>
              <div className="wip-shot__image">
                <img src={screen.src} alt={screen.alt} loading="lazy" decoding="async" draggable="false" />
                <span className="wip-shot__overlay"><i /> Work in progress</span>
              </div>
              <div className="wip-shot__caption">
                <strong>{screen.label}</strong>
                <span>Intentionally blurred while the customer build is in development.</span>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="wip-scope">
          <div><strong>Current direction</strong><span>{venue.scope}</span></div>
          <div><strong>Project state</strong><span>Active customer build</span></div>
          <div><strong>Next milestone</strong><span>Design and workflow refinement</span></div>
        </div>
      </div>
    </section>
  );
}

export default function Live() {
  const [activeVenueId, setActiveVenueId] = useState('primo');
  const activeVenue = VENUES.find((venue) => venue.id === activeVenueId) || VENUES[0];

  return (
    <main id="main">
      <section className="page-hero live-hero live-collection-hero grain">
        <div className="glow glow--violet" style={{ width: 460, height: 460, top: -150, left: -70, opacity: 0.38 }} />
        <div className="glow glow--coral" style={{ width: 340, height: 340, bottom: -170, right: '8%', opacity: 0.28 }} />
        <div className="container">
          <div className="cs-hero__grid">
            <div>
              <span className="eyebrow"><IconStore /> Our venue work</span>
              <h1>Built for one venue at a time.</h1>
              <p>
                Browse one launched CentralPass system and two active customer
                builds. Every project is designed from scratch around a different venue.
              </p>
              <div className="hero__actions page-hero__actions">
                <Magnetic>
                  <a href="#venue-collection" className="btn btn-primary btn-lg">
                    Choose a venue <IconArrowRight />
                  </a>
                </Magnetic>
              </div>
            </div>

            <div className="portfolio-status" aria-label="CentralPass venue project status">
              <div className="portfolio-status__top">
                <span>Customer portfolio</span>
                <strong>3 venue builds</strong>
              </div>
              {VENUES.map((venue) => (
                <div className="portfolio-status__row" key={venue.id}>
                  <StatusPill venue={venue} />
                  <span><strong>{venue.name}</strong><small>{venue.location}</small></span>
                </div>
              ))}
              <p>Unfinished customer work is shown as a blurred preview until launch.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section venue-collection" id="venue-collection">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <span className="eyebrow">Select a project</span>
              <h2>See what is live and what is taking shape.</h2>
            </div>
            <p>
              Launched work is shown in full. Active builds are clearly marked and
              intentionally blurred while we continue designing with each customer.
            </p>
          </div>

          <div className="venue-picker" role="group" aria-label="Choose a CentralPass venue project">
            {VENUES.map((venue) => (
              <VenueCard
                venue={venue}
                selected={activeVenueId === venue.id}
                onSelect={setActiveVenueId}
                key={venue.id}
              />
            ))}
          </div>
        </div>
      </section>

      <div id="venue-project-details" className="venue-project-details" aria-live="polite">
        {activeVenue.id === 'primo'
          ? <PrimoProject />
          : <WorkInProgressProject venue={activeVenue} />}
      </div>

      <section className="section section--tight">
        <div className="container">
          <Reveal className="cta-band grain">
            <div className="glow glow--violet" style={{ width: 360, height: 360, top: -140, left: '18%', opacity: 0.4 }} />
            <div className="glow glow--coral" style={{ width: 300, height: 300, bottom: -150, right: '16%', opacity: 0.3 }} />
            <h2>What should your venue system look like?</h2>
            <p>Bring us your customer journey, staff workflow and owner wish list. We will scope a custom build around them.</p>
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
