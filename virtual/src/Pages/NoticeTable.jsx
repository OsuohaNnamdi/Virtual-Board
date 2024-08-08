import React, { useState, useEffect } from 'react';
import '../Styles/NoticeTable.css';
import Modal from './Modal';
import axiosInstance from '../auth/axiosInstance';
import { showConfirmationAlert } from '../Components/showConfirmationAlert';

const NoticeTable = () => {
    const [notices, setNotices] = useState([]);
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async (page = 0, size = 10) => {
        try {
            const response = await axiosInstance.get('/dashboard', {
                params: {
                    page,
                    size
                }
            });
            setNotices(response.data);
        } catch (error) {
            console.error("Error fetching notices:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const result = await showConfirmationAlert('Are you sure?', 'This action cannot be undone.', 'warning', true, 'Delete', 'Cancel');
            if (result.isConfirmed) {
                await axiosInstance.delete(`/dashboard/delete/${id}`);
                setNotices(notices.filter(notice => notice.id !== id));
                showConfirmationAlert('Deleted!', 'The notice has been deleted.', 'success');
            }
        } catch (error) {
            console.error("Error deleting notice:", error);
            showConfirmationAlert('Error', 'There was an error deleting the notice. Please try again.', 'error');
        }
    };

    const handleUpdateClick = (notice) => {
        setSelectedNotice(notice);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedNotice(null);
    };

    const handleUpdate = async (id, updatedNotice) => {
        try {
            const response = await axiosInstance.put(`/dashboard/update/${id}`, updatedNotice, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Important for file uploads
                }
            });
            setNotices(notices.map(notice => notice.id === id ? response.data : notice));
            handleModalClose();
            showConfirmationAlert('Updated!', 'The notice has been updated.', 'success');
        } catch (error) {
            console.error("Error updating notice:", error);
            showConfirmationAlert('Error', 'There was an error updating the notice. Please try again.', 'error');
        }
    };

    return (
        <div className="notice-table-container">
            <h2>All Notices</h2>
            <table className="notice-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Source</th>
                        <th>Faculty</th>
                        <th>Department</th>
                        <th>Content</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {notices.map(notice => (
                        <tr key={notice.id}>
                            <td>{notice.subject}</td>
                            <td>{notice.source}</td>
                            <td>{notice.faculty}</td>
                            <td>{notice.department}</td>
                            <td>{notice.content}</td>
                            <td>{notice.date}</td>
                            <td>
                                <button onClick={() => handleUpdateClick(notice)}>Update</button>
                                <button onClick={() => handleDelete(notice.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isModalOpen && (
                <Modal
                    notice={selectedNotice}
                    onClose={handleModalClose}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default NoticeTable;
