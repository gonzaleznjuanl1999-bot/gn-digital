// ============================================================
// routes/content.js · API de contenido del CMS
//   GET  /api/content           → { key: data } (público)
//   GET  /api/content/:key      → { key, data } (público)
//   PUT  /api/content/:key      → upsert (admin)
//   POST /api/content/:key/reset→ restaura el seed (admin)
//   GET  /api/content/meta      → marcas de tiempo (público, ligero)
// ============================================================
'use strict';
const express = require('express');
const auth = require('../lib/auth');
const seedLib = require('../lib/seed');

const MAX_BODY = 256 * 1024; // ~250 KB por sección

function register(database) {
  const router = express.Router();

  async function readKey(key) {
    const row = await database.get('SELECT data FROM gn_content WHERE key = ?', [key]);
    if (!row) return null;
    try { return JSON.parse(row.data); } catch (e) { return null; }
  }

  router.get('/content', async (req, res) => {
    const rows = await database.all('SELECT key, data FROM gn_content');
    const out = {};
    for (const r of rows) {
      try { out[r.key] = JSON.parse(r.data); } catch (e) { /* fila corrupta */ }
    }
    res.json(out);
  });

  router.get('/content/meta', async (req, res) => {
    const rows = await database.all('SELECT key, updated_at FROM gn_content');
    const out = {};
    for (const r of rows) out[r.key] = r.updated_at;
    res.json(out);
  });

  router.get('/content/:key', async (req, res) => {
    const key = String(req.params.key || '').replace(/[^a-zA-Z0-9_-]/g, '');
    if (!key) return res.status(400).json({ error: 'bad_key' });
    const data = await readKey(key);
    if (data === null) return res.status(404).json({ error: 'not_found' });
    res.json({ key, data });
  });

  router.put('/content/:key', express.json({ limit: '1mb' }), auth.requireAdmin, async (req, res) => {
    const key = String(req.params.key || '').replace(/[^a-zA-Z0-9_-]/g, '');
    if (!key) return res.status(400).json({ error: 'bad_key' });
    const data = req.body && req.body.data;
    if (data === undefined || data === null) return res.status(400).json({ error: 'missing_data' });
    const raw = JSON.stringify(data);
    if (raw.length > MAX_BODY) return res.status(400).json({ error: 'too_large' });
    if (!(key in seedLib.DEFAULT_CONTENT)) return res.status(404).json({ error: 'unknown_section' });
    await database.run(
      'INSERT INTO gn_content (key, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at',
      [key, raw, new Date().toISOString()]
    );
    res.json({ ok: true, key });
  });

  router.post('/content/:key/reset', auth.requireAdmin, async (req, res) => {
    const key = String(req.params.key || '').replace(/[^a-zA-Z0-9_-]/g, '');
    if (!key) return res.status(400).json({ error: 'bad_key' });
    if (!(key in seedLib.DEFAULT_CONTENT)) return res.status(404).json({ error: 'unknown_section' });
    await database.run(
      'INSERT INTO gn_content (key, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at',
      [key, JSON.stringify(seedLib.DEFAULT_CONTENT[key]), new Date().toISOString()]
    );
    res.json({ ok: true, key });
  });

  return router;
}

module.exports = { register };
