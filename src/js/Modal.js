import React from 'react';
import './../css/Modal.css'; // CSS pro modální okno

const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
        <button className="loginbutton" onClick={onClose}>Zavřít</button>
      </div>
    </div>
  );
}

export default Modal;
