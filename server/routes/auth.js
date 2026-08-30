// ============================================================
// routes/auth.js · Login / refresh / logout / me (admin)
// ============================================================
'use strict';
const express = require('express');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const auth = require('../lib/auth');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.GN_RATE_LIMIT || 5),
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ error: 'too_many_requests', message: 'Demasiados intentos. Espera 15 minutos.' }),
});

function register(database) {
  const router = express.Router();

  router.post('/login', loginLimiter, async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'missing_credentials' });
    const user = await database.get('SELECT * FROM gn_users WHERE username = ?', [String(username).trim()]);
    if (!user || !bcrypt.compareSync(String(password), user.pass_hash)) {
      return res.status(401).json({ error: 'invalid_credentials' });
    }
    const access = auth.issueAccess(user);
    const { token, jti } = auth.issueRefresh(user);
    await database.run('UPDATE gn_users SET refresh_jti = ? WHERE id = ?', [jti, user.id]);
    auth.setRefreshCookie(res, token);
    res.json({
      token: access,
      user: { id: user.id, username: user.username, role: user.role, name: user.name },
    });
  });

  // Rotación del refresh: solo acepta el último jti emitido; si llega uno
  // distinto, sospecha de reuso/robo y fuerza nuevo login (borra jti).
  router.post('/refresh', async (req, res) => {
    const cookie = req.cookies && req.cookies[auth.REFRESH_COOKIE];
    if (!cookie) return res.status(401).json({ error: 'missing_refresh' });
    let payload;
    try { payload = auth.verify(cookie); } catch (e) { return res.status(401).json({ error: 'invalid_refresh' }); }
    if (payload.type !== 'refresh') return res.status(401).json({ error: 'invalid_refresh' });
    const user = await database.get('SELECT * FROM gn_users WHERE id = ?', [String(payload.sub)]);
    if (!user) return res.status(401).json({ error: 'no_user' });
    if (user.refresh_jti !== payload.jti) {
      await database.run('UPDATE gn_users SET refresh_jti = ? WHERE id = ?', ['', user.id]).catch(() => {});
      auth.clearRefreshCookie(res);
      return res.status(401).json({ error: 'refresh_reused' });
    }
    const access = auth.issueAccess(user);
    const { token, jti } = auth.issueRefresh(user);
    await database.run('UPDATE gn_users SET refresh_jti = ? WHERE id = ?', [jti, user.id]);
    auth.setRefreshCookie(res, token);
    res.json({ token: access, user: { id: user.id, username: user.username, role: user.role, name: user.name } });
  });

  router.post('/logout', (req, res) => {
    auth.clearRefreshCookie(res);
    res.json({ ok: true });
  });

  router.get('/me', auth.requireAuth, async (req, res) => {
    const user = await database.get('SELECT id, username, role, name FROM gn_users WHERE id = ?', [req.user.sub]);
    if (!user) return res.status(401).json({ error: 'no_user' });
    res.json({ user });
  });

  // Cambio de contraseña del propio admin (login actual requerido)
  router.post('/change-password', auth.requireAuth, async (req, res) => {
    const { current, next } = req.body || {};
    if (!current || !next) return res.status(400).json({ error: 'missing_fields' });
    if (String(next).length < 6) return res.status(400).json({ error: 'weak_password' });
    const user = await database.get('SELECT * FROM gn_users WHERE id = ?', [req.user.sub]);
    if (!user || !bcrypt.compareSync(String(current), user.pass_hash)) {
      return res.status(401).json({ error: 'invalid_current' });
    }
    const passHash = bcrypt.hashSync(String(next), 10);
    await database.run('UPDATE gn_users SET pass_hash = ?, refresh_jti = ? WHERE id = ?', [passHash, '', user.id]);
    auth.clearRefreshCookie(res);
    res.json({ ok: true });
  });

  return router;
}

module.exports = { register };
