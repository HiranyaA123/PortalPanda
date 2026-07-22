import { BRAND } from '../brand.js';
import ContactForm from '../components/ContactForm.jsx';
import { IconPhone, IconMail } from '../components/icons.jsx';

export default function Contact() {
  return (
    <main id="main">
      <section className="section">
        <div className="container">
          <div className="contact__grid">
            <div className="contact__aside">
              <span className="eyebrow">Book a demo</span>
              <h1>Tell us about your venue.</h1>
              <p>
                We’ll show you {BRAND.name} running a real venue, answer your
                questions, and put together a straight quote for yours. Usually a
                reply within one business day.
              </p>

              <div className="contact-lines">
                <a href={`tel:${BRAND.contactPhone}`} className="contact-card">
                  <span className="contact-card__icon"><IconPhone /></span>
                  <span>
                    {BRAND.contactPhoneDisplay}
                    <small>Call for a demo &amp; quote</small>
                  </span>
                </a>
                <a href={`mailto:${BRAND.contactEmail}`} className="contact-card">
                  <span className="contact-card__icon"><IconMail /></span>
                  <span>
                    {BRAND.contactEmail}
                    <small>Email us any time</small>
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
