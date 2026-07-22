import { BRAND } from '../brand.js';
import ContactForm from '../components/ContactForm.jsx';
import { IconPhone, IconMail } from '../components/icons.jsx';

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
                  <li>Your customer journey and service model</li>
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
    </main>
  );
}
