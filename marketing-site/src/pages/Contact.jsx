import { BRAND } from '../brand.js';
import ContactForm from '../components/ContactForm.jsx';
import { IconPhone, IconMail } from '../components/icons.jsx';

// Sets expectations for the enquiry. Every step here reflects a commitment the
// site already makes (one business day reply, 1:1 discovery, written proposal,
// and the Terms line that a brief does not create a contract).
const NEXT_STEPS = [
  ['01', 'We reply within one business day', 'A short call or email to understand your venue and what you are trying to fix.'],
  ['02', 'A 1:1 discovery session', 'We map your service flow, team roles and the systems that need to connect - before anything is designed.'],
  ['03', 'A written proposal', 'Scope, phases, milestones and a launch plan in writing. Sending a brief does not commit you to anything.'],
];

export default function Contact() {
  return (
    <main id="main">
      <section className="section contact-section">
        <div className="container">
          <div className="contact__grid">
            <div className="contact__aside">
              <span className="eyebrow">Plan your build</span>
              <h1>Tell us what your ideal system should do.</h1>
              <p>
                Start with your venue, the way your team works and anything you
                wish your current software could do. Even if a capability is not
                shown on this site, ask for it. We will reply within one business day.
              </p>

              <div className="contact-brief" aria-label="What to include in your enquiry">
                <strong>Useful details to include</strong>
                <ul>
                  <li>How customers order, and your service model</li>
                  <li>The systems or manual steps causing friction</li>
                  <li>Any new feature, workflow or integration you want</li>
                </ul>
              </div>

              <div className="contact-lines">
                <a href={`tel:${BRAND.contactPhone}`} className="contact-card">
                  <span className="contact-card__icon"><IconPhone /></span>
                  <span>
                    {BRAND.contactPhoneDisplay}
                    <small>Call to discuss your build</small>
                  </span>
                </a>
                <a href={`mailto:${BRAND.contactEmail}`} className="contact-card">
                  <span className="contact-card__icon"><IconMail /></span>
                  <span>
                    {BRAND.contactEmail}
                    <small>Send a brief or ask a question</small>
                  </span>
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="section section--tight section--subtle">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">What happens next</span>
            <h2>No black box, no pressure.</h2>
          </div>
          <div className="steps next-steps">
            {NEXT_STEPS.map(([num, title, body]) => (
              <div className="step" key={num}>
                <span className="step__num">{num}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
