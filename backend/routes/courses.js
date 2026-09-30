const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const {
  listPublicCourses, listAllCourses, createCourse, updateCourse, deleteCourse,
} = require('../controllers/coursesController');

router.get('/', listPublicCourses);
router.get('/all', requireAuth, requireAdmin, listAllCourses);
router.post('/', requireAuth, requireAdmin, createCourse);
router.put('/:id', requireAuth, requireAdmin, updateCourse);
router.delete('/:id', requireAuth, requireAdmin, deleteCourse);

module.exports = router;
