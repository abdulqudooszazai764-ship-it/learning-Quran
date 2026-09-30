const db = require('../config/db');

// Helper: load a family with its students + enrolled courses
async function loadFamilyFull(familyId) {
  const famRes = await db.query('SELECT * FROM families WHERE id = $1', [familyId]);
  const family = famRes.rows[0];
  if (!family) return null;

  const studentsRes = await db.query('SELECT * FROM students WHERE family_id = $1 ORDER BY id', [familyId]);
  const students = studentsRes.rows;

  for (const student of students) {
    const coursesRes = await db.query(
      `SELECT c.* FROM courses c
       JOIN student_courses sc ON sc.course_id = c.id
       WHERE sc.student_id = $1`,
      [student.id]
    );
    student.courses = coursesRes.rows;
  }

  return { ...family, students };
}

// GET /api/families/me (family only) - their own record
async function getMyFamily(req, res) {
  try {
    if (!req.user.familyId) return res.status(404).json({ error: 'No family record linked to this account.' });
    const family = await loadFamilyFull(req.user.familyId);
    if (!family) return res.status(404).json({ error: 'Family not found.' });
    return res.json({ family });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load your family information.' });
  }
}

// GET /api/families (admin only) - list all families
async function listFamilies(req, res) {
  try {
    const result = await db.query(
      `SELECT f.*, (SELECT COUNT(*) FROM students s WHERE s.family_id = f.id) AS student_count
       FROM families f ORDER BY f.created_at DESC`
    );
    return res.json({ families: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load families.' });
  }
}

// GET /api/families/:id (admin only) - full detail of one family
async function getFamilyById(req, res) {
  try {
    const family = await loadFamilyFull(req.params.id);
    if (!family) return res.status(404).json({ error: 'Family not found.' });
    return res.json({ family });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load this family.' });
  }
}

// PUT /api/families/:id (admin only) - edit family details, e.g. WhatsApp group link
async function updateFamily(req, res) {
  const { id } = req.params;
  const {
    familyName, guardianName, country, contactNumber, whatsappNumber,
    whatsappGroupLink, preferredLanguage, notes,
  } = req.body;
  try {
    const result = await db.query(
      `UPDATE families SET
        family_name = COALESCE($1, family_name),
        guardian_name = COALESCE($2, guardian_name),
        country = COALESCE($3, country),
        contact_number = COALESCE($4, contact_number),
        whatsapp_number = COALESCE($5, whatsapp_number),
        whatsapp_group_link = COALESCE($6, whatsapp_group_link),
        preferred_language = COALESCE($7, preferred_language),
        notes = COALESCE($8, notes)
       WHERE id = $9 RETURNING *`,
      [familyName, guardianName, country, contactNumber, whatsappNumber,
        whatsappGroupLink, preferredLanguage, notes, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Family not found.' });
    return res.json({ family: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not update family.' });
  }
}

// DELETE /api/families/:id (admin only)
async function deleteFamily(req, res) {
  try {
    await db.query('DELETE FROM families WHERE id = $1', [req.params.id]);
    return res.json({ message: 'Family removed.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not remove family.' });
  }
}

// POST /api/families/:id/students (admin only) - add a student to a family
async function addStudent(req, res) {
  const { id } = req.params; // family id
  const { fullName, age, gender, notes, courseIds } = req.body;
  if (!fullName) return res.status(400).json({ error: 'Student name is required.' });
  try {
    const result = await db.query(
      'INSERT INTO students (family_id, full_name, age, gender, notes) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [id, fullName, age || null, gender || null, notes || null]
    );
    const student = result.rows[0];
    if (Array.isArray(courseIds)) {
      for (const courseId of courseIds) {
        await db.query(
          'INSERT INTO student_courses (student_id, course_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
          [student.id, courseId]
        );
      }
    }
    return res.status(201).json({ student });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not add student.' });
  }
}

// PUT /api/students/:studentId (admin only)
async function updateStudent(req, res) {
  const { studentId } = req.params;
  const { fullName, age, gender, notes, courseIds } = req.body;
  try {
    const result = await db.query(
      `UPDATE students SET
        full_name = COALESCE($1, full_name),
        age = COALESCE($2, age),
        gender = COALESCE($3, gender),
        notes = COALESCE($4, notes)
       WHERE id = $5 RETURNING *`,
      [fullName, age, gender, notes, studentId]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Student not found.' });

    if (Array.isArray(courseIds)) {
      await db.query('DELETE FROM student_courses WHERE student_id = $1', [studentId]);
      for (const courseId of courseIds) {
        await db.query('INSERT INTO student_courses (student_id, course_id) VALUES ($1,$2)', [studentId, courseId]);
      }
    }
    return res.json({ student: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not update student.' });
  }
}

// DELETE /api/students/:studentId (admin only)
async function deleteStudent(req, res) {
  try {
    await db.query('DELETE FROM students WHERE id = $1', [req.params.studentId]);
    return res.json({ message: 'Student removed.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not remove student.' });
  }
}

// GET /api/families/dashboard-stats (admin only)
async function dashboardStats(req, res) {
  try {
    const families = await db.query('SELECT COUNT(*) FROM families');
    const students = await db.query('SELECT COUNT(*) FROM students');
    const pending = await db.query("SELECT COUNT(*) FROM admissions WHERE status = 'pending'");
    const upcoming = await db.query(
      `SELECT COUNT(*) FROM classes WHERE status = 'scheduled' AND class_datetime > NOW()`
    );
    const recentQuestions = await db.query(
      `SELECT q.*, f.family_name FROM questions q JOIN families f ON f.id = q.family_id
       ORDER BY q.created_at DESC LIMIT 5`
    );
    return res.json({
      totalFamilies: parseInt(families.rows[0].count, 10),
      totalStudents: parseInt(students.rows[0].count, 10),
      pendingAdmissions: parseInt(pending.rows[0].count, 10),
      upcomingClasses: parseInt(upcoming.rows[0].count, 10),
      recentQuestions: recentQuestions.rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load dashboard statistics.' });
  }
}

module.exports = {
  getMyFamily, listFamilies, getFamilyById, updateFamily, deleteFamily,
  addStudent, updateStudent, deleteStudent, dashboardStats,
};
