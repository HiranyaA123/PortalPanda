import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Reveal from '../components/Reveal.jsx';
import ScrollJourney from '../components/ScrollJourney.jsx';
import { Magnetic, CountUp } from '../components/motion.jsx';
import { IconArrowRight, IconPhone } from '../components/icons.jsx';

export default function Home() {
  return (
    <main id="main">
      {/* Compact hero */}
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
            <div className="scroll-cue" aria-hidden="true">
              <span className="scroll-cue__mouse" />
              Scroll to follow an order
            </div>
          </div>
        </div>
      </section>

      {/* The scroll journey — the order flows down the page */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Follow the order</span>
            <h2>Watch one order travel through the whole portal.</h2>
            <p>Scroll down — the order flows from your customer’s phone to the kitchen, the printer and out the door. Every step is one system.</p>
          </div>
          <ScrollJourney />
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
          <Reveal className="cta-band grain" style={{ background: 'var(--surface-2)', border: '1px solid var(--line)' }}>
            <span className="eyebrow" style={{ position: 'relative', zIndex: 2 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              Live now
            </span>
            <h2>Running a real venue today.</h2>
            <p>
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
