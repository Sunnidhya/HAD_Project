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
import empty from '../../../Resources/EmptyState.PNG';
import scan from '../../../Resources/scanned.avif';
import prescription from '../../../Resources/prescription.webp';
import radiologistreport from '../../../Resources/radioreport.webp';
import finaldiagnosis from '../../../Resources/finaldiag.jpeg';


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
        <div className="Rad-land-container">
        <div class="Rad-Home-hor">
          <div>
            <img src={imgside} id="docsideimg" />
          </div>
         
          <div class="RadLogout" onClick={handleLogout}>  
          <img src={logout} alt="Logout" className="rad-input-icon1" />
          </div>
      </div>
      <div className='Rad-Det-ver'>
        <div className='Rad-Det-ver1'>
          
            <img src={admin} alt="Admin Icon" className="rad-admin-land-icon" />
            <p>Patients Name</p>
            <p>Consulting Doctor's Name</p>
        </div>
        <div className='Rad-Det-ver2'>
        <div className='Rad-Det-ver2-inner'>
        <div className='RadVerUp'>
                <div className='Rad-Det-ver2-1'>
                    <img src={scan} alt="scan" className='radscan'/>
                    <p className='scantext'>Scanned Images</p>
                </div>
                <div className='Rad-Det-ver2-2'>
                    <img src={prescription} alt="pres" className='radpres'/>
                    <p className='prestext'>Prescription</p>
                </div>
            </div>

            <div className='RadVerDown'>
                <div className='Rad-Det-ver2-3'>
                    <img src={radiologistreport} alt="radioReport" className='radradioReport'/>
                    <p className='rep'>Radiologist's Report</p>
                </div>
                <div className='Rad-Det-ver2-4'>
                    <img src={finaldiagnosis} alt="finalDiag" className='radfinalDiag'/>
                    <p className='diagtext'>Final Diagnosis</p>
                </div>

               

            </div>
        </div>
            
            
        </div>
        
      </div>
      <div></div>
        <div class="Radfooter">
          <p>About Us</p>
        </div>
      </div>
    );
}
export default RadiologistDetails;