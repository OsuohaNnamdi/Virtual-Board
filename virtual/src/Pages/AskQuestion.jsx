import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/AskQuestion.css';
import axiosInstance from '../auth/axiosInstance';
import showAlert from '../Components/showAlert';



const AskQuestion = () => {
    const [questionTitle, setQuestionTitle] = useState('');
    const [questionBody, setQuestionBody] = useState('');
    const navigate = useNavigate();
    
    const matricNo = localStorage.getItem("MatricNo");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const newQuestion = {
            title: questionTitle,
            content: questionBody,
            matricNo: matricNo,
        };

        try {
            await axiosInstance.post('/question/add', newQuestion);
            showAlert('Success', 'Question added successfully!', 'success'); // Use SweetAlert for success
            navigate("/");
        } catch (error) {
            console.error('There was an error adding the question!', error);
            showAlert('Error', 'There was an error adding the question. Please try again.', 'error'); // Use SweetAlert for error
        }
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            setQuestionBody(questionBody + '\n');
        }
    };

    return (
        <div className="ask-question">
            <div className="ask-ques-container">
                <h1>Ask a Public Question</h1>
                <form onSubmit={handleSubmit}>
                    <div className="ask-form-container">
                        <label htmlFor="ask-ques-title">
                            <h4>Question Title</h4>
                            <p>Be specific and imagine you’re asking a question to another person</p>
                            <input
                                type="text"
                                id="ask-ques-title"
                                onChange={(e) => setQuestionTitle(e.target.value)}
                                placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                            />
                        </label>
                        <label htmlFor="ask-ques-body">
                            <h4>Body</h4>
                            <p>Include all the information someone would need to answer your question</p>
                            <textarea
                                id="ask-ques-body"
                                onChange={(e) => setQuestionBody(e.target.value)}
                                cols="30"
                                rows="10"
                                onKeyPress={handleEnter}
                            ></textarea>
                        </label>
                    </div>
                    <input type="submit" value="Review Your Question" className="review-btn" />
                </form>
            </div>
        </div>
    );
};

export default AskQuestion;
