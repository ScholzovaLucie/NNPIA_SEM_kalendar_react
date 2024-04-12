import React, { useState, useEffect } from "react";
import ApiService from "../../ApiService";
import TaskTypeItem from "./TaskTypeItem";
import Modal from "../../Modal";

function TaskTypeList({ user, setTypesGlobal, setError }) {
  const apiService = new ApiService("http://localhost:2024/api");
  const [types, setTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState(null);
  const [openNewTask, setOpenNewTask] = useState(null);

  const onDelete = async (id) => {
    await apiService
      .delete("removeTypeTask", { id: id, username: user["username"] })
      .then((data) => {
        setTypes(data);
        setTypesGlobal(data);
        setError("");
      })
      .catch((error) => setError("Chyba při mazání osoby:", error));
  };

  const onEdit = (id) => {
    const taskToEdit = types.find((event) => event.id === id);
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
      .post("updateTypeTask", {
        username: user["username"],
        id: editingTask["id"],
        name: editingTask["name"],
      })
      .then((data) => {
        setTypes(data);
        setTypesGlobal(data);
        setIsModalOpen(false);
        setError("");
      })
      .catch((error) => setError("Chyba při aktualizaci typu úkolu:", error));
  };

  const addTask = async () => {
    const newTask = {
      name: "",
    };
    setNewTask(newTask);
    setOpenNewTask(true);
    setIsModalOpen(true);
  };

  const newTaskSubmit = async (e) => {
    e.preventDefault();
    await apiService
      .put("createTypeTask", {
        username: user["username"],
        name: newTask["name"],
      })
      .then((data) => {
        setTypes(data);
        setTypesGlobal(data);
        setError("");
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleNewChange = (e) => {
    setNewTask((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    async function callApi() {
      const apiService = new ApiService("http://localhost:2024/api");
      await apiService
        .get("allTypeEvents", { username: user["username"] })
        .then((data) => {
          setTypes(data);
          setTypesGlobal(data);
          setError("");
        })
        .catch((error) =>
          setError("Chyba při načítání dat z API task type: ", error)
        );
    }
    callApi();
  }, [user, setTypesGlobal, setError]);

  return (
    <div className="seznamTypu">
      <div className="seznam">
        {types.map((type) => (
          <TaskTypeItem event={type} onEdit={onEdit} onDelete={onDelete} />
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
            <button className="loginbutton" type="submit">
              Přidat
            </button>
          </form>
        )}
      </Modal>
      <button className="action-button edit" onClick={addTask}>
        <svg
          id="Layer_1"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 122.88 122.88"
        >
          <title>add</title>
          <path d="M61.44,0A61.46,61.46,0,1,1,18,18,61.25,61.25,0,0,1,61.44,0ZM88.6,56.82v9.24a4,4,0,0,1-4,4H70V84.62a4,4,0,0,1-4,4H56.82a4,4,0,0,1-4-4V70H38.26a4,4,0,0,1-4-4V56.82a4,4,0,0,1,4-4H52.84V38.26a4,4,0,0,1,4-4h9.24a4,4,0,0,1,4,4V52.84H84.62a4,4,0,0,1,4,4Zm8.83-31.37a50.92,50.92,0,1,0,14.9,36,50.78,50.78,0,0,0-14.9-36Z" />
        </svg>
      </button>
    </div>
  );
}

export default TaskTypeList;
