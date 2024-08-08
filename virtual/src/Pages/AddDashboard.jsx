import React, { useState } from 'react';
import axios from 'axios';
import '../Styles/AddDashboard.css';
import showAlert from '../Components/showAlert';

const faculties = [
    'Faculty of Arts',
    'Faculty of Science',
    'Faculty of Social Sciences',
    'Faculty of Law',
    'Faculty of Engineering',
    'Faculty of Management Sciences',
    'Faculty of Education',
    'Faculty of Medicine'
];

const departments = {
    'Faculty of Arts': ['Department of English', 'Department of History', 'Department of Philosophy'],
    'Faculty of Science': ['Department of Computer Science', 'Department of Mathematics', 'Department of Physics'],
    'Faculty of Social Sciences': ['Department of Economics', 'Department of Political Science', 'Department of Psychology'],
    'Faculty of Law': [],
    'Faculty of Engineering': [],
    'Faculty of Management Sciences': [],
    'Faculty of Education': [],
    'Faculty of Medicine': []
};

const AddDashboard = () => {
    const [subject, setSubject] = useState('');
    const [source, setSource] = useState('');
    const [faculty, setFaculty] = useState('');
    const [department, setDepartment] = useState('');
    const [content, setContent] = useState('');
    const [main, setMain] = useState('');
    const [image, setImage] = useState(null); // State for image file

    const handleFacultyChange = (e) => {
        setFaculty(e.target.value);
        setDepartment(''); // Reset department when faculty changes
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Update image state with selected file
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('source', source);
        formData.append('faculty', faculty);
        formData.append('mains', main);
        formData.append('department', department);
        formData.append('content', content);
        if (image) formData.append('document', image); 

        try {
            await axios.post('http://localhost:8080/api/v1/dashboard/add', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    'Content-Type': 'multipart/form-data' 
                }
            });
            showAlert('Success', 'Dashboard added successfully!', 'success'); 
        } catch (error) {
            console.error('There was an error adding the dashboard!', error);
            showAlert('Error', 'There was an error adding the dashboard. Please try again.', 'error');
        }
    };

    return (
        <div className="add-dashboard-container">
            <form onSubmit={handleSubmit} className="dashboard-form">
                <h2>Add New Dashboard</h2>
                <label>Subject</label>
                <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />
                <label>Source</label>
                <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    required
                />
                <label>Location</label>
                <select value={main} onChange={(e) => setMain(e.target.value)} required>
                    <option value="">Select Location</option>
                    <option value="Faculty">Faculty</option>
                    <option value="Department">Department</option>
                    <option value="Main">General</option>
                </select>
                {main === 'Faculty' && (
                    <>
                        <label>Faculty</label>
                        <select value={faculty} onChange={handleFacultyChange} required>
                            <option value="">Select Faculty</option>
                            {faculties.map((fac) => (
                                <option key={fac} value={fac}>{fac}</option>
                            ))}
                        </select>
                    </>
                )}
                {main === 'Department' && (
                    <>
                        <label>Faculty</label>
                        <select value={faculty} onChange={handleFacultyChange} required>
                            <option value="">Select Faculty</option>
                            {faculties.map((fac) => (
                                <option key={fac} value={fac}>{fac}</option>
                            ))}
                        </select>
                        {faculty && (
                            <>
                                <label>Department</label>
                                <select value={department} onChange={(e) => setDepartment(e.target.value)} required>
                                    <option value="">Select Department</option>
                                    {departments[faculty].map((dept) => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </>
                        )}
                    </>
                )}
                <label>Content</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                ></textarea>
                <label>Upload Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                <button type="submit">Add Dashboard</button>
            </form>
        </div>
    );
};

export default AddDashboard;
