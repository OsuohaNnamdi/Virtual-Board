import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { noticeApi } from '../../api/noticeApi';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import Spinner from '../../Components/Spinner';
import EmptyState from '../../Components/EmptyState';
import EditNoticeModal from './EditNoticeModal';

export default function NoticeAdminPage() {
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(0);

  const load = async (targetPage = 0) => {
    setLoading(true);
    setError('');
    try {
      const data = await noticeApi.list(targetPage, 20);
      setNotices(Array.isArray(data) ? data : data.content ?? []);
      setPage(targetPage);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not load notices.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(0); }, []);

  const handleDelete = async (notice) => {
    const ok = await confirm({ title: 'Delete this notice?', message: `"${notice.subject}" will be removed permanently.`, confirmText: 'Delete' });
    if (!ok) return;
    try {
      await noticeApi.remove(notice.id);
      setNotices((prev) => prev.filter((n) => n.id !== notice.id));
      showToast('Notice deleted', '', 'success');
    } catch (err) {
      showToast('Could not delete', extractErrorMessage(err), 'error');
    }
  };

  const handleUpdated = (updated) => {
    setNotices((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    setEditing(null);
    showToast('Notice updated', '', 'success');
  };

  if (loading) return <Spinner fullPage />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Admin</p>
          <h1 className="page-title">Manage notices</h1>
          <p className="page-subtitle">Edit or remove anything published to the notice board.</p>
        </div>
        <Link to="/admin/notices/new" className="btn btn-primary">+ New notice</Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {notices.length === 0 ? (
        <EmptyState icon="🗒️" title="No notices yet" message="Publish your first announcement to get started." />
      ) : (
        <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
          <table className="table">
            <thead>
              <tr><th>Subject</th><th>Source</th><th>Faculty</th><th>Department</th><th>Date</th><th></th></tr>
            </thead>
            <tbody>
              {notices.map((n) => (
                <tr key={n.id}>
                  <td style={{ maxWidth: 240, fontWeight: 600 }}>{n.subject}</td>
                  <td>{n.source}</td>
                  <td>{n.faculty || '—'}</td>
                  <td>{n.department || '—'}</td>
                  <td>{n.date ? new Date(n.date).toLocaleDateString() : '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setEditing(n)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
        <button className="btn btn-secondary btn-sm" disabled={page === 0} onClick={() => load(page - 1)}>Previous</button>
        <button className="btn btn-secondary btn-sm" disabled={notices.length < 20} onClick={() => load(page + 1)}>Next</button>
      </div>

      {editing && (
        <EditNoticeModal notice={editing} onClose={() => setEditing(null)} onUpdated={handleUpdated} />
      )}
    </div>
  );
}
