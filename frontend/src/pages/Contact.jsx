import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../api/client';
import WhatsAppButton from '../components/WhatsAppButton.jsx';

export default function Contact() {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    client.get('/teacher-profile').then((res) => setProfile(res.data.profile)).catch(() => {});
  }, []);

  return (
    <section className="section container">
      <h1 className="section-title">{t('contact.title')}</h1>
      <div className="card" style={{ maxWidth: 500, margin: '0 auto' }}>
        {profile?.whatsapp_contact_number && (
          <p><strong>{t('contact.whatsapp')}:</strong> {profile.whatsapp_contact_number}</p>
        )}
        {profile?.contact_email && <p><strong>{t('contact.email')}:</strong> {profile.contact_email}</p>}
        {profile?.contact_phone && <p><strong>{t('contact.phone')}:</strong> {profile.contact_phone}</p>}
        {profile?.address && <p><strong>{t('contact.address')}:</strong> {profile.address}</p>}
        <div style={{ marginTop: 20 }}>
          <WhatsAppButton number={profile?.whatsapp_contact_number} />
        </div>
      </div>
    </section>
  );
}
