import { BRAND } from './brand.js';

const DEFAULT_DESCRIPTION =
  'CentralPass designs and builds bespoke venue software for independent Australian restaurants and cafes, with connected operations and zero marketplace commission.';

export const SEO = {
  '/': {
    title: 'CentralPass | Custom venue software, built around you',
    description: DEFAULT_DESCRIPTION,
  },
  '/platform': {
    title: 'Custom restaurant and cafe software | CentralPass',
    description:
      'Explore proven CentralPass modules, then request the custom workflows, integrations and capabilities your restaurant or cafe needs.',
  },
  '/pricing': {
    title: 'Custom venue software pricing | CentralPass',
    description:
      'Get a tailored CentralPass proposal based on your venue, chosen modules and requested features. No marketplace commission or forced software tier.',
  },
  '/live': {
    title: 'CentralPass live at Caffe Primo Firle | Case study',
    description:
      'See how Caffe Primo Firle uses CentralPass for a 100+ item pickup menu, kitchen orders, printed dockets and day-to-day venue operations.',
  },
  '/contact': {
    title: 'Plan custom venue software | CentralPass Adelaide',
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
