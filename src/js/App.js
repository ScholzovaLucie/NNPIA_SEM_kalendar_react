import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'// Importujeme Navigate pro přesměrování
import "../css/App.css";
import Login from "./Auth/Login";
import HomePage from "./HomePage";
import Profile from "./Profile/Profile"
import bcrypt from "bcryptjs-react";

function App() {
  const [user, setUser] = useState(null);
  var salt = bcrypt.genSaltSync(10);

  function hash(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash;
  }

  if(!user) {
    return <Login setUser={setUser} hash={hash} />
  }

  return (
    <div className="app-container">
      <header>
        <h1>KALENDÁŘ</h1>
      </header>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage user={user} setUser={setUser} hash={hash}/>}>
          </Route>
          <Route path="/profile" element={<Profile/>}>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
