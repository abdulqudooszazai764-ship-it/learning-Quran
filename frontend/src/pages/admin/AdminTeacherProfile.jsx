import { useEffect, useState } from 'react';
import client from '../../api/client';

export default function AdminTeacherProfile() {
  const [p, setP] = useState(null);
  const [msg, setMsg] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [tForm, setTForm] = useState({ name: '', country: '', messageEn: '' });
  const [faq, setFaq] = useState({ questionEn: '', answerEn: '' });
  const [faqs, setFaqs] = useState([]);

  const loadT = () => client.get('/testimonials/all').then((r) => setTestimonials(r.data.testimonials));
  const loadF = () => client.get('/faqs').then((r) => setFaqs(r.data.faqs));
  useEffect(() => { client.get('/teacher-profile').then((r) => setP(r.data.profile)); loadT(); loadF(); }, []);

  if (!p) return <div>Loading...</div>;
  const set = (k, v) => setP((x) => ({ ...x, [k]: v }));

  async function save(e) {
    e.preventDefault();
    await client.put('/teacher-profile', {
      academyName: p.academy_name, teacherName: p.teacher_name, photoUrl: p.photo_url,
      bioEn: p.bio_en, bioAr: p.bio_ar, bioFa: p.bio_fa, bioPs: p.bio_ps,
      qualifications: p.qualifications, experienceYears: p.experience_years ? Number(p.experience_years) : null,
      whatsappContactNumber: p.whatsapp_contact_number, contactEmail: p.contact_email,
      contactPhone: p.contact_phone, address: p.address,
    });
    setMsg('Saved.');
  }

  const field = (label, key, extra = {}) => (
    <div className="form-group"><label>{label}</label>
      {extra.area ? <textarea rows="3" dir={extra.rtl ? 'rtl' : undefined} value={p[key] || ''} onChange={(e) => set(key, e.target.value)} />
        : <input value={p[key] || ''} onChange={(e) => set(key, e.target.value)} />}
    </div>
  );

  return (
    <div>
      <form className="card" onSubmit={save}>
        {msg && <div className="alert alert-success">{msg}</div>}
        {field('Academy name', 'academy_name')}
        {field('Teacher name', 'teacher_name')}
        {field('Photo URL (link to an image)', 'photo_url')}
        {field('Biography (English)', 'bio_en', { area: true })}
        {field('Biography (العربية)', 'bio_ar', { area: true, rtl: true })}
        {field('Biography (دری)', 'bio_fa', { area: true, rtl: true })}
        {field('Biography (پښتو)', 'bio_ps', { area: true, rtl: true })}
        {field('Qualifications', 'qualifications', { area: true })}
        {field('Years of experience', 'experience_years')}
        {field('WhatsApp number (digits only, with country code, e.g. 93700000000)', 'whatsapp_contact_number')}
        {field('Contact email', 'contact_email')}
        {field('Contact phone', 'contact_phone')}
        {field('Address', 'address')}
        <button className="btn btn-primary" type="submit">Save profile</button>
      </form>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>Testimonials (only add real feedback you received)</h3>
        {testimonials.map((t) => (
          <div key={t.id} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
            “{t.message_en}” — <strong>{t.student_or_family_name}</strong> {t.is_published ? '' : '(hidden)'}{' '}
            <button className="btn btn-secondary btn-small" onClick={async () => { await client.put(`/testimonials/${t.id}`, { isPublished: !t.is_published }); loadT(); }}>{t.is_published ? 'Hide' : 'Show'}</button>{' '}
            <button className="btn btn-danger btn-small" onClick={async () => { await client.delete(`/testimonials/${t.id}`); loadT(); }}>Delete</button>
          </div>
        ))}
        <div className="form-group" style={{ marginTop: 12 }}><input placeholder="Name" value={tForm.name} onChange={(e) => setTForm({ ...tForm, name: e.target.value })} /></div>
        <div className="form-group"><input placeholder="Country" value={tForm.country} onChange={(e) => setTForm({ ...tForm, country: e.target.value })} /></div>
        <div className="form-group"><textarea rows="2" placeholder="Their message" value={tForm.messageEn} onChange={(e) => setTForm({ ...tForm, messageEn: e.target.value })} /></div>
        <button className="btn btn-primary btn-small" onClick={async () => { await client.post('/testimonials', tForm); setTForm({ name: '', country: '', messageEn: '' }); loadT(); }}>Add testimonial</button>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <h3>FAQ</h3>
        {faqs.map((f) => (
          <div key={f.id} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
            <strong>{f.question_en}</strong> — {f.answer_en}{' '}
            <button className="btn btn-danger btn-small" onClick={async () => { await client.delete(`/faqs/${f.id}`); loadF(); }}>Delete</button>
          </div>
        ))}
        <div className="form-group" style={{ marginTop: 12 }}><input placeholder="Question" value={faq.questionEn} onChange={(e) => setFaq({ ...faq, questionEn: e.target.value })} /></div>
        <div className="form-group"><textarea rows="2" placeholder="Answer" value={faq.answerEn} onChange={(e) => setFaq({ ...faq, answerEn: e.target.value })} /></div>
        <button className="btn btn-primary btn-small" onClick={async () => { await client.post('/faqs', faq); setFaq({ questionEn: '', answerEn: '' }); loadF(); }}>Add FAQ</button>
      </div>
    </div>
  );
}
