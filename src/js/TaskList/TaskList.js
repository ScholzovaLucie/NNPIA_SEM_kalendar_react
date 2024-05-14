import React, { useState, useEffect } from "react";
import ApiService from "../API/ApiService";
import TaskItem from "./TaskItem";
import Modal from "../Modal/Modal";
import dayjs from "dayjs";
import { TimePicker } from "antd";
import { formatDate, formatTime } from "./../utility";
import { usePagination } from '../components/usePagination';

function TaskList({ user, date, setError, setEventsGlobal, setDateGlobal }) {
  const apiService = new ApiService("http://localhost:2024/api");
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState(null);
  const [count, setCount] = useState(0);
  const [openNewTask, setOpenNewTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const {
    pageNumber,
    pageSize,
    sort,
    pageableState,
    incrementPageNumber,
    decrementPageNumber,
    updatePageableState,
    setPageNumber,
    setSort,
  } = usePagination(0, 4, "asc");

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
        page: pageNumber, size: pageSize, sort: `name,${sort}`
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
    async function callApi() {
      await apiService
        .get("allTasksByDate", {
          username: user["username"],
          date: formatDate(date.toString()),
          page: pageNumber, size: pageSize, sort: `name,${sort}`
        })
        .then((data) => {
          setEvents(data);
          setEventsGlobal(data);
          setIsModalOpen(false);
          setError("");
        })
        .catch((error) => setError("Chyba při načítání dat z API ukolu: " + error));

        await apiService.get('getCountOfTasks', { 
          username: user["username"],
          date: formatDate(date.toString()),
          page: pageNumber, size: pageSize, sort: `name,${sort}`
        })
      .then((data) => {
        setCount(data);
      })
      .catch(error => setError("Chyba při načítání dat z AP person: ", error));
    }

    callApi();
  }, [user, date, setEventsGlobal, setError, setDateGlobal, sort, count, pageNumber, pageSize]);

  return (
    <div className="seznam tasks">
      <div>
        <h2>Seznam úkolů</h2>
      <div>
        <button value={"asc"} onClick={() => setSort("asc")} className="loginbutton">ASC</button>
        <button value={"desc"} onClick={() => setSort("desc")} className="loginbutton">DESC</button>
      </div>
      </div>
      <div>
        <div className="seznamBlok">
        {pageNumber > 0 && (
          <div className='arrowBlok'>
            <div className='arrowButton' onClick={() => decrementPageNumber()}>&#8593;</div>
          </div>

        )}
        {events.map((event) => (
          <TaskItem user={user} date={formatDate(date.toString())} setError={setError} event={event} events={events}
            setEventsGlobal={setEvents} pageble={{page: pageNumber, size: pageSize, sort: `name,${sort}`}} />

        ))}
        {(pageNumber + 1) < Math.ceil(count / pageSize) && (
          <div className='arrowBlok'>
            <div className='arrowButton' onClick={() => incrementPageNumber()}>&#8595;</div>
          </div>
        )}
      </div>
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
