import React, { useState, useEffect } from "react";
import ApiService from "../API/ApiService";
import TaskItem from "./TaskItem";
import Modal from "../Modal/Modal";
import "../../css/Tasks/TaskList.css";
import dayjs from "dayjs";
import { TimePicker } from "antd";
import {formatDate, formatTime} from "./../utility";

function TaskList({ user, date, setError, setEventsGlobal, setDateGlobal }) {
  const apiService = new ApiService("http://localhost:2024/api");
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState(null);
  const [openNewTask, setOpenNewTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const addTask = async () => {
    const newTask = {
      name: "",
      description: "",
      time: "",
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
        date: formatDate(date.toString()),
        time: time,
        name: newTask["name"],
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


  useEffect(() => {
   async function callApi(){
      await apiService
      .get("allTasksByDate", {
        username: user["username"],
        date: formatDate(date.toString()),
      })
      .then((data) => {
        setEvents(data);
        setEventsGlobal(data);
        setIsModalOpen(false);
        setError("");
      })
      .catch((error) => setError("Chyba při načítání dat z API ukolu: " + error));
    }

    callApi();
  }, [user, date, setEventsGlobal, setError, setDateGlobal]);

  return (
    <div className="seznamUkolu">
      <h2>Seznam úkolů</h2>
      <div className="seznamUkoluBlok">
      {events.map((event) => (
    <TaskItem user={user} date={date} setError={setError} event={event} events={events}
    setEventsGlobal={setEvents}  />
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
