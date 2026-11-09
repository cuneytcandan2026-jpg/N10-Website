import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// One canonical host so search engines don't index www and non-www as
// duplicates. Must match the <link rel="canonical"> tags and sitemap.xml.
const CANONICAL_HOST = 'n10academy.co.uk';

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
};

function redirect(res, location) {
  res.writeHead(301, { Location: location });
  res.end();
}

function sendNotFound(res) {
  fs.readFile(path.join(__dirname, '404.html'), (err, body) => {
    res.writeHead(404, { 'Content-Type': mime['.html'] });
    res.end(err ? '404 Not Found' : body);
  });
}

http.createServer((req, res) => {
  const [rawPath, rawQuery] = req.url.split('?');
  const query = rawQuery ? `?${rawQuery}` : '';

  // www.n10academy.co.uk → n10academy.co.uk (path and query preserved).
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '')
    .split(',')[0].trim().toLowerCase().replace(/:\d+$/, '');
  if (host === `www.${CANONICAL_HOST}`) {
    redirect(res, `https://${CANONICAL_HOST}${rawPath}${query}`);
    return;
  }

  let urlPath;
  try {
    urlPath = decodeURIComponent(rawPath);
  } catch {
    res.writeHead(400);
    res.end('400 Bad Request');
    return;
  }

  // /index.html duplicates the homepage.
  if (urlPath === '/index.html') {
    redirect(res, `/${query}`);
    return;
  }

  const filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
  // path.join resolves "..", so never serve anything outside the project.
  if (filePath !== __dirname && !filePath.startsWith(__dirname + path.sep)) {
    res.writeHead(403);
    res.end('403 Forbidden');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mime[ext] || 'application/octet-stream';

  // Only publish the site itself: root-level pages/robots/sitemap and the
  // public/ asset folder. Project files (README, CLAUDE.md, package.json,
  // server code, notes, backups) must not be reachable or indexable.
  const rel = path.relative(__dirname, filePath).split(path.sep);
  const isRootPage = rel.length === 1 && !rel[0].startsWith('.') && ['.html', '.txt', '.xml', ''].includes(ext);
  const isPublicAsset = rel[0] === 'public' && rel.length > 1 && !rel.some(p => p.startsWith('.'));
  if (urlPath !== '/' && !isRootPage && !isPublicAsset) {
    sendNotFound(res);
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      if (err && err.code !== 'ENOENT') {
        res.writeHead(500);
        res.end('500 Server Error');
        return;
      }
      // Extensionless page URLs (/programmes) → the canonical .html page.
      if (!ext && /^\/[a-z0-9-]+\/?$/i.test(urlPath)) {
        const page = urlPath.replace(/^\/|\/$/g, '');
        fs.stat(path.join(__dirname, `${page}.html`), (pageErr, pageStat) => {
          if (!pageErr && pageStat.isFile()) redirect(res, `/${page}.html${query}`);
          else sendNotFound(res);
        });
        return;
      }
      sendNotFound(res);
      return;
    }

    const range = req.headers.range;
    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : stat.size - 1;

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': end - start + 1,
        'Content-Type': contentType,
      });
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
    });
    fs.createReadStream(filePath).pipe(res);
  });
}).listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
