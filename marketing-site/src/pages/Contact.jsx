import ContactForm from '../components/ContactForm.jsx';

export default function Contact() {
  return (
    <main id="main">
      <section className="section">
        <div className="container">
          <div className="contact__grid">
            <div className="contact__aside">
              <span className="eyebrow">Get started</span>
              <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', marginBottom: 18 }}>
                Tell us about your venue.
              </h1>
              <p>
                Custom-designed, done-for-you online ordering. Tell us what you
                serve and what you need — we'll be in touch within one business
                day.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
