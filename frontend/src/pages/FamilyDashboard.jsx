import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';

const TABS = ['overview', 'classes', 'teacher', 'questions'];

export default function FamilyDashboard() {
  const { t } = useTranslation();
  const { family, reload } = useAuth();
  const [tab, setTab] = useState('overview');
  const [classes, setClasses] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [qError, setQError] = useState(null);
  const [qSuccess, setQSuccess] = useState(null);

  useEffect(() => {
    client.get('/classes/me').then((res) => setClasses(res.data.classes)).catch(() => {});
    client.get('/teacher-profile').then((res) => setTeacher(res.data.profile)).catch(() => {});
    client.get('/questions/me').then((res) => setQuestions(res.data.questions)).catch(() => {});
  }, []);

  async function submitQuestion(e) {
    e.preventDefault();
    setQError(null);
    setQSuccess(null);
    if (!newQuestion.trim()) return;
    try {
      await client.post('/questions', { question: newQuestion, studentId: selectedStudent || null });
      setNewQuestion('');
      setQSuccess('Your question has been sent to the teacher.');
      const res = await client.get('/questions/me');
      setQuestions(res.data.questions);
    } catch (err) {
      setQError(err.response?.data?.error || 'Could not send your question.');
    }
  }

  if (!family) return <div className="container" style={{ padding: 40 }}>{t('common.loading')}</div>;

  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar">
        {TABS.map((tb) => (
          <button key={tb} className={tab === tb ? 'active' : ''} onClick={() => setTab(tb)}>
            {t(`family_dashboard.${tb === 'overview' ? 'title' : tb === 'classes' ? 'class_schedule' : tb === 'teacher' ? 'teacher_info' : 'my_questions'}`)}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        <h1>{t('family_dashboard.welcome')}, {family.guardian_name}</h1>

        {tab === 'overview' && (
          <div className="card">
            <p><strong>{t('admission.family_name')}:</strong> {family.family_name}</p>
            <p><strong>{t('admission.country')}:</strong> {family.country}</p>
            <p><strong>{t('admission.contact_number')}:</strong> {family.contact_number}</p>
            <h3>{t('family_dashboard.students')}</h3>
            <table>
              <thead><tr><th>Name</th><th>{t('family_dashboard.courses')}</th></tr></thead>
              <tbody>
                {family.students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.full_name}</td>
                    <td>{s.courses.map((c) => c.name_en).join(', ') || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={{ marginTop: 20 }}>{t('family_dashboard.whatsapp_class_link')}</h3>
            {family.whatsapp_group_link ? (
              <a href={family.whatsapp_group_link} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                {t('family_dashboard.whatsapp_class_link')}
              </a>
            ) : (
              <p>{t('family_dashboard.no_link_yet')}</p>
            )}
          </div>
        )}

        {tab === 'classes' && (
          <div className="card">
            <table>
              <thead><tr><th>Date/Time</th><th>Course</th><th>Duration</th><th>Status</th></tr></thead>
              <tbody>
                {classes.map((c) => (
                  <tr key={c.id}>
                    <td>{new Date(c.class_datetime).toLocaleString()}</td>
                    <td>{c.course_name || '—'}</td>
                    <td>{c.duration_minutes} min</td>
                    <td>{c.status}</td>
                  </tr>
                ))}
                {classes.length === 0 && <tr><td colSpan="4">No classes scheduled yet.</td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'teacher' && teacher && (
          <div className="card">
            <h3>{teacher.teacher_name}</h3>
            <p>{teacher.bio_en}</p>
            {teacher.qualifications && <p><strong>{t('teacher.qualifications')}:</strong> {teacher.qualifications}</p>}
            {teacher.whatsapp_contact_number && <WhatsAppButton number={teacher.whatsapp_contact_number} />}
          </div>
        )}

        {tab === 'questions' && (
          <div className="card">
            <h3>{t('family_dashboard.ask_question')}</h3>
            {qError && <div className="alert alert-error">{qError}</div>}
            {qSuccess && <div className="alert alert-success">{qSuccess}</div>}
            <form onSubmit={submitQuestion}>
              <div className="form-group">
                <label>Student (optional)</label>
                <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
                  <option value="">—</option>
                  {family.students.map((s) => (
                    <option key={s.id} value={s.id}>{s.full_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <textarea rows="3" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="Type your question..." />
              </div>
              <button type="submit" className="btn btn-primary">{t('family_dashboard.ask_question')}</button>
            </form>

            <h3 style={{ marginTop: 30 }}>{t('family_dashboard.my_questions')}</h3>
            {questions.map((q) => (
              <div key={q.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                <p><strong>Q:</strong> {q.question}</p>
                {q.answer ? <p><strong>A:</strong> {q.answer}</p> : <p style={{ color: '#999' }}>Awaiting teacher's answer...</p>}
              </div>
            ))}
            {questions.length === 0 && <p>No questions yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
