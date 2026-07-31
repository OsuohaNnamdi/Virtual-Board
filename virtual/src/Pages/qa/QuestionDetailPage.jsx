import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { questionApi } from '../../api/questionApi';
import { answerApi } from '../../api/answerApi';
import { commentApi } from '../../api/commentApi';
import { extractErrorMessage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useConfirm } from '../../context/ConfirmContext';
import Spinner from '../../Components/Spinner';
import Avatar from '../../Components/Avatar';
import VoteControl from '../../Components/VoteControl';

export default function QuestionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, isAuthenticated, hasAccess } = useAuth();
  const { showToast } = useToast();
  const confirm = useConfirm();

  const canWrite = hasAccess('NOTICE_BOARD', 'WRITE');

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answerDraft, setAnswerDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});

  const load = useCallback(async () => {
    try {
      const [questionData, answersData] = await Promise.all([
        questionApi.get(id),
        answerApi.list(id),
      ]);
      setQuestion(questionData);
      setAnswers(answersData);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not load this question.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const requireWriteAccess = async (action) => {
    if (canWrite) return true;
    const proceed = await confirm({
      title: 'Access needed',
      message: `You need write access to the notice board to ${action}.`,
      tone: 'brand',
      confirmText: 'Request access',
    });
    if (proceed) navigate('/request-access', { state: { level: 'WRITE' } });
    return false;
  };

  const handleAnswerVote = async (answerId, type) => {
    try {
      type === 'up' ? await answerApi.upvote(answerId) : await answerApi.downvote(answerId);
      setAnswers((prev) =>
        prev.map((a) => (a.id === answerId ? { ...a, [type === 'up' ? 'upVotes' : 'downVotes']: (a[type === 'up' ? 'upVotes' : 'downVotes'] ?? 0) + 1 } : a))
      );
    } catch (err) {
      showToast('Vote failed', extractErrorMessage(err), 'error');
    }
  };

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!(await requireWriteAccess('post an answer'))) return;
    if (!answerDraft.trim()) return;
    setPosting(true);
    try {
      await answerApi.add({ content: answerDraft.trim(), questionId: parseInt(id, 10) });
      setAnswerDraft('');
      const refreshed = await answerApi.list(id);
      setAnswers(refreshed);
      showToast('Answer posted', '', 'success');
    } catch (err) {
      showToast('Could not post your answer', extractErrorMessage(err), 'error');
    } finally {
      setPosting(false);
    }
  };

  const toggleComments = async (answerId) => {
    if (!expandedComments[answerId]) {
      try {
        const comments = await commentApi.list(answerId);
        setAnswers((prev) => prev.map((a) => (a.id === answerId ? { ...a, comments } : a)));
      } catch (err) {
        showToast('Could not load comments', extractErrorMessage(err), 'error');
        return;
      }
    }
    setExpandedComments((prev) => ({ ...prev, [answerId]: !prev[answerId] }));
  };

  const handlePostComment = async (answerId, e) => {
    e.preventDefault();
    if (!(await requireWriteAccess('comment'))) return;
    const text = (commentDrafts[answerId] || '').trim();
    if (!text) return;
    try {
      await commentApi.add({ content: text, answerId });
      const comments = await commentApi.list(answerId);
      setAnswers((prev) => prev.map((a) => (a.id === answerId ? { ...a, comments } : a)));
      setCommentDrafts((prev) => ({ ...prev, [answerId]: '' }));
    } catch (err) {
      showToast('Could not post comment', extractErrorMessage(err), 'error');
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/questions/${id}`;
    navigator.clipboard?.writeText(url);
    showToast('Link copied', url, 'info');
  };

  const handleDeleteQuestion = async () => {
    const ok = await confirm({ title: 'Delete this question?', message: 'This cannot be undone.', confirmText: 'Delete' });
    if (!ok) return;
    try {
      await questionApi.remove(id);
      showToast('Question deleted', '', 'success');
      navigate('/questions', { replace: true });
    } catch (err) {
      showToast('Could not delete', extractErrorMessage(err), 'error');
    }
  };

  if (loading) return <Spinner fullPage />;
  if (error) return <div className="page"><div className="alert alert-error">{error}</div></div>;
  if (!question) return null;

  const canDeleteQuestion = canWrite && profile?.id === question.userId;

  return (
    <div className="page">
      <div className="question-detail-header">
        <h1 className="question-detail-title">{question.title}</h1>
      </div>
      <div className="post-byline" style={{ marginBottom: 16 }}>
        <span className="post-byline-text">
          asked {moment(question.createdDate).fromNow()} · {question.viewCount ?? 0} views
        </span>
      </div>

      <div className="card">
        <div className="question-content-row">
          <div className="question-body-text">{question.content}</div>
        </div>

        <div className="post-actions-row">
          <div className="post-actions">
            <button className="btn btn-ghost btn-sm" onClick={handleShare} type="button">Share</button>
            {canDeleteQuestion && (
              <button className="btn btn-ghost btn-sm" onClick={handleDeleteQuestion} type="button">Delete</button>
            )}
          </div>
          <div className="post-byline">
            <Avatar name={question.userName} size={30} />
            <span className="post-byline-text"><strong>{question.userName}</strong></span>
          </div>
        </div>
      </div>

      {answers.length > 0 && (
        <>
          <div className="answers-section-header">{answers.length} Answer{answers.length === 1 ? '' : 's'}</div>
          {answers.map((ans) => (
            <div className="answer-card" key={ans.id}>
              <VoteControl
                score={(ans.upVotes ?? 0) - (ans.downVotes ?? 0)}
                onUpvote={() => handleAnswerVote(ans.id, 'up')}
                onDownvote={() => handleAnswerVote(ans.id, 'down')}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="question-body-text" style={{ marginBottom: 12 }}>{ans.content}</div>
                <div className="post-actions-row">
                  <button className="btn btn-ghost btn-sm" onClick={() => toggleComments(ans.id)} type="button">
                    {expandedComments[ans.id] ? 'Hide comments' : 'Show comments'}
                  </button>
                  <div className="post-byline">
                    <Avatar name={ans.userName} size={26} />
                    <span className="post-byline-text">
                      <strong>{ans.userName || 'Anonymous'}</strong> · answered {moment(ans.createdDate).fromNow()}
                    </span>
                  </div>
                </div>

                {expandedComments[ans.id] && (
                  <div className="comment-list">
                    {(ans.comments || []).length === 0 ? (
                      <p style={{ color: 'var(--ink-500)', fontSize: 13.5, margin: 0 }}>No comments yet.</p>
                    ) : (
                      ans.comments.map((c) => (
                        <div className="comment-item" key={c.id}>
                          <Avatar name={c.userName} size={22} />
                          <div className="comment-item-body">
                            <strong>{c.userName || 'Anonymous'}</strong> {c.content}
                          </div>
                        </div>
                      ))
                    )}
                    {isAuthenticated && (
                      <form className="comment-form" onSubmit={(e) => handlePostComment(ans.id, e)}>
                        <input
                          value={commentDrafts[ans.id] || ''}
                          onChange={(e) => setCommentDrafts((prev) => ({ ...prev, [ans.id]: e.target.value }))}
                          placeholder="Add a comment…"
                        />
                        <button className="btn btn-secondary btn-sm" type="submit">Post</button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      <div className="card answer-form-card">
        <h3 style={{ marginTop: 0 }}>Your answer</h3>
        {canWrite ? (
          <form onSubmit={handlePostAnswer}>
            <div className="field">
              <textarea rows={6} value={answerDraft} onChange={(e) => setAnswerDraft(e.target.value)} placeholder="Type your answer here…" />
            </div>
            <button className="btn btn-primary" disabled={posting} type="submit">
              {posting ? 'Posting…' : 'Post your answer'}
            </button>
          </form>
        ) : (
          <p style={{ color: 'var(--ink-500)' }}>
            <Link to="/request-access" state={{ level: 'WRITE' }} style={{ color: 'var(--brand-600)', fontWeight: 700 }}>
              Request write access
            </Link> to post an answer.
          </p>
        )}
      </div>
    </div>
  );
}
