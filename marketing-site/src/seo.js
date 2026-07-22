import { BRAND } from './brand.js';

const DEFAULT_DESCRIPTION =
  'CentralPass connects online ordering, bookings, kitchen operations, staff, promotions and delivery for independent Australian venues — with zero marketplace commission.';

export const SEO = {
  '/': {
    title: 'CentralPass | One connected venue system',
    description: DEFAULT_DESCRIPTION,
  },
  '/platform': {
    title: 'Restaurant management platform | CentralPass',
    description:
      'Explore CentralPass ordering, bookings, kitchen, staff, promotion and Uber Direct delivery tools — all connected in one venue system.',
  },
  '/pricing': {
    title: 'Commission-free restaurant software pricing | CentralPass',
    description:
      'Get straightforward, custom CentralPass pricing for your venue. No marketplace commission, no per-order platform fee and no forced package.',
  },
  '/live': {
    title: 'CentralPass live at Caffe Primo Firle | Case study',
    description:
      'See how Caffe Primo Firle uses CentralPass for a 100+ item pickup menu, kitchen orders, printed dockets and day-to-day venue operations.',
  },
  '/contact': {
    title: 'Book a CentralPass demo | Adelaide restaurant software',
    description:
      'Book a practical CentralPass demo for your restaurant or café. See the live platform, ask questions and receive a quote for your venue.',
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
  upsertMeta('property', 'og:site_name', BRAND.name);
  upsertMeta('property', 'og:title', entry.title);
  upsertMeta('property', 'og:description', entry.description);
  upsertMeta('property', 'og:url', canonicalUrl);
  upsertMeta('property', 'og:image', socialImage);
  upsertMeta('property', 'og:image:alt', 'CentralPass — one connected system for independent venues');
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
        '@type': 'SoftwareApplication',
        '@id': `${BRAND.siteUrl}/#software`,
        name: BRAND.name,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: BRAND.siteUrl,
        description: DEFAULT_DESCRIPTION,
        provider: { '@id': `${BRAND.siteUrl}/#organization` },
      },
    ],
  });
}
