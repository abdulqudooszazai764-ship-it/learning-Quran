const db = require('../config/db');

// POST /api/questions (family) - submit a new question
async function askQuestion(req, res) {
  const { studentId, question } = req.body;
  if (!question || !question.trim()) {
    return res.status(400).json({ error: 'Please write your question.' });
  }
  try {
    const result = await db.query(
      'INSERT INTO questions (family_id, student_id, question) VALUES ($1,$2,$3) RETURNING *',
      [req.user.familyId, studentId || null, question.trim()]
    );
    return res.status(201).json({ question: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not submit your question.' });
  }
}

// GET /api/questions/me (family) - only their own family's questions
async function myQuestions(req, res) {
  try {
    const result = await db.query(
      `SELECT q.*, s.full_name AS student_name FROM questions q
       LEFT JOIN students s ON s.id = q.student_id
       WHERE q.family_id = $1 ORDER BY q.created_at DESC`,
      [req.user.familyId]
    );
    return res.json({ questions: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load your questions.' });
  }
}

// GET /api/questions (admin) - all questions, optional ?answered=true/false
async function listQuestions(req, res) {
  const { answered } = req.query;
  try {
    let query = `SELECT q.*, f.family_name, s.full_name AS student_name
                 FROM questions q
                 JOIN families f ON f.id = q.family_id
                 LEFT JOIN students s ON s.id = q.student_id`;
    const params = [];
    if (answered === 'true') query += ' WHERE q.answer IS NOT NULL';
    if (answered === 'false') query += ' WHERE q.answer IS NULL';
    query += ' ORDER BY q.created_at DESC';
    const result = await db.query(query, params);
    return res.json({ questions: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load questions.' });
  }
}

// PUT /api/questions/:id/answer (admin) - answer a question
async function answerQuestion(req, res) {
  const { id } = req.params;
  const { answer } = req.body;
  if (!answer || !answer.trim()) return res.status(400).json({ error: 'Please write an answer.' });
  try {
    const result = await db.query(
      'UPDATE questions SET answer = $1, answered_at = NOW() WHERE id = $2 RETURNING *',
      [answer.trim(), id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Question not found.' });
    return res.json({ question: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not save the answer.' });
  }
}

module.exports = { askQuestion, myQuestions, listQuestions, answerQuestion };
