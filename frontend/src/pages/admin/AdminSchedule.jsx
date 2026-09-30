import { useEffect, useState } from 'react';
import client from '../../api/client';

const TIMEZONES = ['Asia/Kabul', 'Asia/Riyadh', 'Asia/Karachi', 'Asia/Dubai', 'Europe/London', 'Europe/Berlin', 'Europe/Stockholm', 'America/New_York', 'America/Chicago', 'America/Los_Angeles', 'America/Toronto', 'Australia/Sydney', 'UTC'];
const empty = { familyId: '', courseId: '', title: '', date: '', time: '', timezone: 'Asia/Kabul', durationMinutes: 30, whatsappLink: '' };

// Converts a wall-clock date/time in a given IANA timezone to a UTC ISO string.
function toUtcIso(date, time, tz) {
  const asUtc = new Date(`${date}T${time}:00Z`);
  const inTz = new Date(asUtc.toLocaleString('en-US', { timeZone: tz }));
  const offset = inTz.getTime() - asUtc.getTime();
  return new Date(asUtc.getTime() - offset).toISOString();
}

export default function AdminSchedule() {
  const [classes, setClasses] = useState([]);
  const [families, setFamilies] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(empty);
  const [attClass, setAttClass] = useState(null);
  const [attStudents, setAttStudents] = useState([]);
  const [attMap, setAttMap] = useState({});
  const [error, setError] = useState(null);

  const load = () => client.get('/classes').then((r) => setClasses(r.data.classes));
  useEffect(() => {
    load();
    client.get('/families').then((r) => setFamilies(r.data.families));
    client.get('/courses/all').then((r) => setCourses(r.data.courses));
  }, []);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function create(e) {
    e.preventDefault();
    setError(null);
    try {
      await client.post('/classes', {
        familyId: form.familyId, courseId: form.courseId || null, title: form.title,
        classDatetime: toUtcIso(form.date, form.time, form.timezone),
        timezone: form.timezone, durationMinutes: Number(form.durationMinutes), whatsappLink: form.whatsappLink,
      });
      setForm(empty);
      load();
    } catch (err) { setError(err.response?.data?.error || 'Error'); }
  }

  async function cancelClass(id) {
    await client.put(`/classes/${id}`, { status: 'cancelled' });
    load();
  }
  async function removeClass(id) {
    if (!window.confirm('Delete this class?')) return;
    await client.delete(`/classes/${id}`);
    load();
  }

  async function openAttendance(c) {
    const fam = await client.get(`/families/${c.family_id}`);
    const att = await client.get(`/classes/${c.id}/attendance`);
    const map = {};
    att.data.attendance.forEach((a) => { map[a.student_id] = a.status; });
    setAttClass(c); setAttStudents(fam.data.family.students); setAttMap(map);
  }
  async function saveAttendance() {
    const records = attStudents.filter((s) => attMap[s.id]).map((s) => ({ studentId: s.id, status: attMap[s.id] }));
    await client.post(`/classes/${attClass.id}/attendance`, { records });
    setAttClass(null);
  }

  return (
    <div>
      <form className="card" onSubmit={create}>
        <h3>New class</h3>
        {error && <div className="alert alert-error">{error}</div>}
        <div className="grid grid-2">
          <div className="form-group"><label>Family / group</label>
            <select required value={form.familyId} onChange={(e) => set('familyId', e.target.value)}>
              <option value="">—</option>{families.map((f) => <option key={f.id} value={f.id}>{f.family_name}</option>)}
            </select></div>
          <div className="form-group"><label>Course</label>
            <select value={form.courseId} onChange={(e) => set('courseId', e.target.value)}>
              <option value="">—</option>{courses.map((c) => <option key={c.id} value={c.id}>{c.name_en}</option>)}
            </select></div>
          <div className="form-group"><label>Date</label><input required type="date" value={form.date} onChange={(e) => set('date', e.target.value)} /></div>
          <div className="form-group"><label>Time</label><input required type="time" value={form.time} onChange={(e) => set('time', e.target.value)} /></div>
          <div className="form-group"><label>Time zone</label>
            <select value={form.timezone} onChange={(e) => set('timezone', e.target.value)}>{TIMEZONES.map((z) => <option key={z}>{z}</option>)}</select></div>
          <div className="form-group"><label>Duration (minutes)</label><input type="number" min="10" value={form.durationMinutes} onChange={(e) => set('durationMinutes', e.target.value)} /></div>
        </div>
        <div className="form-group"><label>Title (optional)</label><input value={form.title} onChange={(e) => set('title', e.target.value)} /></div>
        <div className="form-group"><label>WhatsApp class link (optional)</label><input value={form.whatsappLink} onChange={(e) => set('whatsappLink', e.target.value)} /></div>
        <button className="btn btn-primary" type="submit">Create class</button>
      </form>

      <div className="card" style={{ marginTop: 20, overflowX: 'auto' }}>
        <table>
          <thead><tr><th>When</th><th>Family</th><th>Course</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c.id}>
                <td>{new Date(c.class_datetime).toLocaleString('en-GB', { timeZone: c.timezone })}<br /><small>{c.timezone} · {c.duration_minutes} min</small></td>
                <td>{c.family_name}</td><td>{c.course_name || '—'}</td><td>{c.status}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button className="btn btn-outline btn-small" onClick={() => openAttendance(c)}>Attendance</button>{' '}
                  {c.status === 'scheduled' && <button className="btn btn-secondary btn-small" onClick={() => cancelClass(c.id)}>Cancel</button>}{' '}
                  <button className="btn btn-danger btn-small" onClick={() => removeClass(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {classes.length === 0 && <tr><td colSpan="5">No classes yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {attClass && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3>Attendance – {attClass.family_name}</h3>
          {attStudents.map((s) => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <span>{s.full_name}</span>
              <select value={attMap[s.id] || ''} onChange={(e) => setAttMap((m) => ({ ...m, [s.id]: e.target.value }))}>
                <option value="">—</option><option value="present">Present</option><option value="absent">Absent</option><option value="excused">Excused</option>
              </select>
            </div>
          ))}
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" onClick={saveAttendance}>Save</button>
            <button className="btn btn-secondary" onClick={() => setAttClass(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
