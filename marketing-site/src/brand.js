// Single source of truth for every brand-specific string, colour and contact
// detail on the site. The business name is likely to change, so renaming the
// business should be a one-file edit here — no component may hardcode the name,
// email or phone number.
export const BRAND = {
  name: 'PayPanda',
  tagline: 'Online ordering that looks like your restaurant.',
  contactEmail: 'agarwalhiranya@gmail.com',
  contactPhone: '0452145196',
  contactPhoneDisplay: '0452 145 196',
  formEndpoint: 'https://formspree.io/f/mlgqbarp', // Formspree URL
  accent: '#0F9D6E', // keep in sync with --accent in index.css
  location: 'Adelaide, South Australia',
};
