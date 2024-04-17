import "../../css/Profil/Profil.css";
import Modal from "../Modal/Modal";
import React, { useState } from "react";
import ApiService from "./../API/ApiService";
import icon from "./../../img/boy.png";
import Logout from "./../Auth/Logout";
import { comparePassword, hashPassword } from "./../utility";

function Profile({ user, setUser }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiService = new ApiService("http://localhost:2024/api");
  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [passwordFirst, setPasswordFirst] = useState(user.password);
  const [passwordSecond, setPasswordSecond] = useState("");
  const [lastname, setLastname] = useState(user.lastName);
  const [firstname, setFirstname] = useState(user.firstName);
  const [error, setError] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const onEdit = (id) => {
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    hashPassword(password).then((hash) => {
      apiService
        .put("updateUser", {
          username: user.username,
          newusername: username,
          password: hash,
          firstName: firstname,
          lastName: lastname,
        })
        .then((data) => {
          setUser(data);
          setIsModalOpen(false);
          setError("");
        })
        .catch((error) => setError("Chyba při aktualizaci uživatele:", error));
    });
  };

  return (
    <div className="profil" onClick={onEdit}>
      <ul>
        <li>
          <img src={icon} alt="icon" />
        </li>
        <li>
          <h2>{user.firstName}</h2>
        </li>
        <li>
          <h2>{user.lastName}</h2>
        </li>
        <li>
          <Logout setUser={setUser} />
        </li>
      </ul>
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      >
        {
          <form>
            <label>Jméno:</label>
            <input
              type="text"
              placeholder={firstname}
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <label>Příjmení:</label>
            <input
              type="text"
              placeholder={lastname}
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
            <label>Uživatelské jméno:</label>
            <input
              type="text"
              placeholder={username}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Heslo"
              value={passwordFirst}
              onChange={(e) => setPasswordFirst(e.target.value)}
            />
            <input
              type="password"
              placeholder="Heslo znovu"
              value={passwordSecond}
              onChange={async (e) => {
                // Přidání async pro správné ošetření asynchronní funkce
                const newPasswordSecond = e.target.value;
                setPasswordSecond(newPasswordSecond);
                const match = passwordFirst === newPasswordSecond;
                setPasswordsMatch(match);
                if (match) {
                  setPassword(newPasswordSecond);
                  setError("");
                } else {
                  setError("Hesla se neshodují");
                }
              }}
              style={{ backgroundColor: passwordsMatch ? "inherit" : "red" }}
            />
            <div className="errorHandler">{error}</div>
            <button
              className="loginbutton"
              type="submit"
              onClick={handleSubmit}
              disabled={!passwordsMatch}
            >
              Uložit změny
            </button>
          </form>
        }
      </Modal>
    </div>
  );
}

export default Profile;
