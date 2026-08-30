// ============================================================
// store.js · Almacén portátil (kv) para el CMS
//   sqlite  → local (node:sqlite, tabla gn_kv) — dev
//   rest    → Supabase PostgREST sobre la tabla kv existente
//             (con SUPABASE_SERVICE_ROLE) — producción
// API: get(key) → {ts, d} | null · set(key, value) ·
//      list(prefix) → [{key, ts, d}] · kind
// ============================================================
'use strict';

const SUPABASE_URL = String(process.env.SUPABASE_URL || '').trim().replace(/\/+$/, '');
const SERVICE_ROLE = String(process.env.SUPABASE_SERVICE_ROLE || '').trim();

function restHeaders() {
  return {
    apikey: SERVICE_ROLE,
    Authorization: 'Bearer ' + SERVICE_ROLE,
    'Content-Type': 'application/json',
  };
}

function unwrap(parsed) {
  // Tolerante: datos nuevos en envoltorio {ts,d} y filas viejas crudas
  if (parsed && typeof parsed === 'object' && 'd' in parsed && 'ts' in parsed) return parsed;
  return { ts: null, d: parsed };
}

function qs(obj) {
  const parts = [];
  for (const [k, v] of Object.entries(obj)) parts.push(encodeURIComponent(k) + '=' + encodeURIComponent(v));
  return parts.join('&');
}

function makeRest() {
  const base = SUPABASE_URL + '/rest/v1/kv';
  return {
    kind: 'rest',
    async get(key) {
      const r = await fetch(base + '?' + qs({ select: 'data', file: 'eq.' + key }), { headers: restHeaders() });
      if (!r.ok) throw new Error('kv read failed: ' + r.status);
      const rows = await r.json();
      if (!rows || !rows.length) return null;
      try { return unwrap(JSON.parse(rows[0].data)).d; } catch (e) { return null; }
    },
    async set(key, value) {
      const r = await fetch(base + '?' + qs({ on_conflict: 'file' }), {
        method: 'POST',
        headers: Object.assign(restHeaders(), { Prefer: 'resolution=merge-duplicates,return=minimal' }),
        body: JSON.stringify([{ file: key, data: JSON.stringify({ ts: new Date().toISOString(), d: value }), updated_at: new Date().toISOString() }]),
      });
      if (!r.ok) throw new Error('kv write failed: ' + r.status);
    },
    async list(prefix) {
      const r = await fetch(base + '?' + qs({ select: 'file,data', file: 'like.' + prefix + '%' }), { headers: restHeaders() });
      if (!r.ok) throw new Error('kv list failed: ' + r.status);
      const rows = await r.json();
      return (rows || []).map((row) => {
        try { const u = unwrap(JSON.parse(row.data)); return { key: row.file, ts: u.ts, d: u.d }; } catch (e) { return { key: row.file, ts: null, d: null }; }
      });
    },
    async close() {},
  };
}

function makeSqlite(db) {
  db.exec('CREATE TABLE IF NOT EXISTS gn_kv (file TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)');
  return {
    kind: 'sqlite',
    async get(key) {
      const row = db.prepare('SELECT data FROM gn_kv WHERE file = ?').get(key);
      if (!row) return null;
      try { return unwrap(JSON.parse(row.data)).d; } catch (e) { return null; }
    },
    async set(key, value) {
      db.prepare(
        'INSERT INTO gn_kv (file, data, updated_at) VALUES (?, ?, ?) ON CONFLICT(file) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at'
      ).run(key, JSON.stringify({ ts: new Date().toISOString(), d: value }), new Date().toISOString());
    },
    async list(prefix) {
      const rows = db.prepare('SELECT file, data FROM gn_kv WHERE file LIKE ?').all(prefix + '%');
      return rows.map((row) => {
        try { const u = unwrap(JSON.parse(row.data)); return { key: row.file, ts: u.ts, d: u.d }; } catch (e) { return { key: row.file, ts: null, d: null }; }
      });
    },
    async close() { db.close(); },
  };
}

let impl = null;
async function init() {
  if (impl) return impl;
  if (SUPABASE_URL && SERVICE_ROLE) {
    impl = makeRest();
  } else {
    const path = require('path');
    const { DatabaseSync } = require('node:sqlite');
    const file = process.env.GN_DB_FILE || path.join(__dirname, '..', 'data.db');
    const db = new DatabaseSync(file);
    db.exec('PRAGMA journal_mode=WAL;');
    impl = makeSqlite(db);
  }
  return impl;
}

module.exports = { init };
