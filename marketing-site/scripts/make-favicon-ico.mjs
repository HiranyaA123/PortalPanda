// Builds public/favicon.ico from the 192px PNG mark.
//
// Google crawls /favicon.ico by default and historically ignores SVG-only
// favicons, which is why search results fall back to a generic globe. The ICO
// container has allowed PNG-compressed entries since Vista, so we can wrap the
// existing PNG rather than pulling in an image-encoding dependency.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = join(root, 'public', 'centralpass-mark-192.png');
const target = join(root, 'public', 'favicon.ico');

const png = readFileSync(source);

// PNG dimensions live at bytes 16-23 of the IHDR chunk.
const width = png.readUInt32BE(16);
const height = png.readUInt32BE(20);
if (width > 256 || height > 256) {
  throw new Error(`ICO entries cap at 256px; source is ${width}x${height}`);
}

const ICONDIR = 6;
const ICONDIRENTRY = 16;

const header = Buffer.alloc(ICONDIR);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type 1 = icon
header.writeUInt16LE(1, 4); // one image

const entry = Buffer.alloc(ICONDIRENTRY);
entry.writeUInt8(width === 256 ? 0 : width, 0); // 0 encodes 256
entry.writeUInt8(height === 256 ? 0 : height, 1);
entry.writeUInt8(0, 2); // palette colours
entry.writeUInt8(0, 3); // reserved
entry.writeUInt16LE(1, 4); // colour planes
entry.writeUInt16LE(32, 6); // bits per pixel
entry.writeUInt32LE(png.length, 8); // payload size
entry.writeUInt32LE(ICONDIR + ICONDIRENTRY, 12); // payload offset

writeFileSync(target, Buffer.concat([header, entry, png]));
console.log(`favicon.ico written (${width}x${height}, ${png.length} bytes payload)`);
