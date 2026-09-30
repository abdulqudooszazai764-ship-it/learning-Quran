const db = require('../config/db');

// GET /api/courses (public - only active courses)
async function listPublicCourses(req, res) {
  try {
    const result = await db.query('SELECT * FROM courses WHERE is_active = TRUE ORDER BY id');
    return res.json({ courses: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load courses.' });
  }
}

// GET /api/courses/all (admin - includes inactive)
async function listAllCourses(req, res) {
  try {
    const result = await db.query('SELECT * FROM courses ORDER BY id');
    return res.json({ courses: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load courses.' });
  }
}

// POST /api/courses (admin)
async function createCourse(req, res) {
  const { nameEn, nameAr, nameFa, namePs, descriptionEn, descriptionAr, descriptionFa, descriptionPs } = req.body;
  if (!nameEn) return res.status(400).json({ error: 'Course name (English) is required.' });
  try {
    const result = await db.query(
      `INSERT INTO courses (name_en, name_ar, name_fa, name_ps, description_en, description_ar, description_fa, description_ps)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [nameEn, nameAr, nameFa, namePs, descriptionEn, descriptionAr, descriptionFa, descriptionPs]
    );
    return res.status(201).json({ course: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not create course.' });
  }
}

// PUT /api/courses/:id (admin)
async function updateCourse(req, res) {
  const { id } = req.params;
  const { nameEn, nameAr, nameFa, namePs, descriptionEn, descriptionAr, descriptionFa, descriptionPs, isActive } = req.body;
  try {
    const result = await db.query(
      `UPDATE courses SET
        name_en = COALESCE($1, name_en),
        name_ar = COALESCE($2, name_ar),
        name_fa = COALESCE($3, name_fa),
        name_ps = COALESCE($4, name_ps),
        description_en = COALESCE($5, description_en),
        description_ar = COALESCE($6, description_ar),
        description_fa = COALESCE($7, description_fa),
        description_ps = COALESCE($8, description_ps),
        is_active = COALESCE($9, is_active)
       WHERE id = $10 RETURNING *`,
      [nameEn, nameAr, nameFa, namePs, descriptionEn, descriptionAr, descriptionFa, descriptionPs, isActive, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Course not found.' });
    return res.json({ course: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not update course.' });
  }
}

// DELETE /api/courses/:id (admin)
async function deleteCourse(req, res) {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM courses WHERE id = $1', [id]);
    return res.json({ message: 'Course removed.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not remove course.' });
  }
}

module.exports = { listPublicCourses, listAllCourses, createCourse, updateCourse, deleteCourse };
