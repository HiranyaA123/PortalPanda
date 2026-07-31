// Dev utility: report which CSS class prefixes are still referenced from JSX,
// so a design-system rewrite can drop dead blocks without deleting live styles.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const used = new Set();

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!/\.(jsx|js)$/.test(name)) continue;
    const src = readFileSync(p, 'utf8');
    // className="a b c" and className={`a b ${x}`}
    for (const m of src.matchAll(/className=(?:"([^"]+)"|\{`([^`]+)`\})/g)) {
      const raw = m[1] || m[2] || '';
      raw.replace(/\$\{[^}]*\}/g, ' ').split(/\s+/).forEach((c) => c && used.add(c));
    }
    // class names passed as plain strings (e.g. className={cond ? 'x' : 'y'})
    for (const m of src.matchAll(/'([a-z][a-z0-9-]*(?:__|--)[a-z0-9-]+)'/gi)) used.add(m[1]);
  }
}
walk('src');

const css = readFileSync('src/index.css', 'utf8');
const defined = new Set();
for (const m of css.matchAll(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g)) defined.add(m[1]);

const prefixes = ['ofd', 'device', 'ph', 'marquee', 'journey', 'stage', 'jv', 'printer',
  'receipt', 'webz', 'mk', 'explorer', 'bento', 'cost', 'commitments', 'venue', 'live'];

for (const p of prefixes) {
  const def = [...defined].filter((c) => c === p || c.startsWith(`${p}-`) || c.startsWith(`${p}_`));
  const live = def.filter((c) => used.has(c));
  const verdict = live.length === 0 ? 'DEAD' : `live (${live.length}/${def.length})`;
  console.log(`${p.padEnd(12)} ${String(def.length).padStart(3)} defined  ->  ${verdict}`);
}
