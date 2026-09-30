const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const {
  createAdmission, checkStatus, listAdmissions, decideAdmission,
} = require('../controllers/admissionsController');

// Public
router.post('/', createAdmission);
router.get('/status', checkStatus);

// Admin only
router.get('/', requireAuth, requireAdmin, listAdmissions);
router.post('/:id/decision', requireAuth, requireAdmin, decideAdmission);

module.exports = router;
