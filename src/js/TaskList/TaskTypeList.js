import React, { useState, useEffect } from 'react';
import ApiService from './../ApiService';
import TaskTypeItem from './TaskTypeItem'; 

function TaskTypeList({ user }) {
    const apiService = new ApiService('http://localhost:2024/api');
    const [types, setTypes] = useState([]);

    const onDelete = (id) => {
        apiService.delete('removeTypes', { id: id, username: user['username'] })
          .then((data) => {
            setTypes(data);
          })
          .catch(error => console.error("Chyba při mazání osoby:", error));
      };

      const onEdit = (id) => {
        const typeToEdit = types.find(person => person.id === id);
  
      };

    useEffect(() => {
        apiService.get('allTypeEvents', { username: user['username'] })
          .then((data) => {
            setTypes(data);
          })
          .catch(error => console.error("Chyba při načítání dat z API:", error));
      }, [user]); 

    return (
        <div className='seznamTypu'>
         <div className='seznam'>
        {types.map(type => (
        <TaskTypeItem event={type} 
                    onEdit={onEdit} 
                    onDelete={onDelete} />
      ))}
      </div>
      <button className="action-button edit"><svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><title>add</title><path d="M61.44,0A61.46,61.46,0,1,1,18,18,61.25,61.25,0,0,1,61.44,0ZM88.6,56.82v9.24a4,4,0,0,1-4,4H70V84.62a4,4,0,0,1-4,4H56.82a4,4,0,0,1-4-4V70H38.26a4,4,0,0,1-4-4V56.82a4,4,0,0,1,4-4H52.84V38.26a4,4,0,0,1,4-4h9.24a4,4,0,0,1,4,4V52.84H84.62a4,4,0,0,1,4,4Zm8.83-31.37a50.92,50.92,0,1,0,14.9,36,50.78,50.78,0,0,0-14.9-36Z"/></svg></button>
        </div>
        
      );
}

export default TaskTypeList;