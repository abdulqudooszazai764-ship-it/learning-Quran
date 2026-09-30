import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import client from '../api/client';

export default function Courses() {
  const { t, i18n } = useTranslation();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    client.get('/courses').then((res) => setCourses(res.data.courses)).catch(() => {});
  }, []);

  const lang = i18n.language;

  return (
    <section className="section container">
      <h1 className="section-title">{t('courses.title')}</h1>
      <div className="grid grid-3">
        {courses.map((c) => (
          <div className="card" key={c.id}>
            <h3>{c[`name_${lang}`] || c.name_en}</h3>
            <p>{c[`description_${lang}`] || c.description_en || '—'}</p>
            <Link to="/admission" className="btn btn-primary btn-small">
              {t('courses.apply_for_this_course')}
            </Link>
          </div>
        ))}
      </div>
      {courses.length === 0 && <p>{t('common.loading')}</p>}
    </section>
  );
}
