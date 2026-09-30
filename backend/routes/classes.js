const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin, requireFamily } = require('../middleware/auth');
const {
  myClasses, listClasses, createClass, updateClass, deleteClass, recordAttendance, getAttendance,
} = require('../controllers/classesController');

router.get('/me', requireAuth, requireFamily, myClasses);

router.get('/', requireAuth, requireAdmin, listClasses);
router.post('/', requireAuth, requireAdmin, createClass);
router.put('/:id', requireAuth, requireAdmin, updateClass);
router.delete('/:id', requireAuth, requireAdmin, deleteClass);
router.post('/:id/attendance', requireAuth, requireAdmin, recordAttendance);
router.get('/:id/attendance', requireAuth, requireAdmin, getAttendance);

module.exports = router;
