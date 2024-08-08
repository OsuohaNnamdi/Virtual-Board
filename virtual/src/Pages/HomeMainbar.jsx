import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Styles/HomeMainbar.css';
import QuestionList from './QuestionList';
import axiosInstance from '../auth/axiosInstance';
import showAlert from '../Components/showAlert';


const HomeMainbar = () => {
    const location = useLocation();
    const user = 1; // Mock user ID
    const navigate = useNavigate();
    const [questionsList, setQuestionsList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axiosInstance.get('/question/list');
                setQuestionsList(response.data);
                setLoading(false);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching questions:', error);
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const checkAuth = () => {
        if (user === null) {
            showAlert("Authentication Required", "Please login or signup to ask a question.", "warning");
            navigate('/Auth');
        } else {
            navigate('/AskQuestion');
        }
    };

    return (
        <div className='main-bar'>
            <div className='main-bar-header'>
                {location.pathname === '/home' ? <h1>Top Questions</h1> : <h1>All Questions</h1>}
                <button onClick={checkAuth} className='ask-btn'>Ask Question</button>
            </div>
            <div className='questions-container'>
                {loading ? (
                    <h1>Loading...</h1>
                ) : (
                    <>
                        <p>{questionsList.length} questions</p>
                        <QuestionList questionsList={questionsList} />
                    </>
                )}
            </div>
        </div>
    );
};

export default HomeMainbar;
