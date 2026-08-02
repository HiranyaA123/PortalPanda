import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { SEO } from '../src/seo.js';
import { BRAND } from '../src/brand.js';

const serverDirectory = resolve('dist/server');
await mkdir(serverDirectory, { recursive: true });

// Resolution order, matching the other hosting configs:
//   1. exact asset
//   2. <path>/index.html   - the prerendered route document
//   3. /404.html with a real 404 status
//
// Every route is prerendered, so there is no SPA fallback any more. The old
// worker rewrote everything to /index.html and returned whatever status that
// fetch produced (200), which made every mistyped URL a soft 404 carrying the
// homepage's title and "index, follow". Directory-index resolution is done
// explicitly rather than relying on the ASSETS binding to infer it.
await writeFile(
  resolve(serverDirectory, 'index.js'),
  `const withStatus = (response, status) =>
  new Response(response.body, { status, headers: response.headers });

export default {
  async fetch(request, env) {
    const direct = await env.ASSETS.fetch(request);
    if (direct.status !== 404) return direct;

    const url = new URL(request.url);

    // Prerendered route: /platform -> /platform/index.html
    if (!url.pathname.includes('.')) {
      const indexUrl = new URL(url);
      indexUrl.pathname = \`\${url.pathname.replace(/\\/$/, '')}/index.html\`;
      const page = await env.ASSETS.fetch(new Request(indexUrl, request));
      if (page.status === 200) return page;
    }

    const notFoundUrl = new URL(url);
    notFoundUrl.pathname = '/404.html';
    const notFound = await env.ASSETS.fetch(new Request(notFoundUrl, request));
    return withStatus(notFound, 404);
  },
};
`,
  'utf8',
);

// Sitemap is generated rather than hand-maintained so that lastmod is always
// real and the URL list cannot drift from the routes defined in src/seo.js.
// Google ignores changefreq and priority entirely; lastmod is the one signal it
// actually reads, and it was the one the previous hand-written file omitted.
const PRIORITY = {
  '/': '1.0',
  '/platform': '0.9',
  '/pricing': '0.8',
  '/live': '0.8',
  '/contact': '0.7',
  '/privacy': '0.2',
  '/terms': '0.2',
};

const lastmod = new Date().toISOString().slice(0, 10);
const urls = Object.keys(SEO)
  .map((path) => {
    const loc = `${BRAND.siteUrl}${path === '/' ? '/' : path}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${PRIORITY[path] ?? '0.5'}</priority>\n  </url>`;
  })
  .join('\n');

await writeFile(
  resolve('dist/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
  'utf8',
);

console.log(`Generated dist/sitemap.xml (${Object.keys(SEO).length} URLs, lastmod ${lastmod})`);
