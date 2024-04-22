
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CustomCalendar ({ setDateGlobal, allEvents, dateGLobal, persons }) {
  
    const onChange = (newValue) => {
        setDateGlobal(newValue);
    };
  
 
    function tileContent({ date, view }) {
        if (view === "month") {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');  
            const day = date.getDate().toString().padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;
    
            var dayEvents = allEvents.filter(event => event.date === dateString);
            var birthday = persons.filter(event => event.birthday === dateString);
            var holiday = persons.filter(event => event.holiday === dateString);
            if(dayEvents.length > 0){
                return (
                <div className="dayEventsBlock">
                    <div key={day} className="event"></div>
                </div>
            );
        }
            if(birthday.length > 0){
                return (
                <div className="dayEventsBlock">
                    <div key={day} className="birthday"></div>
                </div>
            );
            }  
            if(holiday.length > 0){
                return (
                <div className="dayEventsBlock">
                    <div key={day} className="holiday"></div>
                </div>
            );
            }  
        } 
        
    }
  
    return (
          <Calendar
            className="block_clanedar"
            onChange={onChange}
            tileContent={tileContent}
            tileClassName={"calendarTile"}
            disabled={false}
          />
    );
  };
  
  export default CustomCalendar;