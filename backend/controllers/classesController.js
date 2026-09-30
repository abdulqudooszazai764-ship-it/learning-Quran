const db = require('../config/db');

// GET /api/classes/me (family) - upcoming + past classes for logged-in family
async function myClasses(req, res) {
  try {
    const result = await db.query(
      `SELECT cl.*, co.name_en AS course_name
       FROM classes cl LEFT JOIN courses co ON co.id = cl.course_id
       WHERE cl.family_id = $1 ORDER BY cl.class_datetime DESC`,
      [req.user.familyId]
    );
    return res.json({ classes: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load your classes.' });
  }
}

// GET /api/classes (admin) - optional ?familyId=
async function listClasses(req, res) {
  const { familyId } = req.query;
  try {
    let result;
    if (familyId) {
      result = await db.query(
        `SELECT cl.*, co.name_en AS course_name, f.family_name
         FROM classes cl
         LEFT JOIN courses co ON co.id = cl.course_id
         LEFT JOIN families f ON f.id = cl.family_id
         WHERE cl.family_id = $1 ORDER BY cl.class_datetime DESC`,
        [familyId]
      );
    } else {
      result = await db.query(
        `SELECT cl.*, co.name_en AS course_name, f.family_name
         FROM classes cl
         LEFT JOIN courses co ON co.id = cl.course_id
         LEFT JOIN families f ON f.id = cl.family_id
         ORDER BY cl.class_datetime DESC`
      );
    }
    return res.json({ classes: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load classes.' });
  }
}

// POST /api/classes (admin)
async function createClass(req, res) {
  const { familyId, courseId, title, classDatetime, timezone, durationMinutes, whatsappLink } = req.body;
  if (!familyId || !classDatetime) {
    return res.status(400).json({ error: 'Family and class date/time are required.' });
  }
  try {
    const result = await db.query(
      `INSERT INTO classes (family_id, course_id, title, class_datetime, timezone, duration_minutes, whatsapp_link)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [familyId, courseId || null, title || null, classDatetime, timezone || 'Asia/Kabul',
        durationMinutes || 30, whatsappLink || null]
    );
    return res.status(201).json({ class: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not create class.' });
  }
}

// PUT /api/classes/:id (admin) - edit or cancel
async function updateClass(req, res) {
  const { id } = req.params;
  const { courseId, title, classDatetime, timezone, durationMinutes, whatsappLink, status } = req.body;
  try {
    const result = await db.query(
      `UPDATE classes SET
        course_id = COALESCE($1, course_id),
        title = COALESCE($2, title),
        class_datetime = COALESCE($3, class_datetime),
        timezone = COALESCE($4, timezone),
        duration_minutes = COALESCE($5, duration_minutes),
        whatsapp_link = COALESCE($6, whatsapp_link),
        status = COALESCE($7, status)
       WHERE id = $8 RETURNING *`,
      [courseId, title, classDatetime, timezone, durationMinutes, whatsappLink, status, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Class not found.' });
    return res.json({ class: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not update class.' });
  }
}

// DELETE /api/classes/:id (admin)
async function deleteClass(req, res) {
  try {
    await db.query('DELETE FROM classes WHERE id = $1', [req.params.id]);
    return res.json({ message: 'Class deleted.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not delete class.' });
  }
}

// POST /api/classes/:id/attendance (admin) - body: { records: [{studentId, status}] }
async function recordAttendance(req, res) {
  const { id } = req.params;
  const { records } = req.body;
  if (!Array.isArray(records)) return res.status(400).json({ error: 'Attendance records are required.' });
  try {
    for (const rec of records) {
      await db.query(
        `INSERT INTO attendance (class_id, student_id, status)
         VALUES ($1,$2,$3)
         ON CONFLICT (class_id, student_id) DO UPDATE SET status = $3, recorded_at = NOW()`,
        [id, rec.studentId, rec.status]
      );
    }
    return res.json({ message: 'Attendance saved.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not save attendance.' });
  }
}

// GET /api/classes/:id/attendance (admin)
async function getAttendance(req, res) {
  try {
    const result = await db.query(
      `SELECT a.*, s.full_name FROM attendance a JOIN students s ON s.id = a.student_id WHERE class_id = $1`,
      [req.params.id]
    );
    return res.json({ attendance: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load attendance.' });
  }
}

module.exports = {
  myClasses, listClasses, createClass, updateClass, deleteClass, recordAttendance, getAttendance,
};
