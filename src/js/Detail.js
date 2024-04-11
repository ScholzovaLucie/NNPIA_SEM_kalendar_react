
import './../css/Detail.css'; // CSS pro modální okno

function Detail({ isOpen, onClose, data }) {
  if (!isOpen) {
    return null;
  }

  return (

      <div className="detail-content" onClick={(e) => e.stopPropagation()}>
        {data.map((event) => (
            <div className='detail-blok'>
                <h3>{event[0]}</h3><p>{event[1]}</p>
          </div>
            
        ))}
        <button className="loginbutton" onClick={onClose}>
          Zavřít
        </button>
      </div>
  );
}

export default Detail;
