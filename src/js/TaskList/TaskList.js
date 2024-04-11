import React, { useState, useEffect } from "react";
import ApiService from "./../ApiService";
import TaskItem from "./TaskItem";
import Modal from "./../Modal";
import "../../css/Tasks/TaskList.css";
import dayjs from "dayjs";
import { TimePicker } from "antd";
import ControllableStates from "./ControllableStates";

function formatTime(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const second = date.getSeconds().toString().padStart(2, "0");
  return `${hours}:${minutes}:${second}`;
}

function TaskList({ user, date, types, setError, setEventsGlobal }) {
  const apiService = new ApiService("http://localhost:2024/api");
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState(null);
  const [openNewTask, setOpenNewTask] = useState(null);
  const [type, setType] = useState(null);
  const [setectedTypId, setSetectedTypId] = useState(null);

  const onEdit = (id) => {
    const taskToEdit = events.find((event) => event.id === id);
    setEditingTask({ ...taskToEdit });
    setIsModalOpen(true);
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
        typeid: type["id"],
        time: editingTask["time"],
      })
      .then((data) => {
        setEvents(data);
        setEventsGlobal(data);
        setIsModalOpen(false);
        setError("");
      })
      .catch((error) => setError("Chyba při aktualizaci task:" + error));
  };

  const addTask = async () => {
    const newTask = {
      name: "",
      description: "",
      time: "",
      typeid: "",
    };
    setNewTask(newTask);
    setOpenNewTask(true);
    setIsModalOpen(true);
  };

  const newTaskSubmit = async (e) => {
    var time = formatTime(new Date().toString());
    if (newTask["time"] !== "") time = newTask["time"];
    e.preventDefault();
    await apiService
      .put("createTask", {
        username: user["username"],
        description: newTask["description"],
        date: date,
        time: time,
        name: newTask["name"],
        typeid: type["id"],
      })
      .then((data) => {
        setEvents(data);
        setEventsGlobal(data);
        setError("");
      })
      .catch((error) => setError("Chyba při vytvoření task:" + error));
  };

  const handleNewChange = (e) => {
    setNewTask((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const dateNewCange = (e) => {
    setEditingTask((prevState) => ({
      ...prevState,
      time: formatTime(e["$d"].toString()),
    }));
  };

  const dateEditCange = (e) => {
    setEditingTask((prevState) => ({
      ...prevState,
      time: formatTime(e["$d"].toString()),
    }));
  };
  const onDelete = (id) => {
    apiService
      .delete("removeTask", { id: id, username: user["username"], date: date })
      .then((data) => {
        setEvents(data);
        setEventsGlobal(data);
        setError("");
      })
      .catch((error) => setError("Chyba při mazání ukolu: " + error));
  };

  const selectedValues = React.useMemo(
    () => types.filter((v) => v.selected),
    [types]
  );

  useEffect(() => {
    apiService
      .get("allEvents", {
        username: user["username"],
        date: date,
        typeid: setectedTypId || 0,
      })
      .then((data) => {
        setEvents(data);
        setEventsGlobal(data);
        setIsModalOpen(false);
        setError("");
      })
      .catch((error) => setError("Chyba při načítání dat z API ukolu: " + error));
  }, [user, date, types]);

  return (
    <div className="seznamUkolu">
      <h2>Seznam úkolů</h2>
      <div className="seznamUkoluBlok">
      {events.map((event) => (
  <TaskItem key={event.id} event={event} onEdit={onEdit} onDelete={onDelete} />
))}
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
          setOpenNewTask(false);
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
              <label>Typ:</label>
              <ControllableStates
                multiple
                value={selectedValues}
                options={types}
                label={"Typ"}
                setValueGlobal={setType}
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

        {openNewTask && (
          <form onSubmit={newTaskSubmit}>
            <div>
              <label>Název:</label>
              <input
                type="text"
                name="name"
                value={newTask["name"] || ""}
                onChange={handleNewChange}
              />
            </div>
            <div>
              <label>Popis:</label>
              <input
                type="text"
                name="description"
                value={newTask["description"] || ""}
                onChange={handleNewChange}
              />
            </div>
            <div>
              <label>Typ:</label>
              <ControllableStates
                multiple
                value={selectedValues}
                options={types}
                label={"Typ"}
                setValueGlobal={setType}
              />
            </div>
            <div>
              <TimePicker
                defaultValue={dayjs(
                  formatTime(new Date().toString()),
                  "HH:mm:ss"
                )}
                onChange={dateNewCange}
              />
            </div>
            <button className="loginbutton" type="submit">
              Přidat
            </button>
          </form>
        )}
      </Modal>

      <button className="loginbutton" onClick={addTask}>
        Přidej úkol
      </button>
    </div>
  );
}

export default TaskList;
