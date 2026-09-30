const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin, requireFamily } = require('../middleware/auth');
const {
  getMyFamily, listFamilies, getFamilyById, updateFamily, deleteFamily,
  addStudent, updateStudent, deleteStudent, dashboardStats,
} = require('../controllers/familiesController');

// Family's own record - a family can NEVER fetch another family's data because
// this route ignores any id in the URL and only ever uses req.user.familyId.
router.get('/me', requireAuth, requireFamily, getMyFamily);

// Admin-only management routes
router.get('/dashboard-stats', requireAuth, requireAdmin, dashboardStats);
router.get('/', requireAuth, requireAdmin, listFamilies);
router.get('/:id', requireAuth, requireAdmin, getFamilyById);
router.put('/:id', requireAuth, requireAdmin, updateFamily);
router.delete('/:id', requireAuth, requireAdmin, deleteFamily);
router.post('/:id/students', requireAuth, requireAdmin, addStudent);
router.put('/students/:studentId', requireAuth, requireAdmin, updateStudent);
router.delete('/students/:studentId', requireAuth, requireAdmin, deleteStudent);

module.exports = router;
