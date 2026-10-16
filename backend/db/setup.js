/**
 * Run once to create all tables and the first teacher/admin login.
 * Usage:  npm run setup-db
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function main() {
  console.log('Reading schema.sql ...');
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

  console.log('Creating tables (safe to re-run) ...');
  await db.query(schema);

  console.log('Making sure a teacher_profile row exists ...');
  await db.query(
    `INSERT INTO teacher_profile (id, academy_name, teacher_name)
     VALUES (1, 'Quran Learning Academy', $1)
     ON CONFLICT (id) DO NOTHING`,
    [process.env.FIRST_ADMIN_NAME || 'Teacher']
  );

  const email = process.env.FIRST_ADMIN_EMAIL;
  const password = process.env.FIRST_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('FIRST_ADMIN_EMAIL / FIRST_ADMIN_PASSWORD not set in .env, skipping admin creation.');
  } else {
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log(`Admin account with email ${email} already exists. Skipping.`);
    } else {
      const hash = await bcrypt.hash(password, 12);
      await db.query(
        `INSERT INTO users (role, email, password_hash) VALUES ('admin', $1, $2)`,
        [email, hash]
      );
      console.log(`First admin (teacher) account created: ${email}`);
      console.log('Please log in and change this password from a secure device.');
    }
  }

  console.log('Adding a few starter courses if none exist ...');
  const courseCount = await db.query('SELECT COUNT(*) FROM courses');
  if (parseInt(courseCount.rows[0].count, 10) === 0) {
    const starterCourses = [
      ['Quran Nazira (Reading)', 'القرآن الناظرة', 'قرآن ناظره', 'قرآن ناظره'],
      ['Hifz (Memorization)', 'التحفيظ', 'حفظ قرآن', 'حفظ قرآن'],
      ['Tajweed', 'التجويد', 'تجوید', 'تجوید'],
      ['Hadith Studies', 'دراسة الحديث', 'علم حدیث', 'علم حدیث'],
      ['Tafsir (Quran Interpretation)', 'التفسير', 'تفسیر قرآن', 'تفسیر قرآن'],
      ['Islamic Studies', 'الدراسات الإسلامية', 'مطالعات اسلامی', 'مطالعات اسلامي'],
      ['Fiqh (Islamic Jurisprudence)', 'الفقه', 'فقه', 'فقه'],
      ['Aqeedah (Islamic Creed)', 'العقيدة', 'عقیده', 'عقیده'],
    ];
    for (const [en, ar, fa, ps] of starterCourses) {
      await db.query(
        `INSERT INTO courses (name_en, name_ar, name_fa, name_ps) VALUES ($1,$2,$3,$4)`,
        [en, ar, fa, ps]
      );
    }
    console.log('Starter courses added.');
  }

  console.log('Database setup complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Database setup failed:', err);
  process.exit(1);
});
