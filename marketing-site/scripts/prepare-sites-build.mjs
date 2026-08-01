import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { SEO } from '../src/seo.js';
import { BRAND } from '../src/brand.js';

const serverDirectory = resolve('dist/server');
await mkdir(serverDirectory, { recursive: true });

// Static-host fallback. Unknown paths must return the SPA shell with a real 404
// status - returning 200 makes every mistyped URL a soft 404 that crawlers will
// happily index. The prerendered 404.html is preferred when present.
await writeFile(
  resolve(serverDirectory, 'index.js'),
  `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    const url = new URL(request.url);
    url.pathname = '/404.html';
    const notFound = await env.ASSETS.fetch(new Request(url, request));
    if (notFound.status === 200) {
      return new Response(notFound.body, {
        status: 404,
        headers: notFound.headers,
      });
    }

    url.pathname = '/index.html';
    const shell = await env.ASSETS.fetch(new Request(url, request));
    return new Response(shell.body, { status: 404, headers: shell.headers });
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
