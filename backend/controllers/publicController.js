const db = require('../config/db');

// GET /api/teacher-profile (public)
async function getTeacherProfile(req, res) {
  try {
    const result = await db.query('SELECT * FROM teacher_profile WHERE id = 1');
    return res.json({ profile: result.rows[0] || null });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load teacher profile.' });
  }
}

// PUT /api/teacher-profile (admin)
async function updateTeacherProfile(req, res) {
  const {
    academyName, teacherName, photoUrl, bioEn, bioAr, bioFa, bioPs,
    qualifications, experienceYears, whatsappContactNumber, contactEmail, contactPhone, address,
  } = req.body;
  try {
    const result = await db.query(
      `UPDATE teacher_profile SET
        academy_name = COALESCE($1, academy_name),
        teacher_name = COALESCE($2, teacher_name),
        photo_url = COALESCE($3, photo_url),
        bio_en = COALESCE($4, bio_en),
        bio_ar = COALESCE($5, bio_ar),
        bio_fa = COALESCE($6, bio_fa),
        bio_ps = COALESCE($7, bio_ps),
        qualifications = COALESCE($8, qualifications),
        experience_years = COALESCE($9, experience_years),
        whatsapp_contact_number = COALESCE($10, whatsapp_contact_number),
        contact_email = COALESCE($11, contact_email),
        contact_phone = COALESCE($12, contact_phone),
        address = COALESCE($13, address)
       WHERE id = 1 RETURNING *`,
      [academyName, teacherName, photoUrl, bioEn, bioAr, bioFa, bioPs,
        qualifications, experienceYears, whatsappContactNumber, contactEmail, contactPhone, address]
    );
    return res.json({ profile: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not update teacher profile.' });
  }
}

// GET /api/testimonials (public - published only)
async function listPublicTestimonials(req, res) {
  try {
    const result = await db.query('SELECT * FROM testimonials WHERE is_published = TRUE ORDER BY created_at DESC');
    return res.json({ testimonials: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load testimonials.' });
  }
}

// GET /api/testimonials/all (admin)
async function listAllTestimonials(req, res) {
  try {
    const result = await db.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    return res.json({ testimonials: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load testimonials.' });
  }
}

// POST /api/testimonials (admin) - add a genuine testimonial received from a family
async function createTestimonial(req, res) {
  const { name, country, messageEn, messageAr, messageFa, messagePs } = req.body;
  if (!name || !messageEn) return res.status(400).json({ error: 'Name and message (English) are required.' });
  try {
    const result = await db.query(
      `INSERT INTO testimonials (student_or_family_name, country, message_en, message_ar, message_fa, message_ps)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, country || null, messageEn, messageAr || null, messageFa || null, messagePs || null]
    );
    return res.status(201).json({ testimonial: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not add testimonial.' });
  }
}

// PUT /api/testimonials/:id (admin) - e.g. publish/unpublish or edit
async function updateTestimonial(req, res) {
  const { id } = req.params;
  const { name, country, messageEn, messageAr, messageFa, messagePs, isPublished } = req.body;
  try {
    const result = await db.query(
      `UPDATE testimonials SET
        student_or_family_name = COALESCE($1, student_or_family_name),
        country = COALESCE($2, country),
        message_en = COALESCE($3, message_en),
        message_ar = COALESCE($4, message_ar),
        message_fa = COALESCE($5, message_fa),
        message_ps = COALESCE($6, message_ps),
        is_published = COALESCE($7, is_published)
       WHERE id = $8 RETURNING *`,
      [name, country, messageEn, messageAr, messageFa, messagePs, isPublished, id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Testimonial not found.' });
    return res.json({ testimonial: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not update testimonial.' });
  }
}

// DELETE /api/testimonials/:id (admin)
async function deleteTestimonial(req, res) {
  try {
    await db.query('DELETE FROM testimonials WHERE id = $1', [req.params.id]);
    return res.json({ message: 'Testimonial removed.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not remove testimonial.' });
  }
}

// GET /api/faqs (public)
async function listFaqs(req, res) {
  try {
    const result = await db.query('SELECT * FROM faqs ORDER BY sort_order, id');
    return res.json({ faqs: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not load FAQs.' });
  }
}

// POST /api/faqs (admin)
async function createFaq(req, res) {
  const { questionEn, answerEn, questionAr, answerAr, questionFa, answerFa, questionPs, answerPs, sortOrder } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO faqs (question_en, answer_en, question_ar, answer_ar, question_fa, answer_fa, question_ps, answer_ps, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [questionEn, answerEn, questionAr, answerAr, questionFa, answerFa, questionPs, answerPs, sortOrder || 0]
    );
    return res.status(201).json({ faq: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not add FAQ.' });
  }
}

// DELETE /api/faqs/:id (admin)
async function deleteFaq(req, res) {
  try {
    await db.query('DELETE FROM faqs WHERE id = $1', [req.params.id]);
    return res.json({ message: 'FAQ removed.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Could not remove FAQ.' });
  }
}

module.exports = {
  getTeacherProfile, updateTeacherProfile,
  listPublicTestimonials, listAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  listFaqs, createFaq, deleteFaq,
};
