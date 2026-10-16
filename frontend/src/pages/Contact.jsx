import { Link } from 'react-router-dom';
import WhatsAppButton from '../components/WhatsAppButton.jsx';

export default function Contact() {
  return (
    <section className="section container">
      <h1 className="section-title">Contact Us</h1>

      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Have questions about learning the Holy Quran or Islamic Studies?
        We are happy to hear from you.
      </p>

      <div
        className="card"
        style={{
          maxWidth: '750px',
          margin: '0 auto',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          ☪
        </div>

        <h2 style={{ marginBottom: '1rem' }}>
          Haseen Quran and Islamic Studies Academy
        </h2>

        <p style={{ marginBottom: '1.5rem' }}>
          Our teacher, Ihsanullah Haseen, teaches Quran recitation,
          Quran memorization, Tajweed, Hadith, and Islamic Studies.
          Contact us to ask about lessons, class schedules, or admission.
        </p>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <WhatsAppButton />

          <Link to="/admission" className="btn btn-primary">
            Apply for Admission
          </Link>
        </div>

        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
          We welcome inquiries from students and families around the world.
        </p>
      </div>
    </section>
  );
}