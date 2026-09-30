import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../../api/client';

export default function AdminAdmissions() {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(null); // admission being decided
  const [message, setMessage] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState(null);

  const load = () => client.get('/admissions').then((r) => setList(r.data.admissions)).catch(() => {});
  useEffect(() => { load(); }, []);

  function startDecision(a) {
    setOpen(a); setMessage(''); setLoginEmail(''); setLoginPassword(''); setError(null);
  }

  async function decide(decision) {
    setError(null);
    try {
      await client.post(`/admissions/${open.id}/decision`, { decision, message, loginEmail, loginPassword });
      setOpen(null);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Error');
    }
  }

  return (
    <div>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead><tr><th>Family</th><th>Guardian</th><th>Students</th><th>Courses</th><th>WhatsApp</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id}>
                <td>{a.family_name}<br /><small>{a.country}</small></td>
                <td>{a.guardian_name}</td>
                <td>{a.student_names}</td>
                <td>{a.selected_courses}<br /><small>{a.preferred_time}</small></td>
                <td>{a.whatsapp_number}</td>
                <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                <td>{a.status === 'pending' && <button className="btn btn-primary btn-small" onClick={() => startDecision(a)}>Review</button>}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan="7">No applications yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3>{open.family_name}</h3>
          {open.notes && <p><em>{open.notes}</em></p>}
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label>{t('admin_dashboard.message_optional')}</label>
            <textarea rows="2" value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <h4>{t('admin_dashboard.set_login')}</h4>
          <div className="form-group">
            <label>{t('admin_dashboard.username')}</label>
            <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label>{t('admin_dashboard.temporary_password')}</label>
            <input value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" onClick={() => decide('accepted')}>{t('admin_dashboard.accept')}</button>
            <button className="btn btn-danger" onClick={() => decide('declined')}>{t('admin_dashboard.decline')}</button>
            <button className="btn btn-secondary" onClick={() => setOpen(null)}>{t('common.cancel')}</button>
          </div>
          <p className="alert alert-info" style={{ marginTop: 12 }}>
            After accepting, send the username and password to the family on WhatsApp ({open.whatsapp_number}).
          </p>
        </div>
      )}
    </div>
  );
}
