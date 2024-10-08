import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/Login.css';
import { useNavigate } from 'react-router-dom';
import showAlert from '../Components/showAlert';

const Login = () => {
    const [matricNumber, setMatriculationNumber] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);  // Loading state

    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);  // Show spinner

        try {
            const response = await axios.post('https://virtual-notice-board-api.onrender.com/api/v1/login', {
                matricNumber,
                password
            });

            const { profileDTO, token } = response.data;
            const { Type, matricNumber: responseMatricNumber } = profileDTO;

            showAlert("Login Successful", "You have successfully logged in.", "success"); 

            switch (Type) {
                case 'ADMIN':
                    localStorage.setItem('TYPE', Type);
                    break;
                case 'STUDENT':
                    localStorage.setItem('TYPES', Type);
                    break;
                default:
                    console.error('Unknown user type:', Type);
            }

            localStorage.setItem('profile', JSON.stringify(profileDTO));
            localStorage.setItem('MatricNo', responseMatricNumber);
            localStorage.setItem('jwtToken', token);

            nav("/");
            window.location.reload();
        } catch (error) {
            console.error('Login error', error);
            showAlert("Login Failed", "Invalid matriculation number or password. Please try again.", "error");
        } finally {
            setLoading(false);  // Hide spinner
        }
    };

    return (
        <div className="login-container">
            {loading && (
                <div className="overlay">
                    <div className="spinner">
                        <div className="double-bounce1"></div>
                        <div className="double-bounce2"></div>
                    </div>
                    <p>Logging in...</p>
                </div>
            )}
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                <label>Matriculation Number</label>
                <input
                    type="text"
                    value={matricNumber}
                    onChange={(e) => setMatriculationNumber(e.target.value)}
                    required
                />
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>Login</button>
            </form>
        </div>
    );
};

export default Login;
