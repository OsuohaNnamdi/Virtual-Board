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
        const fetchQuestion = async () => {
            try {
                const response = await axiosInstance.get(`/question/${id}`);
                setQuestion(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching question details:', error);
                setLoading(false);
            }
        };

        const fetchAnswer = async () => {
            try {
                const response = await axiosInstance.get(`/answer/list/${id}`);
                setQuestion(prev => ({ ...prev, answers: response.data }));
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching answers:', error);
            }
        };

        fetchAnswer();
        fetchQuestion();
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
            };
    
            try {
                await axiosInstance.post(`/answer/add`, newAnswer);
                await showConfirmationAlert('Success', 'Answer posted successfully!', 'success');
                setAnswer(''); // Clear the answer input after posting
                // Optionally, fetch answers again or update state
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
                true, // Show cancel button
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

    const toggleComments = (answerId) => {
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
                                    {currentUser?.matricNumber === ans.matricNo && (
                                        <button type='button' className='action-button'>Delete</button>
                                    )}
                                </div>
                                <div className='answer-user-info'>
                                    <div className='user-meta'>
                                        <p className='answer-meta'>answered {moment(ans.date).fromNow()}</p>
                                        <Link to={`/Users/${ans.matricNo}`} className='user-link'>
                                            <Avatar backgroundColor="orange" px='8px' py='5px' borderRadius="4px">
                                                {ans.firstName ? ans.firstName.charAt(0).toUpperCase() : ''}
                                            </Avatar>
                                            <span>{ans.lastName || 'Unknown User'}</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {ans.comments && (
                                <div className='comments-section'>
                                    {expandedComments[ans.id] ? (
                                        <>
                                            {ans.comments.map((comment, index) => (
                                                <p key={index}>
                                                    <strong>{comment.firstName} {comment.lastName}: </strong>
                                                    {comment.content}
                                                </p>
                                            ))}
                                            <button type="button" onClick={() => toggleComments(ans.id)} className='toggle-comments'>View Less</button>
                                        </>
                                    ) : (
                                        <>
                                            {ans.comments.slice(0, 2).map((comment, index) => (
                                                <p key={index}>
                                                    <strong>{comment.firstName} {comment.lastName}: </strong>
                                                    {comment.content}
                                                </p>
                                            ))}
                                            {ans.comments.length > 2 && (
                                                <button type="button" onClick={() => toggleComments(ans.id)} className='toggle-comments'>View More</button>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                            <div className='comment-form'>
                                <form onSubmit={(e) => handlePostComment(ans.id, e)}>
                                    <input
                                        type="text"
                                        placeholder="Add a comment"
                                        value={commentMap[ans.id] || ''}
                                        onChange={(e) =>
                                            setCommentMap((prevCommentMap) => ({
                                                ...prevCommentMap,
                                                [ans.id]: e.target.value,
                                            }))
                                        }
                                    />
                                    <button type="submit" className='submit-button'>Add Comment</button>
                                </form>
                            </div>
                        </div>
                    ))}
                </section>
            )}

            <section className='post-answer-section'>
                <h3>Your Answer</h3>
                <form onSubmit={handlePostAns}>
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        rows="10"
                    />
                    <button type='submit' className='submit-button'>Post Your Answer</button>
                </form>
            </section>
        </div>
    );
};

export default QuestionsDetails;
