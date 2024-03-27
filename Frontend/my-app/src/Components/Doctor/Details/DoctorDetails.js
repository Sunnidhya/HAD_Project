import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useState } from 'react';
import logout from '../../../Resources/log-out.png';
import './DoctorDetails.css'
import { useNavigate } from 'react-router-dom';
import empty from '../../../Resources/EmptyState.PNG';
import admin from '../../../Resources/Picture1.png';
import scan from '../../../Resources/scanned.avif';
import prescription from '../../../Resources/prescription.webp';
import radiologistreport from '../../../Resources/radioreport.webp';
import finaldiagnosis from '../../../Resources/finaldiag.jpeg';

const DoctorDetails = () => {

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
    <div className="Doc-land-container">
        <div class="Doc-Home-hor">
          <div>
            <img src={imgside} id="docsideimg" />
          </div>
         
          <div class="DocLogout" onClick={handleLogout}>  
          <img src={logout} alt="Logout" className="input-icon1" />
          </div>
      </div>
      <div className='Doc-Det-ver'>
        <div className='Doc-Det-ver1'>
          
            <img src={admin} alt="Admin Icon" className="admin-land-icon" />
            <p>Patients Name</p>
            <p>Consulting Doctor's Name</p>
        </div>
        <div className='Doc-Det-ver2'>
    
        <div className='Doc-Det-ver2-inner'>
            <div className='Doc-Det-ver2-inner-upper'>
            <div className='DocVerUp'>
                <div className='Doc-Det-ver2-1'>
                    <img src={scan} alt="scan" className='scanned'/>
                    <p className='scantext'>Scanned Images</p>
                </div>
                <div className='Doc-Det-ver2-2'>
                    <img src={prescription} alt="pres" className='pres'/>
                    <p className='prestext'>Prescription</p>
                </div>
            </div>

            <div className='DocVerDown'>
                <div className='Doc-Det-ver2-3'>
                    <img src={radiologistreport} alt="radioReport" className='radioReport'/>
                    <p className='rep'>Radiologist's Report</p>
                </div>
                <div className='Doc-Det-ver2-4'>
                    <img src={finaldiagnosis} alt="finalDiag" className='finalDiag'/>
                    <p className='diagtext'>Final Diagnosis</p>
                </div>

               

            </div>
            </div>
            <div className='Doc-Det-ver2-inner-lower'>
                <button className="generate-button">Generate Final Diagnosis Report</button>

            </div>

        
        </div>
            
            
        </div>
        
      </div>
      <div></div>
        <div class="Docfooter">
          <h2>About Us</h2>
        </div>
      </div>
    
  );
};

export default DoctorDetails;
