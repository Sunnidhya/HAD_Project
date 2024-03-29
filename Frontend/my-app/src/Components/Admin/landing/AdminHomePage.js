import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import profile from '../../../Resources/Profile.png';
import user from '../../../Resources/IconProfile.png';
import star1 from '../../../Resources/star.jpg';
import admin from '../../../Resources/Picture1.png';
import logout from '../../../Resources/log-out.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './AdminHomePage.css'
const Profile = () => {
  const [patientValue, setPatientValue] = useState(12);
  const [radiologistValue, setRadiologistValue] = useState(22);
  const [doctorValue, setDoctorValue] = useState(22);
  const [labValue, setLabValue] = useState(12);

  let nav = useNavigate()

  const handleLogout = () => {
    localStorage.clear()
    alert('Logout successful!');
    nav("/admin")
  };


    return (
      <div class="Admin-Login-container">
        <div class="Admin-Login-hor">
          <div>
            <img src={imgside} id="radseideimg" />
          </div>
          <div className='divisions1'>
             <h1 className="pageTitle">Kavach - India's Leading Tele-Radiology Platform</h1>
          </div>
          <div class="AdminLogout" onClick={handleLogout}>  
        <img src={logout} alt="Logout" className="input-icon1" />
        </div>
        </div>

        <div className="vertical-box">
           <img src={admin} alt="Admin Icon" className="user-icon" />
        </div>

        <div className="vertical-box1">
          <div className='box1'>
              <h2>Patient</h2>
              <p>{patientValue}</p>
          </div>
          <br/>
          <div className='box2'>
            <h2>Radiologist</h2>
            <p>{radiologistValue}</p>
          </div>
        </div>

        <div className="vertical-box2">
          <div className='box3'>
          <h2>Doctor</h2>
          <p>{doctorValue}</p>
          </div>
          <br/>
          <div className='box4'>
          <h2>Lab</h2>
          <p>{labValue}</p>
          </div>
        </div>


        <div className="footer2">
          <footer>About Us</footer>
        </div>
    </div>
    );
}
export default Profile;