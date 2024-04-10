function TaskItem({ event, onEdit, onDelete } ){
    return(
        <div className="task-item">
        <h3>{event['name']} {event['time']}</h3>
        <div className="actions">
        <button onClick={() => onEdit(event['id'])} className="action-button edit">Editovat</button>
          <button onClick={() => onDelete(event['id'])} className="action-button delete">Smazat</button>
          <svg className="action-icon" /* svg path */></svg>
          <svg className="action-icon" /* svg path */></svg>
        </div>
      </div>
    );
}

export default TaskItem;