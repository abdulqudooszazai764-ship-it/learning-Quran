import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setAppLanguage } from '../i18n/index.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-logo">☾</span>
          Quran Academy
        </Link>
        <div className="nav-links">
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/teacher">{t('nav.teacher')}</Link>
          <Link to="/courses">{t('nav.courses')}</Link>
          <Link to="/admission">{t('nav.admission')}</Link>
          <Link to="/contact">{t('nav.contact')}</Link>

          {!user && <Link to="/login">{t('nav.login')}</Link>}
          {user && user.role === 'family' && <Link to="/dashboard">{t('nav.dashboard')}</Link>}
          {user && user.role === 'admin' && <Link to="/admin">{t('nav.dashboard')}</Link>}
          {user && <button onClick={handleLogout}>{t('nav.logout')}</button>}

          <select
            className="lang-select"
            value={i18n.language}
            onChange={(e) => setAppLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="fa">دری</option>
            <option value="ps">پښتو</option>
          </select>
        </div>
      </div>
    </nav>
  );
}
