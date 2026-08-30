// ============================================================
// seed.js · Seed inicial (admin + contenido por defecto)
// El contenido por defecto vive en assets/js/content.default.js
// (una sola fuente de verdad: navegador y servidor la leen).
// Claves: gn:users (array) · gn:content:{seccion} · gn:img:{key}
// ============================================================
'use strict';
const bcrypt = require('bcryptjs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const DEFAULT_CONTENT = require(path.join(ROOT, 'assets', 'js', 'content.default.js'));

const USERS_KEY = 'gn:users';
const CONTENT_PREFIX = 'gn:content:';

async function seedAll(store) {
  let seeded = 0;

  // --- Usuario admin por defecto: admin / admin123 ---
  const users = (await store.get(USERS_KEY)) || [];
  if (!users.length) {
    users.push({
      id: 'u-admin',
      username: 'admin',
      pass_hash: bcrypt.hashSync('admin123', 10),
      role: 'owner',
      name: 'GN Admin',
      refresh_jti: '',
      created_at: new Date().toISOString(),
    });
    await store.set(USERS_KEY, users);
    seeded++;
  }

  // --- Contenido por defecto (solo si la sección no existe) ---
  for (const [key, data] of Object.entries(DEFAULT_CONTENT)) {
    const existing = await store.get(CONTENT_PREFIX + key);
    if (!existing) {
      await store.set(CONTENT_PREFIX + key, data);
      seeded++;
    }
  }
  return seeded;
}

async function resetSection(store, key) {
  if (!(key in DEFAULT_CONTENT)) return false;
  await store.set(CONTENT_PREFIX + key, DEFAULT_CONTENT[key]);
  return true;
}

async function loadAll(store) {
  const rows = await store.list(CONTENT_PREFIX);
  const out = {};
  for (const row of rows) {
    const key = row.key.slice(CONTENT_PREFIX.length);
    if (key) out[key] = row.d;
  }
  return out;
}

async function loadSection(store, key) {
  return store.get(CONTENT_PREFIX + key);
}

async function saveSection(store, key, data) {
  await store.set(CONTENT_PREFIX + key, data);
}

module.exports = { seedAll, resetSection, loadAll, loadSection, saveSection, USERS_KEY, DEFAULT_CONTENT };
