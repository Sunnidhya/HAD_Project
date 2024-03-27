import './RadiologistProfile.css'
import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useState } from 'react';
import logout from '../../../Resources/log-out.png';
import { useNavigate } from 'react-router-dom';
import radpic from '../../../Resources/radio1.avif';

const RadiologistProfile = () => {
  let nav = useNavigate()

  const [searchQuery, setSearchQuery] = useState('');
  return (
      
      <div class="Profile-login-container">
      <div class="Profile-Login-hor">
        <div>
          <img src={imgside} id="profilesideimg"/>
        </div>
        <div className='divisions1'>
          <h2 className="pageTitle">Kavach - India's Leading Tele-Radiology Platform</h2>
        </div>
        </div>

        <div class="profile-container">
        <div class="profile-picture">
            <img src={radpic} alt="Profile Picture"/><br/>
            <button class="edit-button" onclick="editProfile()">Update Profile</button><br/>
            <button class="change-button" onclick="changePassword()">Change Password</button>
        </div>
        
        <div class="user-info">
            <h2>Samarpita Bhaumik</h2><br/>
            <p><b>Degree:</b> MBBS</p>
            <p><b>Specialization:</b> Radiology</p>
            <p><b>UserName:</b> sammy</p>
            <p><b>Department:</b> Radiology</p>
            <p><b>Password:</b>1234</p>
        </div>
       </div>
        {/* About Us Section */}
      <div className="about-us-section">
        <p>About Us</p>
      </div>
    </div>
    );
}
export default RadiologistProfile;