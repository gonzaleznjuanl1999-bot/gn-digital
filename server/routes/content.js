// ============================================================
// routes/content.js · API de contenido del CMS
//   GET  /api/content           → { key: data } (público)
//   GET  /api/content/:key      → { key, data } (público)
//   PUT  /api/content/:key      → upsert (admin)
//   POST /api/content/:key/reset→ restaura el seed (admin)
// ============================================================
'use strict';
const express = require('express');
const auth = require('../lib/auth');
const seedLib = require('../lib/seed');

const MAX_BODY = 256 * 1024; // ~250 KB por sección

function register(store) {
  const router = express.Router();

  router.get('/content', async (req, res) => {
    res.json(await seedLib.loadAll(store));
  });

  router.get('/content/:key', async (req, res) => {
    const key = String(req.params.key || '').replace(/[^a-zA-Z0-9_-]/g, '');
    if (!key) return res.status(400).json({ error: 'bad_key' });
    const data = await seedLib.loadSection(store, key);
    if (data === null || data === undefined) return res.status(404).json({ error: 'not_found' });
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
    await seedLib.saveSection(store, key, data);
    res.json({ ok: true, key });
  });

  router.post('/content/:key/reset', auth.requireAdmin, async (req, res) => {
    const key = String(req.params.key || '').replace(/[^a-zA-Z0-9_-]/g, '');
    if (!key) return res.status(400).json({ error: 'bad_key' });
    const ok = await seedLib.resetSection(store, key);
    if (!ok) return res.status(404).json({ error: 'unknown_section' });
    res.json({ ok: true, key });
  });

  return router;
}

module.exports = { register };
