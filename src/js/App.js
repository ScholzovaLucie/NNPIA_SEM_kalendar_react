import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'// Importujeme Navigate pro přesměrování
import "../css/App.css";
import Login from "./Login";
import HomePage from "./HomePage";

function App() {
  const [user, setUser] = useState(null);


  if(!user) {
    return <Login setUser={setUser} />
  }


  return (
    <div className="app-container">
      <header>
        <h1>KALENDÁŘ</h1>
      </header>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage user={user}/>}>
          </Route>
          <Route path="/userInfo">
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
