// Spends exactly one API call to prove the key, the billing account and the
// key's restrictions are all set up correctly - before any bulk run.
//
//   node test-key.mjs

import { requireApiKey, redact } from './env.mjs';

const key = requireApiKey();

const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': key,
    'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.websiteUri,places.businessStatus',
  },
  body: JSON.stringify({ textQuery: 'Africola restaurant East Terrace Adelaide SA', maxResultCount: 1 }),
});

const body = await res.text();

if (!res.ok) {
  console.error(`FAILED - HTTP ${res.status}\n`);
  console.error(redact(body, key).slice(0, 900));
  console.error(`
Common causes:
  403 + "API_KEY_HTTP_REFERRER_BLOCKED"  - key is restricted to Websites.
                                           Set Application restrictions to None.
  403 + "SERVICE_DISABLED" / "not enabled" - enable Places API (New) on the project.
  403 + "PERMISSION_DENIED" on billing    - no billing account linked to the project.
  400 + "API key not valid"               - key copied wrong, or extra whitespace in .env`);
  process.exit(1);
}

const place = JSON.parse(body).places?.[0];
console.log('Key works. One call spent.\n');
if (!place) {
  console.log('  (no match returned, but the API accepted the request - that is the part that matters)');
} else {
  console.log(`  name          ${place.displayName?.text}`);
  console.log(`  address       ${place.formattedAddress}`);
  console.log(`  status        ${place.businessStatus}`);
  console.log(`  rating        ${place.rating ?? '-'} from ${place.userRatingCount ?? 0} reviews`);
  console.log(`  website       ${place.websiteUri ?? '(none)'}`);
}
console.log(`
These four fields are exactly what OSM could not tell you:
  businessStatus   -> is it permanently closed
  userRatingCount  -> how big/busy is it
  websiteUri       -> what web presence do they have`);
