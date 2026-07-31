import React, { useState } from 'react';
import { noticeApi } from '../../api/noticeApi';
import { extractErrorMessage } from '../../api/client';

export default function EditNoticeModal({ notice, onClose, onUpdated }) {
  const [form, setForm] = useState({
    subject: notice.subject || '',
    source: notice.source || '',
    content: notice.content || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      // The backend's update endpoint returns void and only ever touches
      // subject/source/content (it also stamps today's date) — audience and
      // image can't be changed after a notice is created, so we build the
      // merged notice client-side instead of trusting a response body.
      await noticeApi.update(notice.id, {
        subject: form.subject,
        source: form.source,
        content: form.content,
        mains: notice.mains,
        faculty: notice.faculty,
        department: notice.department,
      });
      onUpdated({ ...notice, ...form, date: new Date().toISOString() });
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not update this notice.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit notice</h2>
          <button className="icon-btn" onClick={onClose} type="button">✕</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <p className="field-hint" style={{ marginTop: 0 }}>
          Audience ({notice.mains === 'Main' ? 'Everyone' : `${notice.mains}: ${notice.faculty || ''}${notice.department ? ` / ${notice.department}` : ''}`}) and the image can't be changed after publishing — delete and re-create the notice if those need to change.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Subject</label>
            <input value={form.subject} onChange={update('subject')} />
          </div>
          <div className="field">
            <label>Source</label>
            <input value={form.source} onChange={update('source')} />
          </div>
          <div className="field">
            <label>Content</label>
            <textarea value={form.content} onChange={update('content')} />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
