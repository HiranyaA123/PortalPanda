// Minimal static server that mimics production hosting semantics so the
// prerendered build can actually be verified locally:
//   1. exact file      ->  200
//   2. <path>/index.html (prerendered route)  ->  200
//   3. 404.html        ->  404   (a real 404, not a soft one)
//
// `vite preview` cannot be used for this: it applies SPA fallback to every
// unmatched path, so it serves the homepage shell for /platform and hides
// whether prerendering worked at all.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = 'dist';
const PORT = Number(process.argv[2] || 4180);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.webmanifest': 'application/manifest+json',
};

const tryFile = async (path) => {
  try {
    const info = await stat(path);
    if (!info.isFile()) return null;
    return await readFile(path);
  } catch {
    return null;
  }
};

createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');

  let body = await tryFile(join(ROOT, safe));
  let status = 200;
  let ext = extname(safe);

  if (!body) {
    body = await tryFile(join(ROOT, safe, 'index.html'));
    ext = '.html';
  }

  if (!body) {
    body = await tryFile(join(ROOT, '404.html'));
    ext = '.html';
    status = 404;
  }

  res.writeHead(status, { 'Content-Type': TYPES[ext] || 'application/octet-stream' });
  res.end(body ?? 'Not found');
}).listen(PORT, () => console.log(`Serving ${ROOT} on http://localhost:${PORT}`));
