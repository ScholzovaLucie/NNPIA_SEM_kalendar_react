import React, { useState } from "react";
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import "../css/HomePage.css";

export default function HomePage( {user}) {
  const [date, setDate] = useState();
  return (
    <div className='main_kalendar'>
      <div>{user['username']}</div>
      <div className='block_clanedar'>
        <div>{date.value}</div>
      <Calendar onChange={setDate} value={date} />
    </div>
    </div>
  );
}

