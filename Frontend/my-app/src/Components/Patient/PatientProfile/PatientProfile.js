import './PatientProfile.css'
import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useState } from 'react';
import logout from '../../../Resources/log-out.png';
import { useNavigate } from 'react-router-dom';
import radpic from '../../../Resources/radio1.avif';

const PatientProfile = () => {
  let nav = useNavigate()

  const [searchQuery, setSearchQuery] = useState('');
  return (
      
      <div class="Patient-login-container">
      <div class="Patient-Login-hor">
        <div>
          <img src={imgside} id="profilesideimg"/>
        </div>
        <div className='divisions1'>
          <h2 className="pageTitle">Kavach - India's Leading Tele-Radiology Platform</h2>
        </div>
        </div>

        <div class="Patient-container">
        <div class="Patient-picture">
            <img src={radpic} alt="Profile Picture"/><br/>
            <button class="Patient-edit-button" onclick="editProfile()">Update Profile</button><br/>
            <button class="Patient-change-button" onclick="changePassword()">Change Password</button>
        </div>
        
        <div class="Patient-user-info">
            <h2>Samarpita Bhaumik</h2><br/>
            <p><b>Degree:</b> MBBS</p>
            <p><b>Specialization:</b> Radiology</p>
            <p><b>UserName:</b> sammy</p>
            <p><b>Department:</b> Radiology</p>
            <p><b>Password:</b>1234</p>
        </div>
       </div>
        {/* About Us Section */}
      <div className="Patient-about-us-section">
        <p>About Us</p>
      </div>
    </div>
    );
}
export default PatientProfile;