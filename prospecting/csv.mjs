// Minimal CSV read/write. Handles quoted fields, embedded commas, embedded
// newlines and escaped quotes - which matters because venue names and your own
// notes will contain all four.

export function serialise(rows, columns) {
  const esc = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [columns.join(','), ...rows.map((r) => columns.map((c) => esc(r[c])).join(','))].join('\n');
}

function parseRows(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } // escaped quote
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

export function parse(text) {
  const rows = parseRows(text).filter((r) => r.some((c) => c !== ''));
  if (rows.length < 2) return { header: rows[0] || [], records: [] };
  const [header, ...body] = rows;
  return {
    header,
    records: body.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? '']))),
  };
}
