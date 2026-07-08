import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));

const dimCache = new Map();

async function getDims(srcPath) {
  if (dimCache.has(srcPath)) return dimCache.get(srcPath);
  const abs = path.join(root, decodeURIComponent(srcPath));
  if (!fs.existsSync(abs)) {
    console.warn('MISSING', srcPath);
    return null;
  }
  const meta = await sharp(abs).metadata();
  const dims = { width: meta.width, height: meta.height };
  dimCache.set(srcPath, dims);
  return dims;
}

const imgTagRe = /<img\b[^>]*>/g;
const srcRe = /\bsrc="([^"]+)"/;

for (const file of htmlFiles) {
  const filePath = path.join(root, file);
  let html = fs.readFileSync(filePath, 'utf8');
  const matches = [...html.matchAll(imgTagRe)];
  let changed = false;

  for (const m of matches) {
    const tag = m[0];
    if (/\bwidth=/.test(tag) || /\bheight=/.test(tag)) continue;
    const srcMatch = tag.match(srcRe);
    if (!srcMatch) continue;
    const src = srcMatch[1];
    if (/^https?:\/\//.test(src)) continue; // skip external (unsplash placeholders)

    const dims = await getDims(src);
    if (!dims) continue;

    const newTag = tag.replace(/<img\b/, `<img width="${dims.width}" height="${dims.height}"`);
    html = html.replace(tag, newTag);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('Updated', file);
  } else {
    console.log('No change', file);
  }
}
