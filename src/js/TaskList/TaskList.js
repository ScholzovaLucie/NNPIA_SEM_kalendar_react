import React, { useState, useEffect } from 'react';
import ApiService from './../ApiService';
import TaskItem from './TaskItem'; 
import Modal from './../Modal';
import "../../css/Tasks/TaskList.css";
import dayjs from 'dayjs';
import { TimePicker } from 'antd';
import Combobox from "react-widgets/Combobox";

function formatTime(dateString) {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
  
    return `${hours}:${minutes}`;
  }


function TaskList({ user, date, types }){
    const apiService = new ApiService('http://localhost:2024/api');
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [newTask, setNewTask] = useState(null);
    const [openNewTask, setOpenNewTask] = useState(null);

  const onEdit = (id) => {
    const taskToEdit = events.find(event => event.id === id);
    setEditingTask({ ...taskToEdit });
    setIsModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditingTask(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

     
    
    await apiService.put('updateTask', {
        username: user['username'],
        id: editingTask['id'],
        name: editingTask['name'],
        description: editingTask['description'],
        date: date,
        type: newTask['type'],
        time: editingTask['time']
      }).then((data) => {
        setEvents(data);
        setIsModalOpen(false);
          })
          .catch(error =>  console.error("Chyba při aktualizaci osoby:", error));
  };

  const addTask = async () => {
    const newTask = { 
        name: "",
        description: "",
        time: "",
        typeid:""
    };
    setNewTask(newTask);
    setOpenNewTask(true);
    setIsModalOpen(true);
  };

  
  const newTaskSubmit = async (e) => {
    e.preventDefault();
        await apiService.put('createTask', { 
            username: user['username'], 
            description: newTask['description'],
            date: date,
            time: newTask['time'],
            name: newTask['name'],
            typeid: newTask['typeid'],
        })
        .then((data) => {
            setEvents(data);
        })
        .catch((error) => {
          console.error(error);
        });
       
  };

  const handleNewChange = (e) => {
    setNewTask(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

 
  const dateNewCange = (e) => {
    setNewTask(prevState => ({
        ...prevState,
        time: formatTime(e["$d"].toString())
      }));
      console.log(newTask);
  };

  const dateEditCange = (e) => {
    setEditingTask(prevState => ({
        ...prevState,
        time: formatTime(e["$d"].toString())
      }));
      console.log(newTask);
  };

  

      const onDelete = (id) => {
        apiService.delete('removeTask', { id: id, username: user['username'], date: date })
          .then((data) => {
            setEvents(data);
          })
          .catch(error => console.error("Chyba při mazání ukolu:", error));
      };

      const handleEditTypeChange= (e) => {
        setEditingTask(prevState => ({
          ...prevState,
          typeid: e['id']
        }));
      };

      const editNewChange= (e) => {
        setNewTask(prevState => ({
          ...prevState,
          typeid: e['id']
        }));
      };

      useEffect(() => {
        apiService.get('allEvents', { username: user['username'], date: date })
          .then((data) => {
            setEvents(data);
            setIsModalOpen(false);
          })
          .catch(error => console.error("Chyba při načítání dat z API:", error));

          console.log(types)
      }, [user, date, types]); 



    return(
        <div className='seznamUkolu'>
 <h2>Seznam úkolů</h2>
<div className='seznamUkoluBlok'>
        {events.map(event => (
        <TaskItem event={event} 
                    onEdit={onEdit} 
                    onDelete={onDelete} />
      ))}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false)
        setEditingTask(null)
        setOpenNewTask(false)
       }
        }>
        {editingTask && (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Název:</label>
              <input type="text" name="name" value={editingTask['name'] || ''} onChange={handleEditChange} />
            </div>
            <div>
              <label>Popis:</label>
              <input type="text" name="description" value={editingTask['description'] || ''} onChange={handleEditChange} />
            </div>
            <div>
            <label>Typ:</label>
              <Combobox
    data={types}
    textField='name'
    onSelect={handleEditTypeChange}
  />
            </div>
            <div>
              <TimePicker defaultValue={dayjs(editingTask['time'] ||'12:08', 'HH:mm')}  onChange={dateEditCange}/>
            </div>
            <button className="loginbutton" type="submit">Uložit změny</button>
          </form>
        )}

{openNewTask && (
          <form onSubmit={newTaskSubmit}>
            <div>
              <label>Název:</label>
              <input type="text" name="name" value={newTask['name'] || ''} onChange={handleNewChange} />
            </div>
            <div>
              <label>Popis:</label>
              <input type="text" name="description" value={newTask['description'] ||''} onChange={handleNewChange} />
            </div>
            <div>
              <label>Typ:</label>
              <Combobox
    data={types}
    textField='name'
    onSelect={editNewChange}
  />
            </div>
            <div>
              <TimePicker defaultValue={dayjs(newTask['time'] ||'12:08', 'HH:mm')} onChange={dateNewCange}/>
            </div>
            <button className="loginbutton" type="submit">Přidat</button>
          </form>
        )}
      </Modal>
      <button className="loginbutton" onClick={addTask}>Přidej úkol</button>
        </div>
    );
}

export default TaskList;