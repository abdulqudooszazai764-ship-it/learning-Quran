
import { Link } from 'react-router-dom';

export default function About() {
  const subjects = [
    {
      title: 'Quran Recitation (Nazira)',
      description:
        'Learn to read the Holy Quran correctly with regular guidance and practice.',
      icon: '📖',
    },
    {
      title: 'Noorani Qaida',
      description:
        'Build a strong foundation in Arabic letters and Quran reading.',
      icon: '✍️',
    },
    {
      title: 'Tajweed',
      description:
        'Learn the rules of Quran recitation and improve pronunciation.',
      icon: '🌙',
    },
    {
      title: 'Hadith Studies',
      description:
        'Explore the teachings and guidance of Prophet Muhammad ﷺ.',
      icon: '📚',
    },
    {
      title: 'Tafsir and Islamic Studies',
      description:
        'Develop an understanding of Quranic meanings and Islamic teachings.',
      icon: '🕌',
    },
    {
      title: 'Fiqh and Aqeedah',
      description:
        'Study essential Islamic rulings, beliefs, and principles.',
      icon: '✨',
    },
  ];

  return (
    <section className="section container">
      <div
        style={{
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto 2.5rem',
        }}
      >
        <p
          style={{
            color: '#b8860b',
            fontWeight: '700',
            letterSpacing: '2px',
          }}
        >
          KNOWLEDGE • FAITH • GUIDANCE
        </p>

        <h1 className="section-title">
          About Our Academy
        </h1>

        <p style={{ lineHeight: 1.9 }}>
          Welcome to Haseen Quran and Islamic Studies Academy,
          an online learning academy dedicated to helping students
          learn the Holy Quran and understand the beautiful teachings
          of Islam in a respectful and supportive environment.
        </p>
      </div>

      <div
        className="card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          borderTop: '4px solid #b8860b',
        }}
      >
        <h2>Our Mission</h2>
        <p style={{ lineHeight: 1.9 }}>
          Our mission is to make Quran learning and Islamic education
          accessible to students and families around the world.
          We aim to encourage correct recitation, meaningful learning,
          good character, and a deeper understanding of Islamic values
          through structured online lessons.
        </p>

        <h2 style={{ marginTop: '2rem' }}>
          Our Approach to Learning
        </h2>
        <p style={{ lineHeight: 1.9 }}>
          We believe every student deserves patience, encouragement,
          and clear guidance. Our learning approach focuses on
          building strong foundations, understanding lessons,
          practising regularly, and respecting each student's
          learning journey.
        </p>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h2 className="section-title">
          What We Teach
        </h2>

        <p
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
            lineHeight: 1.8,
          }}
        >
          Explore our Quran and Islamic Studies subjects.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {subjects.map((subject) => (
            <div
              className="card"
              key={subject.title}
              style={{ padding: '1.5rem' }}
            >
              <div
                style={{
                  fontSize: '2rem',
                  marginBottom: '0.75rem',
                }}
              >
                {subject.icon}
              </div>

              <h3>{subject.title}</h3>

              <p style={{ lineHeight: 1.8 }}>
                {subject.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: '#f7faf8',
        }}
      >
        <h2>Meet Our Teacher</h2>

        <h3 style={{ color: '#092f27' }}>
          Ihsanullah Haseen
        </h3>

        <p style={{ lineHeight: 1.9 }}>
          Ihsanullah Haseen is dedicated to Quran teaching
          and Islamic education. His academic achievements include
          first position in his bachelor's degree, Tafsir and Hadith
          studies, and Sharia Law.
        </p>

        <p style={{ lineHeight: 1.9 }}>
          His aim is to help students develop accurate Quran
          recitation, sound Islamic knowledge, and a lasting
          appreciation for Islamic teachings.
        </p>

        <Link
          to="/teacher"
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
        >
          View Teacher Profile
        </Link>
      </div>

      <div
        style={{
          textAlign: 'center',
          padding: '2rem 1rem',
        }}
      >
        <h2>Begin Your Learning Journey</h2>

        <p style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>
          Take the next step towards learning the Holy Quran
          and Islamic Studies with our academy.
        </p>

        <Link
          to="/courses"
          className="btn btn-outline"
          style={{ margin: '0.5rem' }}
        >
          Explore Courses
        </Link>

        <Link
          to="/admission"
          className="btn btn-primary"
          style={{ margin: '0.5rem' }}
        >
          Apply for Admission
        </Link>
      </div>
    </section>
  );
}
