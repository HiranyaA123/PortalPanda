// Single source of truth for every brand-specific string, colour and contact
// detail on the site. Renaming the business or changing a contact detail should
// be a one-file edit here — no component may hardcode the name, email or phone.
export const BRAND = {
  name: 'CentralPass',
  shortName: 'CentralPass',
  tagline: 'Every system your venue runs, connected.',
  siteUrl: 'https://portal-panda.vercel.app',
  // One-liner used in meta descriptions and hero sub-copy.
  pitch:
    'Take orders, manage bookings, run the kitchen and staff, send promotions and dispatch delivery from one connected system — without marketplace commission.',
  contactEmail: 'agarwalhiranya@gmail.com',
  contactPhone: '0452145196',
  contactPhoneDisplay: '0452 145 196',
  formEndpoint: 'https://formspree.io/f/mlgqbarp', // Formspree URL
  location: 'Adelaide, South Australia',

  // Brand colours — keep in sync with the tokens in src/index.css.
  colors: {
    ink: '#0B0B12',
    violet: '#6C4DFF',
    coral: '#FF6B4A',
    cyan: '#37D6E5',
  },
};
