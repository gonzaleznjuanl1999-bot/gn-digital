// ============================================================
// server.js · API + estáticos (GN Digital Technology)
// Arranque local: node server/server.js  →  http://localhost:8765/
// Producción:     SUPABASE_URL + SUPABASE_SERVICE_ROLE → PostgREST kv
// Serverless (Vercel): module.exports es el handler (req, res) →
// getApp() inicializa store+seed+app una sola vez por instancia.
// ============================================================
'use strict';
const path = require('path');
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');

const storeLib = require('./lib/store');
const seed = require('./lib/seed');
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const uploadRoutes = require('./routes/upload');

const PORT = Number(process.env.PORT || 8765);
const ROOT = path.join(__dirname, '..');
const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8',
};

function securityHeaders(app) {
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    const csp = process.env.GN_CSP;
    if (csp) res.setHeader('Content-Security-Policy', csp);
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });
}

function buildApp(store) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  securityHeaders(app);
  // /api/upload lleva su propio parser (hasta 8mb)
  app.use('/api', uploadRoutes.register(store));
  app.use(express.json({ limit: '2mb' }));
  app.use(cookieParser());

  app.get('/api/health', (req, res) => {
    res.json({ ok: true, db: store.kind, time: new Date().toISOString() });
  });
  app.use('/api/auth', authRoutes.register(store));
  app.use('/api', contentRoutes.register(store));

  app.get('/robots.txt', (req, res) => {
    const base = req.protocol + '://' + req.get('host');
    res.type('text/plain');
    res.send('User-agent: *\nAllow: /\n\nSitemap: ' + base + '/sitemap.xml\n');
  });
  app.get('/sitemap.xml', (req, res) => {
    const base = req.protocol + '://' + req.get('host');
    const today = new Date().toISOString().slice(0, 10);
    const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const urls = [
      { loc: base + '/', lastmod: today, prio: '1.0' },
      { loc: base + '/#contacto', lastmod: today, prio: '0.8' },
      { loc: base + '/#servicios', lastmod: today, prio: '0.8' },
      { loc: base + '/admin.html', lastmod: today, prio: '0.2' },
    ];
    const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls.map((u) => `  <url><loc>${esc(u.loc)}</loc><lastmod>${u.lastmod}</lastmod><priority>${u.prio}</priority></url>`).join('\n') +
      '\n</urlset>\n';
    res.type('application/xml');
    res.send(xml);
  });

  // ---- Estáticos ----
  app.use((req, res, next) => {
    let p = decodeURIComponent(req.path || '/');
    let rel = p.replace(/^\/+/, '');
    if (p === '/' || p === '') rel = 'index.html';
    else if (p.startsWith('/admin')) rel = 'admin.html';
    const f = path.normalize(path.join(ROOT, rel));
    if (f.startsWith(ROOT) && fs.existsSync(f) && fs.statSync(f).isFile()) {
      const ext = path.extname(f).toLowerCase();
      res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
      const alwaysRevalidate = ext === '.html';
      res.setHeader('Cache-Control', alwaysRevalidate ? 'no-cache' : 'public, max-age=3600');
      const stat = fs.statSync(f);
      const etag = '"' + stat.size.toString(16) + '-' + Math.floor(stat.mtimeMs).toString(16) + '"';
      res.setHeader('ETag', etag);
      if (req.headers['if-none-match'] === etag) return res.status(304).end();
      return fs.createReadStream(f).pipe(res);
    }
    next();
  });

  app.use((req, res) => res.status(404).json({ error: 'not_found' }));

  return app;
}

let appPromise = null;
async function getApp() {
  if (!appPromise) {
    const store = await storeLib.init();
    const seeded = await seed.seedAll(store);
    await uploadRoutes.ensureBucket();
    appPromise = buildApp(store);
    appPromise.locals.store = store;
    appPromise.locals.seeded = seeded;
  }
  return appPromise;
}

async function main() {
  const app = await getApp();
  const server = app.listen(PORT, () => {
    console.log(`[gn] http://localhost:${PORT} · store=${app.locals.store.kind}`);
  });
  return { app, server, store: app.locals.store };
}

if (require.main === module) {
  main().catch((e) => { console.error('[gn] boot failed:', e); process.exit(1); });
}

// ---- Serverless (Vercel): handler Express por petición ----
module.exports = async (req, res) => {
  const app = await getApp();
  app(req, res);
};
module.exports.main = main;
module.exports.getApp = getApp;
module.exports.buildApp = buildApp;
