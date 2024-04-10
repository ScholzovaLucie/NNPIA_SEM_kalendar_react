import React, { useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import "../../css/Login.css";
import Registration from "./Register";
import time from "./../../img/time.png";
import pc from "./../../img/pc.png";
import PropTypes from 'prop-types';
import ApiService from './../ApiService';

export default function Login({ setUser }) {
  const [localUsername, setlocalUsername] = useState("");
  const [password, setPassword] = useState("");
  const apiService = new ApiService('http://localhost:2024/api');

  const [isSignUpActive, setIsSignUpActive] = useState(false);

  const handleSignUpClick = () => {
    setIsSignUpActive(true);
  };

  const handleSignInClick = () => {
    setIsSignUpActive(false);
  };

  const handleLogin = async () => {

    apiService.get('verifyUser', { username: localUsername, password:password })
    .then((data) => {
      setUser(data);
    })
    .catch((error) => {
      console.error(error);
    });
   
  };

  return (
    <div className="main_form">
      <img className="obrazek_pozadi" src={time} alt="time" />
      <div className={`container ${isSignUpActive ? "right-panel-active" : ""}`}>
        <div className="form-container sign-in-container">
          <h2>Přihlášení</h2>
          <input
            type="text"
            placeholder="Username"
            value={localUsername}
            onChange={(e) => setlocalUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Heslo"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="loginbutton" onClick={handleLogin}>Přihlásit</button>
        </div>
        <Registration />
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Vítejte zpět!</h1>
              <p>Chcete-li se dostat ke svému kalendáři, přihlaste se pomocí svých osobních údajů.</p>
              <button className="loginbutton ghost" onClick={handleSignInClick}>Přihlásit se</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Ahoj, návštěvníku!</h1>
              <p>Zadejte své osobní údaje a zjisti možnosti našeho kalendáře</p>
              <button className="loginbutton ghost" onClick={handleSignUpClick}>Registrace</button>
            </div>
          </div>
        </div>
      </div>
      <img className="obrazek_pozadi_right" src={pc} alt="pc" />
    </div>
  );
}

Login.propTypes = {
  setUser: PropTypes.func.isRequired
};
