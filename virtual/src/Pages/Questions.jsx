import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import axiosInstance from '../auth/axiosInstance';

const Questions = ({ question }) => {
    const [answerCount, setAnswerCount] = useState(0);
    const [answer, setAnswer] = useState([]);
    const [votes, setVotes] = useState(0);

    useEffect(() => {
        const fetchAnswerCount = async () => {
            try {
                const response = await axiosInstance.get(`/answer/list/${question.id}`);
                setAnswerCount(response.data.length);
                setAnswer(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching answers:', error);
            }
        };
        


        const calculateVotes = () => {
        const upVote = answer.reduce((acc, currentAnswer) => acc + currentAnswer.upVotes, 0);

        const downVote = answer.reduce((acc, currentAnswer) => acc + currentAnswer.downVotes, 0);
            setVotes(upVote - downVote);
        };

        calculateVotes();
        fetchAnswerCount();
        
    }, [question]);

    return (
        <div className='display-question-container'>
            <div className='display-votes-ans'>
                <p>{votes}</p>
                <p>votes</p>
            </div>
            <div className='display-votes-ans'>
                <p>{answerCount}</p>
                <p>answers</p>
            </div>
            <div className="display-question-details">
                <Link to={`/Questions/${question.id}`} className='question-title-link'>{question.title}</Link>
                <div className='display-tags-time'>
                    <div className='display-tags'>
                        
                    </div>
                    <p className='display-time'>
                        asked {moment(question.createdDate).fromNow()} {question.matricNo}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Questions;
