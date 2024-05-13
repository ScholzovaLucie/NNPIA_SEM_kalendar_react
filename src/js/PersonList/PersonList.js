import React, { useState, useEffect } from 'react';
import PersonItem from './PersonItem'; 
import ApiService from './../API/ApiService';
import Modal from './../Modal/Modal';
import { usePagination } from '../components/usePagination';

function PersonList({ user, setPersonsGlobal, setError }) {
  const apiService = new ApiService('http://localhost:2024/api');
  const [persons, setPersons] = useState([]);
  const [count, setCount] = useState(0);
  const [newPerson, setNewPerson] = useState(null);
  const [openNewPerson, setOpenNewPerson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    console.log(pageSize)
        await apiService.put('createPerson', { 
            username: user['username'], 
            firstName: newPerson['firstName'],
            lastName: newPerson['lastName'],
            birthday: newPerson['birthday'],
            page: pageNumber, size: pageSize, sort: `lastName,${sort}` 
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

      await apiService.get('getAllPersons', { username: user['username'], page: pageNumber, size: pageSize, sort: `lastName,${sort}`   })
      .then((data) => {
        console.log(data);
        setPersons(data);
        setPersonsGlobal(data);
        setIsModalOpen(false);
        setError('')
      })
      .catch(error => setError("Chyba při načítání dat z AP person: ", error));

      await apiService.get('getCountOfPerson', { username: user['username'] })
      .then((data) => {
        setCount(data);
        console.log(pageNumber + 1)
        console.log(count)
        console.log(pageSize)
        console.log(count % pageSize)
        console.log((pageNumber + 1) < (count % pageSize))
      })
      .catch(error => setError("Chyba při načítání dat z AP person: ", error));
    }
    callApi();
  }, [ user, setError, setPersonsGlobal, sort, count, pageNumber, pageSize]); 

  return (
    <div className='seznam persons'>
      <div>
        <h2>Seznam osob</h2>
      <div className='sorting'>
        <button  value={"asc"} onClick={() => setSort("asc")} className="loginbutton">ASC</button>
        <button  value={"desc"} onClick={() => setSort("desc")} className="loginbutton">DESC</button>
      </div>
      </div>
      <div>
      <div className='seznamBlok'>
        {pageNumber > 0 && (
          <div className='arrowBlok'>
            <div className='arrowButton' onClick={() => decrementPageNumber()}>&#8593;</div>
            </div>
          
        )}
      
        {persons.map(person => (
        <PersonItem person={person} 
                    persons={persons}
                    user={user}
                    setPersons={setPersons}
                    setPersonsGlobal={setPersonsGlobal}
                    setError={setError} />
      ))}
      {(pageNumber + 1) < Math.ceil(count / pageSize) && (
        <div  className='arrowBlok'> 
      <div className='arrowButton' onClick={() => incrementPageNumber()}>&#8595;</div>
      </div>
      )}
      </div>
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
