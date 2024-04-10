import React, { useState, useEffect } from 'react';
import PersonItem from './PersonItem'; 
import ApiService from './../ApiService';
import Modal from './../Modal';
import "../../css/Person/PersonList.css";


function PersonList({ user }) {
    const apiService = new ApiService('http://localhost:2024/api');
  const [persons, setPersons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState(null);
  const [newPerson, setNewPerson] = useState(null);
  const [openNewPerson, setOpenNewPerson] = useState(null);
  
  const onEdit = (id) => {
    const personToEdit = persons.find(person => person.id === id);
    setEditingPerson({ ...personToEdit });
    setIsModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditingPerson(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await apiService.put('updatePerson', {
        username: user['username'],
        id: editingPerson['id'],
        firstName: editingPerson['firstName'],
        lastName: editingPerson['lastName'],
        birthday: new Date(editingPerson['birthday'])
      }).then((data) => {
        setPersons(data);
        setIsModalOpen(false);
          })
          .catch(error =>  console.error("Chyba při aktualizaci osoby:", error));
            

  };
  const addPerson = async () => {
    const newPerson = { 
        firstName:"",
        lastName:"",
        birthday:""
    };
    setNewPerson(newPerson);
    setOpenNewPerson(true);
    setIsModalOpen(true);
  };

  const newPersonSubmit = async (e) => {
    e.preventDefault();
        await apiService.put('createPerson', { 
            username: user['username'], 
            firstName: newPerson['firstName'],
            lastName: newPerson['lastName'],
            birthday: newPerson['birthday']
        })
        .then((data) => {
            setPersons(data);
        })
        .catch((error) => {
          console.error(error);
        });
       
  };

  const handleNewChange = (e) => {
    setNewPerson(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  
  const onDelete = (id) => {
    apiService.delete('removePerson', { id: id, username: user['username'] })
      .then((data) => {
        setPersons(data);
      })
      .catch(error => console.error("Chyba při mazání osoby:", error));
  };

  useEffect(() => {
    apiService.get('getAllPersons', { username: user['username'] })
      .then((data) => {
        setPersons(data);
        setIsModalOpen(false);
      })
      .catch(error => console.error("Chyba při načítání dat z API:", error));
  }, [user]); 

  return (
    <div className='seznamOsob'>
      <h2>Seznam osob</h2>
      <div>
        {persons.map(person => (
        <PersonItem person={person} 
                    onEdit={onEdit} 
                    onDelete={onDelete} />
      ))}
      </div>
       <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false)
        setEditingPerson(null)
        setOpenNewPerson(false)
       }
        }>
        {editingPerson && (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Jméno:</label>
              <input type="text" name="firstName" value={editingPerson['firstName'] || ''} onChange={handleEditChange} />
            </div>
            <div>
              <label>Příjmení:</label>
              <input type="text" name="lastName" value={editingPerson['lastName'] || ''} onChange={handleEditChange} />
            </div>
            <div>
              <label>Datum narození:</label>
              <input type="date" name="birthdate" value={editingPerson['birthday'] || ''} onChange={handleEditChange} />
            </div>
            <button className="loginbutton" type="submit">Uložit změny</button>
          </form>
        )}

{openNewPerson && (
          <form onSubmit={newPersonSubmit}>
            <div>
              <label>Jméno:</label>
              <input type="text" name="firstName" value={newPerson['firstName'] || ''} onChange={handleNewChange} />
            </div>
            <div>
              <label>Příjmení:</label>
              <input type="text" name="lastName" value={newPerson['lastName'] ||''} onChange={handleNewChange} />
            </div>
            <div>
              <label>Datum narození:</label>
              <input type="date" name="birthday" value={ newPerson['birthday'] ||''} onChange={handleNewChange} />
            </div>
            <button className="loginbutton" type="submit">Přidat</button>
          </form>
        )}
      </Modal>
      <button className="loginbutton" onClick={addPerson}>Přidej osobu</button>
    </div>
    
  );
}

export default PersonList;
