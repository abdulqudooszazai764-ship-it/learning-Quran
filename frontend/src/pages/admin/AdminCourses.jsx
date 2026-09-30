import { useEffect, useState } from 'react';
import client from '../../api/client';

const empty = { nameEn: '', nameAr: '', nameFa: '', namePs: '', descriptionEn: '', descriptionAr: '', descriptionFa: '', descriptionPs: '' };

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const load = () => client.get('/courses/all').then((r) => setCourses(r.data.courses));
  useEffect(() => { load(); }, []);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function edit(c) {
    setEditId(c.id);
    setForm({
      nameEn: c.name_en || '', nameAr: c.name_ar || '', nameFa: c.name_fa || '', namePs: c.name_ps || '',
      descriptionEn: c.description_en || '', descriptionAr: c.description_ar || '', descriptionFa: c.description_fa || '', descriptionPs: c.description_ps || '',
    });
  }
  async function save(e) {
    e.preventDefault();
    if (editId) await client.put(`/courses/${editId}`, form); else await client.post('/courses', form);
    setForm(empty); setEditId(null); load();
  }
  async function toggle(c) { await client.put(`/courses/${c.id}`, { isActive: !c.is_active }); load(); }
  async function remove(id) {
    if (!window.confirm('Remove this course?')) return;
    await client.delete(`/courses/${id}`); load();
  }

  return (
    <div>
      <form className="card" onSubmit={save}>
        <h3>{editId ? 'Edit course' : 'Add course'}</h3>
        <div className="grid grid-2">
          <div className="form-group"><label>Name (English) *</label><input required value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} /></div>
          <div className="form-group"><label>Name (العربية)</label><input dir="rtl" value={form.nameAr} onChange={(e) => set('nameAr', e.target.value)} /></div>
          <div className="form-group"><label>Name (دری)</label><input dir="rtl" value={form.nameFa} onChange={(e) => set('nameFa', e.target.value)} /></div>
          <div className="form-group"><label>Name (پښتو)</label><input dir="rtl" value={form.namePs} onChange={(e) => set('namePs', e.target.value)} /></div>
        </div>
        <div className="form-group"><label>Description (English)</label><textarea rows="2" value={form.descriptionEn} onChange={(e) => set('descriptionEn', e.target.value)} /></div>
        <div className="form-group"><label>Description (العربية)</label><textarea dir="rtl" rows="2" value={form.descriptionAr} onChange={(e) => set('descriptionAr', e.target.value)} /></div>
        <div className="form-group"><label>Description (دری)</label><textarea dir="rtl" rows="2" value={form.descriptionFa} onChange={(e) => set('descriptionFa', e.target.value)} /></div>
        <div className="form-group"><label>Description (پښتو)</label><textarea dir="rtl" rows="2" value={form.descriptionPs} onChange={(e) => set('descriptionPs', e.target.value)} /></div>
        <button className="btn btn-primary" type="submit">Save</button>{' '}
        {editId && <button type="button" className="btn btn-secondary" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
      </form>
      <div className="card" style={{ marginTop: 20, overflowX: 'auto' }}>
        <table>
          <thead><tr><th>Course</th><th>Visible</th><th></th></tr></thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id}>
                <td>{c.name_en}</td><td>{c.is_active ? 'Yes' : 'Hidden'}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button className="btn btn-outline btn-small" onClick={() => edit(c)}>Edit</button>{' '}
                  <button className="btn btn-secondary btn-small" onClick={() => toggle(c)}>{c.is_active ? 'Hide' : 'Show'}</button>{' '}
                  <button className="btn btn-danger btn-small" onClick={() => remove(c.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
