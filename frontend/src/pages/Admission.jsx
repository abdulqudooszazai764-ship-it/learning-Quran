import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../api/client';

const initialForm = {
  familyName: '', guardianName: '', country: '', contactNumber: '', whatsappNumber: '',
  sameAsContact: true, numberOfStudents: 1, studentNames: '', selectedCourses: [],
  preferredTime: '', notes: '',
};

export default function Admission() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [statusNumber, setStatusNumber] = useState('');
  const [statusResults, setStatusResults] = useState(null);
  const [statusError, setStatusError] = useState(null);

  useEffect(() => {
    client.get('/courses').then((res) => setCourses(res.data.courses)).catch(() => {});
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleCourse(name) {
    setForm((f) => {
      const has = f.selectedCourses.includes(name);
      return {
        ...f,
        selectedCourses: has ? f.selectedCourses.filter((c) => c !== name) : [...f.selectedCourses, name],
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);
    try {
      const whatsappNumber = form.sameAsContact ? form.contactNumber : form.whatsappNumber;
      const res = await client.post('/admissions', {
        familyName: form.familyName,
        guardianName: form.guardianName,
        country: form.country,
        contactNumber: form.contactNumber,
        whatsappNumber,
        numberOfStudents: Number(form.numberOfStudents) || 1,
        studentNames: form.studentNames,
        selectedCourses: form.selectedCourses.join(', '),
        preferredTime: form.preferredTime,
        notes: form.notes,
      });
      setMessage(t('admission.success'));
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCheckStatus(e) {
    e.preventDefault();
    setStatusError(null);
    setStatusResults(null);
    try {
      const res = await client.get('/admissions/status', { params: { contactNumber: statusNumber } });
      setStatusResults(res.data.admissions);
    } catch (err) {
      setStatusError(err.response?.data?.error || 'Could not check status.');
    }
  }

  const lang = i18n.language;

  return (
    <section className="section container">
      <h1 className="section-title">{t('admission.title')}</h1>
      <p style={{ textAlign: 'center', marginBottom: 30 }}>{t('admission.subtitle')}</p>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 640, margin: '0 auto 40px' }}>
        <div className="form-group">
          <label>{t('admission.family_name')} *</label>
          <input required value={form.familyName} onChange={(e) => update('familyName', e.target.value)} />
        </div>
        <div className="form-group">
          <label>{t('admission.guardian_name')} *</label>
          <input required value={form.guardianName} onChange={(e) => update('guardianName', e.target.value)} />
        </div>
        <div className="form-group">
          <label>{t('admission.country')}</label>
          <input value={form.country} onChange={(e) => update('country', e.target.value)} />
        </div>
        <div className="form-group">
          <label>{t('admission.contact_number')} *</label>
          <input required value={form.contactNumber} onChange={(e) => update('contactNumber', e.target.value)} />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={form.sameAsContact}
              onChange={(e) => update('sameAsContact', e.target.checked)}
              style={{ width: 'auto', marginInlineEnd: 6 }}
            />
            {t('admission.same_as_contact')}
          </label>
        </div>
        {!form.sameAsContact && (
          <div className="form-group">
            <label>{t('admission.whatsapp_number')} *</label>
            <input required value={form.whatsappNumber} onChange={(e) => update('whatsappNumber', e.target.value)} />
          </div>
        )}
        <div className="form-group">
          <label>{t('admission.number_of_students')}</label>
          <input type="number" min="1" value={form.numberOfStudents} onChange={(e) => update('numberOfStudents', e.target.value)} />
        </div>
        <div className="form-group">
          <label>{t('admission.student_names')} *</label>
          <input required value={form.studentNames} onChange={(e) => update('studentNames', e.target.value)} placeholder={t('admission.student_names_hint')} />
        </div>
        <div className="form-group">
          <label>{t('admission.selected_courses')}</label>
          <div className="form-checkbox-group">
            {courses.map((c) => (
              <label key={c.id}>
                <input
                  type="checkbox"
                  checked={form.selectedCourses.includes(c.name_en)}
                  onChange={() => toggleCourse(c.name_en)}
                />
                {c[`name_${lang}`] || c.name_en}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>{t('admission.preferred_time')}</label>
          <input value={form.preferredTime} onChange={(e) => update('preferredTime', e.target.value)} />
        </div>
        <div className="form-group">
          <label>{t('admission.notes')}</label>
          <textarea rows="3" value={form.notes} onChange={(e) => update('notes', e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? t('common.loading') : t('admission.submit')}
        </button>
      </form>

      <div className="card" style={{ maxWidth: 640, margin: '0 auto' }}>
        <h3>{t('admission.check_status_title')}</h3>
        <form onSubmit={handleCheckStatus} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <input
            style={{ flex: 1, minWidth: 200, padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc' }}
            placeholder={t('admission.contact_number')}
            value={statusNumber}
            onChange={(e) => setStatusNumber(e.target.value)}
          />
          <button type="submit" className="btn btn-outline">{t('admission.check_status_button')}</button>
        </form>
        {statusError && <div className="alert alert-error" style={{ marginTop: 12 }}>{statusError}</div>}
        {statusResults && (
          <div style={{ marginTop: 16 }}>
            {statusResults.length === 0 && <p>No applications found for this number.</p>}
            {statusResults.map((a) => (
              <div key={a.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                <strong>{a.family_name}</strong>{' '}
                <span className={`badge badge-${a.status}`}>{t(`admission.status_${a.status}`)}</span>
                {a.teacher_message && <p style={{ marginTop: 6 }}>{a.teacher_message}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
