import React, { useState, useEffect } from "react";
import "../css/App.css";
import PersonList from "./PersonList/PersonList";
import Profile from "./Profile/Profile";
import TaskList from "./TaskList/TaskList";
import Logout from "./Auth/Logout";
import ApiService from "./ApiService";
import cake from "./../img/birthday-cake.png";
import kalendar from "./../img/icons8-calendar-64.png";
import "../css/HomePage.css";
import { useError } from "./ErrorProvider";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function HomePage({ user, setUser, hash }) {
  const [date, setDate] = useState(new Date());
  const [closestBirthdayPerson, setClosestBirthdayPerson] = useState(null);
  const [closestNamedayPerson, setClosestNamedayPerson] = useState(null);
  const [persons, setPersons] = useState([]);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const apiService = new ApiService("http://localhost:2024/api");

      await apiService
        .get("getClosestBirthday", { username: user["username"] })
        .then((data) => {
          setClosestBirthdayPerson(data);
          setError("");
        })
        .catch((error) => {
          setClosestBirthdayPerson(null);
        });

      await apiService
        .get("getClosestNameDay", { username: user["username"] })
        .then((data) => {
          setClosestNamedayPerson(data);
          setError("");
        })
        .catch((error) => {
          setClosestNamedayPerson(null);
        });

        await apiService.get("getAllTasks", {username: user["username"]})
        .then((data) => {
          setAllEvents(data);
          setError("");
        })
        .catch((error) => {
          setAllEvents([]);
        });
    };

      fetchEvents();

  }, [user, persons, setError]);

  useEffect(() => {
    console.log(error);
    setError(error);
  }, [error]);

function tileContent({ date, view }) {
  if (view === "month") {
    const dateString = date.toISOString().split('T')[0];
    var dayEvents = allEvents.filter(event => event.date === dateString);
    if(dayEvents.length > 0)
    {
      return (
        <div className="dayEventsBlock">
           {dayEvents.map((event) => (
          <div key={event.name} className="dot"></div>
        ))}
        </div>
      );
      
    }  
  }
  
}

  return (
    <div className="app-container">
      <main className="main_kalendar">
        <div className="upozorneni">
          {closestBirthdayPerson && (
            <div>
              <img className="icon" alt="Narozeniny" src={cake} />
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
              <img className="icon" alt="Svatek" src={kalendar} />
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
        <Calendar
          className="block_clanedar"
          onChange={setDate}
          value={date}
          user={user}
          tileContent={tileContent}
        />
        <PersonList
          user={user}
          setPersonsGlobal={setPersons}
          setError={setError}
        />
        <TaskList
          user={user}
          date={formatDate(date.toString())}
          setError={setError}
          setEventsGlobal={setEvents}
        />
      </main>
      <aside>
        <Profile user={user} setUser={setUser} hash={hash}/>
        <Logout setUser={setUser} />
      </aside>
      {error && <pre className="errorHandler">{error.toString()}</pre>}
    </div>
  );
}
