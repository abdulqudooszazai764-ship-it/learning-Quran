import { useTranslation } from 'react-i18next';

export default function PrivacyPolicy() {
  const { t } = useTranslation();
  return (
    <section className="section container">
      <h1 className="section-title">{t('privacy.title')}</h1>
      <div className="card">
        <p>{t('privacy.body')}</p>
      </div>
    </section>
  );
}
