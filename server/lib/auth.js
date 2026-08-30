// ============================================================
// auth.js · JWT access (Bearer) + refresh (HttpOnly cookie) + bcrypt
// Mismo patrón probado de tienda-universal.
// ============================================================
'use strict';
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'gn-demo-secret-change-me';
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('[auth] JWT_SECRET es OBLIGATORIO en producción (ver .env.example)');
}
const ACCESS_MS = 15 * 60 * 1000;              // access: 15 min
const REFRESH_MS = 7 * 24 * 3600 * 1000;       // refresh: 7 días
const REFRESH_COOKIE = 'gn_rt';

function issueAccess(user) {
  return jwt.sign(
    { sub: user.id, username: user.username, role: user.role, name: user.name, jti: Math.random().toString(36).slice(2) + Date.now().toString(36) },
    JWT_SECRET,
    { expiresIn: ACCESS_MS / 1000 }
  );
}

// El refresh lleva jti propio; el llamador lo persiste en users.refresh_jti:
// /refresh solo acepta el último emitido (detección de reuso/robo).
function issueRefresh(user) {
  const jti = Math.random().toString(36).slice(2) + Date.now().toString(36);
  const token = jwt.sign({ sub: user.id, type: 'refresh', jti }, JWT_SECRET, { expiresIn: REFRESH_MS / 1000 });
  return { token, jti };
}

function verify(token) {
  return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
}

function requireAuth(req, res, next) {
  const h = req.headers.authorization || '';
  const t = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!t) return res.status(401).json({ error: 'unauthorized' });
  try {
    req.user = verify(t);
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid_token' });
  }
}

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    const role = req.user.role || '';
    if (role !== 'owner' && role !== 'admin') return res.status(403).json({ error: 'forbidden' });
    next();
  });
}

function setRefreshCookie(res, token) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/api',
    maxAge: REFRESH_MS,
  });
}

function clearRefreshCookie(res) {
  res.clearCookie(REFRESH_COOKIE, { httpOnly: true, sameSite: 'strict', path: '/api' });
}

module.exports = {
  JWT_SECRET, ACCESS_MS, REFRESH_MS, REFRESH_COOKIE,
  issueAccess, issueRefresh, verify, requireAuth, requireAdmin, setRefreshCookie, clearRefreshCookie,
};
