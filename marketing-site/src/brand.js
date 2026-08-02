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
  // One brand hue (azure, 209deg) plus ink. The previous accent was #5B5DF0,
  // which sits at 239deg in the indigo/violet zone; cyan and coral were dropped
  // as brand hues and survive only as semantic status colours.
  colors: {
    ink: '#101823',
    accent: '#0B5CA8',
    accentDeep: '#083F73',
    paper: '#F4F6F8',
  },
};
