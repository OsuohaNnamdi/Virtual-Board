import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import moment from 'moment';
import copy from 'copy-to-clipboard';
import axiosInstance from '../auth/axiosInstance';
import upvote from '../Components/sort-up.svg';
import downvote from '../Components/sort-down.svg';
import '../Styles/Questions.css';
import Avatar from '../Components/Avatar';
import { showConfirmationAlert } from '../Components/showConfirmationAlert';

const QuestionsDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [commentMap, setCommentMap] = useState({});
    const [expandedComments, setExpandedComments] = useState({});
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        const fetchQuestionAndAnswers = async () => {
            try {
                const [questionResponse, answersResponse] = await Promise.all([
                    axiosInstance.get(`/question/${id}`),
                    axiosInstance.get(`/answer/list/${id}`)
                ]);

                setQuestion({
                    ...questionResponse.data,
                    answers: answersResponse.data,
                    
                });console.log(question)

            } catch (error) {
                console.error('Error fetching question or answers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestionAndAnswers();
    }, [id]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!question) {
        return <div className="error-message">Question not found</div>;
    }

    const handlePostAns = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            await showConfirmationAlert('Authentication Required', 'Login or Signup to answer a question', 'warning');
            navigate('/login');
        } else if (answer === '') {
            await showConfirmationAlert('Input Required', 'Enter an answer before submitting', 'warning');
        } else {
            const newAnswer = {
                content: answer,
                questionId: parseInt(id),
                firstName: currentUser.firstName,
                lastName: currentUser.lastName
            };

            console.log(newAnswer)

            try {
                await axiosInstance.post(`/answer/add`, newAnswer);
                await showConfirmationAlert('Success', 'Answer posted successfully!', 'success');
                setAnswer(''); 
            } catch (error) {
                console.error('Error posting answer:', error);
                await showConfirmationAlert('Error', 'There was an error posting your answer. Please try again.', 'error');
            }
        }
    };

    const handlePostComment = async (answerId, e) => {
        e.preventDefault();
        if (!currentUser) {
            await showConfirmationAlert('Authentication Required', 'Login or Signup to comment', 'warning');
            navigate('/login');
        } else if (commentMap[answerId] === '') {
            await showConfirmationAlert('Input Required', 'Enter a comment before submitting', 'warning');
        } else {
            const newComment = {
                content: commentMap[answerId],
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                answerId: answerId,
            };

            try {
                await axiosInstance.post(`/comment/add`, newComment);
                setQuestion((prevQuestion) => ({
                    ...prevQuestion,
                    answers: prevQuestion.answers.map((ans) =>
                        ans.id === answerId
                            ? {
                                  ...ans,
                                  comments: ans.comments ? [...ans.comments, newComment] : [newComment],
                              }
                            : ans
                    ),
                }));
                setCommentMap((prevCommentMap) => ({
                    ...prevCommentMap,
                    [answerId]: '',
                }));
                await showConfirmationAlert('Success', 'Comment posted successfully!', 'success');
            } catch (error) {
                console.error('Error posting comment:', error);
                await showConfirmationAlert('Error', 'There was an error posting your comment. Please try again.', 'error');
            }
        }
    };

    const handleShare = () => {
        const url = `http://localhost:3000${location.pathname}`;
        copy(url);
        alert('Copied url: ' + url);
    };

    const handleDelete = async () => {
        try {
            const result = await showConfirmationAlert(
                'Are you sure?',
                'Do you really want to delete this question?',
                'warning',
                true, 
                'Yes, delete it!',
                'No, cancel!'
            );

            if (result.isConfirmed) {
                await axiosInstance.delete(`/question/delete/${id}`);
                await showConfirmationAlert('Deleted!', 'Your question has been deleted.', 'success');
                navigate('/');
            } else if (result.isDismissed) {
                await showConfirmationAlert('Cancelled', 'Your question is safe :)', 'error');
            }
        } catch (error) {
            console.error('Error deleting question:', error);
            await showConfirmationAlert('Error', 'There was an error deleting your question. Please try again.', 'error');
        }
    };

    const handleVote = async (type, answerId) => {
        const url = `/answer/${type}vote/${answerId}`;
        try {
            await axiosInstance.post(url);
            setQuestion((prevQuestion) => ({
                ...prevQuestion,
                answers: prevQuestion.answers.map((ans) =>
                    ans.id === answerId
                        ? {
                              ...ans,
                              [type === 'up' ? 'upVotes' : 'downVotes']: ans[type === 'up' ? 'upVotes' : 'downVotes'] + 1,
                          }
                        : ans
                ),
            }));
        } catch (error) {
            console.error(`Error ${type}voting answer:`, error);
        }
    };

    const fetchComments = async (answerId) => {
        try {
            const response = await axiosInstance.get(`/comment/list/${answerId}`);
            setQuestion((prevQuestion) => ({
                ...prevQuestion,
                answers: prevQuestion.answers.map((ans) =>
                    ans.id === answerId ? { ...ans, comments: response.data } : ans
                ),
            }));
            console.log(response.data)
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const toggleComments = (answerId) => {
        if (!expandedComments[answerId]) {
            fetchComments(answerId); // Fetch comments only if not expanded yet
        }

        setExpandedComments((prevExpandedComments) => ({
            ...prevExpandedComments,
            [answerId]: !prevExpandedComments[answerId],
        }));
    };

    return (
        <div className='question-details-page'>
            <section className='question-details-container'>
                <h1 className='question-title'>{question.title}</h1>
                <div className='question-details-content'>
                    <div className="question-votes">
                        <img
                            src={upvote}
                            alt="Upvote"
                            className='votes-icon'
                            onClick={() => handleVote('up', question.id)}
                        />
                        <p className='vote-count'>{question.upVotes - question.downVotes}</p>
                        <img
                            src={downvote}
                            alt="Downvote"
                            className='votes-icon'
                            onClick={() => handleVote('down', question.id)}
                        />
                    </div>
                    <div className='question-body'>
                        <p>{question.content}</p>
                    </div>
                    <div className="question-actions-user">
                        <div className="question-actions">
                            <button type='button' onClick={handleShare} className='action-button'>Share</button>
                            {currentUser?.matricNumber === question?.matricNo && (
                                <button type='button' onClick={handleDelete} className='action-button'>Delete</button>
                            )}
                        </div>
                        <div className="user-info">
                            <p className='question-meta'>
                                asked {moment(question.createdDate).fromNow()} by
                            </p>
                            <Link to={`/Users/${question.matricNo}`} className='user-link'>
                                <Avatar backgroundColor="orange" px='10px' py='5px' borderRadius="4px">
                                    {question.matricNo}
                                </Avatar>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {question.answers && question.answers.length > 0 && (
                <section className='answers-section'>
                    <h3>{question.answers.length} Answers</h3>
                    {question.answers.map((ans) => (
                        <div className='answer-card' key={ans.id}>
                            <div className="answer-header">
                                <Avatar backgroundColor="pink" px='8px' py='4px' borderRadius="4px">
                                    {ans.lastName ? ans.lastName.charAt(0) : 'U'}
                                </Avatar>
                                <p className='answer-meta'>
                                    {ans.firstName || 'Anonymous'} answered {moment(ans.date).fromNow()}
                                </p>
                            </div>
                            <div className="answer-votes">
                                <img
                                    src={upvote}
                                    alt="Upvote"
                                    className='votes-icon'
                                    onClick={() => handleVote('up', ans.id)}
                                />
                                <p className='vote-count'>{ans.upVotes - ans.downVotes}</p>
                                <img
                                    src={downvote}
                                    alt="Downvote"
                                    className='votes-icon'
                                    onClick={() => handleVote('down', ans.id)}
                                />
                            </div>
                            <div className='answer-content'>
                                <p className='answer-text'>{ans.content}</p>
                                <div className="answer-actions">
                                    {currentUser?.matricNumber && (
                                        <button
                                            onClick={() => toggleComments(ans.id)}
                                            className='comment-button'
                                        >
                                            {expandedComments[ans.id] ? 'Hide Comments' : 'Show Comments'}
                                        </button>
                                    )}
                                </div>
                            </div>
                            {expandedComments[ans.id] && (
                                <div className='comments-section'>
                                    {ans.comments && ans.comments.length > 0 ? (
                                        ans.comments.map((comment) => (
                                            <div className='comment-card' key={comment.id}>
                                                <div className='comment-header'>
                                                    <Avatar backgroundColor="green" px='8px' py='4px' borderRadius="4px">
                                                        {comment.lastName ? comment.lastName.charAt(0) : 'U'}
                                                    </Avatar>
                                                     <div className='comment-meta'>
                                                        <span className='comment-name'>{comment.firstName || 'Anonymous'}</span> 
                                                        <span className='comment-time'>commented {moment(comment.date).fromNow()}</span>
                                                    </div>
                                                </div>
                                                <p className='comment-text'>{comment.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No comments yet</p>
                                    )}
                                    {currentUser && (
                                        <form onSubmit={(e) => handlePostComment(ans.id, e)}>
                                            <textarea
                                                value={commentMap[ans.id] || ''}
                                                onChange={(e) => setCommentMap({ ...commentMap, [ans.id]: e.target.value })}
                                                placeholder='Add a comment...'
                                                className='comment-input'
                                            />
                                            <button type='submit' className='post-comment-button'>
                                                Post Comment
                                            </button>
                                        </form>
                                    )}
                                </div>
                            )}

                        </div>
                    ))}
                </section>
            )}


            <section className='post-answer-section'>
                <h3>Post an Answer</h3>
                {currentUser ? (
                    <form onSubmit={handlePostAns} className='answer-form'>
                        <textarea
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder='Type your answer here...'
                            className='answer-input'
                        />
                        <button type='submit' className='post-answer-button'>
                            Post Answer
                        </button>
                    </form>
                ) : (
                    <p>Please <Link to='/login'>login</Link> to post an answer.</p>
                )}
            </section>
        </div>
    );
};

export default QuestionsDetails;
