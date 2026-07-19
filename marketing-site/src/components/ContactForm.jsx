import { useState } from 'react';
import { BRAND } from '../brand.js';
import { IconMail, IconPhone } from './icons.jsx';

const EMPTY = { name: '', venue: '', phone: '', email: '', message: '' };

export default function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const update = (field) => (e) =>
    setValues((v) => ({ ...v, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // No endpoint configured yet: degrade gracefully, point at email/phone.
    if (!BRAND.formEndpoint) {
      setStatus('error');
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch(BRAND.formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: JSON.stringify(values),
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
          Thanks — we'll be in touch within one business day.
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate={false}>
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
            {status === 'submitting' ? 'Sending…' : 'Send'}
          </button>

          {status === 'error' && (
            <div className="form-status form-status--err" role="alert">
              Something went wrong — email us at{' '}
              <a href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>.
            </div>
          )}

          <p className="form-note">
            Prefer to talk? Call{' '}
            <a href={`tel:${BRAND.contactPhone}`}>{BRAND.contactPhoneDisplay}</a>{' '}
            or email{' '}
            <a href={`mailto:${BRAND.contactEmail}`}>{BRAND.contactEmail}</a>.
          </p>
        </form>
      )}

      <div className="contact-lines" aria-hidden={status === 'success' ? undefined : true}>
        {status === 'success' && (
          <>
            <a href={`tel:${BRAND.contactPhone}`}>
              <IconPhone /> {BRAND.contactPhoneDisplay}
            </a>
            <a href={`mailto:${BRAND.contactEmail}`}>
              <IconMail /> {BRAND.contactEmail}
            </a>
          </>
        )}
      </div>
    </div>
  );
}
