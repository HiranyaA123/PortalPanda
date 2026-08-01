// Carries your own work forward across re-runs.
//
// Everything the script derives from OSM is disposable - it gets rebuilt on
// every run. What isn't disposable is what you typed: whether you've visited a
// venue, what the owner said, when to come back. Without this, re-running to
// pick up fresh OSM data would silently wipe weeks of field notes, which is the
// single thing most likely to make you abandon the spreadsheet.
//
// Venues are matched on osm_url, which is stable for a given OSM object.

import { readFileSync, writeFileSync, renameSync, existsSync, copyFileSync } from 'node:fs';
import { parse } from './csv.mjs';

// Always preserved. Any other column you add yourself in Sheets is detected and
// preserved too - see extraColumns below.
const OWNED_FIELDS = ['status', 'notes'];
const DEFAULT_STATUS = 'not visited';

const hasWork = (r) =>
  OWNED_FIELDS.some((f) => (r[f] || '').trim() && r[f] !== DEFAULT_STATUS);

export function loadPrevious(csvPath, knownColumns) {
  if (!existsSync(csvPath)) return null;

  const { header, records } = parse(readFileSync(csvPath, 'utf8'));
  if (!records.length) return null;

  // Columns you added in Sheets that the script doesn't generate. Preserved and
  // appended to the output so your own fields survive a refresh.
  const extraColumns = header.filter((h) => !knownColumns.includes(h));

  const byOsmUrl = new Map();
  for (const r of records) if (r.osm_url) byOsmUrl.set(r.osm_url, r);

  return { records, byOsmUrl, extraColumns, path: csvPath };
}

export function applyPrevious(venues, previous) {
  if (!previous) return { restored: 0, carried: [], extraColumns: [] };

  const fields = [...OWNED_FIELDS, ...previous.extraColumns];
  let restored = 0;

  for (const v of venues) {
    const old = previous.byOsmUrl.get(v.osm_url);
    if (!old) continue;
    for (const f of fields) if ((old[f] || '').trim()) v[f] = old[f];
    if (hasWork(old)) restored++;
  }

  // A venue you've worked on can vanish from a later pull - OSM edits happen,
  // a venue gets retagged, or it closes. Dropping the row would lose the notes,
  // so it's carried over and flagged instead.
  const stillPresent = new Set(venues.map((v) => v.osm_url));
  const carried = previous.records
    .filter((r) => hasWork(r) && !stillPresent.has(r.osm_url))
    .map((r) => ({ ...r, strip: r.strip || '', carried_over: 'no longer in OSM pull' }));

  return { restored, carried, extraColumns: previous.extraColumns };
}

// Keep one backup before overwriting, so a bad run is always recoverable.
export function backup(csvPath) {
  if (existsSync(csvPath)) copyFileSync(csvPath, `${csvPath}.bak`);
}

// Write via a temp file and rename, so the sheet holding your field notes is
// never left half-written if the run dies partway through. Rename is atomic on
// the same volume: venues.csv is either the old file or the new one, never a
// truncated mix of both.
export function writeAtomic(path, contents) {
  const tmp = `${path}.tmp`;
  writeFileSync(tmp, contents, 'utf8');
  renameSync(tmp, path);
}
