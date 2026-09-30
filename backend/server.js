require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const admissionsRoutes = require('./routes/admissions');
const coursesRoutes = require('./routes/courses');
const familiesRoutes = require('./routes/families');
const classesRoutes = require('./routes/classes');
const questionsRoutes = require('./routes/questions');
const publicContentRoutes = require('./routes/publicContent');

const app = express();

// Security & basics
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Basic rate limiting to slow down brute-force login attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many attempts. Please wait a few minutes and try again.' },
});
app.use('/api/auth/login', authLimiter);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admissions', admissionsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/families', familiesRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api', publicContentRoutes); // /api/teacher-profile, /api/testimonials, /api/faqs

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

// Central error handler (safety net)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Quran Academy backend running on port ${PORT}`);
});
