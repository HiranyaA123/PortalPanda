// Adds Google Places data to every venue from the OSM pull.
//
//   node enrich-google.mjs --dry-run     see what it would cost, spend nothing
//   node enrich-google.mjs               enrich up to MAX_CALLS venues
//   node enrich-google.mjs --limit 200   enrich at most 200 this run
//
// Nothing is dropped, filtered or scored. Every venue keeps its row and gains
// columns. Judging whether a venue is worth pitching is yours to do in Sheets.
//
// COST: the fields that matter here - rating, userRatingCount, websiteUri,
// nationalPhoneNumber, priceLevel - are all Enterprise-tier, which gets 1,000
// free calls a month (not 5,000). Past that it is roughly $0.035/call. The
// default cap keeps a run inside the free allowance; raise it deliberately.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { requireApiKey, redact } from './env.mjs';
import { serialise } from './csv.mjs';
import { writeAtomic } from './preserve.mjs';

const DIR = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(DIR, 'output');
const CACHE_PATH = join(DIR, '.google-cache.json');

// Free Enterprise allowance is 1,000/month. Staying just under it means a full
// run never surprises you with a bill.
const MAX_CALLS = 950;
const PACE_MS = 150;          // ~400/min, well under the 600/min limit
const SAVE_EVERY = 25;        // checkpoint the cache so an interrupt loses little
const BIAS_RADIUS_M = 300;    // search near the OSM coords, not city-wide

// Every field below is Enterprise-tier or lower, so the whole request bills at
// Enterprise. Adding atmosphere fields (reservable, delivery, servesBreakfast,
// dineIn...) moves it to a dearer SKU again - useful for judging the bookings
// and ordering pitch, but opt into that knowingly.
const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.primaryTypeDisplayName',
  'places.types',
  'places.businessStatus',
  'places.googleMapsUri',
  'places.rating',
  'places.userRatingCount',
  'places.websiteUri',
  'places.nationalPhoneNumber',
  'places.priceLevel',
  'places.regularOpeningHours.openNow',
  'places.regularOpeningHours.weekdayDescriptions',
].join(',');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const limitArg = args.indexOf('--limit');
const limit = limitArg !== -1 ? parseInt(args[limitArg + 1], 10) : MAX_CALLS;

const key = requireApiKey();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// --- data in ----------------------------------------------------------------

const venuesPath = join(OUT_DIR, 'venues.json');
if (!existsSync(venuesPath)) {
  console.error('No output/venues.json - run "node fetch-venues.mjs" first.');
  process.exit(1);
}
const venues = JSON.parse(readFileSync(venuesPath, 'utf8'));
const cache = existsSync(CACHE_PATH) ? JSON.parse(readFileSync(CACHE_PATH, 'utf8')) : {};

// Cached venues cost nothing, so a re-run only ever pays for what is new.
const todo = venues.filter((v) => v.osm_url && !cache[v.osm_url]);

console.log(`venues            ${venues.length}`);
console.log(`already enriched  ${venues.length - todo.length}`);
console.log(`not yet enriched  ${todo.length}`);

const willFetch = Math.min(todo.length, limit);
console.log(`
this run would call Google ${willFetch} times`);
if (willFetch > 1000) {
  console.log(`  WARNING: over the 1,000/month free Enterprise allowance.`);
  console.log(`  roughly $${((willFetch - 1000) * 0.035).toFixed(2)} for the excess.`);
} else {
  console.log(`  inside the 1,000/month free Enterprise allowance - no charge.`);
}

if (dryRun) {
  console.log('\n--dry-run: nothing called, nothing spent.');
  process.exit(0);
}

// --- fetch ------------------------------------------------------------------

const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

async function lookup(v) {
  const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify({
      textQuery: [v.name, v.address, v.suburb, 'SA'].filter(Boolean).join(' '),
      maxResultCount: 1,
      // Bias to the OSM coordinates so a common name like "Roma" matches the
      // venue on this street, not one across town.
      locationBias: {
        circle: { center: { latitude: +v.lat, longitude: +v.lon }, radius: BIAS_RADIUS_M },
      },
    }),
  });

  if (!res.ok) {
    const body = redact(await res.text(), key);
    throw new Error(`HTTP ${res.status} ${body.slice(0, 300)}`);
  }
  return (await res.json()).places?.[0] ?? null;
}

let calls = 0;
let matched = 0;
let missed = 0;

for (const v of todo.slice(0, limit)) {
  try {
    const p = await lookup(v);
    calls++;
    // Store the miss too, so a re-run doesn't pay to look it up again.
    cache[v.osm_url] = p ? { ...p, _fetched: new Date().toISOString().slice(0, 10) }
                         : { _none: true, _fetched: new Date().toISOString().slice(0, 10) };
    if (p) matched++; else missed++;
  } catch (err) {
    console.error(`\n  ${v.name}: ${err.message}`);
    // A quota or auth failure will hit every subsequent call - stop rather than
    // burn through the remaining allowance repeating it.
    if (/HTTP (401|403|429)/.test(err.message)) {
      console.error('  stopping early - fix the above, cached progress is kept.');
      break;
    }
  }

  if (calls % SAVE_EVERY === 0) {
    writeFileSync(CACHE_PATH, JSON.stringify(cache), 'utf8');
    process.stdout.write(`\r  ${calls}/${willFetch} called, ${matched} matched, ${missed} no match`);
  }
  await sleep(PACE_MS);
}
writeFileSync(CACHE_PATH, JSON.stringify(cache), 'utf8');
console.log(`\r  ${calls}/${willFetch} called, ${matched} matched, ${missed} no match          `);

// --- merge and write --------------------------------------------------------

const PRICE = { PRICE_LEVEL_FREE: '0', PRICE_LEVEL_INEXPENSIVE: '$', PRICE_LEVEL_MODERATE: '$$', PRICE_LEVEL_EXPENSIVE: '$$$', PRICE_LEVEL_VERY_EXPENSIVE: '$$$$' };

for (const v of venues) {
  const g = cache[v.osm_url];
  if (!g || g._none) {
    v.g_match = g ? 'no match' : 'not looked up';
    continue;
  }
  // Flag how confident the name match is. This is information, not a filter -
  // a "check" row may well be correct, it just deserves a glance.
  const a = norm(v.name);
  const b = norm(g.displayName?.text);
  v.g_match = a === b ? 'exact' : (a.includes(b) || b.includes(a) ? 'partial' : 'check');

  v.g_name = g.displayName?.text ?? '';
  v.g_status = g.businessStatus ?? '';
  v.g_rating = g.rating ?? '';
  v.g_reviews = g.userRatingCount ?? '';
  v.g_website = g.websiteUri ?? '';
  v.g_phone = g.nationalPhoneNumber ?? '';
  v.g_price = PRICE[g.priceLevel] ?? '';
  v.g_type = g.primaryTypeDisplayName?.text ?? '';
  v.g_address = g.formattedAddress ?? '';
  v.g_open_now = g.regularOpeningHours?.openNow ?? '';
  v.g_hours = (g.regularOpeningHours?.weekdayDescriptions ?? []).join(' | ');
  v.g_maps_url = g.googleMapsUri ?? '';
  v.g_place_id = g.id ?? '';
}

// Google's website field is far better populated than OSM's, so classify it the
// same way - but keep both columns rather than overwriting.
const HOSTS = [
  [['ubereats.', 'doordash.', 'menulog.', 'deliveroo.', 'order.online', 'hey-you.', 'mryum.', 'bopple.'], 'marketplace-only'],
  [['facebook.', 'instagram.', 'linktr.ee', 'linktree.', 'business.site', 'sites.google.'], 'social-only'],
  [['wix.', 'wixsite.', 'squarespace.', 'weebly.', 'godaddysites.', 'webnode.', 'jimdo.', 'shopify.'], 'diy-builder'],
];
for (const v of venues) {
  if (!v.g_website) { v.g_website_class = v.g_match === 'not looked up' ? '' : 'no website'; continue; }
  const host = v.g_website.toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
  v.g_website_class = HOSTS.find(([hosts]) => hosts.some((h) => host.includes(h)))?.[1] ?? 'has own site';
}

const OSM_COLS = ['tier', 'strip_rank', 'strip', 'strip_size', 'nearest_strip', 'nearest_strip_m',
  'name', 'type', 'cuisine', 'suburb', 'street', 'address', 'website_class', 'website', 'phone',
  'opening_hours', 'outdoor_seating', 'takeaway', 'delivery', 'last_edit', 'last_edit_years',
  'footprint_m2', 'lat', 'lon', 'osm_url', 'google_url'];
const G_COLS = ['g_match', 'g_status', 'g_reviews', 'g_rating', 'g_website_class', 'g_website',
  'g_phone', 'g_price', 'g_type', 'g_name', 'g_address', 'g_open_now', 'g_hours', 'g_maps_url',
  'g_place_id'];
const COLS = [...OSM_COLS, ...G_COLS, 'status', 'notes'];

writeAtomic(join(OUT_DIR, 'venues-enriched.csv'), serialise(venues, COLS));
writeAtomic(join(OUT_DIR, 'venues-enriched.json'), JSON.stringify(venues, null, 2));

// --- what you now have ------------------------------------------------------

const done = venues.filter((v) => v.g_match && v.g_match !== 'not looked up');
const count = (fn) => done.filter(fn).length;

console.log(`
Enriched ${done.length} of ${venues.length} venues. Nothing was dropped.

  Trading status
    operational        ${count((v) => v.g_status === 'OPERATIONAL')}
    permanently closed ${count((v) => v.g_status === 'CLOSED_PERMANENTLY')}
    temporarily closed ${count((v) => v.g_status === 'CLOSED_TEMPORARILY')}

  Web presence (Google)
    no website         ${count((v) => v.g_website_class === 'no website')}
    marketplace only   ${count((v) => v.g_website_class === 'marketplace-only')}
    social only        ${count((v) => v.g_website_class === 'social-only')}
    DIY builder        ${count((v) => v.g_website_class === 'diy-builder')}
    own site           ${count((v) => v.g_website_class === 'has own site')}

  Review count (your size proxy)
    under 50           ${count((v) => v.g_reviews !== '' && v.g_reviews < 50)}
    50-199             ${count((v) => v.g_reviews >= 50 && v.g_reviews < 200)}
    200-499            ${count((v) => v.g_reviews >= 200 && v.g_reviews < 500)}
    500+               ${count((v) => v.g_reviews >= 500)}

  Name match quality
    exact              ${count((v) => v.g_match === 'exact')}
    partial            ${count((v) => v.g_match === 'partial')}
    worth a check      ${count((v) => v.g_match === 'check')}
    no match found     ${count((v) => v.g_match === 'no match')}

Wrote output/venues-enriched.csv`);

const left = venues.length - done.length;
if (left) console.log(`\n${left} venues still un-enriched. Re-run to continue - cached venues cost nothing.`);
