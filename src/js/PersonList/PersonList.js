import React, { useState, useEffect } from 'react';
import PersonItem from './PersonItem'; 
import ApiService from './../API/ApiService';
import Modal from './../Modal/Modal';
import "../../css/Person/PersonList.css";

function PersonList({ user, setPersonsGlobal, setError }) {
  const apiService = new ApiService('http://localhost:2024/api');
  const [persons, setPersons] = useState([]);
  const [newPerson, setNewPerson] = useState(null);
  const [openNewPerson, setOpenNewPerson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


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
            setPersonsGlobal(data);
            setError('')
        })
        .catch((error) => {
          setError(error);
        });
       
  };

  const handleNewChange = (e) => {
    setNewPerson(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };


  useEffect(() => {
    async function callApi(){
      const apiService = new ApiService('http://localhost:2024/api');

      await apiService.get('getAllPersons', { username: user['username'] })
      .then((data) => {
        setPersons(data);
        setPersonsGlobal(data);
        setIsModalOpen(false);
        setError('')
      })
      .catch(error => setError("Chyba při načítání dat z AP person: ", error));
    }
    callApi();
  }, [ user, setError, setPersonsGlobal]); 

  return (
    <div className='seznamOsob'>
      <h2>Seznam osob</h2>
      <div className='seznamOsobBlok'>
        {persons.map(person => (
        <PersonItem person={person} 
                    persons={persons}
                    user={user}
                    setPersons={setPersons}
                    setPersonsGlobal={setPersonsGlobal}
                    setError={setError} />
      ))}
      </div>
       <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false)
        setOpenNewPerson(false)
       }
        }>
       
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
