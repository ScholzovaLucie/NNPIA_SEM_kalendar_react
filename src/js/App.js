import React, { useState } from "react";
import "../css/App.css";
import Login from "./Login";
import Registration from "./Register";
import time from "./../img/time.png";
import pc from "./../img/pc.png";

function App() {
  const [isSignUpActive, setIsSignUpActive] = useState(false);

  const handleSignUpClick = () => {
    setIsSignUpActive(true);
  };

  const handleSignInClick = () => {
    setIsSignUpActive(false);
  };

  return (
    <div className="app-container">
      <header>
        <h1>KALENDÁŘ</h1>
      </header>
      <div class="main_form">
        <img class="obrazek_pozadi" src={time} alt="time" />
        <div
          className={`container ${isSignUpActive ? "right-panel-active" : ""}`}
        >
          <Login />
          <Registration />
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Vítejte zpět!</h1>
                <p>
                  Chcete-li se dostat ke svému kalendáři, přihlaste se pomocí
                  svých osobních údajů.
                </p>
                <button className="ghost" onClick={handleSignInClick}>
                  Přihlásit se
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Ahoj, návštěvníku!</h1>
                <p>
                  Zadejte své osobní údaje a zjisti možnosti našeho kalendáře
                </p>
                <button className="ghost" onClick={handleSignUpClick}>
                  Registrace
                </button>
              </div>
            </div>
          </div>
        </div>
        <img class="obrazek_pozadi_right" src={pc} alt="pc" />
      </div>
    </div>
  );
}

export default App;
