import './LabProfile.css'
import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useState } from 'react';
import logout from '../../../Resources/log-out.png';
import { useNavigate } from 'react-router-dom';
import radpic from '../../../Resources/radio1.avif';

const LabProfile = () => {
  let nav = useNavigate()

  const [searchQuery, setSearchQuery] = useState('');
  return (
      
      <div class="Lab-login-container">
      <div class="Lab-Login-hor">
        <div>
          <img src={imgside} id="profilesideimg"/>
        </div>
        <div className='divisions1'>
          <h2 className="pageTitle">Kavach - India's Leading Tele-Radiology Platform</h2>
        </div>
        </div>

        <div class="Lab-container">
        <div class="Lab-picture">
            <img src={radpic} alt="Profile Picture"/><br/>
            <button class="Lab-edit-button" onclick="editProfile()">Update Profile</button><br/>
            <button class="Lab-change-button" onclick="changePassword()">Change Password</button>
        </div>
        
        <div class="Lab-user-info">
            <h2>Samarpita Bhaumik</h2><br/>
            <p><b>Degree:</b> MBBS</p>
            <p><b>Specialization:</b> Radiology</p>
            <p><b>UserName:</b> sammy</p>
            <p><b>Department:</b> Radiology</p>
            <p><b>Password:</b>1234</p>
        </div>
       </div>
        {/* About Us Section */}
      <div className="Lab-about-us-section">
        <p>About Us</p>
      </div>
    </div>
    );
}
export default LabProfile;