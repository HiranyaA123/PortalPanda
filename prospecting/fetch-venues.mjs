// Pulls every named hospitality venue in Adelaide metro from OpenStreetMap,
// drops chains and shopping-centre tenancies, classifies whatever web presence
// OSM knows about, and writes a CSV you can sort or import into Google My Maps.
//
//   node fetch-venues.mjs
//
// No API key and no billing - Overpass is free. Coverage is the trade-off:
// see README.md for what this can and can't tell you.

import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BBOX, AMENITIES, OVERPASS_ENDPOINTS, USER_AGENT, CHAINS, MALL_NAME_HINTS,
  SOCIAL_HOSTS, MARKETPLACE_HOSTS, BUILDER_HOSTS, STRIP_MIN_VENUES, STRIP_RADIUS_M,
  STRIP_MAX_VENUES, MALL_BUFFER_M, SHOPS, ABSORB_RADIUS_M, POCKET_MIN_VENUES,
} from './config.mjs';
import { clusterVenues, absorbStragglers, attachNearestStrip } from './cluster.mjs';
import { nameStrips } from './geocode.mjs';
import { serialise } from './csv.mjs';
import { loadPrevious, applyPrevious, backup, writeAtomic } from './preserve.mjs';

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), 'output');
const VENUES_CSV = join(OUT_DIR, 'venues.csv');
const [S, W, N, E] = BBOX;
const BOX = `${S},${W},${N},${E}`;

const VENUE_COLS = ['tier', 'strip_rank', 'strip', 'strip_size', 'nearest_strip', 'nearest_strip_m', 'name', 'type', 'cuisine', 'suburb', 'street',
  'address', 'website_class', 'website', 'website_note', 'phone', 'opening_hours', 'outdoor_seating',
  'takeaway', 'delivery', 'footprint_m2', 'lat', 'lon', 'osm_url', 'google_url', 'status', 'notes'];

// --- Overpass ---------------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function overpass(query, label) {
  let lastErr;
  // Two passes: a 429 means the mirror is busy right now, not broken, so it's
  // worth coming back to it after the other mirrors have been tried.
  for (let attempt = 1; attempt <= 2; attempt++) {
    for (const endpoint of OVERPASS_ENDPOINTS) {
      try {
        process.stdout.write(`  ${label}: ${new URL(endpoint).host} ... `);
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': USER_AGENT,
          },
          body: new URLSearchParams({ data: query }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        // A mirror that only carries another region answers 200 with nothing.
        if (!json.elements?.length) throw new Error('0 elements - wrong region?');
        console.log(`${json.elements.length} elements`);
        return json.elements;
      } catch (err) {
        console.log(`failed (${err.message})`);
        lastErr = err;
      }
    }
    if (attempt === 1) {
      console.log('  all mirrors busy, waiting 30s before retry...');
      await sleep(30_000);
    }
  }
  throw new Error(`All Overpass mirrors failed for ${label}: ${lastErr?.message}`);
}

const venueQuery = `
[out:json][timeout:300];
(
  nwr["amenity"~"^(${AMENITIES.join('|')})$"]["name"](${BOX});
  nwr["shop"~"^(${SHOPS.join('|')})$"]["name"](${BOX});
);
out center tags;`;

// Malls come back with full geometry so we can test whether a venue sits inside
// one, rather than guessing from a hardcoded list of centre names.
const mallQuery = `
[out:json][timeout:300];
(
  way["shop"="mall"](${BOX});
  relation["shop"="mall"](${BOX});
  way["amenity"="food_court"](${BOX});
);
out geom;`;

// --- Geometry ---------------------------------------------------------------

const M_PER_DEG_LAT = 111_320;
const mPerDegLon = (lat) => 111_320 * Math.cos((lat * Math.PI) / 180);

function pointInRing(lat, lon, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [yi, xi] = [ring[i].lat, ring[i].lon];
    const [yj, xj] = [ring[j].lat, ring[j].lon];
    const straddles = yi > lat !== yj > lat;
    if (straddles && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// Buffer the bounds by MALL_BUFFER_M so venues in the mall's own car-park strip
// or an attached annexe still get caught.
function inBufferedBounds(lat, lon, b) {
  if (!b) return false;
  const padLat = MALL_BUFFER_M / M_PER_DEG_LAT;
  const padLon = MALL_BUFFER_M / mPerDegLon(lat);
  return lat >= b.minlat - padLat && lat <= b.maxlat + padLat
      && lon >= b.minlon - padLon && lon <= b.maxlon + padLon;
}

function polygonAreaM2(ring) {
  if (!ring || ring.length < 4) return null;
  const lat0 = ring[0].lat;
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i].lon * mPerDegLon(lat0), yi = ring[i].lat * M_PER_DEG_LAT;
    const xj = ring[j].lon * mPerDegLon(lat0), yj = ring[j].lat * M_PER_DEG_LAT;
    sum += xj * yi - xi * yj;
  }
  return Math.round(Math.abs(sum / 2));
}

// --- Classification ---------------------------------------------------------

const norm = (s) => (s || '').toLowerCase().trim();

function isChain(tags) {
  // An explicit brand link is OSM's own way of saying "this is a chain".
  if (tags['brand:wikidata'] || tags.brand) return true;
  const haystack = `${norm(tags.name)} ${norm(tags.operator)}`;
  return CHAINS.some((c) => haystack.includes(c));
}

function classifyWebsite(url) {
  if (!url) return { class: 'unknown', note: 'no website tag in OSM' };
  const host = norm(url).replace(/^https?:\/\//, '').split('/')[0];
  if (MARKETPLACE_HOSTS.some((h) => host.includes(h))) return { class: 'marketplace-only', note: 'paying commission, no direct channel' };
  if (SOCIAL_HOSTS.some((h) => host.includes(h))) return { class: 'social-only', note: 'no real website' };
  if (BUILDER_HOSTS.some((h) => host.includes(h))) return { class: 'diy-builder', note: 'template site' };
  return { class: 'has-site', note: 'needs manual review' };
}

// OSM website coverage is patchy, so this is a coarse sort order only - it ranks
// what we know, and parks everything unknown in the middle for Google to settle.
const PRIORITY = { 'marketplace-only': 1, 'social-only': 2, 'diy-builder': 3, unknown: 4, 'has-site': 5 };

// --- Main -------------------------------------------------------------------

console.log(`Adelaide metro bbox ${BOX}`);
console.log(`Types: ${[...AMENITIES, ...SHOPS].join(', ')}`);

// Read the existing sheet up front, so a malformed file fails immediately
// rather than after a minute of downloading.
const previous = loadPrevious(VENUES_CSV, VENUE_COLS);
if (previous) {
  const extras = previous.extraColumns.length ? `, keeping your columns: ${previous.extraColumns.join(', ')}` : '';
  console.log(`Found existing venues.csv (${previous.records.length} rows)${extras}`);
}
console.log();

const [rawVenues, rawMalls] = [
  await overpass(venueQuery, 'venues'),
  await overpass(mallQuery, 'malls '),
];

const malls = rawMalls.map((m) => ({
  name: m.tags?.name || '(unnamed centre)',
  ring: m.geometry || null,
  bounds: m.bounds || null,
}));

const stats = { total: rawVenues.length, noCoords: 0, chain: 0, mall: 0, kept: 0 };
const kept = [];

for (const el of rawVenues) {
  const tags = el.tags || {};
  const lat = el.lat ?? el.center?.lat;
  const lon = el.lon ?? el.center?.lon;
  if (lat == null || lon == null) { stats.noCoords++; continue; }

  if (isChain(tags)) { stats.chain++; continue; }

  // Polygon test first, then the name hints as a backstop for tenancies mapped
  // as bare nodes outside their centre's footprint.
  let mallHit = malls.find((m) => (m.ring ? pointInRing(lat, lon, m.ring) : inBufferedBounds(lat, lon, m.bounds)));
  if (!mallHit) {
    const haystack = `${norm(tags.name)} ${norm(tags['addr:street'])} ${norm(tags['addr:place'])}`;
    const hint = MALL_NAME_HINTS.find((h) => haystack.includes(h));
    if (hint) mallHit = { name: `name match: ${hint}` };
  }
  if (mallHit) { stats.mall++; continue; }

  const website = tags.website || tags['contact:website'] || tags.url || '';
  const web = classifyWebsite(website);
  const street = tags['addr:street'] || '';
  const suburb = tags['addr:suburb'] || tags['addr:city'] || '';

  kept.push({
    name: tags.name,
    type: tags.amenity || tags.shop,
    cuisine: (tags.cuisine || '').replace(/;/g, ' / '),
    suburb,
    street,
    address: [tags['addr:housenumber'], street].filter(Boolean).join(' '),
    website,
    website_class: web.class,
    website_note: web.note,
    phone: tags.phone || tags['contact:phone'] || '',
    opening_hours: tags.opening_hours || '',
    outdoor_seating: tags.outdoor_seating || '',
    takeaway: tags.takeaway || '',
    delivery: tags.delivery || '',
    footprint_m2: el.type === 'way' && el.geometry ? polygonAreaM2(el.geometry) : '',
    lat, lon,
    osm_url: `https://www.openstreetmap.org/${el.type}/${el.id}`,
    google_url: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${tags.name} ${street} ${suburb} SA`)}`,
    status: 'not visited',
    notes: '',
  });
}
stats.kept = kept.length;

// Group into walkable areas by coordinate, not by address tag. Three tiers, so
// that nothing is left as an undifferentiated pile at the bottom of the file:
//
//   strip  - 6+ venues close together. A full session on foot.
//   pocket - 3-5 venues. A worthwhile stop, not a whole afternoon.
//   single - on its own. Tagged with the nearest strip and how far, so you can
//            decide whether it's a detour or a special trip.
const { clusters: strips, leftovers } = clusterVenues(kept, {
  epsM: STRIP_RADIUS_M,
  minVenues: STRIP_MIN_VENUES,
  maxVenues: STRIP_MAX_VENUES,
});

// Stragglers within walking distance of a strip belong to that session.
const afterAbsorb = absorbStragglers(strips, leftovers, ABSORB_RADIUS_M);
const absorbed = leftovers.length - afterAbsorb.length;

const { clusters: pockets, leftovers: singles } = clusterVenues(afterAbsorb, {
  epsM: STRIP_RADIUS_M,
  minVenues: POCKET_MIN_VENUES,
});

await nameStrips(strips);
await nameStrips(pockets);

for (const c of strips) {
  for (const v of c.members) { v.tier = 'strip'; v.strip = c.name; v.strip_rank = c.rank; v.strip_size = c.size; }
}
for (const c of pockets) {
  for (const v of c.members) { v.tier = 'pocket'; v.strip = c.name; v.strip_rank = ''; v.strip_size = c.size; }
}
for (const v of singles) { v.tier = 'single'; v.strip = ''; v.strip_rank = ''; v.strip_size = 1; }

// Everything not in a strip gets told which strip it's nearest, so a pocket or
// single can be picked up as a detour on a day you're already in the area.
attachNearestStrip([...pockets.flatMap((c) => c.members), ...singles], strips);

// Strips first (biggest first), then pockets, then singles ordered by how easy
// a detour they are - so the file reads top to bottom as descending priority.
const TIER_ORDER = { strip: 0, pocket: 1, single: 2 };
kept.sort((a, b) =>
  (TIER_ORDER[a.tier] - TIER_ORDER[b.tier]) ||
  (b.strip_size - a.strip_size) ||
  (a.strip || '').localeCompare(b.strip || '') ||
  ((a.nearest_strip_m || 0) - (b.nearest_strip_m || 0)) ||
  (PRIORITY[a.website_class] - PRIORITY[b.website_class]) ||
  a.name.localeCompare(b.name));

const summarise = (c, tier) => ({
  tier,
  rank: c.rank ?? '',
  strip: c.name,
  venues: c.size,
  walk_metres: c.walkMetres,
  no_real_website: c.members.filter((v) => ['marketplace-only', 'social-only', 'diy-builder'].includes(v.website_class)).length,
  unknown_website: c.members.filter((v) => v.website_class === 'unknown').length,
  nearest_strip: c.members[0]?.nearest_strip ?? '',
  nearest_strip_m: c.members[0]?.nearest_strip_m ?? '',
  lat: c.lat.toFixed(5),
  lon: c.lon.toFixed(5),
  maps_url: `https://www.google.com/maps/search/?api=1&query=${c.lat.toFixed(5)},${c.lon.toFixed(5)}`,
});

const areas = [
  ...strips.map((c) => summarise(c, 'strip')),
  ...pockets.map((c) => summarise(c, 'pocket')),
];

mkdirSync(OUT_DIR, { recursive: true });
const STRIP_COLS = ['tier', 'rank', 'strip', 'venues', 'walk_metres', 'no_real_website',
  'unknown_website', 'nearest_strip', 'nearest_strip_m', 'lat', 'lon', 'maps_url'];

// Restore field notes from the previous run before writing anything, then keep
// a .bak of the old file so a bad run is always recoverable.
const { restored, carried, extraColumns } = applyPrevious(kept, previous);
const rows = [...kept, ...carried];
const venueCols = [...VENUE_COLS, ...extraColumns];
if (carried.length) venueCols.push('carried_over');

backup(VENUES_CSV);
writeAtomic(VENUES_CSV, serialise(rows, venueCols));
writeAtomic(join(OUT_DIR, 'strips.csv'), serialise(areas, STRIP_COLS));
writeAtomic(join(OUT_DIR, 'venues.json'), JSON.stringify(rows, null, 2));

const byClass = kept.reduce((acc, v) => ({ ...acc, [v.website_class]: (acc[v.website_class] || 0) + 1 }), {});

console.log(`
Pulled          ${stats.total}
  no coords     -${stats.noCoords}
  chains        -${stats.chain}
  in a centre   -${stats.mall}
  ------------------------
  kept          ${stats.kept}

Web presence (per OSM):`);
for (const [k, n] of Object.entries(byClass).sort((a, b) => PRIORITY[a[0]] - PRIORITY[b[0]])) {
  console.log(`  ${k.padEnd(16)} ${n}`);
}
const inStrips = strips.reduce((s, c) => s + c.size, 0);
const inPockets = pockets.reduce((s, c) => s + c.size, 0);
const nearSingles = singles.filter((v) => v.nearest_strip_m <= 1500).length;

console.log(`
How the ${kept.length} venues group:
  ${String(inStrips).padStart(4)}  in ${strips.length} strips   (${STRIP_MIN_VENUES}+ venues - a full session on foot)
        of those, ${absorbed} were absorbed from within ${ABSORB_RADIUS_M}m of a strip
  ${String(inPockets).padStart(4)}  in ${pockets.length} pockets  (${POCKET_MIN_VENUES}-${STRIP_MIN_VENUES - 1} venues - a worthwhile stop)
  ${String(singles.length).padStart(4)}  on their own  (${nearSingles} of them within 1.5km of a strip)

  #   venues  walk   strip`);
for (const s of strips.slice(0, 15)) {
  console.log(`  ${String(s.rank).padStart(2)}  ${String(s.size).padStart(6)}  ${(s.walkMetres + 'm').padStart(5)}  ${s.name}`);
}
if (previous) {
  console.log(`
Your work:
  ${restored} venues had status or notes - all carried across`);
  if (carried.length) {
    console.log(`  ${carried.length} worked-on venues are no longer in OSM, kept and flagged 'carried_over':`);
    for (const c of carried.slice(0, 10)) console.log(`    - ${c.name}`);
  }
  console.log(`  previous file backed up to output/venues.csv.bak`);
}

console.log(`\nWrote output/venues.csv, output/strips.csv, output/venues.json`);
