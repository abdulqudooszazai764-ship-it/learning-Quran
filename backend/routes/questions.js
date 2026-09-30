const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin, requireFamily } = require('../middleware/auth');
const { askQuestion, myQuestions, listQuestions, answerQuestion } = require('../controllers/questionsController');

router.post('/', requireAuth, requireFamily, askQuestion);
router.get('/me', requireAuth, requireFamily, myQuestions);

router.get('/', requireAuth, requireAdmin, listQuestions);
router.put('/:id/answer', requireAuth, requireAdmin, answerQuestion);

module.exports = router;
