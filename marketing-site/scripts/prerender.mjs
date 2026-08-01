// Renders every route to static HTML at build time.
//
// Why this exists: the site is a client-rendered SPA, so before this step every
// route served the HOMEPAGE's <title>, <meta description> and, worst of all,
// <link rel="canonical" href="https://www.centralpass.au/">. Social unfurlers
// (Facebook, LinkedIn, WhatsApp, Slack, iMessage, X) do not execute JavaScript,
// so sharing /live rendered as the homepage card. And a canonical pointing at
// "/" is an explicit instruction not to index the page it appears on.
//
// Runs after `vite build` and after the SSR bundle is built. Reads the client
// index.html as a template, swaps in per-route head tags and the prerendered
// markup, and writes dist/<route>/index.html.
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const SSR_DIR = '.ssr-build';
const DIST = 'dist';

const { render, SEO, getSeoData } = await import(
  pathToFileURL(resolve(SSR_DIR, 'entry-server.js')).href
);

const template = await readFile(resolve(DIST, 'index.html'), 'utf8');

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// JSON-LD sits inside a <script> block, so the only sequence that can break out
// is a literal "</script>". Escaping the slash is the standard mitigation.
const escapeJsonLd = (value) =>
  JSON.stringify(value).replace(/</g, '\\u003c');

function buildHead(seo) {
  return [
    `<title>${escapeAttr(seo.title)}</title>`,
    `<meta name="description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="robots" content="${escapeAttr(seo.robots)}" />`,
    `<link rel="canonical" href="${escapeAttr(seo.canonicalUrl)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="CentralPass" />`,
    `<meta property="og:locale" content="en_AU" />`,
    `<meta property="og:title" content="${escapeAttr(seo.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(seo.description)}" />`,
    `<meta property="og:url" content="${escapeAttr(seo.canonicalUrl)}" />`,
    `<meta property="og:image" content="${escapeAttr(seo.socialImage)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escapeAttr(seo.socialImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(seo.socialImage)}" />`,
    `<script type="application/ld+json" id="centralpass-schema">${escapeJsonLd(seo.schema)}</script>`,
  ].join('\n    ');
}

// Strip the generic tags baked into index.html so each page carries exactly one
// title/description/canonical/og/twitter/schema set rather than two competing ones.
function stripTemplateHead(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/g, '')
    .replace(/<meta\s+name="description"[\s\S]*?\/>\s*/gi, '')
    .replace(/<meta\s+name="robots"[^>]*>\s*/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi, '')
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '');
}

const routes = Object.keys(SEO);
const base = stripTemplateHead(template);

async function writeRoute(pathname, outPath) {
  const seo = getSeoData(pathname);
  const appHtml = render(pathname);

  const html = base
    .replace('</head>', `  ${buildHead(seo)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  await mkdir(resolve(DIST, outPath), { recursive: true });
  await writeFile(resolve(DIST, outPath, 'index.html'), html, 'utf8');
  return { pathname, file: join(outPath || '.', 'index.html'), bytes: html.length };
}

const written = [];
for (const route of routes) {
  written.push(await writeRoute(route, route === '/' ? '' : route.slice(1)));
}

// A dedicated 404 document. getSeoData() returns noindex for any unknown path,
// so this page carries "noindex, nofollow" - unlike the old behaviour, where an
// unknown URL returned the homepage's "index, follow" shell with a 200 status.
const notFoundSeo = getSeoData('/__not-found__');
const notFoundHtml = base
  .replace('</head>', `  ${buildHead(notFoundSeo)}\n  </head>`)
  .replace('<div id="root"></div>', `<div id="root">${render('/__not-found__')}</div>`);
await writeFile(resolve(DIST, '404.html'), notFoundHtml, 'utf8');

await rm(SSR_DIR, { recursive: true, force: true });

console.log(`Prerendered ${written.length} routes + 404.html`);
for (const { pathname, file, bytes } of written) {
  console.log(`  ${pathname.padEnd(10)} -> ${file.padEnd(24)} ${(bytes / 1024).toFixed(1)} kB`);
}
