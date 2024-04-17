import React, { useState, useEffect } from "react";
import "../css/App.css";
import PersonList from "./PersonList/PersonList";
import CustomCalendar from "./components/CustomCalendar";
import Profile from "./Profile/Profile";
import TaskList from "./TaskList/TaskList";
import ApiService from "./API/ApiService";
import cake from "./../img/birthday-cake.png";
import kalendar from "./../img/icons8-calendar-64.png";
import "../css/HomePage.css";
import "../css/components/ActionButtons.css"
import "../css/components/Item.css"

export default function HomePage({ user, setUser }) {
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

  }, [user, persons, setError, date, setPersons]);

  useEffect(() => {
    setError(error);
  }, [error]);


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
        <CustomCalendar
          setDateGlobal={setDate}
          allEvents={allEvents}
          dateGLobal={date}
        />
        <PersonList
          user={user}
          setPersonsGlobal={setPersons}
          setError={setError}
        />
        <TaskList
          user={user}
          date={date}
          setError={setError}
          setEventsGlobal={setEvents}
          setDateGlobal={setDate}
        />
      </main>
      <aside>
        <Profile user={user} setUser={setUser}/>
      </aside>
      {error && <pre className="errorHandler">{error.toString()}</pre>}
    </div>
  );
}
