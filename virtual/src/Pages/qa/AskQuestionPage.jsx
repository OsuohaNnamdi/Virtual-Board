import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionApi } from '../../api/questionApi';
import { extractErrorMessage } from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function AskQuestionPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await questionApi.add({ title, content });
      showToast('Question posted', 'The community can now weigh in.', 'success');
      navigate('/questions', { replace: true });
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not post your question.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Community</p>
          <h1 className="page-title">Ask a public question</h1>
          <p className="page-subtitle">Be specific — imagine you're asking a classmate directly.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label>Title</label>
          <p className="field-hint">e.g. "Is there an R function for finding the index of an element in a vector?"</p>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Question title" />
        </div>
        <div className="field">
          <label>Body</label>
          <p className="field-hint">Include everything someone would need to help answer it.</p>
          <textarea required rows={10} value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <button className="btn btn-primary" disabled={saving} type="submit">
          {saving ? 'Posting…' : 'Post your question'}
        </button>
      </form>
    </div>
  );
}
