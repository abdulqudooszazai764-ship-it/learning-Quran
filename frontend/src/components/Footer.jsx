import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer>
      <div className="container">
        <div className="footer-links">
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/courses">{t('nav.courses')}</Link>
          <Link to="/admission">{t('nav.admission')}</Link>
          <Link to="/contact">{t('nav.contact')}</Link>
          <Link to="/privacy">{t('nav.privacy')}</Link>
        </div>
        <p>© {new Date().getFullYear()} Quran Learning Academy. {t('common.no_price_notice')}</p>
      </div>
    </footer>
  );
}
