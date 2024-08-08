import React, { useState, useEffect } from 'react';
import '../Styles/Modal.css';

const Modal = ({ notice, onClose, onUpdate }) => {
    const [updatedNotice, setUpdatedNotice] = useState(notice);
    const [image, setImage] = useState(null); // State for image file

    useEffect(() => {
        setUpdatedNotice(notice);
        setImage(null); // Reset image when notice changes
    }, [notice]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedNotice({ ...updatedNotice, [name]: value });
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // Update image state with selected file
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('subject', updatedNotice.subject);
        formData.append('source', updatedNotice.source);
        formData.append('faculty', updatedNotice.faculty);
        formData.append('department', updatedNotice.department);
        formData.append('content', updatedNotice.content);
        formData.append('date', updatedNotice.date);
        if (image) formData.append('document', image); // Append image file

        onUpdate(updatedNotice.id, formData); // Pass ID and formData to parent
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Update Notice</h2>
                <form onSubmit={handleSubmit}>
                    <label>Subject</label>
                    <input
                        type="text"
                        name="subject"
                        value={updatedNotice.subject}
                        onChange={handleChange}
                    />
                    <label>Source</label>
                    <input
                        type="text"
                        name="source"
                        value={updatedNotice.source}
                        onChange={handleChange}
                    />
                    <label>Faculty</label>
                    <input
                        type="text"
                        name="faculty"
                        value={updatedNotice.faculty}
                        onChange={handleChange}
                    />
                    <label>Department</label>
                    <input
                        type="text"
                        name="department"
                        value={updatedNotice.department}
                        onChange={handleChange}
                    />
                    <label>Content</label>
                    <textarea
                        name="content"
                        value={updatedNotice.content}
                        onChange={handleChange}
                    ></textarea>
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={updatedNotice.date}
                        onChange={handleChange}
                    />
                    <label>Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <div className="modal-actions">
                        <button type="submit">Update</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
