import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import profile from '../../../Resources/Profile.png';
import user from '../../../Resources/IconProfile.png';
import star1 from '../../../Resources/star.jpg';
import admin from '../../../Resources/admin-landing-icon.webp';
import logout from '../../../Resources/log-out.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminDoc from '../../../Resources/admin-doc.jpg';
import adminRad from '../../../Resources/admin-rad.webp';
import adminLab from '../../../Resources/admin-lab.jpg';
import adminPat from '../../../Resources/admin-pat.jpg';

import './AdminHomePage.css'
const AdminHomePage = () => {
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
      <div className="Admin-land-container">
      <div class="Admin-Home-hor">
        <div>
          <img src={imgside} id="docsideimg" />
        </div>
       
        <div class="AdminLogout" onClick={handleLogout}>  
        <img src={logout} alt="Logout" className="admin-input-icon1" />
        </div>
    </div>
    <div className='Admin-Det-ver'>
      <div className='Admin-Det-ver1'>
          <img src={admin} alt="Admin Icon" className="admin-land-icon-1" />
          <p>Admin's Name</p>
          
      </div>
      <div className='Admin-Det-ver2'>
      <div className='Admin-Det-ver2-inner'>
      <div className='AdminVerUp'>
              <div className='Admin-Det-ver2-1'>
                  {/* <img src={empty} alt="scan" className='admindoc'/> */}
                  <p className='admindoc'>Doctor</p>
                  <p className='counttext'>Count:33</p>
              </div>
              <div className='Admin-Det-ver2-2'>
                  {/* <img src={empty} alt="pres" className='adminrad'/> */}
                  <p className='adminrad'>Laboratory</p>
                  <p className='counttext'>Count:33</p>
              </div>
          </div>
          <div className='AdminVerDown'>
              <div className='Admin-Det-ver2-3'>
                  {/* <img src={empty} alt="radioReport" className='adminlab'/> */}
                  <p className='adminlab'>Radiologist</p>
                  <p className='counttext'>Count:33</p>
              </div>
              <div className='Admin-Det-ver2-4'>
                  {/* <img src={empty} alt="finalDiag" className='adminpat'/> */}
                  <p className='adminpat'>Patient</p> 
                  <p className='counttext'>Count:33</p>
              </div>
          </div>
      </div>
      </div>
    </div>
    <div className="Admin-home-about-us-section">
        <p>About Us</p>
      </div>
    </div>
    );
}
export default AdminHomePage;