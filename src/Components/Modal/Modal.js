import { useState } from 'react';
import './Modal.css';

const Modal = ({ isOpen, message, onClose }) => {
    const modalStyle = {
        display: isOpen ? 'block' : 'none',
        position: 'fixed',
        zIndex: 9999,
        top: '2px',
        right: '2px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
        maxWidth: '300px',
    };

    return (
        <div style={modalStyle}>
            <span style={{ position: 'absolute', top: '5px', right: '10px', cursor: 'pointer', fontSize: '20px' }} onClick={onClose}>&times;</span>
            <p>{message}</p>
        </div>
    );
};

export default Modal;
