// Single source of truth for every brand-specific string, colour and contact
// detail on the site. Renaming the business or changing a contact detail should
// be a one-file edit here - no component may hardcode the name, email or phone.
export const BRAND = {
  name: 'CentralPass',
  shortName: 'CentralPass',
  tagline: 'Custom venue software, built around you.',
  siteUrl: 'https://www.centralpass.au',
  pitch:
    'We design and build a connected system from scratch for your venue - using proven modules, plus any new capabilities we agree to scope with you.',
  contactEmail: 'contact@centralpass.au',
  contactPhone: '0452145196',
  contactPhoneDisplay: '0452 145 196',
  formEndpoint: 'https://formspree.io/f/mlgqbarp',
  location: 'Adelaide, South Australia',

  // Keep these values in sync with the tokens in src/index.css.
  colors: {
    ink: '#0B1020',
    violet: '#5B5DF0',
    coral: '#FF6B5E',
    cyan: '#4AD8DF',
  },
};
