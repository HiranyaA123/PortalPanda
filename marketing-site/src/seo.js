import { BRAND } from './brand.js';

const DEFAULT_DESCRIPTION =
  'CentralPass builds custom restaurant and cafe websites, online ordering, CRM, bookings, kitchen and staff software for independent Australian venues.';

export const SEO = {
  '/': {
    title: 'Restaurant Website, CRM & Venue Software | CentralPass',
    description: DEFAULT_DESCRIPTION,
  },
  '/platform': {
    title: 'Restaurant CRM, Ordering & Operations Software | CentralPass',
    description:
      'Explore CentralPass restaurant CRM, online ordering, bookings, kitchen, staff, promotions and delivery modules, customised for your venue.',
  },
  '/pricing': {
    title: 'Custom Restaurant Software Pricing | CentralPass',
    description:
      'Get a tailored CentralPass proposal based on your venue, chosen modules and requested features. No marketplace commission or forced software tier.',
  },
  '/live': {
    title: 'CentralPass venue projects | Live and in progress',
    description:
      'Explore CentralPass venue projects for Caffe Primo Firle, Needa Pizza and Beach Road Pizza, including live work and clearly marked work-in-progress builds.',
  },
  '/contact': {
    title: 'Restaurant Website & Software Design Adelaide | CentralPass',
    description:
      'Plan bespoke software for your restaurant or cafe. Share your workflows, request features and receive a tailored CentralPass build proposal.',
  },
  '/privacy': {
    title: 'Privacy policy | CentralPass',
    description: 'How CentralPass handles enquiries and website information.',
  },
  '/terms': {
    title: 'Website terms | CentralPass',
    description: 'Terms for using the CentralPass marketing website.',
  },
};

const upsertMeta = (attribute, key, content) => {
  let node = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!node) {
    node = document.createElement('meta');
    node.setAttribute(attribute, key);
    document.head.appendChild(node);
  }
  node.setAttribute('content', content);
};

export function applySeo(pathname) {
  const entry = SEO[pathname] || {
    title: `Page not found | ${BRAND.name}`,
    description: DEFAULT_DESCRIPTION,
    noIndex: true,
  };
  const canonicalPath = SEO[pathname] ? pathname : '/';
  const canonicalUrl = `${BRAND.siteUrl}${canonicalPath === '/' ? '/' : canonicalPath}`;
  const socialImage = `${BRAND.siteUrl}/og.png`;

  document.title = entry.title;
  upsertMeta('name', 'description', entry.description);
  upsertMeta('name', 'robots', entry.noIndex ? 'noindex, nofollow' : 'index, follow');
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:locale', 'en_AU');
  upsertMeta('property', 'og:site_name', BRAND.name);
  upsertMeta('property', 'og:title', entry.title);
  upsertMeta('property', 'og:description', entry.description);
  upsertMeta('property', 'og:url', canonicalUrl);
  upsertMeta('property', 'og:image', socialImage);
  upsertMeta('property', 'og:image:alt', 'CentralPass custom venue software for independent restaurants and cafes');
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', entry.title);
  upsertMeta('name', 'twitter:description', entry.description);
  upsertMeta('name', 'twitter:image', socialImage);

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);

  let schema = document.head.querySelector('#centralpass-schema');
  if (!schema) {
    schema = document.createElement('script');
    schema.id = 'centralpass-schema';
    schema.type = 'application/ld+json';
    document.head.appendChild(schema);
  }
  schema.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BRAND.siteUrl}/#organization`,
        name: BRAND.name,
        url: BRAND.siteUrl,
        logo: `${BRAND.siteUrl}/centralpass-mark-512.png`,
        email: BRAND.contactEmail,
        telephone: `+61${BRAND.contactPhone.slice(1)}`,
        areaServed: 'Australia',
      },
      {
        '@type': 'WebSite',
        '@id': `${BRAND.siteUrl}/#website`,
        name: BRAND.name,
        url: `${BRAND.siteUrl}/`,
        inLanguage: 'en-AU',
        publisher: { '@id': `${BRAND.siteUrl}/#organization` },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${BRAND.siteUrl}/#software`,
        name: BRAND.name,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: BRAND.siteUrl,
        inLanguage: 'en-AU',
        description: DEFAULT_DESCRIPTION,
        provider: { '@id': `${BRAND.siteUrl}/#organization` },
      },
    ],
  });
}
