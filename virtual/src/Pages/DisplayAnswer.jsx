import React from 'react';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';

import Avatar from '../Components/Avatar';

const DisplayAnswer = ({ question, handleShare, handleDeleteAnswer, currentUser }) => {
    const { id } = useParams();

    return (
        <div>
            {question.answer.map((ans) => (
                <div className="display-ans" key={ans._id}>
                    <p>{ans.answerBody}</p>
                    <div className="question-actions-user">
                        <div>
                            <button type="button" onClick={handleShare}>Share</button>
                            {currentUser?.result?._id === ans?.userId && (
                                <button type='button' onClick={() => handleDeleteAnswer(ans._id, question.noOfAnswers)}>Delete</button>
                            )}
                        </div>
                        <div>
                            <p>answered {moment(ans.answeredOn).fromNow()}</p>
                            <Link to={`/Users/${ans.userId}`} className='user-link' style={{ color: '#0086d8' }}>
                                <Avatar backgroundColor="lightgreen" px='8px' py='5px' borderRadius='4px'>{ans.userAnswered.charAt(0).toUpperCase()}</Avatar>
                                <div>
                                    {ans.userAnswered}
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DisplayAnswer;
