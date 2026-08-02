// One-off diagnostic: how old is the OSM data behind the prospect list?
//
// OSM has no "permanently closed" field. When a venue shuts, someone has to
// notice and edit the map. This measures how long ago each venue was last
// touched, which is the closest free proxy for "might not exist any more".

import { BBOX, AMENITIES, SHOPS, USER_AGENT } from './config.mjs';

const [S, W, N, E] = BBOX;
const BOX = `${S},${W},${N},${E}`;

const query = `
[out:json][timeout:300];
(
  nwr["amenity"~"^(${AMENITIES.join('|')})$"]["name"](${BOX});
  nwr["shop"~"^(${SHOPS.join('|')})$"]["name"](${BOX});
);
out center tags meta;`;

const res = await fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': USER_AGENT },
  body: new URLSearchParams({ data: query }),
});
if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`);
const els = (await res.json()).elements;

const YEAR = 365 * 24 * 3600 * 1000;
const now = Date.now();
const ages = els.map((e) => (now - Date.parse(e.timestamp)) / YEAR).sort((a, b) => a - b);

console.log(`venues with edit metadata: ${ages.length}\n`);
for (const [lo, hi, label] of [[0, 1, '< 1 year'], [1, 2, '1-2 years'], [2, 3, '2-3 years'],
  [3, 5, '3-5 years'], [5, 8, '5-8 years'], [8, 99, '8+ years']]) {
  const n = ages.filter((a) => a >= lo && a < hi).length;
  console.log(`  ${label.padEnd(12)}${String(n).padStart(5)}  ${'#'.repeat(Math.round(n / 25))}`);
}

console.log(`
  median last edit : ${ages[Math.floor(ages.length / 2)].toFixed(1)} years ago
  untouched 3+ yrs : ${ages.filter((a) => a >= 3).length}
  untouched 5+ yrs : ${ages.filter((a) => a >= 5).length}`);

// Does anyone in Adelaide actually tag closures?
const closedTag = els.filter((e) => Object.keys(e.tags).some((k) => /^(disused|abandoned|was|removed):/.test(k)));
console.log(`  explicitly tagged disused/abandoned: ${closedTag.length}`);
