import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../api/client';
import WhatsAppButton from '../components/WhatsAppButton.jsx';

export default function TeacherProfile() {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    client.get('/teacher-profile').then((res) => setProfile(res.data.profile)).catch(() => {});
  }, []);

  if (!profile) return <section className="section container">{t('common.loading')}</section>;

  const bio = profile[`bio_${i18n.language}`] || profile.bio_en;

  return (
    <section className="section container">
      <h1 className="section-title">{t('teacher.title')}</h1>
      <div className="card" style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {profile.photo_url && (
          <img
            src={profile.photo_url}
            alt={profile.teacher_name}
            style={{ width: 180, height: 180, borderRadius: '50%', objectFit: 'cover' }}
          />
        )}
        <div style={{ flex: 1, minWidth: 260 }}>
          <h2>{profile.teacher_name}</h2>
          <p>{bio}</p>
          {profile.qualifications && (
            <p><strong>{t('teacher.qualifications')}:</strong> {profile.qualifications}</p>
          )}
          {profile.experience_years && (
            <p><strong>{t('teacher.experience')}:</strong> {profile.experience_years} {t('teacher.years')}</p>
          )}
          {profile.whatsapp_contact_number && (
            <WhatsAppButton number={profile.whatsapp_contact_number} />
          )}
        </div>
      </div>
    </section>
  );
}
