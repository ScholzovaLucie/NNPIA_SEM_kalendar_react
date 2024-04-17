import React from 'react';
import "../../css/Modal.css";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button onClick={onClose} className=" loginbutton modal-close">
        Zavřít
      </button>
      </div>
      
    </div>
  );
}

export default Modal;
