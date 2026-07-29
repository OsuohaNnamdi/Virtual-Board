import React from 'react';
import '../Styles/Dialog.css'; // Create this CSS file for styling

const Dialog = ({ title, onClose, onSubmit, initialValue, onChange }) => {
    const [value, setValue] = React.useState(initialValue || '');

    const handleChange = (e) => {
        setValue(e.target.value);
        onChange(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <div className='dialog-overlay'>
            <div className='dialog-container'>
                <div className='dialog-header'>
                    <h2>{title}</h2>
                    <button className='close-button' onClick={onClose}>×</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='dialog-body'>
                        <textarea
                            value={value}
                            onChange={handleChange}
                            placeholder='Enter your comment here...'
                        />
                    </div>
                    <div className='dialog-footer'>
                        <button type='submit'>Submit</button>
                        <button type='button' onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Dialog;
