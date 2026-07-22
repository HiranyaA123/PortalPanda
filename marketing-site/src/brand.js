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
  contactEmail: 'centralpassinfo@gmail.com',
  contactPhone: '0452145196',
  contactPhoneDisplay: '0452 145 196',
  formEndpoint: 'https://formspree.io/f/mlgqbarp',
  location: 'Adelaide, South Australia',

  // Keep these values in sync with the tokens in src/index.css.
  colors: {
    ink: '#0B0B12',
    violet: '#6C4DFF',
    coral: '#FF6B4A',
    cyan: '#37D6E5',
  },
};
