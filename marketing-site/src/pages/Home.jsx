import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import ScrollThread from '../components/ScrollThread.jsx';
import {
  IconArrowRight,
  IconBolt,
  IconCalendar,
  IconChef,
  IconChart,
  IconClock,
  IconLayout,
  IconPhone,
  IconShield,
  IconSparkle,
  IconStore,
  IconUsers,
} from '../components/icons.jsx';
import { BRAND } from '../brand.js';

const OUTCOMES = [
  {
    Icon: IconStore,
    title: 'A direct customer experience',
    body: 'Your website, ordering and bookings look and feel like your venue - not a marketplace listing.',
  },
  {
    Icon: IconBolt,
    title: 'One operational source of truth',
    body: 'Menu, orders, availability and customer context stay connected from the counter to the kitchen.',
  },
  {
    Icon: IconUsers,
    title: 'Software shaped around the team',
    body: 'Every staff screen is designed around the job being done, then supported as your operation changes.',
  },
];

const MODULES = [
  [IconStore, 'Website + ordering', 'A custom storefront with direct pickup and delivery flows.'],
  [IconCalendar, 'Bookings', 'Reservations connected to the customer and venue view.'],
  [IconChef, 'Kitchen + printing', 'Live orders, clear status changes and compatible receipt printing.'],
  [IconClock, 'Staff tools', 'Role-based access, availability and time-clock workflows.'],
  [IconLayout, 'Owner dashboard', 'Menus, hours, promotions and operations in one place.'],
  [IconChart, 'Reporting + CRM', 'Useful customer and performance context without marketplace ownership.'],
];

const PROCESS = [
  ['01', 'Map the real service', 'We learn the customer journey, kitchen hand-offs, staff roles and current software.'],
  ['02', 'Design the whole system', 'You see the customer and team experience before the build is locked in.'],
  ['03', 'Build, launch and evolve', 'We test the complete flow, train the team and keep improving it after launch.'],
];

const COMMITMENTS = [
  ['A written scope', 'Clear phases, inclusions and cost before development begins.'],
  ['A custom build', 'Proven building blocks, adapted to your venue rather than dropped into a template.'],
  ['Room for new ideas', 'If a workflow is not shown here, bring it to the brief and we will scope it honestly.'],
  ['Launch support', 'Real-service testing, team training and ongoing support after go-live.'],
];

function ProjectScreen({ src, alt, label, className = '', isActive = false, onActivate, priority = false }) {
  const interactive = typeof onActivate === 'function';
  const Tag = interactive ? 'button' : 'figure';

  return (
    <Tag
      className={`cp-screen ${interactive ? 'cp-screen--interactive' : ''} ${isActive ? 'is-active' : 'is-inactive'} ${className}`.trim()}
      type={interactive ? 'button' : undefined}
      aria-label={interactive ? `Bring ${label.toLowerCase()} preview to the front` : undefined}
      aria-pressed={interactive ? isActive : undefined}
      onClick={onActivate}
    >
      <div className="cp-screen__bar" aria-hidden="true">
        <span /><span /><span />
        <small>{label}</small>
      </div>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
      />
    </Tag>
  );
}

export default function Home() {
  const [activeHeroScreen, setActiveHeroScreen] = useState('staff');

  return (
    <main id="main" className="cp-home">
      <ScrollThread />
      <section className="cp-hero">
        <div className="container cp-hero__grid">
          <div className="cp-hero__copy">
            <h1>One custom system for your <em>whole venue.</em></h1>
            <p className="cp-hero__lead">
              CentralPass designs the website, direct ordering, kitchen, staff
              and owner tools around the way your venue actually runs.
            </p>
            <div className="cp-hero__actions">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Start a project <IconArrowRight />
              </Link>
              <Link to="/live" className="btn btn-ghost btn-lg">
                See our venue work
              </Link>
            </div>
            <ul className="cp-hero__assurances" aria-label="CentralPass assurances">
              <li><IconShield /> Built and supported in Adelaide</li>
              <li><IconSparkle /> New features can be scoped for your venue</li>
            </ul>
          </div>

          <div className="cp-hero__stage" aria-label="CentralPass work for Caffe Primo Firle">
            <ProjectScreen
              className="cp-screen--hero"
              priority
              isActive={activeHeroScreen === 'customer'}
              onActivate={() => setActiveHeroScreen('customer')}
              src="/live/venue-home.webp"
              alt="Caffe Primo Firle customer website designed and built by CentralPass"
              label="Customer website"
            />
            <ProjectScreen
              className="cp-screen--floating"
              priority
              isActive={activeHeroScreen === 'staff'}
              onActivate={() => setActiveHeroScreen('staff')}
              src="/live/staff-orders.webp"
              alt="Caffe Primo Firle live order board built by CentralPass"
              label="Staff operations"
            />
            <div className="cp-hero__status">
              <span>Featured live build</span>
              <strong>Caffe Primo Firle</strong>
              <small>Customer, kitchen, staff and owner tools</small>
            </div>
          </div>
        </div>
      </section>

      <section className="cp-project-strip" aria-label="CentralPass project status">
        <div className="container cp-project-strip__grid">
          <div className="cp-project-strip__intro">
            <span className="eyebrow">Venue work</span>
            <strong>Selected live and in-development venue work.</strong>
          </div>
          <Link to="/live" className="cp-project-pill cp-project-pill--live">
            <i /> <span><small>Featured live build</small>Caffe Primo Firle</span><IconArrowRight />
          </Link>
          <Link to="/live#needa-pizza" className="cp-project-pill">
            <i /> <span><small>In development</small>Needa Pizza</span><IconArrowRight />
          </Link>
          <Link to="/live#beach-road-pizza" className="cp-project-pill">
            <i /> <span><small>In development</small>Beach Road Pizza</span><IconArrowRight />
          </Link>
        </div>
      </section>

      <section className="section cp-case-study" aria-labelledby="case-study-title">
        <div className="container">
          <div className="cp-case-study__head">
            <div>
              <span className="eyebrow" data-scroll-thread="right">Proof, not a product mock-up</span>
              <h2 id="case-study-title">A real venue running one connected build.</h2>
            </div>
            <div>
              <p>
                Caffe Primo Firle takes direct customer orders through a site we
                designed, while the same system gives its team the kitchen,
                staffing and owner controls needed to run service.
              </p>
              <div className="cp-inline-actions">
                <a href="https://caffeprimofirle.com.au/" target="_blank" rel="noreferrer" className="btn btn-dark">
                  Visit Caffe Primo Firle <IconArrowRight />
                </a>
                <Link to="/live" className="textlink">View the full project</Link>
              </div>
            </div>
          </div>

          <div className="cp-case-study__screens">
            <ProjectScreen
              src="/live/ordering-mobile.webp"
              alt="Mobile customer ordering menu for Caffe Primo Firle"
              label="Direct ordering"
            />
            <ProjectScreen
              className="cp-screen--wide"
              src="/live/staff-orders.webp"
              alt="Staff order management screen for Caffe Primo Firle"
              label="Order operations"
            />
            <ProjectScreen
              className="cp-screen--wide"
              src="/live/admin-analytics.webp"
              alt="Owner analytics dashboard for Caffe Primo Firle"
              label="Owner dashboard"
            />
          </div>

          <div className="cp-case-study__facts">
            <div><strong>100+</strong><span>menu items and modifiers</span></div>
            <div><strong>5</strong><span>connected customer and team surfaces</span></div>
            <div><strong>$0</strong><span>CentralPass marketplace commission</span></div>
            <p>Payment processing, delivery and other third-party service fees may still apply.</p>
          </div>
        </div>
      </section>

      <section className="section cp-outcomes" aria-labelledby="outcomes-title">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <span className="eyebrow" data-scroll-thread="left">Why venues come to us</span>
              <h2 id="outcomes-title">Less software patchwork. More control.</h2>
            </div>
            <p>
              The goal is not to give your team more tools. It is to connect the
              customer experience and daily operation so fewer things fall between systems.
            </p>
          </div>
          <div className="cp-outcome-grid">
            {OUTCOMES.map(({ Icon, title, body }, index) => (
              <Reveal className="cp-outcome" key={title}>
                <span className="cp-outcome__number">0{index + 1}</span>
                <Icon />
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section cp-modules" aria-labelledby="modules-title">
        <div className="container cp-modules__layout">
          <div className="cp-modules__intro">
            <span className="eyebrow" data-scroll-thread="right">A connected starting point</span>
            <h2 id="modules-title">Choose what you need. Add what is missing.</h2>
            <p>
              Start with proven CentralPass capabilities, then adapt the system
              to your brand, service model and the workflows unique to your venue.
            </p>
            <Link to="/platform" className="btn btn-dark">
              Explore the platform <IconArrowRight />
            </Link>
          </div>
          <div className="cp-module-list">
            {MODULES.map(([Icon, title, body], index) => (
              <div className="cp-module" key={title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <Icon />
                <div><h3>{title}</h3><p>{body}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cp-process" aria-labelledby="process-title">
        <div className="container">
          <div className="cp-process__top">
            <div>
              <span className="eyebrow" data-scroll-thread="left">Custom, without the mystery</span>
              <h2 id="process-title">From the messy brief to a working service.</h2>
            </div>
            <p>
              You do not need a technical specification. Bring the bottlenecks,
              the manual workarounds and the outcome you want.
            </p>
          </div>
          <ol className="cp-process__steps">
            {PROCESS.map(([number, title, body]) => (
              <li key={number}>
                <span>{number}</span><h3>{title}</h3><p>{body}</p>
              </li>
            ))}
          </ol>
          <div className="cp-commitments">
            <div className="cp-commitments__lead">
              <IconShield />
              <span><small>What you can expect</small><strong>A commercial build with clear edges.</strong></span>
            </div>
            <div className="cp-commitments__list">
              {COMMITMENTS.map(([title, body]) => (
                <div key={title}><strong>{title}</strong><p>{body}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="cp-final-cta">
        <div className="container cp-final-cta__inner">
          <div>
            <span className="cp-kicker"><i /> Discovery starts with your venue</span>
            <h2>Tell us what your ideal system should do.</h2>
            <p>We will show you a live build, map the practical scope and put the proposed phases in writing.</p>
          </div>
          <div className="cp-final-cta__actions">
            <Link to="/contact" className="btn btn-primary btn-lg" data-scroll-thread="target">
              Start a project <IconArrowRight />
            </Link>
            <a href={`tel:${BRAND.contactPhone}`} className="btn btn-ghost btn-lg"><IconPhone /> {BRAND.contactPhoneDisplay}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
