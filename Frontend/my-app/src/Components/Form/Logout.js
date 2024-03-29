import React, { useState } from 'react';
import './Logout.css';

function LogoutPopup() {
    let val = true;
  const [showLogoutPopup, setShowLogoutPopup] = useState(val);

  const handleLogout = () => {
    alert("Logging out...");
  };

  const handleNoClick = (event) => {
    event.stopPropagation(); 
    setShowLogoutPopup(!val);
  };

  return (
    <>
      {showLogoutPopup && (
        <div className="popup1">
          <div className="popup-content1">
            <p>Are you sure you want to LogOut?</p>
            <div className="button-container1">
              <button className="yes" onClick={handleLogout}>Yes</button>
              <button className="no" onClick={handleNoClick}>No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LogoutPopup;



