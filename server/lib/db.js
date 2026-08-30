// ============================================================
// db.js · Database factory (portable)
// Postgres si DATABASE_URL está definido (producción → Supabase),
// SQLite (node:sqlite, sin dependencias nativas) para dev local.
// Dialecto común: TEXT/INTEGER, JSON como TEXT, PKs de texto.
// ============================================================
'use strict';
const path = require('path');

const DB_FILE = process.env.GN_DB_FILE || path.join(__dirname, '..', 'data.db');
let impl = null;

// pg usa $1..$n; sqlite usa ?  → traducir '?' a '$n' al vuelo
function toPg(sql) {
  let n = 0;
  return sql.replace(/\?/g, () => `$${++n}`);
}

function makePg(pool) {
  return {
    kind: 'pg',
    async exec(sql) { return pool.query(sql); },
    async run(sql, params = []) { return pool.query(toPg(sql), params); },
    async all(sql, params = []) { const r = await pool.query(toPg(sql), params); return r.rows; },
    async get(sql, params = []) { const r = await pool.query(toPg(sql), params); return r.rows[0] || null; },
    async close() { return pool.end(); },
  };
}

function makeSqlite(db) {
  return {
    kind: 'sqlite',
    async exec(sql) { return db.exec(sql); },
    async run(sql, params = []) { const st = db.prepare(sql); return st.run(...params); },
    async all(sql, params = []) { const st = db.prepare(sql); return st.all(...params); },
    async get(sql, params = []) { const st = db.prepare(sql); return st.get(...params) || null; },
    async close() { db.close(); },
  };
}

async function init() {
  if (impl) return impl;
  if (process.env.DATABASE_URL) {
    const { Pool } = require('pg');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSL === '1' ? { rejectUnauthorized: false } : false,
    });
    await pool.query('SELECT 1'); // falla pronto si no hay Postgres
    impl = makePg(pool);
  } else {
    const { DatabaseSync } = require('node:sqlite');
    const db = new DatabaseSync(DB_FILE);
    db.exec('PRAGMA journal_mode=WAL;');
    impl = makeSqlite(db);
  }
  module.exports._current = impl;
  return impl;
}

module.exports = { init, DB_FILE };
