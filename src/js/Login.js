import React, { useState } from "react";
import "../css/Login.css";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    }
  };

  const handleLogin = async () => {
     await fetch("https://localhost:2024/login", requestOptions)
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
    <div className="form-container sign-in-container">
      <h2>Přihlášení</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Heslo"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Přihlásit</button>
    </div>
  );
}

export default Login;
