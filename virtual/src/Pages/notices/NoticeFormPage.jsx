import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { noticeApi } from '../../api/noticeApi';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { FACULTIES, DEPARTMENTS_BY_FACULTY } from '../../constants/academic';

const initialForm = { subject: '', source: '', scope: '', faculty: '', department: '', content: '' };

export default function NoticeFormPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const departmentOptions = useMemo(() => DEPARTMENTS_BY_FACULTY[form.faculty] || [], [form.faculty]);

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, [field]: value, ...(field === 'faculty' ? { department: '' } : {}) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const notice = {
        subject: form.subject,
        source: form.source,
        content: form.content,
        mains: form.scope,
        faculty: form.faculty,
        department: form.department,
      };

      await noticeApi.create(notice, image);
      showToast('Notice published', 'It will now show up on the relevant board.', 'success');
      navigate('/admin/notices', { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not publish this notice.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Admin</p>
          <h1 className="page-title">New notice</h1>
          <p className="page-subtitle">Publish an announcement to the general board, a faculty, or a department.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label>Subject</label>
          <input required value={form.subject} onChange={update('subject')} placeholder="Mid-semester exam timetable" />
        </div>
        <div className="field">
          <label>Source</label>
          <input required value={form.source} onChange={update('source')} placeholder="Office of the Registrar" />
        </div>
        <div className="field">
          <label>Audience</label>
          <select required value={form.scope} onChange={update('scope')}>
            <option value="">Select audience</option>
            <option value="Main">Everyone (general board)</option>
            <option value="Faculty">A specific faculty</option>
            <option value="Department">A specific department</option>
          </select>
        </div>

        {(form.scope === 'Faculty' || form.scope === 'Department') && (
          <div className="field">
            <label>Faculty</label>
            <select required value={form.faculty} onChange={update('faculty')}>
              <option value="">Select faculty</option>
              {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        )}

        {form.scope === 'Department' && form.faculty && (
          <div className="field">
            <label>Department</label>
            <select required value={form.department} onChange={update('department')}>
              <option value="">Select department</option>
              {departmentOptions.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )}

        <div className="field">
          <label>Content</label>
          <textarea required value={form.content} onChange={update('content')} />
        </div>
        <div className="field">
          <label>Attached image</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
        </div>

        <button className="btn btn-primary" disabled={saving} type="submit">
          {saving ? 'Publishing…' : 'Publish notice'}
        </button>
      </form>
    </div>
  );
}
