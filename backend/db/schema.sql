-- =====================================================================
-- Quran Learning Academy - Database Schema (PostgreSQL)
-- Simple, relational, no payment/fee tables anywhere on purpose.
-- =====================================================================

-- Roles: 'admin' (the teacher/owner) or 'family' (a parent/guardian login)
CREATE TABLE IF NOT EXISTS users (
    id              SERIAL PRIMARY KEY,
    role            VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'family')),
    email           VARCHAR(255) UNIQUE, -- optional for family, required for admin
    password_hash   VARCHAR(255) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- One family = one household account, one shared phone/WhatsApp number.
CREATE TABLE IF NOT EXISTS families (
    id                  SERIAL PRIMARY KEY,
    user_id             INTEGER UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    family_name         VARCHAR(150) NOT NULL,
    guardian_name       VARCHAR(150) NOT NULL,
    country             VARCHAR(100),
    contact_number      VARCHAR(50) NOT NULL,
    whatsapp_number     VARCHAR(50) NOT NULL,
    whatsapp_group_link TEXT, -- teacher sets this per family/group
    preferred_language  VARCHAR(5) DEFAULT 'en', -- en, ps, fa, ar
    notes               TEXT,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Each student belongs to one family. No separate email/phone required.
CREATE TABLE IF NOT EXISTS students (
    id          SERIAL PRIMARY KEY,
    family_id   INTEGER NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    full_name   VARCHAR(150) NOT NULL,
    age         INTEGER,
    gender      VARCHAR(10),
    notes       TEXT,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Courses offered (admin can add/edit/remove). No price field, ever.
CREATE TABLE IF NOT EXISTS courses (
    id           SERIAL PRIMARY KEY,
    name_en      VARCHAR(150) NOT NULL,
    name_ar      VARCHAR(150),
    name_fa      VARCHAR(150),
    name_ps      VARCHAR(150),
    description_en TEXT,
    description_ar TEXT,
    description_fa TEXT,
    description_ps TEXT,
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- A student can be enrolled in several courses.
CREATE TABLE IF NOT EXISTS student_courses (
    id          SERIAL PRIMARY KEY,
    student_id  INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id   INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE (student_id, course_id)
);

-- Admission applications, before a family account exists.
CREATE TABLE IF NOT EXISTS admissions (
    id                  SERIAL PRIMARY KEY,
    family_name         VARCHAR(150) NOT NULL,
    guardian_name       VARCHAR(150) NOT NULL,
    country             VARCHAR(100),
    contact_number      VARCHAR(50) NOT NULL,
    whatsapp_number      VARCHAR(50) NOT NULL,
    student_names       TEXT NOT NULL,      -- comma separated, simple for teacher
    number_of_students  INTEGER NOT NULL DEFAULT 1,
    selected_courses    TEXT,               -- comma separated course names
    preferred_time      VARCHAR(100),
    notes               TEXT,
    status              VARCHAR(10) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
    teacher_message     TEXT,
    family_id           INTEGER REFERENCES families(id) ON DELETE SET NULL, -- filled in after acceptance
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    decided_at          TIMESTAMP
);

-- Class schedule, per family or group, tied to a course.
CREATE TABLE IF NOT EXISTS classes (
    id               SERIAL PRIMARY KEY,
    family_id        INTEGER REFERENCES families(id) ON DELETE CASCADE,
    course_id        INTEGER REFERENCES courses(id) ON DELETE SET NULL,
    title            VARCHAR(150),
    class_datetime   TIMESTAMPTZ NOT NULL, -- stored in UTC; timezone shown per family
    timezone         VARCHAR(60) NOT NULL DEFAULT 'Asia/Kabul',
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    whatsapp_link    TEXT,
    status           VARCHAR(10) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','cancelled')),
    created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Attendance per student per class.
CREATE TABLE IF NOT EXISTS attendance (
    id          SERIAL PRIMARY KEY,
    class_id    INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    student_id  INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status      VARCHAR(10) NOT NULL CHECK (status IN ('present','absent','excused')),
    recorded_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (class_id, student_id)
);

-- Questions & Answers, private to the family that asked.
CREATE TABLE IF NOT EXISTS questions (
    id          SERIAL PRIMARY KEY,
    family_id   INTEGER NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    student_id  INTEGER REFERENCES students(id) ON DELETE SET NULL,
    question    TEXT NOT NULL,
    answer      TEXT,
    answered_at TIMESTAMP,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Teacher / academy profile (single row, id = 1).
CREATE TABLE IF NOT EXISTS teacher_profile (
    id              INTEGER PRIMARY KEY DEFAULT 1,
    academy_name    VARCHAR(200) NOT NULL DEFAULT 'Quran Learning Academy',
    teacher_name    VARCHAR(150) NOT NULL DEFAULT 'Teacher Name',
    photo_url       TEXT,
    bio_en          TEXT,
    bio_ar          TEXT,
    bio_fa          TEXT,
    bio_ps          TEXT,
    qualifications  TEXT,
    experience_years INTEGER,
    whatsapp_contact_number VARCHAR(50),
    contact_email   VARCHAR(255),
    contact_phone   VARCHAR(50),
    address         TEXT,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Genuine testimonials/reviews, added by admin from real feedback.
CREATE TABLE IF NOT EXISTS testimonials (
    id          SERIAL PRIMARY KEY,
    student_or_family_name VARCHAR(150) NOT NULL,
    country     VARCHAR(100),
    message_en  TEXT,
    message_ar  TEXT,
    message_fa  TEXT,
    message_ps  TEXT,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Frequently Asked Questions shown on the public site.
CREATE TABLE IF NOT EXISTS faqs (
    id           SERIAL PRIMARY KEY,
    question_en  TEXT, answer_en TEXT,
    question_ar  TEXT, answer_ar TEXT,
    question_fa  TEXT, answer_fa TEXT,
    question_ps  TEXT, answer_ps TEXT,
    sort_order   INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_students_family ON students(family_id);
CREATE INDEX IF NOT EXISTS idx_classes_family ON classes(family_id);
CREATE INDEX IF NOT EXISTS idx_questions_family ON questions(family_id);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON admissions(status);

-- NOTE: There is intentionally no table, column, or field anywhere in this
-- schema for prices, fees, invoices, payments, or wallets. Do not add one.
