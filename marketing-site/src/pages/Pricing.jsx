import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';
import Reveal from '../components/Reveal.jsx';
import { IconArrowRight, IconPhone, IconSparkle } from '../components/icons.jsx';

// Three tiers that all read "Tailored quote" tell a buyer nothing and look
// like a template. A custom studio sells a *process*, so the page now names
// the five phases every proposal is priced against.
const PHASES = [
  {
    n: '01',
    name: 'Discovery',
    time: 'Week 1',
    body: 'We sit down with how your venue actually runs — service flow, roles, the tools you already pay for and the jobs nobody wants to do twice.',
    out: 'A written brief and scope you approve before anything is designed.',
  },
  {
    n: '02',
    name: 'Design',
    time: 'Weeks 1–2',
    body: 'Your customer experience and your team’s screens, designed around your brand rather than dropped into a theme.',
    out: 'Designs for every screen your customers and staff will touch.',
  },
  {
    n: '03',
    name: 'Build',
    time: 'The bulk of the project',
    body: 'We build the system — ordering, dashboard, staff and kitchen tooling, plus any capability we agreed to scope for you.',
    out: 'A working system on your own domain, tested against real service.',
  },
  {
    n: '04',
    name: 'Launch',
    time: 'Around go-live',
    body: 'Hardware set up on your floor, menu and data loaded, and your team trained on the screens they will use every shift.',
    out: 'You take real orders with us in the room.',
  },
  {
    n: '05',
    name: 'Support',
    time: 'Ongoing',
    body: 'We stay on call, keep the system current and scope the next phase when your operation changes.',
    out: 'A system that keeps developing instead of ageing.',
  },
];

// Custom pricing creates uncertainty, so name the variables that actually move
// the number. No figures are quoted here - the proposal carries those.
const COST_DRIVERS = [
  ['How much connects', 'A single ordering channel costs less than a build that links customers, kitchen, staff and reporting.'],
  ['Menu and data complexity', 'Item counts, modifier depth and migrating existing menus or customer data all affect build time.'],
  ['New capabilities', 'Anything designed from scratch for your venue needs design, build and testing time that a proven module does not.'],
  ['Integrations and hardware', 'Payments, receipt printers, delivery services and any tools you already run are scoped before we start.'],
  ['Rollout and training', 'One venue with a small team is a different rollout to several sites with rotating staff.'],
];

const COMMITMENTS = [
  'No marketplace commission on your orders',
  'You keep control of your customer and operational data',
  'Scope, phases and cost agreed in writing before the build starts',
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
      <section className="page-hero">
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
          <div className="section-head section-head--split">
            <div>
              <span className="eyebrow">What you are paying for</span>
              <h2>Five phases, priced as one project</h2>
            </div>
            <p>
              Every quote is built from the same five phases. Your proposal prices
              each one against your brief, so you can see where the money goes
              instead of picking a package.
            </p>
          </div>

          <ol className="phases">
            {PHASES.map((p) => (
              <Reveal className="phase" key={p.n} as="li">
                <span className="phase__n">{p.n}</span>
                <div className="phase__main">
                  <div className="phase__head">
                    <h3>{p.name}</h3>
                    <span className="phase__time">{p.time}</span>
                  </div>
                  <p>{p.body}</p>
                </div>
                <p className="phase__out"><span>You get</span>{p.out}</p>
              </Reveal>
            ))}
          </ol>

          <p className="pricing-note">
            All CentralPass builds are commission-free. Standard payment processor, courier or other third-party service fees may apply.
          </p>
        </div>
      </section>

      <section className="section section--subtle">
        <div className="container">
          <div className="section-head section-head--split">
            <div>
              <span className="eyebrow">How we price</span>
              <h2>What shapes your quote</h2>
            </div>
            <p>
              We cannot put a number on this page honestly without knowing your
              venue. These are the things that actually move it, so you know what
              we will be asking about.
            </p>
          </div>

          <div className="cost-drivers">
            {COST_DRIVERS.map(([title, body], index) => (
              <Reveal className="cost-driver" key={title}>
                <span className="cost-driver__num">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="commitments">
            <strong>What does not change</strong>
            <ul>
              {COMMITMENTS.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <Reveal className="quote-panel">
            <span className="eyebrow quote-panel__eyebrow">
              <IconSparkle /> Start with a conversation
            </span>
            <h2>Tell us what the system needs to do</h2>
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
            <h2>Questions we get asked</h2>
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
