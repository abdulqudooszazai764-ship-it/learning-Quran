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

// Trust first proxy (important for rate-limit & secure cookies behind reverse proxies)
app.set('trust proxy', 1);

// Security headers – hardened for production
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
  hsts: process.env.NODE_ENV === 'production' ? { maxAge: 31536000, includeSubDomains: true } : false,
}));

// CORS – strict origin
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '1mb' })); // tighter limit
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});
app.use('/api/', generalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // stricter for login
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please wait a few minutes and try again.' },
});
app.use('/api/auth/login', authLimiter);

// Health check (no rate limit impact critical)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.1.0', updated: '2026-09' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admissions', admissionsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/families', familiesRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api', publicContentRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

// Central error handler – never leak stack traces
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy violation.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Quran Academy backend v1.1.0 running on port ${PORT}`);
});
