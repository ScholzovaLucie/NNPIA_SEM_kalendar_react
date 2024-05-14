import React, { useState } from "react";
import Detail from "./../Detail";
import ActionButtons from "./../components/ActionButtons";
import ApiService from './../API/ApiService';
import Modal from './../Modal/Modal';

function PersonItem({ user, person, persons, setPersons, setPersonsGlobal, setError, pageble }) {
  const apiService = new ApiService('http://localhost:2024/api');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [personDatilopen, setPersonDatilopen] = useState(null);
  const [editingPerson, setEditingPerson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onClick = (e) => {
    setSelectedPerson(e);
    setPersonDatilopen(true);
  };

  const onEdit = (id) => {
    const personToEdit = persons.find(person => person.id === id);
    setEditingPerson({ ...personToEdit });
    setIsModalOpen(true);
  };

  const onDelete = async (id) => {
    await apiService.delete('removePerson', { id: id, username: user['username'],  page: pageble['page'], size: pageble['size'], sort: pageble['sort'] })
      .then((data) => {
        setPersons(data);
        setPersonsGlobal(data);
        setError('')
      })
      .catch(error => setError("Chyba při mazání osoby:", error));
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
        birthday: editingPerson['birthday']
      }).then((data) => {
        setPersons(data);
        setPersonsGlobal(data);
        setIsModalOpen(false);
        setError('')
          })
          .catch(error =>  setError("Chyba při aktualizaci osoby:", error));
  };


  
  return (
    <div >
      <div className="item">
      <h3>
        {person["firstName"]} {person["lastName"]}
      </h3>
      <ActionButtons onEdit={onEdit} onClick={onClick} onDelete={onDelete} data={person}/>
      
      {personDatilopen && (
        <Detail
          isOpen={setPersonDatilopen}
          onClose={() => {
            setPersonDatilopen(false);
          }}
          data={[
            ["Jméno", selectedPerson["firstName"]],
            ["Příjmení", selectedPerson["lastName"]],
            ["Narozeniny", selectedPerson["birthday"]],
            ["Svátel", selectedPerson["holiday"]],
          ]}
        />
      )}
    </div>
    
      <Modal isOpen={isModalOpen} onClose={() => {
        setIsModalOpen(false)
        setEditingPerson(null)
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
              <input type="date" name="birthday" value={editingPerson['birthday'] || ''} onChange={handleEditChange} />
            </div>
            <button className="loginbutton" type="submit">Uložit změny</button>
          </form>
        )}
      </Modal>
    </div>
    
  );
}

export default PersonItem;
