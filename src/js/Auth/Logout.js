import React from 'react';
 
function Logout({setUser}) {


  const handleLogout = () => {
    setUser();
   };

  return (
    <button className="loginbutton logout" onClick={handleLogout}>Odhlásit se</button>
  );
}

export default Logout;