import React from 'react';

function PersonItem({ person, onEdit, onDelete }) {
    return (
        <div className="person-item">
          <h3>{person['firstName']} {person['lastName']}</h3>
          <div className="actions">
          <button onClick={() => onEdit(person['id'])} className="action-button edit">Editovat</button>
            <button onClick={() => onDelete(person['id'])} className="action-button delete">Smazat</button>
            <svg className="action-icon" /* svg path */></svg>
            <svg className="action-icon" /* svg path */></svg>
          </div>
        </div>
      );
}

export default PersonItem;
