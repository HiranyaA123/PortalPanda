# CentralPass prospecting — phase 1 (OpenStreetMap)

Pulls every named hospitality venue in Adelaide metro, drops the ones that are
never going to buy, and groups the rest into walkable strips.

Free, no API key, no billing.

```bash
node fetch-venues.mjs
```

Takes about a minute. Writes to `output/`:

| File | What it's for |
|---|---|
| `venues.csv` | The working list. Sorted by strip size, then by how weak their web presence looks. |
| `strips.csv` | Session planner — one row per strip, biggest first, with a Maps link to the centre of it. |
| `venues.json` | Same as the CSV, for the phase-2 Google enrichment to read. |

## Current numbers

```
2553 venues pulled
 -372 chains dropped
 -180 shopping-centre tenancies dropped
 2001 kept

 1220 in 62 strips    - 6+ venues, a full session on foot
  279 in 76 pockets   - 3-5 venues, a worthwhile stop
  502 on their own    - tagged with nearest strip + distance
```

Expect the totals to move by 1-2% between runs. Overpass mirrors sync from OSM
at different intervals and disagree slightly on how many venues exist; the
script sticks to one mirror per run so venues and shopping centres always come
from the same snapshot, but which mirror is reachable varies.

Venue types covered: restaurant, cafe, fast_food, pub, bar, ice_cream, bakery,
pastry, deli, coffee, confectionery, chocolate, tea. Note that OSM tags bakeries
and delis as `shop=*`, not `amenity=*` — an amenity-only pull misses 153
Adelaide bakeries.

## Re-running is safe

Everything derived from OSM is rebuilt on every run. Everything *you* type is
carried across, matched on `osm_url`:

- `status` and `notes` are always preserved.
- Any column you add yourself in Sheets is detected and preserved too — add an
  `owner_name` column, re-run, it survives.
- A venue you've worked on that disappears from a later OSM pull isn't dropped.
  It's kept and flagged in a `carried_over` column so you don't silently lose
  the note.
- The previous file is copied to `venues.csv.bak` first, and the new one is
  written to a temp file then renamed, so an interrupted run can't leave you
  with a half-written sheet.

The one case it can't follow: if someone re-maps a venue in OSM from a node to
a building outline, its ID changes and it reads as a new venue. Rare, and the
old row is carried over rather than lost.

**Workflow:** export your sheet back over `output/venues.csv` before re-running,
or keep your notes in the file directly. Notes that only exist in Google Sheets
and never come back to the CSV can't be preserved.

## What it filters, and how

**Chains** — dropped if OSM has a `brand`/`brand:wikidata` tag, or the name
matches the list in `config.mjs`. Head office buys the software, not the store,
so there's nobody on site to pitch.

**Shopping centres** — every `shop=mall` polygon in the bbox is pulled with full
geometry, and any venue falling inside one (plus a 60m buffer) is dropped.
This is geometric, not a hardcoded list of centre names, so it keeps working as
new centres get mapped. A name-based check catches food-court tenancies mapped
as bare nodes outside their centre's footprint.

**Strips** — DBSCAN over the coordinates: venues within 150m chain together,
6+ makes a strip. Address tags are *not* used for grouping, because only 17% of
Adelaide venues carry `addr:suburb` — grouping on address threw away five sixths
of the data. Anything over 60 venues is re-clustered tighter, which is what
breaks the CBD into Peel / Leigh / Gouger / Waymouth rather than one 365-venue
blob. Strips with no address tags at all are named by reverse-geocoding the
centroid through Nominatim (cached in `.geocode-cache.json`).

**Everything not in a strip** goes through two more passes, so nothing is left
as an undifferentiated pile:

1. *Absorb* — a venue within 400m of a strip joins that strip's session; you'd
   walk past it anyway. This repeats with a decaying radius, because a venue
   25m from a just-absorbed venue is obviously part of the same walk, and a
   single pass never reconsiders it. The decay stops one strip chaining across
   the suburbs in 400m hops.
2. *Pocket* — what's left is re-clustered at 3+ venues. Three cafes on a
   suburban corner is a real stop, just not a whole afternoon.

Whatever is still alone gets a `nearest_strip` and `nearest_strip_m`, so a
single reads as "600m off Prospect Road, easy detour" rather than "isolated".
The `tier` column is `strip`, `pocket` or `single`, and the CSV is sorted so it
reads top-to-bottom as descending priority.

## What this does NOT tell you

Be clear about this before planning around the output:

- **Website quality is mostly unknown.** OSM has a website tag for only 27% of
  these venues. `website_class=unknown` means "OSM doesn't know", *not* "no
  website". 1,339 of 1,835 venues are unknown. This is the biggest gap.
- **There is no size signal.** OSM has no ratings or review counts. `footprint_m2`
  is populated only for venues mapped as building polygons, and it's weak.
- **Coverage is incomplete.** OSM has ~2,300 named Adelaide venues; the real
  number is higher. Newer and smaller venues are the most likely to be missing.

All three are what Google Places fixes in phase 2 — `websiteUri`,
`userRatingCount` and `priceLevel` fill exactly these gaps, and at ~200 calls
the whole metro pull sits inside the free tier.

## Tuning

Everything adjustable is in `config.mjs`: the bounding box, which amenity types
count, the chain list, strip radius and size thresholds.

Worth knowing: `MALL_NAME_HINTS` includes `arcade` and `central market`, which
also excludes some legitimate heritage-arcade venues. Drop those two entries if
you'd rather review them yourself.
