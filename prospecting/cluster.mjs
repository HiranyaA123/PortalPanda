// Groups venues into walkable strips by location.
//
// OSM address tags are too sparse to group on - only 17% of Adelaide venues
// carry addr:suburb - but every venue has coordinates. So we cluster on
// coordinates instead, which is also a truer definition of a strip: venues you
// can walk between, regardless of what street they claim to be on.
//
// DBSCAN is the right shape of algorithm here because it finds dense runs of
// venues without being told how many strips exist, and drops isolated venues
// (a suburban takeaway with nothing either side) as noise rather than forcing
// them into a group.

const M_PER_DEG_LAT = 111_320;
const mPerDegLon = (lat) => 111_320 * Math.cos((lat * Math.PI) / 180);

export function metresBetween(a, b) {
  const dy = (a.lat - b.lat) * M_PER_DEG_LAT;
  const dx = (a.lon - b.lon) * mPerDegLon(a.lat);
  return Math.hypot(dx, dy);
}

// Bucket venues into eps-sized grid cells so a neighbour lookup only scans the
// 9 cells around a point rather than every venue in the city.
function buildGrid(venues, epsM) {
  const grid = new Map();
  const latStep = epsM / M_PER_DEG_LAT;
  const lonStep = epsM / mPerDegLon(venues[0].lat);
  const cell = (v) => `${Math.floor(v.lat / latStep)}:${Math.floor(v.lon / lonStep)}`;
  venues.forEach((v, i) => {
    const k = cell(v);
    if (!grid.has(k)) grid.set(k, []);
    grid.get(k).push(i);
  });
  return (v) => {
    const r = Math.floor(v.lat / latStep);
    const c = Math.floor(v.lon / lonStep);
    const out = [];
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) out.push(...(grid.get(`${r + dr}:${c + dc}`) || []));
    }
    return out;
  };
}

const NOISE = -1;

// Returns an array of member-arrays, plus whatever stayed noise.
function dbscan(venues, epsM, minVenues) {
  if (!venues.length) return { groups: [], noise: [] };
  const near = buildGrid(venues, epsM);
  const labels = new Array(venues.length).fill(undefined);
  let id = 0;

  const neighboursOf = (i) =>
    near(venues[i]).filter((j) => j !== i && metresBetween(venues[i], venues[j]) <= epsM);

  for (let i = 0; i < venues.length; i++) {
    if (labels[i] !== undefined) continue;
    const seeds = neighboursOf(i);
    if (seeds.length + 1 < minVenues) { labels[i] = NOISE; continue; }

    labels[i] = id;
    const queued = new Set(seeds);
    for (let s = 0; s < seeds.length; s++) {
      const j = seeds[s];
      if (labels[j] === NOISE) labels[j] = id;
      if (labels[j] !== undefined) continue;
      labels[j] = id;
      const inner = neighboursOf(j);
      if (inner.length + 1 >= minVenues) {
        for (const k of inner) if (!queued.has(k)) { queued.add(k); seeds.push(k); }
      }
    }
    id++;
  }

  const groups = Array.from({ length: id }, () => []);
  const noise = [];
  labels.forEach((l, i) => (l === NOISE || l === undefined ? noise : groups[l]).push(venues[i]));
  return { groups: groups.filter((g) => g.length), noise };
}

// A continuously dense area like the Adelaide CBD chains into one giant blob -
// technically correct, but "365 venues over 2km" is not a session you can plan.
// Re-cluster anything oversized at a tighter radius until the pieces are a
// workable size. Members that fall out as noise during a split are kept by
// attaching them to their nearest sibling rather than being discarded.
function splitOversized(members, epsM, minVenues, maxVenues, depth = 0) {
  if (members.length <= maxVenues || depth >= 4) return [members];

  const tighter = epsM * 0.55;
  const { groups, noise } = dbscan(members, tighter, minVenues);
  if (groups.length < 2) return [members]; // can't break it down any further

  for (const orphan of noise) {
    let best = groups[0];
    let bestDist = Infinity;
    for (const g of groups) {
      const d = Math.min(...g.map((m) => metresBetween(orphan, m)));
      if (d < bestDist) { bestDist = d; best = g; }
    }
    best.push(orphan);
  }

  return groups.flatMap((g) => splitOversized(g, tighter, minVenues, maxVenues, depth + 1));
}

export function clusterVenues(venues, { epsM, minVenues, maxVenues = Infinity }) {
  const { groups, noise } = dbscan(venues, epsM, minVenues);
  const finalGroups = groups.flatMap((g) => splitOversized(g, epsM, minVenues, maxVenues));

  const clusters = finalGroups.map((members) => ({
    members,
    size: members.length,
    name: nameCluster(members),
    lat: members.reduce((s, v) => s + v.lat, 0) / members.length,
    lon: members.reduce((s, v) => s + v.lon, 0) / members.length,
    walkMetres: spanMetres(members),
  }));

  clusters.sort((a, b) => b.size - a.size);
  clusters.forEach((c, i) => { c.rank = i + 1; });
  return { clusters, leftovers: noise };
}

// Pulls stragglers into a strip they're within walking distance of. A cafe 300m
// off The Parade belongs in the Parade session even though it wasn't dense
// enough to cluster on its own. Returns whatever is still left over.
export function absorbStragglers(clusters, leftovers, radiusM) {
  // Absorbing has to repeat: a venue 25m from a venue that was itself just
  // absorbed is plainly part of that session, but a single pass never
  // reconsiders it. The radius decays each round so this converges quickly
  // instead of letting one strip chain in 400m hops across the suburbs.
  let remaining = leftovers;
  for (let round = 0, reach = radiusM; round < 5 && remaining.length; round++, reach *= 0.6) {
    const stillOut = [];
    for (const v of remaining) {
      let best = null;
      let bestDist = reach;
      for (const c of clusters) {
        for (const m of c.members) {
          const d = metresBetween(v, m);
          if (d <= bestDist) { bestDist = d; best = c; }
        }
      }
      if (best) best.members.push(v);
      else stillOut.push(v);
    }
    if (stillOut.length === remaining.length) break; // nothing moved, done
    remaining = stillOut;
  }
  // Sizes and spans changed, so recompute anything derived from membership -
  // including the ranking, since absorbing can reorder which strip is biggest.
  for (const c of clusters) {
    c.size = c.members.length;
    c.walkMetres = spanMetres(c.members);
    c.lat = c.members.reduce((s, v) => s + v.lat, 0) / c.size;
    c.lon = c.members.reduce((s, v) => s + v.lon, 0) / c.size;
  }
  clusters.sort((a, b) => b.size - a.size);
  clusters.forEach((c, i) => { c.rank = i + 1; });
  return remaining;
}

// For venues that aren't in a strip, which strip are they nearest and how far?
// Turns "isolated, no idea what to do with this" into "600m off Prospect Road,
// worth a detour" or "11km from anything, only if you're already out there".
export function attachNearestStrip(venues, clusters) {
  for (const v of venues) {
    let best = null;
    let bestDist = Infinity;
    for (const c of clusters) {
      for (const m of c.members) {
        const d = metresBetween(v, m);
        if (d < bestDist) { bestDist = d; best = c; }
      }
    }
    v.nearest_strip = best ? best.name : '';
    v.nearest_strip_m = best ? Math.round(bestDist) : '';
  }
}

// Name a strip after whatever its members most often claim as street/suburb.
// Sparse tags are fine: we only need a majority among those that have one.
// Clusters where nobody has a tag come back null and get reverse-geocoded.
export function nameCluster(members) {
  const top = (field) => {
    const counts = new Map();
    for (const m of members) if (m[field]) counts.set(m[field], (counts.get(m[field]) || 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  };
  const street = top('street');
  const suburb = top('suburb');
  if (street && suburb) return `${street}, ${suburb}`;
  return street || suburb || null;
}

// Longest distance across the cluster - roughly how far you'd walk end to end.
// Capped at a sample of 200 members; the exact metre doesn't matter and the
// pairwise comparison is the one genuinely quadratic step in the pipeline.
function spanMetres(members) {
  const sample = members.length > 200 ? members.filter((_, i) => i % Math.ceil(members.length / 200) === 0) : members;
  let max = 0;
  for (let i = 0; i < sample.length; i++) {
    for (let j = i + 1; j < sample.length; j++) max = Math.max(max, metresBetween(sample[i], sample[j]));
  }
  return Math.round(max);
}
