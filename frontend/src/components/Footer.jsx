import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer>
      <div className="container">
        <p>© {new Date().getFullYear()} Quran Learning Academy. {t('common.no_price_notice')}</p>
        <p>
          <Link to="/privacy">{t('nav.privacy')}</Link>
        </p>
      </div>
    </footer>
  );
}
