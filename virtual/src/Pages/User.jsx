import React from 'react';
import '../Styles/Users.css';

const User = () => {
    const profile = JSON.parse(localStorage.getItem('profile'));

    if (!profile) {
        return <div>No profile data found. Please log in.</div>;
    }

    const { firstName, lastName, isVerified, matricNumber, set, faculty, department } = profile;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Profile</h1>
            </div>
            <div className="profile-details">
                <div className="profile-field">
                    <label>First Name:</label>
                    <span>{firstName}</span>
                </div>
                <div className="profile-field">
                    <label>Last Name:</label>
                    <span>{lastName}</span>
                </div>
                <div className="profile-field">
                    <label>Matric Number:</label>
                    <span>{matricNumber}</span>
                </div>
                <div className="profile-field">
                    <label>Set:</label>
                    <span>{set}</span>
                </div>
                <div className="profile-field">
                    <label>Faculty:</label>
                    <span>{faculty}</span>
                </div>
                <div className="profile-field">
                    <label>Department:</label>
                    <span>{department}</span>
                </div>
                <div className="profile-field">
                    <label>Verified:</label>
                    <span>{isVerified ? "Yes" : "No"}</span>
                </div>
            </div>
        </div>
    );
};

export default User;
