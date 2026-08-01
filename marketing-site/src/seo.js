import { BRAND } from './brand.js';
import { PRICING_FAQ } from './content/faq.js';

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

// Pure description of a route's metadata - no DOM access. Both the client-side
// applySeo() below and the build-time prerenderer consume this, so a page's
// rendered <head> and its prerendered <head> cannot drift apart.
export function getSeoData(pathname) {
  const entry = SEO[pathname] || {
    title: `Page not found | ${BRAND.name}`,
    description: DEFAULT_DESCRIPTION,
    noIndex: true,
  };
  const canonicalPath = SEO[pathname] ? pathname : '/';

  return {
    title: entry.title,
    description: entry.description,
    robots: entry.noIndex ? 'noindex, nofollow' : 'index, follow',
    canonicalUrl: `${BRAND.siteUrl}${canonicalPath === '/' ? '/' : canonicalPath}`,
    socialImage: `${BRAND.siteUrl}/centralpass-og-saas.png`,
    socialImageAlt: 'CentralPass custom venue software for independent restaurants and cafes',
    schema: buildSchema(pathname),
  };
}

export function applySeo(pathname) {
  const seo = getSeoData(pathname);

  document.title = seo.title;
  upsertMeta('name', 'description', seo.description);
  upsertMeta('name', 'robots', seo.robots);
  upsertMeta('property', 'og:type', 'website');
  upsertMeta('property', 'og:locale', 'en_AU');
  upsertMeta('property', 'og:site_name', BRAND.name);
  upsertMeta('property', 'og:title', seo.title);
  upsertMeta('property', 'og:description', seo.description);
  upsertMeta('property', 'og:url', seo.canonicalUrl);
  upsertMeta('property', 'og:image', seo.socialImage);
  upsertMeta('property', 'og:image:alt', seo.socialImageAlt);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', seo.title);
  upsertMeta('name', 'twitter:description', seo.description);
  upsertMeta('name', 'twitter:image', seo.socialImage);

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', seo.canonicalUrl);

  let schema = document.head.querySelector('#centralpass-schema');
  if (!schema) {
    schema = document.createElement('script');
    schema.id = 'centralpass-schema';
    schema.type = 'application/ld+json';
    document.head.appendChild(schema);
  }
  schema.textContent = JSON.stringify(seo.schema);
}

function buildSchema(pathname) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        // ProfessionalService is a LocalBusiness subtype. Plain Organization
        // carries no locality signal, which is the wrong shape for a business
        // selling to venues in one city.
        //
        // Deliberately NOT included: geo, openingHours and priceRange. Real
        // values for those are not known, and inventing them would be both
        // dishonest and a structured-data violation. Add them only with actual
        // figures - especially priceRange, which is exactly the thing the
        // Pricing page declines to state.
        '@type': ['Organization', 'ProfessionalService'],
        '@id': `${BRAND.siteUrl}/#organization`,
        name: BRAND.name,
        url: BRAND.siteUrl,
        logo: `${BRAND.siteUrl}/centralpass-mark-512.png`,
        image: `${BRAND.siteUrl}/centralpass-og-saas.png`,
        email: BRAND.contactEmail,
        telephone: `+61${BRAND.contactPhone.slice(1)}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Adelaide',
          addressRegion: 'SA',
          addressCountry: 'AU',
        },
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
      // Only emitted on /pricing, where these exact questions and answers are
      // visible on the page. Google requires the marked-up answer to match the
      // rendered one, so both come from src/content/faq.js.
      ...(pathname === '/pricing' ? [{
        '@type': 'FAQPage',
        '@id': `${BRAND.siteUrl}/pricing#faq`,
        inLanguage: 'en-AU',
        mainEntity: PRICING_FAQ.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      }] : []),
    ],
  };
}
