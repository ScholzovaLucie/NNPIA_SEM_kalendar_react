import React, { useState } from 'react';
import '../css/Register.css'; // Importujeme styly

function Registration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [lastname, setLastname] = useState('');
  const [firstname, setFirstname] = useState('');
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  const token = `${username}:${password}`;
  var basicAuth = Buffer.from(token).toString("base64");
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + basicAuth,
    },
    body:{
      username: username,
      password: password,
      email: email,
      firstname: firstname,
      lastname: lastname,
    }
  };

  const handleRegistration = async () => {
    await fetch("https://localhost:2024/api/createUser", requestOptions)
    .then((response) => {
      setUser(response.data);
      console.log("response.data");
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
  };

  return (
    <div className="form-container sign-up-container">
      <h2>Registrace</h2>
      <input type="text" placeholder="Firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
      <input type="text" placeholder="Lastname"  value={lastname} onChange={(e) => setLastname(e.target.value)}/>
      <input type="email" placeholder="Email"  value={email} onChange={(e) => setEmail(e.target.value)}/>
      <input type="text" placeholder="Userame" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Heslo" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegistration}>Registrovat</button>
    </div>
  );
}

export default Registration;
