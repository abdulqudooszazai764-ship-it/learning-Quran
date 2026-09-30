import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../api/client';
import AdminFamilies from './admin/AdminFamilies.jsx';
import AdminAdmissions from './admin/AdminAdmissions.jsx';
import AdminSchedule from './admin/AdminSchedule.jsx';
import AdminQuestions from './admin/AdminQuestions.jsx';
import AdminTeacherProfile from './admin/AdminTeacherProfile.jsx';
import AdminCourses from './admin/AdminCourses.jsx';

const TABS = [
  'overview', 'families', 'admissions', 'schedule', 'questions', 'courses_management', 'teacher_profile',
];

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (tab === 'overview') {
      client.get('/families/dashboard-stats').then((res) => setStats(res.data)).catch(() => {});
    }
  }, [tab]);

  return (
    <div className="dashboard-layout">
      <div className="dashboard-sidebar">
        {TABS.map((tb) => (
          <button key={tb} className={tab === tb ? 'active' : ''} onClick={() => setTab(tb)}>
            {t(`admin_dashboard.${tb === 'overview' ? 'overview' : tb}`)}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
        <h1>{t('admin_dashboard.title')}</h1>

        {tab === 'overview' && stats && (
          <div>
            <div className="grid grid-3" style={{ marginBottom: 24 }}>
              <div className="card stat-card">
                <div className="stat-number">{stats.totalFamilies}</div>
                <div className="stat-label">{t('admin_dashboard.total_families')}</div>
              </div>
              <div className="card stat-card">
                <div className="stat-number">{stats.totalStudents}</div>
                <div className="stat-label">{t('admin_dashboard.total_students')}</div>
              </div>
              <div className="card stat-card">
                <div className="stat-number">{stats.pendingAdmissions}</div>
                <div className="stat-label">{t('admin_dashboard.pending_admissions')}</div>
              </div>
              <div className="card stat-card">
                <div className="stat-number">{stats.upcomingClasses}</div>
                <div className="stat-label">{t('admin_dashboard.upcoming_classes')}</div>
              </div>
            </div>
            <div className="card">
              <h3>{t('admin_dashboard.recent_questions')}</h3>
              {stats.recentQuestions.length === 0 && <p>No questions yet.</p>}
              {stats.recentQuestions.map((q) => (
                <div key={q.id} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                  <strong>{q.family_name}:</strong> {q.question}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'families' && <AdminFamilies />}
        {tab === 'admissions' && <AdminAdmissions />}
        {tab === 'schedule' && <AdminSchedule />}
        {tab === 'questions' && <AdminQuestions />}
        {tab === 'courses_management' && <AdminCourses />}
        {tab === 'teacher_profile' && <AdminTeacherProfile />}
      </div>
    </div>
  );
}
