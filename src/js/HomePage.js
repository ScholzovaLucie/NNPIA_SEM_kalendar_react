import React, { useState, useEffect } from "react";
import "../css/App.css";
import PersonList from "./PersonList/PersonList";
import TaskList from "./TaskList/TaskList";
import TaskTypeList from "./TaskList/TaskTypeList";
import Logout from "./Auth/Logout";
import ApiService from "./ApiService";
import cake from "./../img/birthday-cake.png";

import "../css/HomePage.css";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function HomePage({ user, setUser }) {
  const apiService = new ApiService("http://localhost:2024/api");
  const [date, setDate] = useState(new Date());
  const [types, setTypes] = useState([]);
  const [closestBirthdayPerson, setClosestBirthdayPerson] = useState(null);
  const [closestNamedayPerson, setClosestNamedayPerson] = useState(null);


  useEffect(() => {
    const fetchEvents = async () => {
      await apiService
        .get("getClosestBirthday", { username: user["username"] })
        .then((data) => {
          setClosestBirthdayPerson(data);
        })
        .catch((error) => {
          console.error(error);
        });

      await apiService
        .get("getClosestNameDay", { username: user["username"] })
        .then((data) => {
          setClosestNamedayPerson(data);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchEvents();

    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const msUntilMidnight = midnight.getTime() - now.getTime();

    const timeoutId = setTimeout(() => {
      fetchEvents();
      setInterval(fetchEvents, 24 * 60 * 60 * 1000); 
    }, msUntilMidnight);
console.log(types);
    return () => {
      clearTimeout(timeoutId);
    };
    
  }, [user,types]);

  return (
    <div className="app-container">
      <main className="main_kalendar">
        <div className="upozorneni">
          {closestBirthdayPerson && (
            <div>
              <img className='icon' alt="Narozeniny" src={cake}/>
              <h2>{closestBirthdayPerson["firstName"]}&nbsp;</h2>
              <h2>{closestBirthdayPerson["lastName"]}&nbsp;</h2>
              <h2>
                {new Date(closestBirthdayPerson["birthday"]).toLocaleDateString(
                  "cs-CZ",
                  {
                    day: "2-digit",
                    month: "2-digit",
                  }
                )}
              </h2>
            </div>
          )}
          {closestNamedayPerson && (
            <div>
              <img className='icon' alt="Narozeniny" src={cake}/>
              <h2>{closestNamedayPerson["firstName"]}&nbsp;</h2>
              <h2>{closestNamedayPerson["lastName"]}&nbsp;</h2>
              <h2>
                {new Date(closestNamedayPerson["holiday"]).toLocaleDateString(
                  "cs-CZ",
                  {
                    day: "2-digit",
                    month: "2-digit",
                  }
                )}
              </h2>
            </div>
          )}
        </div>
        <Calendar className="block_clanedar" onChange={setDate} value={date} user={user}/>
        <PersonList user={user} />
        <TaskList user={user} date={formatDate(date.toString())} types={types}/>
        <TaskTypeList user={user} setTypesGlobal={setTypes} />
      </main>
      <aside>
        <Logout setUser={setUser}/>
      </aside>
      <footer>{/* Footer content */}</footer>
    </div>
  );
}
