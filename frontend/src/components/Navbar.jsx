import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setAppLanguage } from '../i18n/index.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-logo" aria-hidden="true">☾</span>
          Quran Academy
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <div className={`nav-links${menuOpen ? ' open' : ''}`}>
          <Link to="/" className={isActive('/')} onClick={closeMenu}>{t('nav.home')}</Link>
          <Link to="/about" className={isActive('/about')} onClick={closeMenu}>{t('nav.about')}</Link>
          <Link to="/teacher" className={isActive('/teacher')} onClick={closeMenu}>{t('nav.teacher')}</Link>
          <Link to="/courses" className={isActive('/courses')} onClick={closeMenu}>{t('nav.courses')}</Link>
          <Link to="/admission" className={isActive('/admission')} onClick={closeMenu}>{t('nav.admission')}</Link>
          <Link to="/contact" className={isActive('/contact')} onClick={closeMenu}>{t('nav.contact')}</Link>

          {!user && (
            <Link to="/login" className={isActive('/login')} onClick={closeMenu}>{t('nav.login')}</Link>
          )}
          {user?.role === 'family' && (
            <Link to="/dashboard" className={isActive('/dashboard')} onClick={closeMenu}>{t('nav.dashboard')}</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className={isActive('/admin')} onClick={closeMenu}>{t('nav.dashboard')}</Link>
          )}
          {user && (
            <button type="button" className="nav-btn" onClick={handleLogout}>
              {t('nav.logout')}
            </button>
          )}

          <select
            className="lang-select"
            value={i18n.language}
            onChange={(e) => {
              setAppLanguage(e.target.value);
              closeMenu();
            }}
            aria-label="Language"
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
