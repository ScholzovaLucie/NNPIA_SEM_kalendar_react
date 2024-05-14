import React, { useState } from "react";
import Detail from "./../Detail";
import ActionButtons from "./../components/ActionButtons";
import Modal from "../Modal/Modal";
import ApiService from "../API/ApiService";
import {formatTime} from "./../utility";
import { TimePicker } from "antd";
import dayjs from "dayjs";

function TaskItem({ user, date, setError, event, setEventsGlobal, events, pageble }) {
  const apiService = new ApiService("http://localhost:2024/api");
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDatilopen, setTaskDatilopen] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClick = (e) => {
    setSelectedTask(e);
    setTaskDatilopen(true);
  };

  const onDelete = async(id) => {
    await apiService
      .delete("removeTask", { id: id, username: user["username"], date: date,  page: pageble['page'], size: pageble['size'], sort: pageble['sort']  })
      .then((data) => {
        setEventsGlobal(data);
        setError("");
      })
      .catch((error) => setError("Chyba při mazání ukolu: " + error));
  };

  const dateEditCange = (e) => {
    setEditingTask((prevState) => ({
      ...prevState,
      time: formatTime(e["$d"].toString()),
    }));
  };

  
  const handleEditChange = (e) => {
    setEditingTask((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await apiService
      .put("updateTask", {
        username: user["username"],
        id: editingTask["id"],
        name: editingTask["name"],
        description: editingTask["description"],
        date: date,
        time: editingTask["time"],
      })
      .then((data) => {
        setEventsGlobal(data);
        setIsModalOpen(false);
        setError("");
      })
      .catch((error) => setError("Chyba při aktualizaci task:" + error));
  };

  const onEdit = (id) => {
    const taskToEdit = events.find((event) => event.id === id);
    setEditingTask({ ...taskToEdit });
    setIsModalOpen(true);
  };

  return (
    <div>
      <div id={event.id} className="item">
      <h3>
        {event["name"]} {event["time"]}
      </h3>
      <ActionButtons onEdit={onEdit} onClick={onClick} onDelete={onDelete} data={event}/>
    
      {taskDatilopen && (
        <Detail
          isOpen={setTaskDatilopen}
          onClose={() => {
            setTaskDatilopen(false);
          }}
          data={[
            ["Název", selectedTask["name"]],
            ["Popis", selectedTask["description"]],
            ["Datum", selectedTask["date"]],
            ["Čas", selectedTask["time"]],
          ]}
        />
      )}
    </div>
    <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
      >
        {editingTask && (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Název:</label>
              <input
                type="text"
                name="name"
                value={editingTask["name"] || ""}
                onChange={handleEditChange}
              />
            </div>
            <div>
              <label>Popis:</label>
              <input
                type="text"
                name="description"
                value={editingTask["description"] || ""}
                onChange={handleEditChange}
              />
            </div>
            <div>
              <TimePicker
                defaultValue={dayjs(
                  editingTask["time"] || formatTime(new Date().toString()),
                  "HH:mm:ss"
                )}
                onChange={dateEditCange}
              />
            </div>
            <button className="loginbutton" type="submit">
              Uložit změny
            </button>
          </form>
        )}
      </Modal>
    </div>
    
  );
}

export default TaskItem;
