const bcrypt = require('bcryptjs');
const db = require('../config/db');

// POST /api/admissions  (public - anyone can apply)
async function createAdmission(req, res) {
  const {
    familyName, guardianName, country, contactNumber, whatsappNumber,
    studentNames, numberOfStudents, selectedCourses, preferredTime, notes,
  } = req.body;

  if (!familyName || !guardianName || !contactNumber || !whatsappNumber || !studentNames) {
    return res.status(400).json({ error: 'Please fill in family name, guardian name, contact number, WhatsApp number, and student names.' });
  }

  try {
    const result = await db.query(
      `INSERT INTO admissions
        (family_name, guardian_name, country, contact_number, whatsapp_number,
         student_names, number_of_students, selected_courses, preferred_time, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id, status, created_at`,
      [familyName, guardianName, country || null, contactNumber, whatsappNumber,
        studentNames, numberOfStudents || 1, selectedCourses || null, preferredTime || null, notes || null]
    );
    return res.status(201).json({
      message: 'Your application has been received. You can check its status any time using your contact number.',
      admission: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not submit your application. Please try again.' });
  }
}

// GET /api/admissions/status?contactNumber=...  (public status check)
async function checkStatus(req, res) {
  const { contactNumber } = req.query;
  if (!contactNumber) return res.status(400).json({ error: 'Contact number is required.' });
  try {
    const result = await db.query(
      `SELECT id, family_name, status, teacher_message, created_at, decided_at
       FROM admissions WHERE contact_number = $1 ORDER BY created_at DESC`,
      [contactNumber]
    );
    return res.json({ admissions: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not check status right now.' });
  }
}

// GET /api/admissions  (admin only)
async function listAdmissions(req, res) {
  const { status } = req.query;
  try {
    let result;
    if (status) {
      result = await db.query('SELECT * FROM admissions WHERE status = $1 ORDER BY created_at DESC', [status]);
    } else {
      result = await db.query('SELECT * FROM admissions ORDER BY created_at DESC');
    }
    return res.json({ admissions: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load admission applications.' });
  }
}

// POST /api/admissions/:id/decision  (admin only) { decision: 'accepted'|'declined', message, loginPassword }
// On acceptance, creates a family account + user login, and student records.
async function decideAdmission(req, res) {
  const { id } = req.params;
  const { decision, message, loginEmail, loginPassword } = req.body;

  if (!['accepted', 'declined'].includes(decision)) {
    return res.status(400).json({ error: "Decision must be 'accepted' or 'declined'." });
  }

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    const admissionRes = await client.query('SELECT * FROM admissions WHERE id = $1 FOR UPDATE', [id]);
    const admission = admissionRes.rows[0];
    if (!admission) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Application not found.' });
    }
    if (admission.status !== 'pending') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'This application has already been decided.' });
    }

    let familyId = null;

    if (decision === 'accepted') {
      if (!loginEmail || !loginPassword) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Please set a login email/username and password for the new family account.' });
      }
      const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [loginEmail]);
      if (existingUser.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'That login email/username is already in use. Please choose another.' });
      }

      const hash = await bcrypt.hash(loginPassword, 10);
      const userRes = await client.query(
        `INSERT INTO users (role, email, password_hash) VALUES ('family', $1, $2) RETURNING id`,
        [loginEmail, hash]
      );
      const userId = userRes.rows[0].id;

      const famRes = await client.query(
        `INSERT INTO families (user_id, family_name, guardian_name, country, contact_number, whatsapp_number)
         VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
        [userId, admission.family_name, admission.guardian_name, admission.country,
          admission.contact_number, admission.whatsapp_number]
      );
      familyId = famRes.rows[0].id;

      const names = admission.student_names.split(',').map((n) => n.trim()).filter(Boolean);
      for (const name of names) {
        await client.query('INSERT INTO students (family_id, full_name) VALUES ($1, $2)', [familyId, name]);
      }

      if (admission.selected_courses) {
        const courseNames = admission.selected_courses.split(',').map((n) => n.trim()).filter(Boolean);
        const studentsRes = await client.query('SELECT id FROM students WHERE family_id = $1', [familyId]);
        const coursesRes = await client.query('SELECT id, name_en FROM courses');
        const courseMap = {};
        coursesRes.rows.forEach((c) => { courseMap[c.name_en.toLowerCase()] = c.id; });
        for (const student of studentsRes.rows) {
          for (const cName of courseNames) {
            const courseId = courseMap[cName.toLowerCase()];
            if (courseId) {
              await client.query(
                'INSERT INTO student_courses (student_id, course_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
                [student.id, courseId]
              );
            }
          }
        }
      }
    }

    await client.query(
      `UPDATE admissions SET status = $1, teacher_message = $2, family_id = $3, decided_at = NOW() WHERE id = $4`,
      [decision, message || null, familyId, id]
    );

    await client.query('COMMIT');
    return res.json({ message: `Application ${decision}.`, familyId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    return res.status(500).json({ error: 'Could not process this decision.' });
  } finally {
    client.release();
  }
}

module.exports = { createAdmission, checkStatus, listAdmissions, decideAdmission };
