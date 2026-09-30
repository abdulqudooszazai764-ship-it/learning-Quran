const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/auth');
const {
  getTeacherProfile, updateTeacherProfile,
  listPublicTestimonials, listAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  listFaqs, createFaq, deleteFaq,
} = require('../controllers/publicController');

// Teacher profile
router.get('/teacher-profile', getTeacherProfile);
router.put('/teacher-profile', requireAuth, requireAdmin, updateTeacherProfile);

// Testimonials
router.get('/testimonials', listPublicTestimonials);
router.get('/testimonials/all', requireAuth, requireAdmin, listAllTestimonials);
router.post('/testimonials', requireAuth, requireAdmin, createTestimonial);
router.put('/testimonials/:id', requireAuth, requireAdmin, updateTestimonial);
router.delete('/testimonials/:id', requireAuth, requireAdmin, deleteTestimonial);

// FAQs
router.get('/faqs', listFaqs);
router.post('/faqs', requireAuth, requireAdmin, createFaq);
router.delete('/faqs/:id', requireAuth, requireAdmin, deleteFaq);

module.exports = router;
