import { useEffect, useState } from 'react';
import client from '../../api/client';

export default function AdminFamilies() {
  const [families, setFamilies] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [link, setLink] = useState('');
  const [newStudent, setNewStudent] = useState('');
  const [msg, setMsg] = useState(null);

  const load = () => client.get('/families').then((r) => setFamilies(r.data.families)).catch(() => {});
  useEffect(() => { load(); client.get('/courses/all').then((r) => setCourses(r.data.courses)); }, []);

  async function open(id) {
    const r = await client.get(`/families/${id}`);
    setSelected(r.data.family);
    setLink(r.data.family.whatsapp_group_link || '');
    setMsg(null);
  }

  async function saveLink() {
    await client.put(`/families/${selected.id}`, { whatsappGroupLink: link });
    setMsg('Saved.');
    load();
  }

  async function addStudent() {
    if (!newStudent.trim()) return;
    await client.post(`/families/${selected.id}/students`, { fullName: newStudent });
    setNewStudent('');
    open(selected.id);
  }

  async function removeStudent(id) {
    if (!window.confirm('Remove this student?')) return;
    await client.delete(`/families/students/${id}`);
    open(selected.id);
  }

  async function toggleCourse(student, courseId) {
    const ids = student.courses.map((c) => c.id);
    const next = ids.includes(courseId) ? ids.filter((i) => i !== courseId) : [...ids, courseId];
    await client.put(`/families/students/${student.id}`, { courseIds: next });
    open(selected.id);
  }

  async function removeFamily(id) {
    if (!window.confirm('Delete this whole family and all their records?')) return;
    await client.delete(`/families/${id}`);
    setSelected(null);
    load();
  }

  return (
    <div>
      <div className="card" style={{ overflowX: 'auto' }}>
        <table>
          <thead><tr><th>Family</th><th>Guardian</th><th>Country</th><th>WhatsApp</th><th>Students</th><th></th></tr></thead>
          <tbody>
            {families.map((f) => (
              <tr key={f.id}>
                <td>{f.family_name}</td><td>{f.guardian_name}</td><td>{f.country}</td>
                <td>{f.whatsapp_number}</td><td>{f.student_count}</td>
                <td><button className="btn btn-outline btn-small" onClick={() => open(f.id)}>Open</button></td>
              </tr>
            ))}
            {families.length === 0 && <tr><td colSpan="6">No families yet. Accept an admission request to create one.</td></tr>}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3>{selected.family_name}</h3>
          {msg && <div className="alert alert-success">{msg}</div>}
          <div className="form-group">
            <label>WhatsApp class/group link (https://chat.whatsapp.com/...)</label>
            <input value={link} onChange={(e) => setLink(e.target.value)} />
          </div>
          <button className="btn btn-primary btn-small" onClick={saveLink}>Save link</button>
          {selected.whatsapp_number && (
            <a className="btn btn-whatsapp btn-small" style={{ marginInlineStart: 8 }} target="_blank" rel="noopener noreferrer"
               href={`https://wa.me/${selected.whatsapp_number.replace(/\D/g, '')}`}>Chat with family</a>
          )}

          <h4 style={{ marginTop: 24 }}>Students</h4>
          {selected.students.map((s) => (
            <div key={s.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <strong>{s.full_name}</strong>{' '}
              <button className="btn btn-danger btn-small" onClick={() => removeStudent(s.id)}>Remove</button>
              <div className="form-checkbox-group" style={{ marginTop: 8 }}>
                {courses.map((c) => (
                  <label key={c.id}>
                    <input type="checkbox" checked={s.courses.some((x) => x.id === c.id)} onChange={() => toggleCourse(s, c.id)} />
                    {c.name_en}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input style={{ flex: 1, padding: 8 }} placeholder="New student name" value={newStudent} onChange={(e) => setNewStudent(e.target.value)} />
            <button className="btn btn-primary btn-small" onClick={addStudent}>Add</button>
          </div>
          <button className="btn btn-danger btn-small" style={{ marginTop: 20 }} onClick={() => removeFamily(selected.id)}>Delete family</button>
        </div>
      )}
    </div>
  );
}
