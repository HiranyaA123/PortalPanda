import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Reveal from '../components/Reveal.jsx';
import SystemWeb from '../components/SystemWeb.jsx';
import PhotoSlot from '../components/PhotoSlot.jsx';
import { MockOrder, MockDashboard } from '../components/mocks.jsx';
import { Magnetic } from '../components/motion.jsx';
import {
  IconArrowRight,
  IconBolt,
  IconPhone,
  IconShield,
  IconSparkle,
  IconUsers,
} from '../components/icons.jsx';

const BENEFITS = [
  {
    Icon: IconShield,
    title: 'Keep the customer and the order',
    body: 'Your brand stays front and centre, your customer relationship stays yours and CentralPass takes no marketplace commission.',
  },
  {
    Icon: IconBolt,
    title: 'One change, everywhere',
    body: 'Update an item once and the ordering site, kitchen and staff view stay in sync - without juggling separate systems.',
  },
  {
    Icon: IconUsers,
    title: 'Built with your team',
    body: 'We design around the people doing the work, help them launch and stay close as your venue and system evolve.',
  },
];

const LAUNCH_STEPS = [
  ['01', 'Define the brief', 'We map your customer journey, service flow, team roles and the tools that need to connect.'],
  ['02', 'Design and build', 'We create your branded system from scratch, combining proven modules with any new capabilities we agree to scope.'],
  ['03', 'Launch and evolve', 'We test the real service flow, train your team and keep improving the system as your operation changes.'],
];

const TICKER = [
  'Online ordering', 'Table bookings', 'Kitchen board', 'Receipt printing',
  'Staff time clock', 'Email + SMS promotions', 'Uber Direct delivery',
  'Customer CRM', 'Reporting', 'Commission-free',
];

const BRIEF_ROWS = [
  ['Customer experience', 'Ordering, bookings, loyalty', 'Core'],
  ['Venue operations', 'Kitchen, staff, reporting', 'Core'],
  ['Your next idea', 'A workflow or feature unique to you', 'Custom'],
];

export default function Home() {
  return (
    <main id="main">
      {/* Type-first hero: the headline is the visual. A side-by-side split kept
          shrinking the type to fit a panel; here the words run the full measure
          and the product sits underneath as a wide anchor. */}
      <section className="hero">
        <div className="container">
          <Link to="/live" className="hero__badge">
            <b>Live</b> Running in Adelaide venues <IconArrowRight />
          </Link>

          <h1 className="hero__display">
            <span className="hero__line">Custom venue</span>
            <span className="hero__line">software,</span>
            <span className="hero__line hero__line--accent">built around you.</span>
          </h1>

          <div className="hero__meta">
            <p className="hero__sub">{BRAND.pitch}</p>
            <div className="hero__meta-right">
              <div className="hero__actions">
                <Magnetic>
                  <Link to="/contact" className="btn btn-primary btn-lg">
                    Plan my system <IconArrowRight />
                  </Link>
                </Magnetic>
                <Magnetic strength={0.25}>
                  <Link to="/platform" className="btn btn-ghost btn-lg">
                    Explore what is possible
                  </Link>
                </Magnetic>
              </div>
              <div className="hero__proof">
                <span className="dot" aria-hidden="true" />
                Built from scratch · yours to evolve · zero marketplace commission
              </div>
            </div>
          </div>

          <div className="hero__plate">
            <MockDashboard />
            <span className="hero__plate-note">Owner dashboard · a real CentralPass screen</span>
          </div>
        </div>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[0, 1].map((pass) => (
            <div className="ticker__run" key={pass}>
              {TICKER.map((t) => (
                <span className="ticker__item" key={`${pass}-${t}`}>{t}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <section className="commercial-proof" aria-label="CentralPass proof points">
        <div className="container commercial-proof__grid">
          <div><strong>Designed for you</strong><span>No off-the-shelf template</span></div>
          <div><strong>Open brief</strong><span>Request features not shown</span></div>
          <div><strong>$0 commission</strong><span>On every CentralPass order</span></div>
          <Link to="/live">See our venue work <IconArrowRight /></Link>
        </div>
      </section>

      <section className="section product-showcase">
        <div className="container">
          <div className="section-head section-head--split product-showcase__head">
            <div>
              <span className="eyebrow">One connected build</span>
              <h2>Six systems you can start from</h2>
            </div>
            <p>
              These six proven systems show what CentralPass can connect. Choose a
              module to explore it at your own pace. The demo only changes when you
              choose something new.
            </p>
          </div>
          <div className="product-showcase__surface">
            <div className="product-showcase__hint">
              <span className="status-dot" aria-hidden="true" />
              Interactive preview <span>Choose any module</span>
            </div>
            <SystemWeb />
          </div>
        </div>
      </section>

      <section className="section section--subtle">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <span className="eyebrow">Built for independent venues</span>
              <h2>Fewer moving parts, and less to keep track of</h2>
            </div>
            <p>
              CentralPass replaces the disconnected hand-offs that slow service,
              lose customer context and make simple updates harder than they should be.
            </p>
          </div>
          <div className="benefit-grid">
            {BENEFITS.map(({ Icon, title, body }) => (
              <Reveal className="benefit-card" key={title}>
                <span className="benefit-card__icon"><Icon /></span>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section custom-build">
        <div className="container custom-build__grid">
          <Reveal className="custom-build__copy">
            <span className="eyebrow">Your venue is the brief</span>
            <h2>Not on the feature list? Ask us to build it.</h2>
            <p>
              CentralPass is not a locked product catalogue. Every customer gets a
              bespoke design and build. If your venue needs a capability we do not
              currently offer, bring it to the discovery session and we will scope
              the practical way to make it part of your system.
            </p>
            <Link to="/contact" className="textlink">
              Tell us what you need <IconArrowRight />
            </Link>
          </Reveal>

          <Reveal className="build-brief">
            <div className="build-brief__top">
              <div>
                <span className="build-brief__label">Build brief</span>
                <strong>CentralPass / your venue</strong>
              </div>
              <span className="build-brief__status"><i /> Open</span>
            </div>
            <div className="build-brief__rows">
              {BRIEF_ROWS.map(([title, body, type], index) => (
                <div className="build-brief__row" key={title}>
                  <span className="build-brief__num">0{index + 1}</span>
                  <span><strong>{title}</strong><small>{body}</small></span>
                  <em className={type === 'Custom' ? 'is-custom' : ''}>{type}</em>
                </div>
              ))}
            </div>
            <div className="build-brief__callout">
              <IconSparkle />
              <span><strong>No fixed ceiling</strong>New workflows can be designed into the build.</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight on-dark">
        <div className="container">
          <div className="stats-row">
            <Reveal className="stat-tile">
              <div className="stat-tile__num">100%</div>
              <div className="stat-tile__label">of every order stays yours</div>
            </Reveal>
            <Reveal className="stat-tile">
              <div className="stat-tile__num">$0</div>
              <div className="stat-tile__label">marketplace commission taken</div>
            </Reveal>
            <Reveal className="stat-tile">
              <div className="stat-tile__num">1:1</div>
              <div className="stat-tile__label">discovery before we design</div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">From brief to service</span>
            <h2>You will always know what is being built, and why</h2>
            <p>You will know what is being built, why it matters and what comes next.</p>
          </div>
          <div className="steps launch-steps">
            {LAUNCH_STEPS.map(([num, title, body]) => (
              <Reveal className="step" key={num}>
                <span className="step__num">{num}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <Reveal className="cta-band cta-band--case-study">
            <div className="cta-band__kicker">
              <span className="status-dot" aria-hidden="true" /> Live in Adelaide
            </div>
            <h2>See it running in a real venue</h2>
            <p>
              Caffe Primo Firle runs a 100+ item pickup menu through CentralPass,
              from customer order to kitchen board and printed docket.
            </p>
            <div className="cta-band__actions">
              <Link to="/live" className="btn btn-primary btn-lg">Explore our venue work <IconArrowRight /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <Reveal className="cta-band">
            <span className="eyebrow">Bring us your ideal system</span>
            <h2>Start with the messy version.</h2>
            <p>Show us how your venue runs today, what is getting in the way and what you wish your software could do.</p>
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
