import { useState } from 'react';
import { BRAND } from '../brand.js';

const EMPTY = { name: '', venue: '', phone: '', email: '', message: '', website: '' };

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const update = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Quietly accept bot-filled submissions without sending them.
    if (values.website) {
      setStatus('success');
      setValues(EMPTY);
      return;
    }

    // No endpoint configured yet: degrade gracefully, point at email/phone.
    if (!BRAND.formEndpoint) {
      setStatus('error');
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch(BRAND.formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: values.name,
          venue: values.venue,
          phone: values.phone,
          email: values.email,
          message: values.message,
          _subject: `CentralPass demo request — ${values.venue}`,
        }),
      });
      if (!res.ok) throw new Error('Bad response');
      setStatus('success');
      setValues(EMPTY);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="form-card">
      {status === 'success' ? (
        <div className="form-status form-status--ok" role="status">
          Thanks — we'll be in touch within one business day. Prefer to talk now?
          Call <a href={`tel:${BRAND.contactPhone}`}>{BRAND.contactPhoneDisplay}</a>.
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate={false}>
          <div className="hp-field" aria-hidden="true">
            <label htmlFor="cf-website">Website</label>
            <input
              id="cf-website"
              type="text"
              tabIndex="-1"
              autoComplete="off"
              value={values.website}
              onChange={update('website')}
            />
          </div>
          <div className="field">
            <label htmlFor="cf-name">
              Your name <span className="req">*</span>
            </label>
            <input
              id="cf-name"
              type="text"
              required
              autoComplete="name"
              value={values.name}
              onChange={update('name')}
            />
          </div>

          <div className="field">
            <label htmlFor="cf-venue">
              Venue name <span className="req">*</span>
            </label>
            <input
              id="cf-venue"
              type="text"
              required
              value={values.venue}
              onChange={update('venue')}
            />
          </div>

          <div className="field">
            <label htmlFor="cf-phone">
              Phone <span className="req">*</span>
            </label>
            <input
              id="cf-phone"
              type="tel"
              required
              autoComplete="tel"
              value={values.phone}
              onChange={update('phone')}
            />
          </div>

          <div className="field">
            <label htmlFor="cf-email">
              Email <span className="req">*</span>
            </label>
            <input
              id="cf-email"
              type="email"
              required
              autoComplete="email"
              value={values.email}
              onChange={update('email')}
            />
          </div>

          <div className="field">
            <label htmlFor="cf-message">Message</label>
            <textarea
              id="cf-message"
              value={values.message}
              onChange={update('message')}
              placeholder="What are you serving, and what do you need?"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending…' : 'Request my demo'}
          </button>

          {status === 'error' && (
            <div className="form-status form-status--err" role="alert">
              Something went wrong — email us at{' '}
              <a href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>.
            </div>
          )}

          <p className="form-note">
            By submitting, you agree that we can contact you about your enquiry.{' '}
            <a href="/privacy">Privacy policy</a>. Prefer to talk? Call{' '}
            <a href={`tel:${BRAND.contactPhone}`}>{BRAND.contactPhoneDisplay}</a>{' '}
            or email{' '}
            <a href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>.
          </p>
        </form>
      )}
    </div>
  );
}
