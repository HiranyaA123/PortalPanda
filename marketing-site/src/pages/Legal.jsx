import { BRAND } from '../brand.js';

const SECTIONS = {
  privacy: {
    eyebrow: 'Privacy',
    title: 'Privacy policy',
    intro:
      'This policy explains the limited information we collect through this website and how you can contact us about it.',
    sections: [
      ['Information we collect', 'When you submit the demo form, we receive the contact and venue details you choose to provide. Our hosting provider may also record standard technical information such as your browser, device and IP address for security and reliability.'],
      ['How we use it', 'We use enquiry details to respond to you, arrange a demo, prepare a quote and improve our service. We do not sell your personal information.'],
      ['Service providers', 'Website hosting and form-processing providers may process information on our behalf. Their own privacy terms also apply to those services.'],
      ['Retention and access', 'We keep enquiry information only for as long as it is reasonably needed for the purpose it was provided or to meet legal obligations. You can ask to access, correct or delete it.'],
      ['Contact', `For a privacy question or request, email ${BRAND.contactEmail}.`],
    ],
  },
  terms: {
    eyebrow: 'Terms',
    title: 'Website terms',
    intro:
      'These terms apply to this marketing website. Product proposals and customer agreements are provided separately.',
    sections: [
      ['Website information', 'The content on this site is general information about CentralPass. Features, integrations, availability and pricing may change as the service develops.'],
      ['Quotes and agreements', 'A demo request does not create a contract. Any implementation scope, fees, timing, support and service commitments will be set out in a separate written proposal or agreement.'],
      ['Intellectual property', 'The CentralPass name, logo, website design and original content belong to their respective owner and may not be copied or represented as your own without permission.'],
      ['Third-party services', 'CentralPass may connect with services such as Stripe and Uber Direct. Those services are supplied under their own terms and may change independently.'],
      ['Contact', `Questions about these terms can be sent to ${BRAND.contactEmail}.`],
    ],
  },
};

export default function Legal({ type }) {
  const content = SECTIONS[type];
  return (
    <main id="main">
      <section className="page-hero page-hero--compact grain">
        <div className="container">
          <div className="page-hero__inner">
            <span className="eyebrow">{content.eyebrow}</span>
            <h1>{content.title}</h1>
            <p>{content.intro}</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container container--narrow legal-copy">
          <p className="legal-copy__updated">Last updated 23 July 2026</p>
          {content.sections.map(([title, body]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{body}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
