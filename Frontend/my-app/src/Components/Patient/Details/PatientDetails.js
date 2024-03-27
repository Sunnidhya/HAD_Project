import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useState } from 'react';
import logout from '../../../Resources/log-out.png';
import './PatientDetails.css'
import { useNavigate } from 'react-router-dom';
import scan from '../../../Resources/scanned.avif';
import prescription from '../../../Resources/prescription.webp';
import radiologistreport from '../../../Resources/radioreport.webp';
import finaldiagnosis from '../../../Resources/finaldiag.jpeg';
import admin from '../../../Resources/Picture1.png';

const PatDetails = () => {

  let nav = useNavigate()

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLogout = () => {
    localStorage.clear()
    alert('Logout successful!');
    nav("/doctor")
  };

  return (
    <div className="Pat-land-container">
        <div class="Pat-Home-hor">
          <div>
            <img src={imgside} id="docsideimg" />
          </div>
         
          <div class="PatLogout" onClick={handleLogout}>  
          <img src={logout} alt="Logout" className="input-icon1" />
          </div>
      </div>
      <div className='Pat-Det-ver'>
        <div className='Pat-Det-ver1'>
          
            <img src={admin} alt="Admin Icon" className="admin-land-icon" />
            <p>Patients Name</p>
            <p>Consulting Doctor's Name</p>
        </div>
        <div className='Pat-Det-ver2'>
        <div className='Pat-Det-ver2-inner'>
        <div className='PatVerUp'>
                <div className='Doc-Det-ver2-1'>
                    <img src={scan} alt="scan" className='scan'/>
                    <p className='scantext'>Scanned Images</p>
                </div>
                <div className='Pat-Det-ver2-2'>
                    <img src={prescription} alt="pres" className='pres'/>
                    <p className='prestext'>Prescription</p>
                </div>
            </div>

            <div className='PatVerDown'>
                <div className='Pat-Det-ver2-3'>
                    <img src={radiologistreport} alt="radioReport" className='radioReport'/>
                    <p className='rep'>Radiologist's Report</p>
                </div>
                <div className='Pat-Det-ver2-4'>
                    <img src={finaldiagnosis} alt="finalDiag" className='finalDiag'/>
                    <p className='diagtext'>Final Diagnosis</p>
                </div>

               

            </div>
        </div>
            
            
        </div>
        
      </div>
      <div></div>
        <div class="Patfooter">
          <h2>About Us</h2>
        </div>
      </div>
    
  );
};

export default PatDetails;
