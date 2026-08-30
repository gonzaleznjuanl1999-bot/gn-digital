// ============================================================
// routes/auth.js · Login / refresh / logout / me / change-password
// Usuarios: array JSON en gn:users (un solo admin en la práctica)
// ============================================================
'use strict';
const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const auth = require('../lib/auth');
const seedLib = require('../lib/seed');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.GN_RATE_LIMIT || 5),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: 'too_many_requests', message: 'Demasiados intentos. Espera 15 minutos.' }),
});

async function getUsers(store) {
  return (await store.get(seedLib.USERS_KEY)) || [];
}
async function saveUsers(store, users) {
  await store.set(seedLib.USERS_KEY, users);
}

function register(store) {
  const router = express.Router();

  router.post('/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'missing_credentials' });
    const users = await getUsers(store);
    const user = users.find((u) => u.username === String(username).trim());
    if (!user || !bcrypt.compareSync(String(password), user.pass_hash)) {
      return res.status(401).json({ error: 'invalid_credentials' });
    }
    const access = auth.issueAccess(user);
    const { token, jti } = auth.issueRefresh(user);
    user.refresh_jti = jti;
    await saveUsers(store, users);
    auth.setRefreshCookie(res, token);
    res.json({
      token: access,
      user: { id: user.id, username: user.username, role: user.role, name: user.name },
    });
  });

  router.post('/refresh', async (req, res) => {
    const cookie = req.cookies && req.cookies[auth.REFRESH_COOKIE];
    if (!cookie) return res.status(401).json({ error: 'missing_refresh' });
    let payload;
    try { payload = auth.verify(cookie); } catch (e) { return res.status(401).json({ error: 'invalid_refresh' }); }
    if (payload.type !== 'refresh') return res.status(401).json({ error: 'invalid_refresh' });
    const users = await getUsers(store);
    const user = users.find((u) => u.id === String(payload.sub));
    if (!user) return res.status(401).json({ error: 'no_user' });
    if (user.refresh_jti !== payload.jti) {
      user.refresh_jti = '';
      await saveUsers(store, users).catch(() => {});
      auth.clearRefreshCookie(res);
      return res.status(401).json({ error: 'refresh_reused' });
    }
    const access = auth.issueAccess(user);
    const { token, jti } = auth.issueRefresh(user);
    user.refresh_jti = jti;
    await saveUsers(store, users);
    auth.setRefreshCookie(res, token);
    res.json({ token: access, user: { id: user.id, username: user.username, role: user.role, name: user.name } });
  });

  router.post('/logout', (req, res) => {
    auth.clearRefreshCookie(res);
    res.json({ ok: true });
  });

  router.get('/me', auth.requireAuth, async (req, res) => {
    const users = await getUsers(store);
    const user = users.find((u) => u.id === req.user.sub);
    if (!user) return res.status(401).json({ error: 'no_user' });
    res.json({ user: { id: user.id, username: user.username, role: user.role, name: user.name } });
  });

  router.post('/change-password', auth.requireAuth, async (req, res) => {
    const { current, next } = req.body || {};
    if (!current || !next) return res.status(400).json({ error: 'missing_fields' });
    if (String(next).length < 6) return res.status(400).json({ error: 'weak_password' });
    const users = await getUsers(store);
    const user = users.find((u) => u.id === req.user.sub);
    if (!user || !bcrypt.compareSync(String(current), user.pass_hash)) {
      return res.status(401).json({ error: 'invalid_current' });
    }
    user.pass_hash = bcrypt.hashSync(String(next), 10);
    user.refresh_jti = '';
    await saveUsers(store, users);
    auth.clearRefreshCookie(res);
    res.json({ ok: true });
  });

  return router;
}

module.exports = { register };
