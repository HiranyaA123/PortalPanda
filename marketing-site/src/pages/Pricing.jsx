import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Reveal from '../components/Reveal.jsx';
import { IconArrowRight, IconPhone, IconSparkle } from '../components/icons.jsx';

const SCOPES = [
  {
    name: 'Customer launch',
    label: 'Focused build',
    desc: 'A polished direct channel for venues that want to start with ordering and customer ownership.',
    features: [
      'Bespoke customer-facing design',
      'Online ordering and payments',
      'Menu and customer management',
      'Kitchen hand-off and printing',
      'Launch support for your team',
    ],
    featured: false,
  },
  {
    name: 'Connected operations',
    label: 'Common starting point',
    desc: 'A broader build that connects customer experience, service and day-to-day venue operations.',
    features: [
      'Everything in Customer launch',
      'Bookings, staff or delivery workflows',
      'Reporting, offers and customer tools',
      'Role-based operational views',
      'A roadmap for future phases',
    ],
    featured: true,
  },
  {
    name: 'Bespoke or multi-venue',
    label: 'Extended brief',
    desc: 'For unique workflows, requested capabilities, integrations or teams operating across locations.',
    features: [
      'A system designed around your brief',
      'New capabilities scoped with you',
      'Multi-venue controls where needed',
      'Custom workflows and integrations',
      'Phased delivery and ongoing evolution',
    ],
    featured: false,
  },
];

const FAQ = [
  {
    q: 'Why is pricing custom?',
    a: 'Because the product is custom. We price the agreed design, modules, new capabilities, integrations, setup and support instead of forcing every venue into the same package.',
  },
  {
    q: 'Can you build a feature that is not listed?',
    a: 'Yes. Tell us the outcome and workflow you need. We will assess how it fits the wider system, explain what is practical and include the agreed work in your proposal.',
  },
  {
    q: 'Do you take a commission on orders?',
    a: 'No. CentralPass takes no marketplace commission. Standard payment processing or third-party delivery fees can still apply where those services are used.',
  },
  {
    q: 'What about hardware and integrations?',
    a: 'We review what you already use, recommend compatible hardware and scope any required integration work before the build begins.',
  },
  {
    q: 'How long will my build take?',
    a: 'Timing depends on the brief. A focused build can move quickly; a larger or first-of-its-kind workflow needs more design and testing. Your proposal will set out phases, milestones and a realistic launch plan.',
  },
];

export default function Pricing() {
  return (
    <main id="main">
      <section className="page-hero grain">
        <div className="glow glow--violet" style={{ width: 460, height: 460, top: -150, right: -60, opacity: 0.38 }} />
        <div className="glow glow--cyan" style={{ width: 320, height: 320, bottom: -160, left: '6%', opacity: 0.2 }} />
        <div className="container">
          <div className="page-hero__inner">
            <span className="eyebrow">Custom pricing</span>
            <h1>Built to your brief. <span className="grad-text">Priced to your scope.</span></h1>
            <p>
              Every proposal reflects the system we agree to design and build for
              you. There is no marketplace commission, forced tier or charge for a
              feature your venue does not need.
            </p>
            <div className="hero__actions page-hero__actions">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Discuss my brief <IconArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section pricing-scopes">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Typical scopes</span>
            <h2>Three starting points. No fixed packages.</h2>
            <p>Use these examples to understand the level of build. Your proposal will be shaped around your actual brief.</p>
          </div>
          <div className="pricing-grid">
            {SCOPES.map((scope) => (
              <Reveal
                className={`price-card ${scope.featured ? 'price-card--featured' : ''}`}
                key={scope.name}
              >
                <span className="price-card__scope">{scope.label}</span>
                <div className="price-card__name">{scope.name}</div>
                <p className="price-card__desc">{scope.desc}</p>
                <div className="price-card__price">
                  Tailored <small>quote</small>
                </div>
                <ul className="price-card__list">
                  {scope.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`btn btn-block price-card__cta ${scope.featured ? 'btn-primary' : 'btn-dark'}`}
                >
                  Scope this build
                </Link>
              </Reveal>
            ))}
          </div>
          <p className="pricing-note">
            All CentralPass builds are commission-free. Standard payment processor, courier or other third-party service fees may apply.
          </p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <Reveal className="quote-panel grain">
            <div className="glow glow--violet" style={{ width: 400, height: 400, top: -160, left: '14%', opacity: 0.4 }} />
            <div className="glow glow--coral" style={{ width: 340, height: 340, bottom: -170, right: '12%', opacity: 0.32 }} />
            <span className="eyebrow quote-panel__eyebrow">
              <IconSparkle /> Start with a conversation
            </span>
            <h2>Tell us what the system needs to do.</h2>
            <p>
              We will show you {BRAND.name} running a real venue, map the scope
              with you and prepare a clear proposal for the build.
            </p>
            <a href={`tel:${BRAND.contactPhone}`} className="quote-phone">
              <IconPhone />
              <span className="grad-text">{BRAND.contactPhoneDisplay}</span>
            </a>
            <div className="cta-band__actions quote-panel__actions">
              <Link to="/contact" className="btn btn-primary btn-lg">
                Send a build brief <IconArrowRight />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container container--narrow">
          <div className="section-head">
            <span className="eyebrow">Questions</span>
            <h2>Good to know.</h2>
          </div>
          <div className="faq-list">
            {FAQ.map((item) => (
              <Reveal className="bento__cell faq-item" key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
