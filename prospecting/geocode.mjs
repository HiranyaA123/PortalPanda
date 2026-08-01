// Reverse-geocodes strip centroids via Nominatim so every strip has a name you
// can actually navigate to, including the ones where no venue carries an
// address tag.
//
// Nominatim's usage policy allows 1 request/second and requires a real
// User-Agent. Results are cached to disk, so a re-run costs nothing and only
// genuinely new strips hit the network.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { USER_AGENT } from './config.mjs';

const CACHE_PATH = join(dirname(fileURLToPath(import.meta.url)), '.geocode-cache.json');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const cache = existsSync(CACHE_PATH) ? JSON.parse(readFileSync(CACHE_PATH, 'utf8')) : {};

async function reverse(lat, lon) {
  const key = `${lat.toFixed(4)},${lon.toFixed(4)}`;
  if (cache[key]) return cache[key];

  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=16&addressdetails=1&lat=${lat}&lon=${lon}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const a = (await res.json()).address || {};
    const place = {
      road: a.road || null,
      suburb: a.suburb || a.city_district || a.town || a.village || a.municipality || null,
    };
    cache[key] = place;
    await sleep(1100); // stay inside the 1 req/sec policy
    return place;
  } catch {
    cache[key] = { road: null, suburb: null };
    return cache[key];
  }
}

// Fills in missing names and disambiguates repeats. A long road like Magill Rd
// legitimately produces several separate strips; without the suburb they all
// read "Magill Road" and you can't tell which session is which.
export async function nameStrips(clusters) {
  const needsLookup = clusters.filter((c) => !c.name);
  const seen = new Map();
  for (const c of clusters) if (c.name) seen.set(c.name, (seen.get(c.name) || 0) + 1);
  const ambiguous = clusters.filter((c) => c.name && seen.get(c.name) > 1);

  const todo = [...needsLookup, ...ambiguous];
  const uncached = todo.filter((c) => !cache[`${c.lat.toFixed(4)},${c.lon.toFixed(4)}`]).length;
  if (todo.length) {
    console.log(`  naming ${todo.length} strips via Nominatim (${uncached} uncached, ~${uncached}s)...`);
  }

  for (const c of todo) {
    const place = await reverse(c.lat, c.lon);
    if (!c.name) {
      c.name = [place.road, place.suburb].filter(Boolean).join(', ') || `Strip @ ${c.lat.toFixed(4)}, ${c.lon.toFixed(4)}`;
    } else if (place.suburb && !c.name.includes(place.suburb)) {
      c.name = `${c.name}, ${place.suburb}`;
    }
  }

  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), 'utf8');
  disambiguate(clusters);
  return clusters;
}

// A long road splits into several strips that all geocode to the same suburb,
// so the route plan ends up with two rows both reading "Waymouth Street,
// Adelaide". Add which end of the road each one is.
function disambiguate(clusters) {
  // Group on the street portion, not the whole name. "Rundle Street" and
  // "Rundle Street, Adelaide" aren't equal as strings but are the same road,
  // and reading both in a route plan tells you nothing about which is which.
  const road = (name) => name.split(',')[0].trim().toLowerCase();
  const byName = new Map();
  for (const c of clusters) {
    const key = road(c.name);
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key).push(c);
  }

  for (const [, list] of byName) {
    if (list.length < 2) continue;
    // Use the longest name in the group as the base, so the suburb survives.
    const name = list.map((c) => c.name).sort((a, b) => b.length - a.length)[0];
    const meanLat = list.reduce((s, c) => s + c.lat, 0) / list.length;
    const meanLon = list.reduce((s, c) => s + c.lon, 0) / list.length;
    const used = new Set();
    for (const c of list) {
      const dLat = c.lat - meanLat;
      const dLon = c.lon - meanLon;
      const hint = Math.abs(dLat) > Math.abs(dLon)
        ? (dLat > 0 ? 'north' : 'south')
        : (dLon > 0 ? 'east' : 'west');
      let label = `${name} (${hint})`;
      // Three-plus segments can collide on the same compass hint.
      let n = 2;
      while (used.has(label)) label = `${name} (${hint} ${n++})`;
      used.add(label);
      c.name = label;
    }
  }
}
