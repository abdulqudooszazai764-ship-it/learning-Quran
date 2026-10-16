
import { useTranslation } from 'react-i18next';
import WhatsAppButton from '../components/WhatsAppButton.jsx';

export default function TeacherProfile() {
  const { t } = useTranslation();

  return (
    <section className="section container">
      <h1 className="section-title">
        {t('teacher.title')}
      </h1>

      <div
        className="card"
        style={{
          maxWidth: '850px',
          margin: '0 auto',
          padding: '2rem',
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <span
            style={{
              color: '#b8860b',
              fontWeight: 700,
              letterSpacing: '0.08em',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
            }}
          >
            Quran & Islamic Studies Educator
          </span>

          <h2
            style={{
              marginTop: '0.6rem',
              marginBottom: '1rem',
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            }}
          >
            Ihsanullah Haseen
          </h2>

          <p>
            Ihsanullah Haseen is an Islamic studies educator
            dedicated to helping students learn the Holy Quran
            and understand Islamic teachings with care,
            patience, and a structured approach.
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.75rem' }}>
            Academic Qualifications
          </h3>

          <ul
            style={{
              paddingInlineStart: '1.5rem',
              lineHeight: 1.9,
              color: '#3d4f47',
            }}
          >
            <li>
              Achieved first position in his bachelor's degree.
            </li>
            <li>
              Achieved first position in Tafsir and Hadith studies.
            </li>
            <li>
              Achieved first position in Sharia Law (Islamic Law).
            </li>
          </ul>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.75rem' }}>
            Subjects Taught
          </h3>

          <div
            className="grid grid-2"
            style={{ gap: '0.75rem' }}
          >
            {[
              'Quran Recitation (Nazira)',
              'Quran Memorization (Hifz)',
              'Tajweed',
              'Hadith Studies',
              'Islamic Studies',
              'Fiqh and Aqidah',
            ].map((subject) => (
              <div
                className="card"
                key={subject}
                style={{
                  padding: '0.9rem 1rem',
                  boxShadow: 'none',
                  background: '#f0faf4',
                }}
              >
                <span style={{ color: '#14532d', fontWeight: 600 }}>
                  {subject}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '0.75rem' }}>
            Teaching Approach
          </h3>

          <p>
            Lessons are designed to support students at
            different learning levels, with an emphasis on
            clear explanations, regular practice, and a
            respectful learning environment.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            marginTop: '1.5rem',
          }}
        >
          <a href="/courses" className="btn btn-primary">
            Explore Courses
          </a>

          <WhatsAppButton />
        </div>
      </div>
    </section>
  );
}
