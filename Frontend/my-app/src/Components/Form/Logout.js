import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Logout.css';

function Logout(props) {
  let nav = useNavigate()
  let val = true;
  const { userType } = props;
  const [showLogoutPopup, setShowLogoutPopup] = useState(val);

  const handleLogout = () => {
    localStorage.clear()
    if(userType == 'admin')
     nav("/admin")
    else if(userType == 'adminhome')
     nav("/admin")
    else if(userType == 'doctor')
    {
      window.localStorage.removeItem("isDoctorLoggedIn")
      nav("/doctor")
    }
     
    else if(userType == 'lab')
    {
      window.localStorage.removeItem("isLabLoggedIn");
      nav("/lab")
  }
    else if(userType == 'patient')
    {
      window.localStorage.removeItem("isPatientLoggedIn");
      nav("/patient")
    }
    else if(userType == 'radiologist')
    {
      window.localStorage.removeItem("isRadioLoggedIn")
      nav("/radiologist")
    }
     
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

export default Logout;



