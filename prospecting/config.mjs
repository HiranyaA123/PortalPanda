// Tunable settings for the prospect pull. Edit this file, not fetch-venues.mjs.

// Adelaide metro bounding box: south, west, north, east.
// Roughly Sellicks Beach up to Gawler, coast across to the Hills face.
export const BBOX = [-35.25, 138.45, -34.70, 138.85];

// OSM tags food venues by two different keys, and you need both. Sit-down and
// counter-service places are amenity=*, but bakeries, delis and ice cream shops
// are shop=* - so an amenity-only pull silently misses 153 Adelaide bakeries.
export const AMENITIES = ['cafe', 'restaurant', 'fast_food', 'bar', 'pub', 'ice_cream'];

// Counter-service food: same shape as a cafe, same pitch.
export const SHOPS = ['bakery', 'pastry', 'deli', 'coffee', 'confectionery', 'chocolate', 'tea'];

// Food retail rather than hospitality - a butcher wants online ordering but has
// no kitchen display, no bookings and no table service, so most of the system
// doesn't apply. Add them here if you want to try that segment anyway:
//   'butcher' (56), 'greengrocer' (32), 'seafood' (18)
//
// Deliberately excluded: nightclub and biergarten (not a food-ordering pitch),
// and food_court (always inside a centre, which is disqualified anyway).

// Mirrors are tried in order - the main endpoint rate-limits under load.
// Don't add overpass.osm.ch: it only carries Switzerland and returns 0 results
// for Adelaide without erroring, which looks like an empty city.
export const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

// Overpass returns 406 without a User-Agent. Their etiquette guide asks for a
// contact address so they can reach you instead of silently blocking.
export const USER_AGENT = 'CentralPass-Prospecting/1.0 (centralpassinfo@gmail.com)';

// Chains and franchises. A venue matching any of these is dropped: head office
// buys the software, not the store, so there's no one on site to pitch.
export const CHAINS = [
  "mcdonald", 'kfc', 'hungry jack', 'subway', 'domino', 'pizza hut', 'red rooster',
  'nando', 'oporto', 'grill\'d', 'guzman', 'zambrero', 'schnitz', 'roll\'d',
  'sushi hub', 'sushi sushi', 'boost juice', 'chatime', 'gong cha', 'starbucks',
  'gloria jean', 'coffee club', 'muffin break', 'bakers delight', 'brumby',
  'donut king', 'krispy kreme', 'san churro', 'cibo espresso', 'hudsons coffee',
  'zarraffa', 'jamaica blue', 'the standard', 'noodle box', 'mad mex',
  'betty\'s burgers', 'burger urge', 'carl\'s jr', 'taco bell', 'wendy\'s',
  'baskin', 'cold rock', 'new york slice', 'la porchetta', 'crust pizza',
  'eagle boys', 'pizza capers', 'chicken treat', 'lord of the fries',
];

// Venue names containing these are almost always food-court or centre tenancies
// that the mall polygon check missed.
export const MALL_NAME_HINTS = [
  'westfield', 'food court', 'shopping centre', 'shopping center', 'plaza',
  'marketplace', 'harbour town', 'central market', 'arcade',
];

// Domains that mean "no real website" rather than "has a website".
export const SOCIAL_HOSTS = ['facebook.', 'instagram.', 'linktr.ee', 'linktree.', 'wixsite.', 'business.site', 'sites.google.'];
export const MARKETPLACE_HOSTS = ['ubereats.', 'doordash.', 'menulog.', 'deliveroo.', 'order.online', 'hey-you.', 'mryum.', 'bopple.'];
export const BUILDER_HOSTS = ['wix.', 'squarespace.', 'weebly.', 'godaddysites.', 'webnode.', 'jimdo.', 'shopify.'];

// Strip detection. Venues within STRIP_RADIUS_M of each other chain together
// into one strip; a strip needs STRIP_MIN_VENUES to be worth a session.
// 150m is about two shopfront blocks - tight enough that two sides of one
// road join up, loose enough that a gap for a servo doesn't split a strip.
export const STRIP_RADIUS_M = 150;
export const STRIP_MIN_VENUES = 6;

// A continuously dense area (the CBD) chains into one huge cluster. Anything
// over this gets re-clustered tighter until the pieces are one-session sized.
export const STRIP_MAX_VENUES = 60;

// A venue this close to a strip is part of that session - you'd walk past it -
// even if it wasn't dense enough to join the cluster on its own. Absorbing is
// done as a separate pass rather than just widening STRIP_RADIUS_M, because a
// wider radius also lets separate strips chain into each other.
export const ABSORB_RADIUS_M = 400;

// Venues left over after absorbing still cluster into small pockets - three
// cafes on a suburban corner is a worthwhile stop, just not a whole session.
export const POCKET_MIN_VENUES = 3;

// Metres of slack around a mall polygon when excluding centre tenancies.
export const MALL_BUFFER_M = 60;
