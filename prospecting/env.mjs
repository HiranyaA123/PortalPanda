// Reads .env without pulling in a dependency.
//
// The key is passed to Google in the X-Goog-Api-Key header rather than a query
// string, so it never lands in a URL that could end up in a log, an error
// message or a terminal scrollback.

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ENV_PATH = join(dirname(fileURLToPath(import.meta.url)), '.env');

export function loadEnv() {
  if (!existsSync(ENV_PATH)) return {};
  const out = {};
  for (const line of readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    out[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
  }
  return out;
}

export function requireApiKey() {
  const key = loadEnv().GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    console.error('No GOOGLE_MAPS_API_KEY found.\n  cp .env.example .env, then paste your key after the = sign.');
    process.exit(1);
  }
  return key;
}

// Google sometimes echoes the request URL back in an error. Never let a key
// reach the terminal.
export function redact(text, key) {
  return String(text).split(key).join('[KEY]');
}
