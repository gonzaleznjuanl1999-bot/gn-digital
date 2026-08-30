// ============================================================
// seed.js · Esquema + seed inicial (users admin + contenido por defecto)
// El contenido por defecto vive en assets/js/content.default.js
// (una sola fuente de verdad: el navegador y el servidor la leen).
// ============================================================
'use strict';
const bcrypt = require('bcryptjs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const DEFAULT_CONTENT = require(path.join(ROOT, 'assets', 'js', 'content.default.js'));

const DDL = `
CREATE TABLE IF NOT EXISTS gn_content (
  key TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS gn_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  pass_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  name TEXT DEFAULT '',
  refresh_jti TEXT DEFAULT '',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS gn_kv (
  file TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
`;

async function ensure(database) {
  await database.exec(DDL);
}

async function seedAll(database) {
  let seeded = 0;

  // --- Usuario admin por defecto: admin / admin123 ---
  const adminRow = await database.get('SELECT id FROM gn_users WHERE username = ?', ['admin']);
  if (!adminRow) {
    const passHash = bcrypt.hashSync('admin123', 10);
    await database.run(
      'INSERT INTO gn_users (id, username, pass_hash, role, name, refresh_jti, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      ['u-admin', 'admin', passHash, 'owner', 'GN Admin', '', new Date().toISOString()]
    );
    seeded++;
  }

  // --- Contenido por defecto (solo si la tabla está vacía) ---
  const any = await database.get('SELECT key FROM gn_content LIMIT 1');
  if (!any) {
    const ts = new Date().toISOString();
    for (const [key, data] of Object.entries(DEFAULT_CONTENT)) {
      await database.run(
        'INSERT INTO gn_content (key, data, updated_at) VALUES (?, ?, ?)',
        [key, JSON.stringify(data), ts]
      );
      seeded++;
    }
  }
  return seeded;
}

module.exports = { ensure, seedAll, DEFAULT_CONTENT };
