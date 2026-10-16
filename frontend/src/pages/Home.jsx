import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client from '../api/client';
import WhatsAppButton from '../components/WhatsAppButton.jsx';

export default function Home() {
  const { t, i18n } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    client.get('/courses').then((res) => setCourses(res.data.courses.slice(0, 6))).catch(() => {});
    client.get('/testimonials').then((res) => setTestimonials(res.data.testimonials)).catch(() => {});
    client.get('/faqs').then((res) => setFaqs(res.data.faqs)).catch(() => {});
  }, []);

  const lang = i18n.language;
  const nameField = `name_${lang}`;
  const questionField = `question_${lang}`;
  const answerField = `answer_${lang}`;
  const messageField = `message_${lang}`;

  return (
    <div>
      <section className="hero">
        <h1>{t('home.hero_title')}</h1>
        <p>{t('home.hero_subtitle')}</p>
        <div className="hero-actions">
          <Link to="/admission" className="btn btn-primary">{t('home.apply_now')}</Link>
          <WhatsAppButton />
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">{t('home.why_us')}</h2>
        <div className="grid grid-3">
          <div className="card"><h3>{t('home.why_1_title')}</h3><p>{t('home.why_1_text')}</p></div>
          <div className="card"><h3>{t('home.why_2_title')}</h3><p>{t('home.why_2_text')}</p></div>
          <div className="card"><h3>{t('home.why_3_title')}</h3><p>{t('home.why_3_text')}</p></div>
        </div>
      </section>

      <section className="section container">
        <h2 className="section-title">{t('home.courses_title')}</h2>
        <div className="grid grid-3">
          {courses.map((c) => (
            <div className="card" key={c.id}>
              <h3>{c[nameField] || c.name_en}</h3>
              <p>{c[`description_${lang}`] || c.description_en}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link to="/courses" className="btn btn-outline">{t('home.view_all_courses')}</Link>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section container">
          <h2 className="section-title">{t('home.reviews_title')}</h2>
          <div className="grid grid-3">
            {testimonials.map((tItem) => (
              <div className="card" key={tItem.id}>
                <p>“{tItem[messageField] || tItem.message_en}”</p>
                <strong>{tItem.student_or_family_name}</strong>
                {tItem.country && <div style={{ color: '#777', fontSize: '0.85rem' }}>{tItem.country}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="section container">
          <h2 className="section-title">{t('home.faq_title')}</h2>
          <div className="grid grid-2">
            {faqs.map((f) => (
              <div className="card" key={f.id}>
                <h3>{f[questionField] || f.question_en}</h3>
                <p>{f[answerField] || f.answer_en}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <WhatsAppButton floating />
    </div>
  );
}

