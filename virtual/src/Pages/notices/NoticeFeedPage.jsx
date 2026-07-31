import React, { useEffect, useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { noticeApi } from '../../api/noticeApi';
import { extractErrorMessage } from '../../api/client';
import { FACULTIES, DEPARTMENTS_BY_FACULTY } from '../../constants/academic';
import Spinner from '../../Components/Spinner';
import EmptyState from '../../Components/EmptyState';

// One page handles all three notice scopes (general / faculty / department)
// rather than three near-identical copy-pasted page files — the only thing
// that changes is which endpoint gets called.
//
// Faculty/department aren't part of the user's profile on this backend (the
// generic bundle-api user is just email/name/phone/role) — they're
// attributes of each notice instead. So "my faculty" / "my department" here
// means "notices for a faculty/department I pick", not one derived from a
// student record.
export default function NoticeFeedPage({ scope }) {
  const [faculty, setFaculty] = useState('');
  const [department, setDepartment] = useState('');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const departmentOptions = useMemo(() => DEPARTMENTS_BY_FACULTY[faculty] || [], [faculty]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        let data;
        if (scope === 'faculty') data = faculty ? await noticeApi.listByFaculty(faculty) : [];
        else if (scope === 'department') data = department ? await noticeApi.listByDepartment(department) : [];
        else data = (await noticeApi.list(0, 50)).content ?? [];
        if (!cancelled) setNotices(data);
      } catch (err) {
        if (!cancelled) setError(extractErrorMessage(err, 'Could not load notices.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [scope, faculty, department]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Notice board</p>
          <h1 className="page-title">Announcements</h1>
          <p className="page-subtitle">Stay on top of what's happening across campus.</p>
        </div>

        <div className="segmented">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>All</NavLink>
          <NavLink to="/notices/faculty" className={({ isActive }) => (isActive ? 'active' : '')}>By faculty</NavLink>
          <NavLink to="/notices/department" className={({ isActive }) => (isActive ? 'active' : '')}>By department</NavLink>
        </div>
      </div>

      {scope === 'faculty' && (
        <div className="field" style={{ maxWidth: 320, marginBottom: 16 }}>
          <label>Faculty</label>
          <select value={faculty} onChange={(e) => setFaculty(e.target.value)}>
            <option value="">Select faculty</option>
            {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      )}

      {scope === 'department' && (
        <div className="field-row" style={{ maxWidth: 480, marginBottom: 16 }}>
          <div className="field">
            <label>Faculty</label>
            <select value={faculty} onChange={(e) => { setFaculty(e.target.value); setDepartment(''); }}>
              <option value="">Select faculty</option>
              {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="field">
            <label>Department</label>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} disabled={!faculty}>
              <option value="">{faculty ? 'Select department' : 'Select faculty first'}</option>
              {departmentOptions.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Spinner fullPage />
      ) : scope === 'faculty' && !faculty ? (
        <EmptyState icon="🎓" title="Pick a faculty" message="Choose a faculty above to see its notices." />
      ) : scope === 'department' && !department ? (
        <EmptyState icon="🎓" title="Pick a department" message="Choose a faculty and department above to see its notices." />
      ) : notices.length === 0 ? (
        <EmptyState icon="📭" title="Nothing here yet" message="Check back soon — new notices will show up as they're posted." />
      ) : (
        <div className="notice-grid">
          {notices.map((item) => (
            <article className="card card-hover notice-card" key={item.id}>
              {item.imageUrl && <img src={item.imageUrl} alt={item.subject} />}
              <div className="notice-title">{item.subject}</div>
              <p className="notice-desc">{item.content}</p>
              <div className="notice-meta">
                <span>{item.source}</span>
                <span>{item.date ? new Date(item.date).toLocaleDateString() : ''}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
