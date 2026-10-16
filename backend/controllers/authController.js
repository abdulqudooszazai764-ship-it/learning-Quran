const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { signToken } = require('../utils/jwt');

// POST /api/auth/login  { email, password }
// Admin logs in with email. Family logs in with the contact number OR email
// (whichever was set up as their login identifier), stored in users.email.
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email/phone and password are required.' });
  }

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1 AND is_active = TRUE', [email]);
    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    let familyId = null;
    if (user.role === 'family') {
      const fam = await db.query('SELECT id FROM families WHERE user_id = $1', [user.id]);
      familyId = fam.rows[0] ? fam.rows[0].id : null;
    }

    const token = signToken({ id: user.id, role: user.role, familyId });
    return res.json({
      token,
      user: { id: user.id, role: user.role, familyId, email: user.email },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong while logging in.' });
  }
}

// GET /api/auth/me
async function me(req, res) {
  try {
    const result = await db.query('SELECT id, role, email FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found.' });

    let family = null;
    if (user.role === 'family') {
      const fam = await db.query('SELECT * FROM families WHERE user_id = $1', [user.id]);
      family = fam.rows[0] || null;
    }
    return res.json({ user, family });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load your account.' });
  }
}

// POST /api/auth/change-password
async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters.' });
  }
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];
    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Current password is incorrect.' });

    const hash = await bcrypt.hash(newPassword, 12);
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, user.id]);
    return res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not update password.' });
  }
}

module.exports = { login, me, changePassword };
