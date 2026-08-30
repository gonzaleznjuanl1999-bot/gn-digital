// ============================================================
// routes/upload.js · Subida de imágenes a Supabase Storage (gn-media)
//   POST /api/upload  (requireAdmin)  body: { data: base64, type }
//   → { ok, url, name }
// Sin Supabase → guarda en el store (gn:img:{key}) y sirve por
// /api/uploaded/:key. El bucket se crea automáticamente al arrancar.
// ============================================================
'use strict';
const express = require('express');
const crypto = require('crypto');
const auth = require('../lib/auth');

const SUPABASE_URL = String(process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
const SERVICE_ROLE = String(process.env.SUPABASE_SERVICE_ROLE || '').trim();
const BUCKET = String(process.env.SUPABASE_STORAGE_BUCKET || 'gn-media').trim();
const MAX_B64 = 7 * 1024 * 1024;      // ~5 MB reales en base64
const MAX_BYTES = 5.5 * 1024 * 1024;

const MIME_EXT = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

// Crea el bucket público una sola vez por proceso (idempotente).
let bucketPromise = null;
function ensureBucket() {
  if (!SUPABASE_URL || !SERVICE_ROLE) return Promise.resolve(false);
  if (!bucketPromise) {
    bucketPromise = (async () => {
      try {
        const r = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + SERVICE_ROLE, apikey: SERVICE_ROLE, 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
        });
        return r.ok || r.status === 409; // 409 = ya existe
      } catch (e) {
        bucketPromise = null;
        return false;
      }
    })();
  }
  return bucketPromise;
}

function register(store) {
  const router = express.Router();

  router.get('/uploaded/:key', async (req, res) => {
    const key = String(req.params.key || '').replace(/[^a-zA-Z0-9_-]/g, '');
    if (!key) return res.status(400).json({ error: 'bad_key' });
    try {
      const row = await store.get('gn:img:' + key);
      if (!row) return res.status(404).json({ error: 'not_found' });
      const buf = Buffer.from(String(row.b || ''), 'base64');
      if (!buf.length) return res.status(404).json({ error: 'not_found' });
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Content-Type', String(row.t || 'image/jpeg'));
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.send(buf);
    } catch (e) {
      res.status(500).json({ error: 'server_error' });
    }
  });

  router.post('/upload', express.json({ limit: '8mb' }), auth.requireAdmin, async (req, res) => {
    const b = req.body || {};
    const raw = String(b.data || '');
    if (!raw) return res.status(400).json({ error: 'missing_data' });
    if (raw.length > MAX_B64) return res.status(400).json({ error: 'too_large' });
    const type = String(b.type || '').toLowerCase();
    if (!MIME_EXT[type]) return res.status(400).json({ error: 'bad_type' });

    const base64 = raw.replace(/^data:[^;]+;base64,/, '');
    if (!/^[A-Za-z0-9+/=\r\n]+$/.test(base64)) return res.status(400).json({ error: 'bad_data' });
    const buf = Buffer.from(base64, 'base64');
    if (!buf.length || buf.length > MAX_BYTES) return res.status(400).json({ error: 'bad_data' });

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      // Sin Supabase → imagen en el store, servida por /api/uploaded/:key
      const key = crypto.randomBytes(8).toString('hex');
      try {
        await store.set('gn:img:' + key, { t: type, b: base64 });
        const url = `${req.protocol}://${req.get('host')}/api/uploaded/${key}`;
        return res.json({ ok: true, url, name: key, storage: 'db' });
      } catch (e) {
        return res.status(502).json({ error: 'upload_failed', detail: String((e && e.message) || e).slice(0, 200) });
      }
    }

    const ext = MIME_EXT[type];
    const name = 'img_' + Date.now().toString(36) + '_' + crypto.randomBytes(4).toString('hex') + '.' + ext;
    try {
      const up = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${name}`, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + SERVICE_ROLE, apikey: SERVICE_ROLE, 'Content-Type': type, 'x-upsert': 'false' },
        body: buf,
      });
      if (!up.ok) {
        const detail = String(await up.text().catch(() => '')).slice(0, 200);
        return res.status(502).json({ error: 'upload_failed', detail: detail || 'Supabase Storage rechazó la subida' });
      }
      const url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${name}`;
      res.json({ ok: true, url, name });
    } catch (e) {
      res.status(502).json({ error: 'upload_failed', detail: String((e && e.message) || e).slice(0, 200) });
    }
  });

  return router;
}

module.exports = { register, ensureBucket };
