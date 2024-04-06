import React, { useState } from 'react';
import '../css/Register.css'; // Importujeme styly

function Registration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = () => {
    // Logika pro vytvoření nového uživatelského účtu
  };

  return (
    <div className="form-container sign-up-container">
      <h2>Registrace</h2>
      <input type="text" placeholder="Userame" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Heslo" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegistration}>Registrovat</button>
    </div>
  );
}

export default Registration;
