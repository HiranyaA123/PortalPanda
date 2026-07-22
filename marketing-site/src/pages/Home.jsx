import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Reveal from '../components/Reveal.jsx';
import SystemWebSection from '../components/SystemWebSection.jsx';
import { Magnetic } from '../components/motion.jsx';
import {
  IconArrowRight,
  IconBolt,
  IconPhone,
  IconShield,
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
    body: 'Update an item once and the ordering site, kitchen and staff view stay in sync — without juggling separate systems.',
  },
  {
    Icon: IconUsers,
    title: 'Set up with real humans',
    body: 'We configure the platform around your venue, help your team launch and stay close when service gets busy.',
  },
];

const LAUNCH_STEPS = [
  ['01', 'Show us your venue', 'A short working session covers your menu, service flow, staff and the tools you already use.'],
  ['02', 'We build the system', 'CentralPass is configured around your venue, including menus, modifiers, ordering and operations.'],
  ['03', 'Launch with support', 'We help your team go live, test the service flow and make sure the day-to-day handover is clear.'],
];

export default function Home() {
  return (
    <main id="main">
      <section className="hero hero--center grain">
        <div className="hero__bg" aria-hidden="true">
          <div className="glow glow--violet" />
          <div className="glow glow--coral" />
          <div className="glow glow--cyan" />
        </div>
        <div className="container hero__grid">
          <div>
            <Link to="/live" className="hero__badge">
              <b>Live</b> Running at Caffe Primo Firle <IconArrowRight />
            </Link>
            <h1>
              Every system your venue runs,<br />
              {' '}connected in <span className="grad-text">one.</span>
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
                  Explore the platform
                </Link>
              </Magnetic>
            </div>
            <div className="hero__proof">
              <span className="dot" aria-hidden="true" />
              Adelaide-built · hands-on setup · zero marketplace commission
            </div>
          </div>
        </div>
      </section>

      <section className="commercial-proof" aria-label="CentralPass proof points">
        <div className="container commercial-proof__grid">
          <div><strong>Live venue</strong><span>Caffe Primo Firle</span></div>
          <div><strong>100+ items</strong><span>Modifiers included</span></div>
          <div><strong>$0 commission</strong><span>On every CentralPass order</span></div>
          <Link to="/live">See the live setup <IconArrowRight /></Link>
        </div>
      </section>

      <SystemWebSection />

      <section className="section section--subtle">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <span className="eyebrow">Built for independent venues</span>
              <h2>Less software to manage. More venue to run.</h2>
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

      <section className="section section--tight on-dark grain">
        <div className="glow glow--violet" style={{ width: 420, height: 420, top: '-30%', left: '30%', opacity: 0.24 }} />
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
              <div className="stat-tile__num">6</div>
              <div className="stat-tile__label">core systems connected</div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">From demo to service</span>
            <h2>A practical launch, shaped around your venue.</h2>
            <p>No self-serve maze. We learn how you work, configure the system and help your team launch it.</p>
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
          <Reveal className="cta-band cta-band--case-study grain">
            <div className="cta-band__kicker">
              <span className="status-dot" aria-hidden="true" /> Live in Adelaide
            </div>
            <h2>See CentralPass running a real venue.</h2>
            <p>
              Caffe Primo Firle runs a 100+ item pickup menu through CentralPass,
              from customer order to kitchen board and printed docket.
            </p>
            <div className="cta-band__actions">
              <Link to="/live" className="btn btn-primary btn-lg">View the live case study <IconArrowRight /></Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <Reveal className="cta-band grain">
            <div className="glow glow--violet" style={{ width: 380, height: 380, top: -140, left: '18%', opacity: 0.4 }} />
            <div className="glow glow--coral" style={{ width: 320, height: 320, bottom: -160, right: '16%', opacity: 0.3 }} />
            <span className="eyebrow">A better-connected venue starts here</span>
            <h2>Bring us the messy version.</h2>
            <p>Show us how your venue runs today. We’ll demonstrate the live system and map a practical path for yours.</p>
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
