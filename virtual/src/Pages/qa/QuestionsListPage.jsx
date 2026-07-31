import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { questionApi } from '../../api/questionApi';
import { extractErrorMessage } from '../../api/client';
import Spinner from '../../Components/Spinner';
import EmptyState from '../../Components/EmptyState';

export default function QuestionsListPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    questionApi
      .list()
      .then(setQuestions)
      .catch((err) => setError(extractErrorMessage(err, 'Could not load questions.')))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return questions;
    const q = search.toLowerCase();
    return questions.filter((item) => item.title?.toLowerCase().includes(q));
  }, [questions, search]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Community</p>
          <h1 className="page-title">Questions</h1>
          <p className="page-subtitle">{questions.length} question{questions.length === 1 ? '' : 's'} asked so far.</p>
        </div>
        <Link to="/questions/new" className="btn btn-primary">Ask question</Link>
      </div>

      <div className="field" style={{ maxWidth: 320, marginBottom: 8 }}>
        <input placeholder="Search questions…" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Spinner fullPage />
      ) : filtered.length === 0 ? (
        <EmptyState icon="💬" title="No questions yet" message="Be the first to ask something the community can help with." />
      ) : (
        <div className="card" style={{ padding: '4px 22px' }}>
          {filtered.map((q) => (
            <div className="qa-row" key={q.id}>
              <div className="qa-stats">
                <div>
                  <div className="qa-stat-value">{q.viewCount ?? 0}</div>
                  <div className="qa-stat-label">views</div>
                </div>
                <div className={q.answerCount > 0 ? 'qa-stat-answered' : ''}>
                  <div className="qa-stat-value">{q.answerCount ?? 0}</div>
                  <div className="qa-stat-label">answers</div>
                </div>
              </div>
              <div className="qa-body">
                <Link to={`/questions/${q.id}`} className="qa-question-title">{q.title}</Link>
                <p className="qa-excerpt">{q.content}</p>
                <div className="qa-meta-row">
                  asked {moment(q.createdDate).fromNow()} by <strong>&nbsp;{q.userName}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
