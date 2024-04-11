import React, { useState } from "react";
import Detail from "./../Detail";

function TaskItem({ event, onEdit, onDelete }) {
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDatilopen, setTaskDatilopen] = useState(null);

  const onClick = (e) => {
    setSelectedTask(e);
    setTaskDatilopen(true);
  };

  return (
    <div id={event.id} className="task-item">
      <h3>
        {event["name"]} {event["time"]}
      </h3>
      <div className="actions">
        <button
          onClick={() => onEdit(event["id"])}
          className="action-button edit"
        >
          Editovat
        </button>
        <button
          onClick={() => onDelete(event["id"])}
          className="action-button delete"
        >
          Smazat
        </button>
        <button onClick={() => onClick(event)} className="action-button info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 128 128"
          >
            <path d="M 64 6 C 32 6 6 32 6 64 C 6 96 32 122 64 122 C 96 122 122 96 122 64 C 122 32 96 6 64 6 z M 64 12 C 92.7 12 116 35.3 116 64 C 116 92.7 92.7 116 64 116 C 35.3 116 12 92.7 12 64 C 12 35.3 35.3 12 64 12 z M 64 30 A 9 9 0 0 0 64 48 A 9 9 0 0 0 64 30 z M 64 59 C 59 59 55 63 55 68 L 55 92 C 55 97 59 101 64 101 C 69 101 73 97 73 92 L 73 68 C 73 63 69 59 64 59 z"></path>
          </svg>
        </button>
      </div>
      {taskDatilopen && (
        <Detail
          isOpen={setTaskDatilopen}
          onClose={() => {
            setTaskDatilopen(false);
          }}
          data={[
            ["Název", selectedTask["name"]],
            ["Popis", selectedTask["description"]],
            ["Typ", selectedTask["typ"]["name"]],
            ["Datum", selectedTask["date"]],
            ["Čas", selectedTask["time"]],
          ]}
        />
      )}
    </div>
  );
}

export default TaskItem;
