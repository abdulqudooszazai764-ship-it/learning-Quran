import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="section container">
      <h1 className="section-title">{t('auth.login_title')}</h1>
      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-group">
          <label>{t('auth.email_or_username')}</label>
          <input required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>{t('auth.password')}</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
          {t('auth.login_button')}
        </button>
        <p style={{ marginTop: 16, fontSize: '0.85rem', color: '#666' }}>{t('auth.login_help')}</p>
      </form>
    </section>
  );
}
