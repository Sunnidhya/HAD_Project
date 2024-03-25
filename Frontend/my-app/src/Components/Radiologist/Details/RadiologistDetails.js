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


import './RadiologistDetails.css'
const RadiologistDetails = () => {
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
        <div className="Had-land-container">
        <div class="Admin-Home-hor">
          <div>
            <img src={imgside} id="docsideimg" />
          </div>
         
          <div class="AdminLogout" onClick={handleLogout}>  
          <img src={logout} alt="Logout" className="input-icon1" />
          </div>
      </div>
      <div className='Admin-Home-ver'>
        <div className='Admin-Home-ver1'>
            <img src={admin} alt="Admin Icon" className="admin-land-icon" />
        </div>
        <div className='Admin-Home-ver2'>
            <div className='VerUp'>
                <div className='Admin-Home-ver2-1'>
                    {/* <img src={adminDoc} alt="adminDoc" className='admindoc'/> */}
                    <p className='AdPat'>Doctor</p>
                </div>
                <div className='Admin-Home-ver2-2'>
                    {/* <img src={adminRad} alt="adminRad" className='adminrad'/> */}
                    <p className='AdPat'>Radiologist</p>
                </div>
            </div>

            <div className='VerDown'>
                <div className='Admin-Home-ver3'>
                <div className='Admin-Home-ver2-3'>
                    {/* <img src={adminLab} alt="adminLab" className='adminlab'/> */}
                    <p className='AdPat'>Laboratory</p>
                </div>
                <div className='Admin-Home-ver2-4'>
                    {/* <img src={adminPat} alt="adminPat" className='adminpat'/> */}
                    <p className='AdPat'>Patient</p>
                </div>

                </div>

            </div>
            
        </div>
        
      </div>
      <div></div>
        <div class="Adminfooter">
          <h2>About Us</h2>
        </div>
      </div>
    );
}
export default RadiologistDetails;