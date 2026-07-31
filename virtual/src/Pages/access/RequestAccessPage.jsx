import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { accessApi } from '../../api/accessApi';
import { extractErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Spinner from '../../Components/Spinner';

const SERVICE = 'NOTICE_BOARD';

export default function RequestAccessPage() {
  const location = useLocation();
  const { refreshGrants, hasAccess } = useAuth();
  const { showToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState(location.state?.level || 'READ');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await accessApi.myRequests();
      setRequests(data.filter((r) => r.service === SERVICE));
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not load your access requests.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const pending = requests.find((r) => r.status === 'PENDING');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await accessApi.request(SERVICE, level, reason.trim() || undefined);
      showToast('Request submitted', 'An admin will review it shortly.', 'success');
      setReason('');
      await load();
      await refreshGrants();
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not submit your request.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner fullPage />;

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Notice board</p>
          <h1 className="page-title">Request access</h1>
          <p className="page-subtitle">
            The notice board is a gated service — an admin needs to approve your access before you can view notices or the Q&amp;A forum.
          </p>
        </div>
      </div>

      {hasAccess(SERVICE, 'READ') && (
        <div className="alert alert-success" style={{ marginBottom: 16 }}>
          You already have access — head back to <a href="/">the notice board</a>.
        </div>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {pending ? (
        <div className="card">
          <p style={{ margin: 0 }}>
            You have a pending <strong>{pending.requestedLevel}</strong> access request, submitted{' '}
            {new Date(pending.createdAt).toLocaleDateString()}. You'll be able to use the notice board as soon as an admin approves it.
          </p>
        </div>
      ) : (
        <form className="card" onSubmit={handleSubmit}>
          <div className="field">
            <label>Access level</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="READ">Read only — view notices and questions</option>
              <option value="WRITE">Read &amp; write — also ask questions, answer, and comment</option>
            </select>
          </div>
          <div className="field">
            <label>Reason (optional)</label>
            <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why do you need access?" />
          </div>
          <button className="btn btn-primary" disabled={submitting} type="submit">
            {submitting ? 'Submitting…' : 'Request access'}
          </button>
        </form>
      )}

      {requests.length > 0 && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>Your requests</h3>
          <table className="table">
            <thead><tr><th>Level</th><th>Status</th><th>Submitted</th></tr></thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td>{r.requestedLevel}</td>
                  <td>{r.status}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
