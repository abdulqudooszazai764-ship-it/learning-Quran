const { verifyToken } = require('../utils/jwt');

/**
 * Requires a valid JWT. Attaches { id, role, familyId } to req.user.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Not authenticated. Please log in.' });
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid. Please log in again.' });
  }
}

/**
 * Requires the logged-in user to be the teacher/admin.
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'This action is only available to the teacher/admin.' });
  }
  return next();
}

/**
 * Requires the logged-in user to be a family account.
 */
function requireFamily(req, res, next) {
  if (!req.user || req.user.role !== 'family') {
    return res.status(403).json({ error: 'This action is only available to family accounts.' });
  }
  return next();
}

/**
 * Ensures a family can only access records that belong to them, unless
 * the requester is the admin (who may access everything).
 * Compares req.user.familyId against a familyId provided by the route
 * (e.g. from req.params.familyId or a record already loaded onto req.resourceFamilyId).
 */
function ensureOwnFamilyOrAdmin(getFamilyIdFromReq) {
  return (req, res, next) => {
    if (req.user.role === 'admin') return next();
    const targetFamilyId = getFamilyIdFromReq(req);
    if (String(req.user.familyId) !== String(targetFamilyId)) {
      return res.status(403).json({ error: 'You may only access your own family records.' });
    }
    return next();
  };
}

module.exports = { requireAuth, requireAdmin, requireFamily, ensureOwnFamilyOrAdmin };
