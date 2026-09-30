import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();
  return (
    <section className="section container">
      <h1 className="section-title">{t('about.title')}</h1>
      <div className="card">
        <p>{t('about.mission')}</p>
      </div>
    </section>
  );
}
