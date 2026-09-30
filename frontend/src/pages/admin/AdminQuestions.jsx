import { useEffect, useState } from 'react';
import client from '../../api/client';

export default function AdminQuestions() {
  const [list, setList] = useState([]);
  const [answers, setAnswers] = useState({});
  const load = () => client.get('/questions').then((r) => setList(r.data.questions));
  useEffect(() => { load(); }, []);

  async function save(id) {
    if (!answers[id]?.trim()) return;
    await client.put(`/questions/${id}/answer`, { answer: answers[id] });
    load();
  }

  return (
    <div>
      {list.map((q) => (
        <div className="card" key={q.id} style={{ marginBottom: 14 }}>
          <small>{q.family_name}{q.student_name ? ` · ${q.student_name}` : ''} · {new Date(q.created_at).toLocaleString()}</small>
          <p><strong>Q:</strong> {q.question}</p>
          <div className="form-group">
            <textarea rows="3" defaultValue={q.answer || ''} placeholder="Write your answer..." onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))} />
          </div>
          <button className="btn btn-primary btn-small" onClick={() => save(q.id)}>{q.answer ? 'Update answer' : 'Send answer'}</button>
        </div>
      ))}
      {list.length === 0 && <div className="card">No questions yet.</div>}
    </div>
  );
}
