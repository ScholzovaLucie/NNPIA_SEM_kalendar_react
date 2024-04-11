import React, { useState } from 'react';
import '../../css/Register.css';
import ApiService from './../ApiService';
import bcrypt from "bcryptjs-react";

function Registration({ setUser, hash }) {
  const apiService = new ApiService('http://localhost:2024/api');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordFirst, setPasswordFirst] = useState('');
  const [passwordSecond, setPasswordSecond] = useState('');
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [error, setError] = useState('');

  const handleRegistration = async () => {
    apiService.put('createUser', { 
      username: username, 
      password: hash(password) ,
      firstName: firstname,
      lastName: lastname,
      
    })
    .then((data) => {
      setUser(data);
      setError('');
    })
    .catch((error) => {
      console.error(error);
      setError('Chyba při vytváření');
    });
  };

  return (
    <div className="form-container sign-up-container">
      <h2>Registrace</h2>
      <input type="text" placeholder="Firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
      <input type="text" placeholder="Lastname"  value={lastname} onChange={(e) => setLastname(e.target.value)}/>
      <input type="text" placeholder="Userame" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Heslo" value={passwordFirst} onChange={(e) => setPasswordFirst(e.target.value)} />
      <input type="password" placeholder="Heslo znovu" value={passwordSecond} onChange={(e) => {
        setPasswordSecond(e.target.value);
        if(passwordFirst===e.target.value) {
          setPassword(e.target.value);
          setError('');
        }
        else{
          setError('Hesla se nenschodují');
        }
        }} />
        <div className='errorHandler'>{error}</div>
      <button className='loginbutton' onClick={handleRegistration}>Registrovat</button>
    </div>
  );
}

export default Registration;
